precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler2DArray;

#include <pathtracing_uniforms_and_defines>

uniform sampler2DArray tModels_triangleDataTexture2DArray;
uniform sampler2DArray tModels_aabbDataTexture2DArray;
uniform sampler2D tLandscape_TriangleTexture;
uniform sampler2D tLandscape_AABBTexture;
uniform mat4 uObjInvMatrices[64];
uniform vec4 uTopLevelAABBTree[256];
uniform vec3 uSunDirection;
uniform vec3 uViewRayTargetPosition;
uniform float uSelectedTile;

#define INV_TEXTURE_WIDTH 0.00390625 // (1 / 256 texture width)


//-----------------------------------------------------------------------

struct Ray { vec3 origin; vec3 direction; };
struct Intersection { float t; vec3 normal; vec3 emission; vec3 color; int type; };
Intersection intersec;


#include <pathtracing_random_functions>

#include <pathtracing_calc_fresnel_reflectance>

#include <pathtracing_sphere_intersect>

#include <pathtracing_box_intersect>

#include <pathtracing_boundingbox_intersect>

#include <pathtracing_bvhTriangle_intersect>


vec2 stackLevels[24];
vec2 objStackLevels[24];

struct BoxNode
{
	vec4 data0; // corresponds to .x: idObject,     .y: aabbMin.x, .z: aabbMin.y, .w: aabbMin.z
	vec4 data1; // corresponds to .x: idRightChild, .y: aabbMax.x, .z: aabbMax.y, .w: aabbMax.z
};

BoxNode GetBoxNode(in float i, in sampler2D texture)
{
	// each bounding box's data is encoded in 2 rgba(or xyzw) texture slots 
	float iX2 = (i * 2.0);
	// (iX2 + 0.0) corresponds to .x: idObject,     .y: aabbMin.x, .z: aabbMin.y, .w: aabbMin.z 
	// (iX2 + 1.0) corresponds to .x: idRightChild, .y: aabbMax.x, .z: aabbMax.y, .w: aabbMax.z 

	ivec2 uv0 = ivec2( mod(iX2 + 0.0, 256.0), (iX2 + 0.0) * INV_TEXTURE_WIDTH ); // data0
	ivec2 uv1 = ivec2( mod(iX2 + 1.0, 256.0), (iX2 + 1.0) * INV_TEXTURE_WIDTH ); // data1
	
	return BoxNode( texelFetch(texture, uv0, 0), texelFetch(texture, uv1, 0) );
}

BoxNode GetBoxNodeUniform(in float i)
{
	// each bounding box's data is encoded in 2 uniform vector4(xyzw) slots 
	float iX2 = (i * 2.0);
	// (iX2 + 0.0) corresponds to .x: idObject,     .y: aabbMin.x, .z: aabbMin.y, .w: aabbMin.z 
	// (iX2 + 1.0) corresponds to .x: idRightChild, .y: aabbMax.x, .z: aabbMax.y, .w: aabbMax.z 
	
	return BoxNode( uTopLevelAABBTree[int(iX2 + 0.0)], uTopLevelAABBTree[int(iX2 + 1.0)] );
}

BoxNode GetBoxNode2DArray(in float i, in float depth)
{
	// each bounding box's data is encoded in 2 rgba(or xyzw) texture slots 
	float iX2 = (i * 2.0);
	// (iX2 + 0.0) corresponds to .x: idObject,     .y: aabbMin.x, .z: aabbMin.y, .w: aabbMin.z 
	// (iX2 + 1.0) corresponds to .x: idRightChild, .y: aabbMax.x, .z: aabbMax.y, .w: aabbMax.z 

	ivec2 uv0 = ivec2( mod(iX2 + 0.0, 256.0), (iX2 + 0.0) * INV_TEXTURE_WIDTH ); // data0
	ivec2 uv1 = ivec2( mod(iX2 + 1.0, 256.0), (iX2 + 1.0) * INV_TEXTURE_WIDTH ); // data1
	
	return BoxNode( texelFetch(tModels_aabbDataTexture2DArray, ivec3(uv0, depth), 0), texelFetch(tModels_aabbDataTexture2DArray, ivec3(uv1, depth), 0) );
}


