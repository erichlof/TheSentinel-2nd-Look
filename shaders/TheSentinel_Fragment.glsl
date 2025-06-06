precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler2DArray;

#include <pathtracing_uniforms_and_defines>

uniform InvMatrices_UniformsGroup {
	mat4 uObj3D_InvMatrices[64];
};

uniform TopLevelBVH_UniformsGroup {
	vec4 uTopLevelBVH_aabbData[256];
};

uniform sampler2DArray tModels_triangleDataTexture2DArray;
uniform sampler2DArray tModels_aabbDataTexture2DArray;
uniform sampler2D tLandscape_TriangleTexture;
uniform sampler2D tLandscape_AABBTexture;
uniform vec3 uSunDirection;
uniform vec3 uViewRayTargetPosition;
uniform float uViewRaySphereRadius;
uniform float uSelectedTileIndex;
uniform float uSelectedObjectIndex;
uniform float uResolvingObjectIndex;
uniform float uDissolveEffectStrength;
uniform bool uDoingDissolveEffect;
uniform bool uPlayingTeleportAnimation;


#define INV_TEXTURE_WIDTH 0.00390625 // (1 / 256 texture width)


//-----------------------------------------------------------------------

vec3 rayOrigin, rayDirection;
// recorded intersection data:
vec3 hitNormal, hitEmission, hitColor;
float hitT;
float hitObjectID = -INFINITY;
int hitTextureID;
int hitType = -100;


#include <pathtracing_random_functions>

#include <pathtracing_calc_fresnel_reflectance>

#include <pathtracing_sphere_intersect>

#include <pathtracing_box_intersect>

#include <pathtracing_boundingbox_intersect>

#include <pathtracing_bvhTriangle_intersect>

		  // when there are 2 stackLevels, for example stackLevels[23] and objStackLevels[23],...
vec2 stackLevels[23]; // [23] is max size for my Samsung Galaxy S21, [24] crashes on compile
vec2 objStackLevels[23]; // [23] is max size for my Samsung Galaxy S21, [24] crashes on compile


//vec4 boxNodeData0 corresponds to .x = idTriangle,  .y = aabbMin.x, .z = aabbMin.y, .w = aabbMin.z
//vec4 boxNodeData1 corresponds to .x = idRightChild .y = aabbMax.x, .z = aabbMax.y, .w = aabbMax.z

void GetBoxNodeData(const in float i, in sampler2D texture, inout vec4 boxNodeData0, inout vec4 boxNodeData1)
{
	// each bounding box's data is encoded in 2 rgba(or xyzw) texture slots 
	float ix2 = i * 2.0;
	// (ix2 + 0.0) corresponds to .x = idTriangle,  .y = aabbMin.x, .z = aabbMin.y, .w = aabbMin.z 
	// (ix2 + 1.0) corresponds to .x = idRightChild .y = aabbMax.x, .z = aabbMax.y, .w = aabbMax.z 

	ivec2 uv0 = ivec2( mod(ix2 + 0.0, 256.0), (ix2 + 0.0) * INV_TEXTURE_WIDTH ); // data0
	ivec2 uv1 = ivec2( mod(ix2 + 1.0, 256.0), (ix2 + 1.0) * INV_TEXTURE_WIDTH ); // data1
	
	boxNodeData0 = texelFetch(texture, uv0, 0);
	boxNodeData1 = texelFetch(texture, uv1, 0);
}

void GetBoxNodeUniform(in float i, inout vec4 boxNodeData0, inout vec4 boxNodeData1)
{
	// each bounding box's data is encoded in 2 uniform vector4(xyzw) slots 
	float ix2 = (i * 2.0);
	// (ix2 + 0.0) corresponds to .x: idObject,     .y: aabbMin.x, .z: aabbMin.y, .w: aabbMin.z 
	// (ix2 + 1.0) corresponds to .x: idRightChild, .y: aabbMax.x, .z: aabbMax.y, .w: aabbMax.z 
	
	boxNodeData0 = uTopLevelBVH_aabbData[int(ix2 + 0.0)]; 
	boxNodeData1 = uTopLevelBVH_aabbData[int(ix2 + 1.0)];
}