//-----------------------------------------------------------------------------------------------------------------------
void Object_BVH_Intersect( Ray rObj, mat3 invMatrix, in float depth_id )
//-----------------------------------------------------------------------------------------------------------------------
{
	BoxNode currentBoxNode, nodeA, nodeB, tmpNode;
	
	vec4 aabbNodeData;
	vec4 vd0, vd1, vd2, vd3, vd4, vd5, vd6;

	vec3 aabbMin, aabbMax;
	vec3 inverseDir = 1.0 / rObj.direction;

	vec2 currentStackData, stackDataA, stackDataB, tmpStackData;
	ivec2 uv0, uv1, uv2, uv3, uv4, uv5, uv6;

	float d;
        float stackptr = 0.0;
	float id = 0.0;
	float tu, tv;
	float triangleID = 0.0;
	float triangleU = 0.0;
	float triangleV = 0.0;
	
	bool skip = false;
	bool triangleLookupNeeded = false;

	
	currentBoxNode = GetBoxNode2DArray(stackptr, depth_id);
	currentStackData = vec2(stackptr, BoundingBoxIntersect(currentBoxNode.data0.yzw, currentBoxNode.data1.yzw, rObj.origin, inverseDir));
	objStackLevels[0] = currentStackData;
	skip = (currentStackData.y < intersec.t);

	while (true)
        {
		if (!skip) 
                {
                        // decrease pointer by 1 (0.0 is root level, 24.0 is maximum depth)
                        if (--stackptr < 0.0) // went past the root level, terminate loop
                                break;

                        currentStackData = objStackLevels[int(stackptr)];
			
			if (currentStackData.y >= intersec.t)
				continue;
			
			currentBoxNode = GetBoxNode2DArray(currentStackData.x, depth_id);
                }
		skip = false; // reset skip
		

		if (currentBoxNode.data0.x < 0.0) // < 0.0 signifies an inner node
		{
			nodeA = GetBoxNode2DArray(currentStackData.x + 1.0, depth_id);
			nodeB = GetBoxNode2DArray(currentBoxNode.data1.x, depth_id);
			stackDataA = vec2(currentStackData.x + 1.0, BoundingBoxIntersect(nodeA.data0.yzw, nodeA.data1.yzw, rObj.origin, inverseDir));
			stackDataB = vec2(currentBoxNode.data1.x, BoundingBoxIntersect(nodeB.data0.yzw, nodeB.data1.yzw, rObj.origin, inverseDir));
			
			// first sort the branch node data so that 'a' is the smallest
			if (stackDataB.y < stackDataA.y)
			{
				tmpStackData = stackDataB;
				stackDataB = stackDataA;
				stackDataA = tmpStackData;

				tmpNode = nodeB;
				nodeB = nodeA;
				nodeA = tmpNode;
			} // branch 'b' now has the larger rayT value of 'a' and 'b'

			if (stackDataB.y < intersec.t) // see if branch 'b' (the larger rayT) needs to be processed
			{
				currentStackData = stackDataB;
				currentBoxNode = nodeB;
				skip = true; // this will prevent the stackptr from decreasing by 1
			}
			if (stackDataA.y < intersec.t) // see if branch 'a' (the smaller rayT) needs to be processed 
			{
				if (skip) // if larger branch 'b' needed to be processed also,
					objStackLevels[int(stackptr++)] = stackDataB; // cue larger branch 'b' for future round
							// also, increase pointer by 1
				
				currentStackData = stackDataA;
				currentBoxNode = nodeA;
				skip = true; // this will prevent the stackptr from decreasing by 1
			}

			continue;
		} // end if (currentBoxNode.data0.x < 0.0) // inner node


		// else this is a leaf

		// each triangle's data is encoded in 8 rgba(or xyzw) texture slots
		id = 8.0 * currentBoxNode.data0.x;

		uv0 = ivec2( mod(id + 0.0, 256.0), (id + 0.0) * INV_TEXTURE_WIDTH );
		uv1 = ivec2( mod(id + 1.0, 256.0), (id + 1.0) * INV_TEXTURE_WIDTH );
		uv2 = ivec2( mod(id + 2.0, 256.0), (id + 2.0) * INV_TEXTURE_WIDTH );
		
		vd0 = texelFetch(tModels_triangleDataTexture2DArray, ivec3(uv0, depth_id), 0);
		vd1 = texelFetch(tModels_triangleDataTexture2DArray, ivec3(uv1, depth_id), 0);
		vd2 = texelFetch(tModels_triangleDataTexture2DArray, ivec3(uv2, depth_id), 0);

		d = BVH_TriangleIntersect( vec3(vd0.xyz), vec3(vd0.w, vd1.xy), vec3(vd1.zw, vd2.x), rObj, tu, tv );

		if (d < intersec.t)
		{
			intersec.t = d;
			triangleID = id;
			triangleU = tu;
			triangleV = tv;
			triangleLookupNeeded = true;
		}
	      
        } // end while (true)


	if (triangleLookupNeeded)
	{
		uv0 = ivec2( mod(triangleID + 0.0, 256.0), (triangleID + 0.0) * INV_TEXTURE_WIDTH );
		uv1 = ivec2( mod(triangleID + 1.0, 256.0), (triangleID + 1.0) * INV_TEXTURE_WIDTH );
		uv2 = ivec2( mod(triangleID + 2.0, 256.0), (triangleID + 2.0) * INV_TEXTURE_WIDTH );
		uv3 = ivec2( mod(triangleID + 3.0, 256.0), (triangleID + 3.0) * INV_TEXTURE_WIDTH );
		uv4 = ivec2( mod(triangleID + 4.0, 256.0), (triangleID + 4.0) * INV_TEXTURE_WIDTH );
		uv5 = ivec2( mod(triangleID + 5.0, 256.0), (triangleID + 5.0) * INV_TEXTURE_WIDTH );
		uv6 = ivec2( mod(triangleID + 6.0, 256.0), (triangleID + 6.0) * INV_TEXTURE_WIDTH );
		//uv7 = ivec2( mod(triangleID + 7.0, 256.0), (triangleID + 7.0) * INV_TEXTURE_WIDTH );
		
		vd0 = texelFetch(tModels_triangleDataTexture2DArray, ivec3(uv0, depth_id), 0);
		vd1 = texelFetch(tModels_triangleDataTexture2DArray, ivec3(uv1, depth_id), 0);
		vd2 = texelFetch(tModels_triangleDataTexture2DArray, ivec3(uv2, depth_id), 0);
		vd3 = texelFetch(tModels_triangleDataTexture2DArray, ivec3(uv3, depth_id), 0);
		vd4 = texelFetch(tModels_triangleDataTexture2DArray, ivec3(uv4, depth_id), 0);
		vd5 = texelFetch(tModels_triangleDataTexture2DArray, ivec3(uv5, depth_id), 0);
		vd6 = texelFetch(tModels_triangleDataTexture2DArray, ivec3(uv6, depth_id), 0);
		//vd7 = texelFetch(tModels_triangleDataTexture2DArray, ivec3(uv7, depth_id), 0);	      

		// face normal for flat-shaded polygon look
		intersec.normal = normalize( cross(vec3(vd0.w, vd1.xy) - vec3(vd0.xyz), vec3(vd1.zw, vd2.x) - vec3(vd0.xyz)) );
		// transfom normal back into world space
		intersec.normal = normalize(transpose(invMatrix) * intersec.normal);
		// else use vertex normals
		//triangleW = 1.0 - triangleU - triangleV;
		//intersec.normal = normalize(triangleW * vec3(vd4.zw, vd5.x) + triangleU * vec3(vd5.yzw) + triangleV * vec3(vd6.xyz));
		intersec.color = vec3(vd4.w, vd5.xy);
		intersec.type = depth_id == 4.0 ? COAT : DIFF;
		//intersec.type = LIGHT; intersec.emission = vec3(1,0,1); // for testing object placement

	} // end if (triangleLookupNeeded)

} // end void Object_BVH_Intersect( Ray rObj, mat3 invMatrix, in float depth_id )


//-------------------------------------------------------------------------------
void SceneIntersect( Ray r )
//-------------------------------------------------------------------------------
{
	BoxNode currentBoxNode, nodeA, nodeB, tmpNode;
	mat4 invMatrix;
	Ray rObj;

	vec4 aabbNodeData;
	vec4 vd0, vd1, vd2, vd3, vd4, vd5, vd6, vd7;

	vec3 aabbMin, aabbMax;
	vec3 inverseDir = 1.0 / r.direction;
	vec3 normal;
	vec3 hitPos;

	vec2 currentStackData, stackDataA, stackDataB, tmpStackData;
	ivec2 uv0, uv1, uv2, uv3, uv4, uv5, uv6, uv7;

	float d;
        float stackptr = 0.0;
	float id = 0.0;
	float model_id = 0.0;
	float tu, tv;
	float triangleID = 0.0;
	float triangleU = 0.0;
	float triangleV = 0.0;
	float triangleW = 0.0;
	float posX, gridX, posZ, gridZ;
	float lineThickness = 0.01;
	float oneMinusLineThickness = 1.0 - lineThickness;
	
	bool skip = false;
	bool triangleLookupNeeded = false;
	bool isRayExiting;

	intersec.t = INFINITY;

	// viewing ray target metal sphere (for debug mode)
	d = SphereIntersect( 2.0, uViewRayTargetPosition, r );
	if (d < intersec.t)
	{
		intersec.t = d;
		intersec.normal = normalize((r.origin + r.direction * intersec.t) - uViewRayTargetPosition);
		intersec.emission = vec3(0);
		intersec.color = vec3(1);//vec3(1.0, 0.765557, 0.336057);
		intersec.type = SPEC;
	}

	// LANDSCAPE BVH ////////////

        stackptr = 0.0;
	currentBoxNode = GetBoxNode(stackptr, tLandscape_AABBTexture);
	currentStackData = vec2(stackptr, BoundingBoxIntersect(currentBoxNode.data0.yzw, currentBoxNode.data1.yzw, r.origin, inverseDir));
	stackLevels[0] = currentStackData;
	skip = (currentStackData.y < intersec.t);

	while (true)
        {
		if (!skip) 
                {
                        // decrease pointer by 1 (0.0 is root level, 24.0 is maximum depth)
                        if (--stackptr < 0.0) // went past the root level, terminate loop
                                break;

                        currentStackData = stackLevels[int(stackptr)];
			
			if (currentStackData.y >= intersec.t)
				continue;
			
			currentBoxNode = GetBoxNode(currentStackData.x, tLandscape_AABBTexture);
                }
		skip = false; // reset skip
		

		if (currentBoxNode.data0.x < 0.0) // < 0.0 signifies an inner node
		{
			nodeA = GetBoxNode(currentStackData.x + 1.0, tLandscape_AABBTexture);
			nodeB = GetBoxNode(currentBoxNode.data1.x, tLandscape_AABBTexture);
			stackDataA = vec2(currentStackData.x + 1.0, BoundingBoxIntersect(nodeA.data0.yzw, nodeA.data1.yzw, r.origin, inverseDir));
			stackDataB = vec2(currentBoxNode.data1.x, BoundingBoxIntersect(nodeB.data0.yzw, nodeB.data1.yzw, r.origin, inverseDir));
			
			// first sort the branch node data so that 'a' is the smallest
			if (stackDataB.y < stackDataA.y)
			{
				tmpStackData = stackDataB;
				stackDataB = stackDataA;
				stackDataA = tmpStackData;

				tmpNode = nodeB;
				nodeB = nodeA;
				nodeA = tmpNode;
			} // branch 'b' now has the larger rayT value of 'a' and 'b'

			if (stackDataB.y < intersec.t) // see if branch 'b' (the larger rayT) needs to be processed
			{
				currentStackData = stackDataB;
				currentBoxNode = nodeB;
				skip = true; // this will prevent the stackptr from decreasing by 1
			}
			if (stackDataA.y < intersec.t) // see if branch 'a' (the smaller rayT) needs to be processed 
			{
				if (skip) // if larger branch 'b' needed to be processed also,
					stackLevels[int(stackptr++)] = stackDataB; // cue larger branch 'b' for future round
							// also, increase pointer by 1
				
				currentStackData = stackDataA;
				currentBoxNode = nodeA;
				skip = true; // this will prevent the stackptr from decreasing by 1
			}

			continue;
		} // end if (currentBoxNode.data0.x < 0.0) // inner node


		// else this is a leaf

		// each triangle's data is encoded in 8 rgba(or xyzw) texture slots
		id = 8.0 * currentBoxNode.data0.x;

		uv0 = ivec2( mod(id + 0.0, 256.0), (id + 0.0) * INV_TEXTURE_WIDTH );
		uv1 = ivec2( mod(id + 1.0, 256.0), (id + 1.0) * INV_TEXTURE_WIDTH );
		uv2 = ivec2( mod(id + 2.0, 256.0), (id + 2.0) * INV_TEXTURE_WIDTH );
		
		vd0 = texelFetch(tLandscape_TriangleTexture, uv0, 0);
		vd1 = texelFetch(tLandscape_TriangleTexture, uv1, 0);
		vd2 = texelFetch(tLandscape_TriangleTexture, uv2, 0);

		d = BVH_TriangleIntersect( vec3(vd0.xyz), vec3(vd0.w, vd1.xy), vec3(vd1.zw, vd2.x), r, tu, tv );

		if (d < intersec.t)
		{
			intersec.t = d;
			triangleID = id;
			triangleU = tu;
			triangleV = tv;
			triangleLookupNeeded = true;
		}
	      
        } // end while (true)


	if (triangleLookupNeeded)
	{
		uv0 = ivec2( mod(triangleID + 0.0, 256.0), (triangleID + 0.0) * INV_TEXTURE_WIDTH );
		uv1 = ivec2( mod(triangleID + 1.0, 256.0), (triangleID + 1.0) * INV_TEXTURE_WIDTH );
		uv2 = ivec2( mod(triangleID + 2.0, 256.0), (triangleID + 2.0) * INV_TEXTURE_WIDTH );
		uv3 = ivec2( mod(triangleID + 3.0, 256.0), (triangleID + 3.0) * INV_TEXTURE_WIDTH );
		uv4 = ivec2( mod(triangleID + 4.0, 256.0), (triangleID + 4.0) * INV_TEXTURE_WIDTH );
		uv5 = ivec2( mod(triangleID + 5.0, 256.0), (triangleID + 5.0) * INV_TEXTURE_WIDTH );
		uv6 = ivec2( mod(triangleID + 6.0, 256.0), (triangleID + 6.0) * INV_TEXTURE_WIDTH );
		//uv7 = ivec2( mod(triangleID + 7.0, 256.0), (triangleID + 7.0) * INV_TEXTURE_WIDTH );
		
		vd0 = texelFetch(tLandscape_TriangleTexture, uv0, 0);
		vd1 = texelFetch(tLandscape_TriangleTexture, uv1, 0);
		vd2 = texelFetch(tLandscape_TriangleTexture, uv2, 0);
		vd3 = texelFetch(tLandscape_TriangleTexture, uv3, 0);
		vd4 = texelFetch(tLandscape_TriangleTexture, uv4, 0);
		vd5 = texelFetch(tLandscape_TriangleTexture, uv5, 0);
		vd6 = texelFetch(tLandscape_TriangleTexture, uv6, 0);
		//vd7 = texelFetch(tLandscape_TriangleTexture, uv7, 0);	      

		// face normal for flat-shaded polygon look
		//intersec.normal = normalize( cross(vec3(vd0.w, vd1.xy) - vec3(vd0.xyz), vec3(vd1.zw, vd2.x) - vec3(vd0.xyz)) );
		// else use vertex normals
		triangleW = 1.0 - triangleU - triangleV;
		intersec.normal = normalize(triangleW * vec3(vd4.zw, vd5.x) + triangleU * vec3(vd5.yzw) + triangleV * vec3(vd6.xyz));
		intersec.color = (triangleID == uSelectedTile || triangleID == uSelectedTile + 8.0) ? vec3(0,2,1) : vd2.yzw;
		intersec.type = DIFF;

		hitPos = r.origin + r.direction * intersec.t;
		if (intersec.color == vec3(1.0))
		{
			intersec.type = COAT;
			
			posX = hitPos.x * 0.1;
			gridX = floor(posX);
			posZ = hitPos.z * 0.1;
			gridZ = floor(posZ);
			
			intersec.color = abs(intersec.normal.x) > abs(intersec.normal.z) ? vec3(1) : vec3(0);

			if (posX - gridX < lineThickness) // to the right of snap grid
			{
				intersec.type = SPEC;
				intersec.color = vec3(0, 0, 1); // blue trim
				intersec.normal.x -= 1.0;
			}
			if (posX - gridX > oneMinusLineThickness) // to the left of snap grid
			{
				intersec.type = SPEC;
				intersec.color = vec3(0, 0, 1); // blue trim
				intersec.normal.x += 1.0;
			}
			if (posZ - gridZ < lineThickness) // in front of snap grid
			{
				intersec.type = SPEC;
				intersec.color = vec3(0, 0, 1); // blue trim
				intersec.normal.z -= 1.0;
			}
			if (posZ - gridZ > oneMinusLineThickness) // behind snap grid
			{
				intersec.type = SPEC;
				intersec.color = vec3(0, 0, 1); // blue trim
				intersec.normal.z += 1.0;
			}

			intersec.normal = normalize(intersec.normal);

		} // end if (intersec.color == vec3(1.0))

	} // end if (triangleLookupNeeded)


	// TOP_LEVEL BVH /////////////////

	// reset variables
	stackptr = 0.0;
	currentBoxNode = GetBoxNodeUniform(stackptr);
	currentStackData = vec2(stackptr, BoundingBoxIntersect(currentBoxNode.data0.yzw, currentBoxNode.data1.yzw, r.origin, inverseDir));
	stackLevels[0] = currentStackData;
	skip = (currentStackData.y < intersec.t);

	while (true)
        {
		if (!skip) 
                {
                        // decrease pointer by 1 (0.0 is root level, 24.0 is maximum depth)
                        if (--stackptr < 0.0) // went past the root level, terminate loop
                                break;

                        currentStackData = stackLevels[int(stackptr)];
			
			if (currentStackData.y >= intersec.t)
				continue;
			
			currentBoxNode = GetBoxNodeUniform(currentStackData.x);
                }
		skip = false; // reset skip
		

		if (currentBoxNode.data0.x < 0.0) // < 0.0 signifies an inner node
		{
			nodeA = GetBoxNodeUniform(currentStackData.x + 1.0);
			nodeB = GetBoxNodeUniform(currentBoxNode.data1.x);
			stackDataA = vec2(currentStackData.x + 1.0, BoundingBoxIntersect(nodeA.data0.yzw, nodeA.data1.yzw, r.origin, inverseDir));
			stackDataB = vec2(currentBoxNode.data1.x, BoundingBoxIntersect(nodeB.data0.yzw, nodeB.data1.yzw, r.origin, inverseDir));
			
			// first sort the branch node data so that 'a' is the smallest
			if (stackDataB.y < stackDataA.y)
			{
				tmpStackData = stackDataB;
				stackDataB = stackDataA;
				stackDataA = tmpStackData;

				tmpNode = nodeB;
				nodeB = nodeA;
				nodeA = tmpNode;
			} // branch 'b' now has the larger rayT value of 'a' and 'b'

			if (stackDataB.y < intersec.t) // see if branch 'b' (the larger rayT) needs to be processed
			{
				currentStackData = stackDataB;
				currentBoxNode = nodeB;
				skip = true; // this will prevent the stackptr from decreasing by 1
			}
			if (stackDataA.y < intersec.t) // see if branch 'a' (the smaller rayT) needs to be processed 
			{
				if (skip) // if larger branch 'b' needed to be processed also,
					stackLevels[int(stackptr++)] = stackDataB; // cue larger branch 'b' for future round
							// also, increase pointer by 1
				
				currentStackData = stackDataA;
				currentBoxNode = nodeA;
				skip = true; // this will prevent the stackptr from decreasing by 1
			}

			continue;
		} // end if (currentBoxNode.data0.x < 0.0) // inner node


		// else this is a leaf
		invMatrix = uObjInvMatrices[int(currentBoxNode.data0.x)];
		model_id = invMatrix[3][3];
		// once the model_id code is extracted, set this last matrix element ([15]) back to 1.0
		invMatrix[3][3] = 1.0;
		// transform ray into leaf object's object space
		rObj.origin = vec3( invMatrix * vec4(r.origin, 1.0) );
		rObj.direction = vec3( invMatrix * vec4(r.direction, 0.0) );

		// d = BoxIntersect(vec3(-4.0625,-9.0625,-4.0625), vec3(4.0625,9.0625,4.0625), rObj, normal, isRayExiting);
		// if (d < intersec.t)
		// {
		// 	intersec.t = d;
		// 	// transfom normal back into world space
		// 	normal = normalize(normal);
		// 	intersec.normal = normalize(transpose(mat3(invMatrix)) * normal);
		// 	intersec.emission = vec3(0);
		// 	intersec.color = vec3(1, 1, 0);
		// 	intersec.type = COAT;
		// }

		Object_BVH_Intersect(rObj, mat3(invMatrix), model_id);

        } // end while (true)

} // end void SceneIntersect( Ray r )