void GetBoxNode2DArray(in float i, in float depth, inout vec4 boxNodeData0, inout vec4 boxNodeData1)
{
	// each bounding box's data is encoded in 2 rgba(or xyzw) texture slots 
	float ix2 = (i * 2.0);
	// (ix2 + 0.0) corresponds to .x: idObject,     .y: aabbMin.x, .z: aabbMin.y, .w: aabbMin.z 
	// (ix2 + 1.0) corresponds to .x: idRightChild, .y: aabbMax.x, .z: aabbMax.y, .w: aabbMax.z 

	ivec2 uv0 = ivec2( mod(ix2 + 0.0, 256.0), (ix2 + 0.0) * INV_TEXTURE_WIDTH ); // data0
	ivec2 uv1 = ivec2( mod(ix2 + 1.0, 256.0), (ix2 + 1.0) * INV_TEXTURE_WIDTH ); // data1
	
	boxNodeData0 = texelFetch(tModels_aabbDataTexture2DArray, ivec3(uv0, depth), 0);
	boxNodeData1 = texelFetch(tModels_aabbDataTexture2DArray, ivec3(uv1, depth), 0);
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------
void Object_BVH_Intersect( vec3 rObjOrigin, vec3 rObjDirection, mat3 invMatrix, in float depth_id, in bool objectIsSelected )
//--------------------------------------------------------------------------------------------------------------------------------------------------------
{
	vec4 currentBoxNodeData0, nodeAData0, nodeBData0, tmpNodeData0;
	vec4 currentBoxNodeData1, nodeAData1, nodeBData1, tmpNodeData1;
	
	vec4 vd0, vd1, vd2, vd3, vd4, vd5, vd6;

	vec3 inverseDir = 1.0 / rObjDirection;

	vec2 currentStackData, stackDataA, stackDataB, tmpStackData;
	ivec2 uv0, uv1, uv2, uv3, uv4, uv5, uv6;

	float d;
        float stackptr = 0.0;
	float id = 0.0;
	float tu, tv;
	float triangleID = 0.0;
	float triangleU = 0.0;
	float triangleV = 0.0;
	
	int skip = FALSE;
	int triangleLookupNeeded = FALSE;

	
	GetBoxNode2DArray(stackptr, depth_id, currentBoxNodeData0, currentBoxNodeData1);
	currentStackData = vec2(stackptr, BoundingBoxIntersect(currentBoxNodeData0.yzw, currentBoxNodeData1.yzw, rObjOrigin, inverseDir));
	objStackLevels[0] = currentStackData;
	skip = (currentStackData.y < hitT) ? TRUE : FALSE;

	while (true)
        {
		if (skip == FALSE) 
                {
                        // decrease pointer by 1 (0.0 is root level, 24.0 is maximum depth)
                        if (--stackptr < 0.0) // went past the root level, terminate loop
                                break;

                        currentStackData = objStackLevels[int(stackptr)];
			
			if (currentStackData.y >= hitT)
				continue;
			
			GetBoxNode2DArray(currentStackData.x, depth_id, currentBoxNodeData0, currentBoxNodeData1);
                }
		skip = FALSE; // reset skip
		

		if (currentBoxNodeData0.x < 0.0) // < 0.0 signifies an inner node
		{
			GetBoxNode2DArray(currentStackData.x + 1.0, depth_id, nodeAData0, nodeAData1);
			GetBoxNode2DArray(currentBoxNodeData1.x, depth_id, nodeBData0, nodeBData1);
			stackDataA = vec2(currentStackData.x + 1.0, BoundingBoxIntersect(nodeAData0.yzw, nodeAData1.yzw, rObjOrigin, inverseDir));
			stackDataB = vec2(currentBoxNodeData1.x, BoundingBoxIntersect(nodeBData0.yzw, nodeBData1.yzw, rObjOrigin, inverseDir));
			
			// first sort the branch node data so that 'a' is the smallest
			if (stackDataB.y < stackDataA.y)
			{
				tmpStackData = stackDataB;
				stackDataB = stackDataA;
				stackDataA = tmpStackData;

				tmpNodeData0 = nodeBData0;   tmpNodeData1 = nodeBData1;
				nodeBData0   = nodeAData0;   nodeBData1   = nodeAData1;
				nodeAData0   = tmpNodeData0; nodeAData1   = tmpNodeData1;
			} // branch 'b' now has the larger rayT value of 'a' and 'b'

			if (stackDataB.y < hitT) // see if branch 'b' (the larger rayT) needs to be processed
			{
				currentStackData = stackDataB;
				currentBoxNodeData0 = nodeBData0;
				currentBoxNodeData1 = nodeBData1;
				skip = TRUE; // this will prevent the stackptr from decreasing by 1
			}
			if (stackDataA.y < hitT) // see if branch 'a' (the smaller rayT) needs to be processed 
			{
				if (skip == TRUE) // if larger branch 'b' needed to be processed also,
					objStackLevels[int(stackptr++)] = stackDataB; // cue larger branch 'b' for future round
							// also, increase pointer by 1
				
				currentStackData = stackDataA;
				currentBoxNodeData0 = nodeAData0; 
				currentBoxNodeData1 = nodeAData1;
				skip = TRUE; // this will prevent the stackptr from decreasing by 1
			}

			continue;
		} // end if (currentBoxNode.data0.x < 0.0) // inner node


		// else this is a leaf

		// each triangle's data is encoded in 8 rgba(or xyzw) texture slots
		id = 8.0 * currentBoxNodeData0.x;

		uv0 = ivec2( mod(id + 0.0, 256.0), (id + 0.0) * INV_TEXTURE_WIDTH );
		uv1 = ivec2( mod(id + 1.0, 256.0), (id + 1.0) * INV_TEXTURE_WIDTH );
		uv2 = ivec2( mod(id + 2.0, 256.0), (id + 2.0) * INV_TEXTURE_WIDTH );
		
		vd0 = texelFetch(tModels_triangleDataTexture2DArray, ivec3(uv0, depth_id), 0);
		vd1 = texelFetch(tModels_triangleDataTexture2DArray, ivec3(uv1, depth_id), 0);
		vd2 = texelFetch(tModels_triangleDataTexture2DArray, ivec3(uv2, depth_id), 0);

		d = BVH_TriangleIntersect( vec3(vd0.xyz), vec3(vd0.w, vd1.xy), vec3(vd1.zw, vd2.x), rObjOrigin, rObjDirection, tu, tv );

		if (d < hitT)
		{
			hitT = d;
			triangleID = id;
			triangleU = tu;
			triangleV = tv;
			triangleLookupNeeded = TRUE;
		}
	      
        } // end while (TRUE)


	if (triangleLookupNeeded == TRUE)
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
		hitNormal = ( cross(vec3(vd0.w, vd1.xy) - vec3(vd0.xyz), vec3(vd1.zw, vd2.x) - vec3(vd0.xyz)) );
		// transfom normal back into world space
		hitNormal = (transpose(invMatrix) * hitNormal);
		// else use vertex normals
		//triangleW = 1.0 - triangleU - triangleV;
		//hitNormal = normalize(triangleW * vec3(vd4.zw, vd5.x) + triangleU * vec3(vd5.yzw) + triangleV * vec3(vd6.xyz));
		hitColor = (objectIsSelected && !uDoingDissolveEffect) ? vec3(0,2,1) : vec3(vd4.w, vd5.xy);
		hitType = depth_id == 4.0 ? COAT : DIFF;

	} // end if (triangleLookupNeeded == TRUE)

} // end void Object_BVH_Intersect( vec3 rObjOrigin, vec3 rObjDirection, mat3 invMatrix, in float depth_id, in bool objectIsSelected, in bool doingDissolveEffect )