vec3 getSkyColor(in vec3 rayDirection)
{
	vec3 topColor = vec3(0.01, 0.2, 1.0);
	//topColor *= max(0.3, dot(vec3(0,1,0), uSunDirection));
	vec3 bottomColor = vec3(0);
	vec3 skyColor = mix(bottomColor, topColor, clamp(pow((rayDirection.y + 1.0), 5.0), 0.0, 1.0) );
	float sun = max(0.0, dot(rayDirection, uSunDirection));
	return skyColor + (pow(sun, 180.0) * vec3(0.2,0.1,0.0)) + (pow(sun, 2000.0) * vec3(1,1,0)) + (pow(sun, 10000.0) * vec3(3,2,1));
}

//---------------------------------------------------------------------------
vec3 CalculateRadiance(Ray r)
//---------------------------------------------------------------------------
{

	vec3 accumCol = vec3(0);
        vec3 mask = vec3(1);
	vec3 tdir;
	vec3 x, n, nl;
	vec3 up = vec3(0, 1, 0);
        
	float t;
	float nc, nt, ratioIoR, Re, Tr;
	float P, RP, TP;
	float weight;
	float randChoose;
	float partialAmount = 0.0;

	int diffuseCount = 0;

	bool bounceIsSpecular = true;
	bool sampleLight = false;


	for (int bounces = 0; bounces < 3; bounces++)
	{

		SceneIntersect(r);

		// // for testing object placement
		// if (bounces == 0 && intersec.type == LIGHT)
		// {
		// 	accumCol = mask * intersec.emission * 10.0;
		// 	break;
		// } // end if (intersec.t == LIGHT)

		if (intersec.t == INFINITY)
		{
			if (sampleLight)
				accumCol = mix(accumCol, mask * getSkyColor(r.direction), weight);
			else
				accumCol = mask * getSkyColor(r.direction);
			
			break;
		} // end if (intersec.t == INFINITY)


		// if we get here and sampleLight is still true, sun targeting ray failed to find the sun
		if (sampleLight) 
			break;
	

		// useful data 
		n = normalize(intersec.normal);
                nl = dot(n, r.direction) < 0.0 ? normalize(n) : normalize(-n);
		x = r.origin + r.direction * intersec.t;


		    
                if (intersec.type == DIFF) // Ideal DIFFUSE reflection
		{
			diffuseCount++;
			
			mask *= intersec.color;

			if (bounceIsSpecular) 
				accumCol = mask * 0.6; // ambient color

			bounceIsSpecular = false;

			r = Ray(x, randomDirectionInSpecularLobe(uSunDirection, 0.01));
			r.origin += nl * uEPS_intersect;
			
			weight = clamp(dot(nl, r.direction), 0.0, 1.0);
			
			sampleLight = true;
			continue;
			
		} // end if (intersec.type == DIFF)
		
		if (intersec.type == SPEC)  // Ideal SPECULAR reflection
		{
			mask *= intersec.color;

			r = Ray( x, reflect(r.direction, nl) );
			r.origin += nl * uEPS_intersect;

			continue;
		}
		/*
		if (intersec.type == REFR)  // Ideal dielectric REFRACTION
		{
			nc = 1.0; // IOR of Air
			nt = 1.4; // IOR of thin Glass
			Re = calcFresnelReflectance(r.direction, n, nc, nt, ratioIoR);
			Tr = 1.0 - Re;
			P  = 0.25 + (0.5 * Re);
                	RP = Re / P;
                	TP = Tr / (1.0 - P);
			
			if (rand() < P)
			{
				mask *= RP;
				r = Ray( x, reflect(r.direction, nl) ); // reflect ray from surface
				r.origin += nl * uEPS_intersect;
				continue;
			}

			// transmit ray through surface
			
			mask *= intersec.color;
			mask *= TP;

			tdir = refract(r.direction, nl, ratioIoR);
			//tdir = r.direction;
			r = Ray(x, tdir);
			r.origin -= nl * uEPS_intersect;

			continue;
			
		} // end if (intersec.type == REFR)
		*/
		if (intersec.type == COAT)  // Diffuse object underneath with ClearCoat on top
		{
			nc = 1.0; // IOR of Air
			nt = 1.4; // IOR of Clear Coat
			Re = calcFresnelReflectance(r.direction, n, nc, nt, ratioIoR);
			Tr = 1.0 - Re;
			P  = 0.25 + (0.5 * Re);
                	RP = Re / P;
                	TP = Tr / (1.0 - P);

			if (bounces == 0 && rand() < P)
			{
				mask *= RP;
				r = Ray( x, reflect(r.direction, nl) );
				r.origin += nl * uEPS_intersect;
				continue;
			}
			
			diffuseCount++;
			
			if (bounces == 0) 
				mask *= TP;
			mask *= intersec.color;

			if (bounceIsSpecular) 
			{
				accumCol = mask * getSkyColor(randomCosWeightedDirectionInHemisphere(up)); // ambient color
				accumCol = mix(mask, accumCol, 0.5);
			}
				
			
			bounceIsSpecular = false;
			
			r = Ray(x, randomDirectionInSpecularLobe(uSunDirection, 0.01));
			r.origin += nl * uEPS_intersect;
			
			weight = clamp(dot(nl, r.direction), 0.0, 1.0);
			
			sampleLight = true;
			continue;
                        
		} //end if (intersec.type == COAT)
		
	} // end for (int bounces = 0; bounces < 3; bounces++)
	
	return max(vec3(0), accumCol);

} // end vec3 CalculateRadiance(Ray r)


/*
//-----------------------------------------------------------------------
void SetupScene(void)
//-----------------------------------------------------------------------
{

}
*/

//#include <pathtracing_main>

// tentFilter from Peter Shirley's 'Realistic Ray Tracing (2nd Edition)' book, pg. 60		
float tentFilter(float x)
{
	return (x < 0.5) ? sqrt(2.0 * x) - 1.0 : 1.0 - sqrt(2.0 - (2.0 * x));
}

void main( void )
{
	// not needed, three.js has a built-in uniform named cameraPosition
	//vec3 camPos   = vec3( uCameraMatrix[3][0],  uCameraMatrix[3][1],  uCameraMatrix[3][2]);
	
	vec3 camRight   = vec3( uCameraMatrix[0][0],  uCameraMatrix[0][1],  uCameraMatrix[0][2]);
	vec3 camUp      = vec3( uCameraMatrix[1][0],  uCameraMatrix[1][1],  uCameraMatrix[1][2]);
	vec3 camForward = vec3(-uCameraMatrix[2][0], -uCameraMatrix[2][1], -uCameraMatrix[2][2]);
	
	// calculate unique seed for rng() function
	seed = uvec2(uFrameCounter, uFrameCounter + 1.0) * uvec2(gl_FragCoord); // old way of generating random numbers

	randVec4 = texture(tBlueNoiseTexture, (gl_FragCoord.xy + (uRandomVec2 * 255.0)) / 255.0); // new way of rand()
	
	vec2 pixelOffset = vec2( tentFilter(rng()), tentFilter(rng()) ) * 0.5;
	// we must map pixelPos into the range -1.0 to +1.0
	vec2 pixelPos = ((gl_FragCoord.xy + pixelOffset) / uResolution) * 2.0 - 1.0;

	vec3 rayDir = normalize( pixelPos.x * camRight * uULen + pixelPos.y * camUp * uVLen + camForward );
	
	// depth of field
	//vec3 focalPoint = uFocusDistance * rayDir;
	vec3 focalPoint = (distance(cameraPosition, uViewRayTargetPosition) - 1.0) * rayDir;
	float randomAngle = rand() * TWO_PI; // pick random point on aperture
	float randomRadius = rand() * uApertureSize;
	vec3  randomAperturePos = ( cos(randomAngle) * camRight + sin(randomAngle) * camUp ) * sqrt(randomRadius);
	// point on aperture to focal point
	vec3 finalRayDir = normalize(focalPoint - randomAperturePos);
	
	Ray ray = Ray( cameraPosition + randomAperturePos, finalRayDir );

	//SetupScene(); // not used in this game
	
	// perform path tracing and get resulting pixel color
	vec3 pixelColor = CalculateRadiance(ray);
	
	vec3 previousColor = texelFetch(tPreviousTexture, ivec2(gl_FragCoord.xy), 0).rgb;

	if (uCameraIsMoving)
	{
                previousColor *= 0.5; // motion-blur trail amount (old image)
                pixelColor *= 0.5; // brightness of new image (noisy)
        }
	else
	{
                previousColor *= 0.8; // motion-blur trail amount (old image)
                pixelColor *= 0.2; // brightness of new image (noisy)
        }
	
        pc_fragColor = vec4( pixelColor + previousColor, 1.0 );	
}