//--------------------------------------------------------------------------------------------------
void SceneIntersect( vec3 rayOrigin, vec3 rayDirection, int bounces, out float hitObjectID )
//--------------------------------------------------------------------------------------------------
{
	mat4 invMatrix;

	vec4 currentBoxNodeData0, nodeAData0, nodeBData0, tmpNodeData0;
	vec4 currentBoxNodeData1, nodeAData1, nodeBData1, tmpNodeData1;

	vec4 vd0, vd1, vd2, vd3, vd4, vd5, vd6, vd7;

	vec3 rObjOrigin, rObjDirection;
	vec3 inverseDir = 1.0 / rayDirection;
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

	int objectCount = 0;
	
	int skip = FALSE;
	int triangleLookupNeeded = FALSE;
	int isRayExiting;
	bool objectIsSelected = false;

	// reset intersection record's hitT value
	hitT = INFINITY;

	

	// LANDSCAPE BVH ////////////

        stackptr = 0.0;
	GetBoxNodeData(stackptr, tLandscape_AABBTexture, currentBoxNodeData0, currentBoxNodeData1);
	currentStackData = vec2(stackptr, BoundingBoxIntersect(currentBoxNodeData0.yzw, currentBoxNodeData1.yzw, rayOrigin, inverseDir));
	stackLevels[0] = currentStackData;
	skip = (currentStackData.y < hitT) ? TRUE : FALSE;

	while (true)
        {
		if (skip == FALSE) 
                {
                        // decrease pointer by 1 (0.0 is root level, 24.0 is maximum depth)
                        if (--stackptr < 0.0) // went past the root level, terminate loop
                                break;

                        currentStackData = stackLevels[int(stackptr)];
			
			if (currentStackData.y >= hitT)
				continue;
			
			GetBoxNodeData(currentStackData.x, tLandscape_AABBTexture, currentBoxNodeData0, currentBoxNodeData1);
                }
		skip = FALSE; // reset skip
		

		if (currentBoxNodeData0.x < 0.0) // < 0.0 signifies an inner node
		{
			GetBoxNodeData(currentStackData.x + 1.0, tLandscape_AABBTexture, nodeAData0, nodeAData1);
			GetBoxNodeData(currentBoxNodeData1.x, tLandscape_AABBTexture, nodeBData0, nodeBData1);
			stackDataA = vec2(currentStackData.x + 1.0, BoundingBoxIntersect(nodeAData0.yzw, nodeAData1.yzw, rayOrigin, inverseDir));
			stackDataB = vec2(currentBoxNodeData1.x, BoundingBoxIntersect(nodeBData0.yzw, nodeBData1.yzw, rayOrigin, inverseDir));
			
			// first sort the branch node data so that 'a' is the smallest
			if (stackDataB.y < stackDataA.y)
			{
				tmpStackData = stackDataB;
				stackDataB = stackDataA;
				stackDataA = tmpStackData;

				tmpNodeData0 = nodeBData0;   tmpNodeData1 = nodeBData1;
				nodeBData0   = nodeAData0;   nodeBData1   = nodeAData1;
				nodeAData0   = tmpNodeData0; nodeAData1   = tmpNodeData1;
			} // branch 'b' now has the larger rayT value of 'a' and 'b'

			if (stackDataB.y < hitT) // see if branch 'b' (the larger rayT) needs to be processed
			{
				currentStackData = stackDataB;
				currentBoxNodeData0 = nodeBData0;
				currentBoxNodeData1 = nodeBData1;
				skip = TRUE; // this will prevent the stackptr from decreasing by 1
			}
			if (stackDataA.y < hitT) // see if branch 'a' (the smaller rayT) needs to be processed 
			{
				if (skip == TRUE) // if larger branch 'b' needed to be processed also,
					stackLevels[int(stackptr++)] = stackDataB; // cue larger branch 'b' for future round
							// also, increase pointer by 1
				
				currentStackData = stackDataA;
				currentBoxNodeData0 = nodeAData0; 
				currentBoxNodeData1 = nodeAData1;
				skip = TRUE; // this will prevent the stackptr from decreasing by 1
			}

			continue;
		} // end if (currentBoxNode.data0.x < 0.0) // inner node


		// else this is a leaf

		// each triangle's data is encoded in 8 rgba(or xyzw) texture slots
		id = 8.0 * currentBoxNodeData0.x;

		uv0 = ivec2( mod(id + 0.0, 256.0), (id + 0.0) * INV_TEXTURE_WIDTH );
		uv1 = ivec2( mod(id + 1.0, 256.0), (id + 1.0) * INV_TEXTURE_WIDTH );
		uv2 = ivec2( mod(id + 2.0, 256.0), (id + 2.0) * INV_TEXTURE_WIDTH );
		
		vd0 = texelFetch(tLandscape_TriangleTexture, uv0, 0);
		vd1 = texelFetch(tLandscape_TriangleTexture, uv1, 0);
		vd2 = texelFetch(tLandscape_TriangleTexture, uv2, 0);

		d = BVH_TriangleIntersect( vec3(vd0.xyz), vec3(vd0.w, vd1.xy), vec3(vd1.zw, vd2.x), rayOrigin, rayDirection, tu, tv );

		if (d < hitT)
		{
			hitT = d;
			triangleID = id;
			triangleU = tu;
			triangleV = tv;
			triangleLookupNeeded = TRUE;
		}
	      
        } // end while (TRUE)


	if (triangleLookupNeeded == TRUE)
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
		//hitNormal = normalize( cross(vec3(vd0.w, vd1.xy) - vec3(vd0.xyz), vec3(vd1.zw, vd2.x) - vec3(vd0.xyz)) );
		// else use vertex normals
		triangleW = 1.0 - triangleU - triangleV;
		hitNormal = (triangleW * vec3(vd4.zw, vd5.x) + triangleU * vec3(vd5.yzw) + triangleV * vec3(vd6.xyz));
		hitColor = (triangleID == uSelectedTileIndex || triangleID == uSelectedTileIndex + 8.0) ? vec3(0,2,1) : vd2.yzw;
		hitType = DIFF;
		hitObjectID = float(objectCount);
		objectCount++;

		hitPos = rayOrigin + rayDirection * hitT;
		if (hitColor == vec3(1.0))
		{
			hitType = COAT;
			hitObjectID = float(objectCount);
			objectCount++;
			
			posX = hitPos.x * 0.1;
			gridX = floor(posX);
			posZ = hitPos.z * 0.1;
			gridZ = floor(posZ);
			
			hitColor = abs(hitNormal.x) > abs(hitNormal.z) ? vec3(0.4) : vec3(0.005,0.001,0.001);

			if (posX - gridX < lineThickness) // to the right of snap grid
			{
				hitType = SPEC;
				hitColor = vec3(0, 0, 1); // blue trim
				hitNormal.x -= 1.0;
				hitObjectID = float(objectCount);
			}
			if (posX - gridX > oneMinusLineThickness) // to the left of snap grid
			{
				hitType = SPEC;
				hitColor = vec3(0, 0, 1); // blue trim
				hitNormal.x += 1.0;
				hitObjectID = float(objectCount);
			}
			if (posZ - gridZ < lineThickness) // in front of snap grid
			{
				hitType = SPEC;
				hitColor = vec3(0, 0, 1); // blue trim
				hitNormal.z -= 1.0;
				hitObjectID = float(objectCount);
			}
			if (posZ - gridZ > oneMinusLineThickness) // behind snap grid
			{
				hitType = SPEC;
				hitColor = vec3(0, 0, 1); // blue trim
				hitNormal.z += 1.0;
				hitObjectID = float(objectCount);
			}

			///hitNormal = normalize(hitNormal);

		} // end if (hitColor == vec3(1.0))

	} // end if (triangleLookupNeeded == TRUE)


	// TOP_LEVEL BVH /////////////////

	// reset variables
	stackptr = 0.0;
	GetBoxNodeUniform(stackptr, currentBoxNodeData0, currentBoxNodeData1);
	currentStackData = vec2(stackptr, BoundingBoxIntersect(currentBoxNodeData0.yzw, currentBoxNodeData1.yzw, rayOrigin, inverseDir));
	stackLevels[0] = currentStackData;
	skip = (currentStackData.y < hitT) ? TRUE : FALSE;

	while (true)
        {
		if (skip == FALSE) 
                {
                        // decrease pointer by 1 (0.0 is root level, 24.0 is maximum depth)
                        if (--stackptr < 0.0) // went past the root level, terminate loop
                                break;

                        currentStackData = stackLevels[int(stackptr)];
			
			if (currentStackData.y >= hitT)
				continue;
			
			GetBoxNodeUniform(currentStackData.x, currentBoxNodeData0, currentBoxNodeData1);
                }
		skip = FALSE; // reset skip
		

		if (currentBoxNodeData0.x < 0.0) // < 0.0 signifies an inner node
		{
			GetBoxNodeUniform(currentStackData.x + 1.0, nodeAData0, nodeAData1);
			GetBoxNodeUniform(currentBoxNodeData1.x, nodeBData0, nodeBData1);
			stackDataA = vec2(currentStackData.x + 1.0, BoundingBoxIntersect(nodeAData0.yzw, nodeAData1.yzw, rayOrigin, inverseDir));
			stackDataB = vec2(currentBoxNodeData1.x, BoundingBoxIntersect(nodeBData0.yzw, nodeBData1.yzw, rayOrigin, inverseDir));
			
			// first sort the branch node data so that 'a' is the smallest
			if (stackDataB.y < stackDataA.y)
			{
				tmpStackData = stackDataB;
				stackDataB = stackDataA;
				stackDataA = tmpStackData;

				tmpNodeData0 = nodeBData0;   tmpNodeData1 = nodeBData1;
				nodeBData0   = nodeAData0;   nodeBData1   = nodeAData1;
				nodeAData0   = tmpNodeData0; nodeAData1   = tmpNodeData1;
			} // branch 'b' now has the larger rayT value of 'a' and 'b'

			if (stackDataB.y < hitT) // see if branch 'b' (the larger rayT) needs to be processed
			{
				currentStackData = stackDataB;
				currentBoxNodeData0 = nodeBData0;
				currentBoxNodeData1 = nodeBData1;
				skip = TRUE; // this will prevent the stackptr from decreasing by 1
			}
			if (stackDataA.y < hitT) // see if branch 'a' (the smaller rayT) needs to be processed 
			{
				if (skip == TRUE) // if larger branch 'b' needed to be processed also,
					stackLevels[int(stackptr++)] = stackDataB; // cue larger branch 'b' for future round
							// also, increase pointer by 1
				
				currentStackData = stackDataA;
				currentBoxNodeData0 = nodeAData0; 
				currentBoxNodeData1 = nodeAData1;
				skip = TRUE; // this will prevent the stackptr from decreasing by 1
			}

			continue;
		} // end if (currentBoxNodeData0.x < 0.0) // inner node


		// else this is a leaf
		objectIsSelected = uSelectedObjectIndex == currentBoxNodeData0.x || uResolvingObjectIndex == currentBoxNodeData0.x;
		if (currentBoxNodeData0.x != 0.0 && objectIsSelected && rng() < uDissolveEffectStrength)
			continue;

		invMatrix = uObj3D_InvMatrices[int(currentBoxNodeData0.x)];
		model_id = invMatrix[3][3];
		if (model_id == 2.0 && bounces == 0 && currentStackData.y < 0.1) 
			continue; // don't want our view blocked by the inside of our robot's head and shoulders

		// once the model_id code is extracted, set this last matrix element ([15]) back to 1.0
		invMatrix[3][3] = 1.0;
		// transform ray into leaf object's object space
		rObjOrigin = vec3( invMatrix * vec4(rayOrigin, 1.0) );
		rObjDirection = vec3( invMatrix * vec4(rayDirection, 0.0) );

		hitObjectID = float(objectCount);
		Object_BVH_Intersect(rObjOrigin, rObjDirection, mat3(invMatrix), model_id, objectIsSelected);

        } // end while (TRUE)
	objectCount++;

	// viewing ray target metal sphere
	d = SphereIntersect( uViewRaySphereRadius, uViewRayTargetPosition, rayOrigin, rayDirection );
	if (d < hitT)
	{
		hitT = d;
		hitNormal = (rayOrigin + rayDirection * hitT) - uViewRayTargetPosition;
		hitEmission = vec3(0);
		hitColor = vec3(1);//vec3(1.0, 0.765557, 0.336057);
		hitType = SPEC;
		hitObjectID = float(objectCount);
	}
	

} // end void SceneIntersect( vec3 rayOrigin, vec3 rayDirection, int bounces, out float hitObjectID )



vec3 getSkyColor(in vec3 rayDir)
{
	vec3 topColor = vec3(0.01, 0.2, 1.0);
	//topColor *= max(0.3, dot(vec3(0,1,0), uSunDirection));
	vec3 bottomColor = vec3(0);
	vec3 skyColor = mix(bottomColor, topColor, clamp(pow((rayDir.y + 1.0), 5.0), 0.0, 1.0) );
	float sun = max(0.0, dot(rayDir, uSunDirection));
	return skyColor + (pow(sun, 180.0) * vec3(0.2,0.1,0.0)) + (pow(sun, 2000.0) * vec3(1,1,0)) + (pow(sun, 10000.0) * vec3(3,2,1));
}

//----------------------------------------------------------------------------------------------------------------------------------------------------
vec3 CalculateRadiance( out vec3 objectNormal, out vec3 objectColor, out float objectID, out float pixelSharpness )
//----------------------------------------------------------------------------------------------------------------------------------------------------
{

	vec3 accumCol = vec3(0);
        vec3 mask = vec3(1);
	vec3 reflectionMask = vec3(1);
	vec3 reflectionRayOrigin = vec3(0);
	vec3 reflectionRayDirection = vec3(0);
	vec3 x, n, nl;
	vec3 up = vec3(0, 1, 0);
        
	float nc, nt, ratioIoR, Re, Tr;
	float randChoose;
	float partialAmount = 0.0;
	float previousObjectID;

	int reflectionBounces = -1;
	int diffuseCount = 0;
	int previousIntersecType = -100;
	hitType = -100;

	int bounceIsSpecular = TRUE;
	int sampleLight = FALSE;
	int willNeedReflectionRay = FALSE;
	int isReflectionTime = FALSE;
	int reflectionNeedsToBeSharp = FALSE;

	

	for (int bounces = 0; bounces < 6; bounces++)
	{
		if (isReflectionTime == TRUE)
			reflectionBounces++;

		previousIntersecType = hitType;
		previousObjectID = hitObjectID;

		SceneIntersect(rayOrigin, rayDirection, bounces, hitObjectID);

		// useful data 
		n = normalize(hitNormal);
                nl = dot(n, rayDirection) < 0.0 ? n : -n;
		x = rayOrigin + rayDirection * hitT;

		if (bounces == 0)
		{
			objectID = hitObjectID;
		}
		if (isReflectionTime == FALSE && diffuseCount == 0 && hitObjectID != previousObjectID)
		{
			objectNormal += n;
			objectColor += hitColor;
		}
		if (reflectionNeedsToBeSharp == TRUE && reflectionBounces == 0)
		{
			objectNormal += n;
			objectColor += hitColor;
		}


		if (hitT == INFINITY)
		{
			if (bounces == 0)
				pixelSharpness = 1.0;
			
			if (bounceIsSpecular == TRUE || sampleLight == TRUE)
				accumCol += mask * getSkyColor(rayDirection);
			
			if (willNeedReflectionRay == TRUE)
			{
				mask = reflectionMask;
				rayOrigin = reflectionRayOrigin;
				rayDirection = reflectionRayDirection;

				willNeedReflectionRay = FALSE;
				bounceIsSpecular = TRUE;
				sampleLight = FALSE;
				isReflectionTime = TRUE;
				continue;
			}

			break;
		}


		// if we get here and sampleLight is still TRUE, shadow ray failed to find the light source 
		// the ray hit an occluding object along its way to the light
		if (sampleLight == TRUE)
		{
			if (willNeedReflectionRay == TRUE)
			{
				mask = reflectionMask;
				rayOrigin = reflectionRayOrigin;
				rayDirection = reflectionRayDirection;

				willNeedReflectionRay = FALSE;
				bounceIsSpecular = TRUE;
				sampleLight = FALSE;
				isReflectionTime = TRUE;
				continue;
			}

			break;
		}
	

		    
                if (hitType == DIFF) // Ideal DIFFUSE reflection
		{
			diffuseCount++;
			
			mask *= hitColor;

			if (bounceIsSpecular == TRUE)
			{
				accumCol += mask * 0.4; // ambient color
			}
				

			bounceIsSpecular = FALSE;

			rayDirection = randomDirectionInSpecularLobe(uSunDirection, 0.03);
			rayOrigin = x + nl * uEPS_intersect;
			
			mask *= clamp(dot(nl, rayDirection), 0.0, 1.0);
			
			sampleLight = TRUE;
			continue;
			
		} // end if (hitType == DIFF)
		
		if (hitType == SPEC)  // Ideal SPECULAR reflection
		{
			mask *= hitColor;

			rayDirection = reflect(rayDirection, nl);
			rayOrigin = x + nl * uEPS_intersect;

			continue;
		}
		
		if (hitType == COAT)  // Diffuse object underneath with ClearCoat on top
		{
			nc = 1.0; // IOR of Air
			nt = 1.5; // IOR of Clear Coat
			Re = calcFresnelReflectance(rayDirection, nl, nc, nt, ratioIoR);
			Tr = 1.0 - Re;
			
			if (bounces == 0)
			{
				reflectionMask = mask * Re;
				reflectionRayDirection = reflect(rayDirection, nl); // reflect ray from surface
				reflectionRayOrigin = x + nl * uEPS_intersect;
				willNeedReflectionRay = TRUE;
				reflectionNeedsToBeSharp = TRUE;
			}

			diffuseCount++;
			
			mask *= Tr;
			mask *= hitColor;

			if (bounceIsSpecular == TRUE) 
			{
				accumCol += mask * 0.4; // ambient color
			}
				
			bounceIsSpecular = FALSE;
			
			rayDirection = randomDirectionInSpecularLobe(uSunDirection, 0.03);
			rayOrigin = x + nl * uEPS_intersect;
			
			mask *= clamp(dot(nl, rayDirection), 0.0, 1.0);
			
			sampleLight = TRUE;
			continue;
                        
		} //end if (hitType == COAT)
		
	} // end for (int bounces = 0; bounces < 6; bounces++)
	
	return max(vec3(0), accumCol);

} // end vec3 CalculateRadiance( vec3 rayOrigin, vec3 rayDirection, out vec3 objectNormal, out vec3 objectColor, out float objectID, out float pixelSharpness )


// SetupScene() not used in this game
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
	vec3 camRight   = vec3( uCameraMatrix[0][0],  uCameraMatrix[0][1],  uCameraMatrix[0][2]);
	vec3 camUp      = vec3( uCameraMatrix[1][0],  uCameraMatrix[1][1],  uCameraMatrix[1][2]);
	vec3 camForward = vec3(-uCameraMatrix[2][0], -uCameraMatrix[2][1], -uCameraMatrix[2][2]);
	// the following is not needed - three.js has a built-in uniform named cameraPosition
	//vec3 camPos   = vec3( uCameraMatrix[3][0],  uCameraMatrix[3][1],  uCameraMatrix[3][2]);
	
	// calculate unique seed for rng() function
	seed = uvec2(uFrameCounter, uFrameCounter + 1.0) * uvec2(gl_FragCoord);
	// initialize rand() variables
	randNumber = 0.0; // the final randomly-generated number (range: 0.0 to 1.0)
	blueNoise = texelFetch(tBlueNoiseTexture, ivec2(mod(floor(gl_FragCoord.xy), 128.0)), 0).r;

	vec2 pixelOffset = vec2( tentFilter(rand()), tentFilter(rand()) );
	pixelOffset *= uCameraIsMoving ? 0.5 : 1.0;

	// we must map pixelPos into the range -1.0 to +1.0
	vec2 pixelPos = ((gl_FragCoord.xy + vec2(0.5) + pixelOffset) / uResolution) * 2.0 - 1.0;

	vec3 rayDir = normalize( pixelPos.x * camRight * uULen + pixelPos.y * camUp * uVLen + camForward );
	
	// depth of field
	//vec3 focalPoint = uFocusDistance * rayDir;
	vec3 focalPoint = (distance(cameraPosition, uViewRayTargetPosition) - 1.0) * rayDir;
	float randomAngle = rand() * TWO_PI; // pick random point on aperture
	float randomRadius = rand() * uApertureSize;
	vec3  randomAperturePos = ( cos(randomAngle) * camRight + sin(randomAngle) * camUp ) * sqrt(randomRadius);
	// point on aperture to focal point
	vec3 finalRayDir = normalize(focalPoint - randomAperturePos);
	
	rayOrigin = cameraPosition + randomAperturePos;
	rayDirection = finalRayDir;

	//SetupScene(); // not used in this game
	
	// Edge Detection - don't want to blur edges where either surface normals change abruptly (i.e. room wall corners), objects overlap each other (i.e. edge of a foreground sphere in front of another sphere right behind it),
	// or an abrupt color variation on the same smooth surface, even if it has similar surface normals (i.e. checkerboard pattern). Want to keep all of these cases as sharp as possible - no blur filter will be applied.
	vec3 objectNormal, objectColor;
	float objectID = -INFINITY;
	float pixelSharpness = 0.0;
	//float dynamicSurface = 0.0;
	
	// perform path tracing and get resulting pixel color
	vec4 currentPixel = vec4( vec3(CalculateRadiance(objectNormal, objectColor, objectID, pixelSharpness)), 0.0 );

	// if difference between normals of neighboring pixels is less than the first edge0 threshold, the white edge line effect is considered off (0.0)
	float edge0 = 0.2; // edge0 is the minimum difference required between normals of neighboring pixels to start becoming a white edge line
	// any difference between normals of neighboring pixels that is between edge0 and edge1 smoothly ramps up the white edge line brightness (smoothstep 0.0-1.0)
	float edge1 = 0.6; // once the difference between normals of neighboring pixels is >= this edge1 threshold, the white edge line is considered fully bright (1.0)
	float difference_Nx = fwidth(objectNormal.x);
	float difference_Ny = fwidth(objectNormal.y);
	float difference_Nz = fwidth(objectNormal.z);
	float normalDifference = smoothstep(edge0, edge1, difference_Nx) + smoothstep(edge0, edge1, difference_Ny) + smoothstep(edge0, edge1, difference_Nz);

	float objectDifference = min(fwidth(objectID), 1.0);

	float colorDifference = (fwidth(objectColor.r) + fwidth(objectColor.g) + fwidth(objectColor.b)) > 0.0 ? 1.0 : 0.0;
	// white-line debug visualization for normal difference
	//currentPixel.rgb += (rng() * 1.5) * vec3(normalDifference);
	// white-line debug visualization for object difference
	//currentPixel.rgb += (rng() * 1.5) * vec3(objectDifference);
	// white-line debug visualization for color difference
	//currentPixel.rgb += (rng() * 1.5) * vec3(colorDifference);
	// white-line debug visualization for all 3 differences
	//currentPixel.rgb += (rng() * 1.5) * vec3( clamp(max(normalDifference, max(objectDifference, colorDifference)), 0.0, 1.0) );
	
	vec4 previousPixel = texelFetch(tPreviousTexture, ivec2(gl_FragCoord.xy), 0);


	if (uCameraIsMoving)
	{
                previousPixel.rgb *= 0.6; // motion-blur trail amount (old image)
		currentPixel.rgb *= 0.4; // brightness of new image (noisy)
		
		previousPixel.a = 0.0;
        }
	else if (uPlayingTeleportAnimation)
	{
                previousPixel.rgb *= 0.9; // motion-blur trail amount (old image)
                currentPixel.rgb *= 0.1; // brightness of new image (noisy)

		previousPixel.a = 0.0;
        }
	else
	{
                previousPixel.rgb *= 0.8; // motion-blur trail amount (old image)
                currentPixel.rgb *= 0.2; // brightness of new image (noisy)
        }
	
	currentPixel.a = pixelSharpness;

	// check for all edges that are not light sources
	if (pixelSharpness < 1.01 && (colorDifference >= 1.0 || normalDifference >= 0.1 || objectDifference >= 1.0)) // all other edges
		currentPixel.a = pixelSharpness = 1.0;

	// makes light source edges (shape boundaries) more stable
	// if (previousPixel.a == 1.01)
	// 	currentPixel.a = 1.01;

	// makes sharp edges more stable
	if (previousPixel.a == 1.0)
		currentPixel.a = 1.0;
	
	// for dynamic scenes (to clear out old, dark, sharp pixel trails left behind from moving objects)
	if (previousPixel.a == 1.0 && rng() < 0.05)
		currentPixel.a = 0.0;

	
	pc_fragColor = vec4(previousPixel.rgb + currentPixel.rgb, currentPixel.a);	
}
