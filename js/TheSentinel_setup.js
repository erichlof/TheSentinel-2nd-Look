// scene/demo-specific variables go here
let sceneIsDynamic = true;
let camFlightSpeed = 60;
let parentRotationObject = new THREE.Object3D();
let sphereObject = new THREE.Object3D();
let sphereObjectPosition = new THREE.Vector3();
let axisOfRotation = new THREE.Vector3();
let sunDirection = new THREE.Vector3();
let lightAngle = 0;
let planeGeometry, planeMaterial, planeMesh;
let numTiles = 40; // 40
let numVertices = numTiles + 1;
let gridExtent = numTiles * 10;
let raiseAmount = 0;
let frequency = 0;
let amplitude = 0;
let i_offset = 0;
let j_offset = 0;
let canBuildNewLevel = true;
let checkColor0 = new THREE.Color();
let checkColor1 = new THREE.Color();
let colors = new Float32Array(numTiles * numTiles * 18);
let tiles = [];
let code = '';
let index = 0;
let tileIndex = 0;
let vertexIndex = 0;
let nextRowIndex = 0;
let highestLevel = -Infinity;
let canPressSpace = true;
let canPressR = true;
let simplex = new THREE.SimplexNoise();
let vertexHeights = new Float32Array(numVertices * numVertices);
let levelCounter = -1;
let upVector = new THREE.Vector3(0, 1, 0);
let modelScale = 10.0;
let MaxUnitsOfEnergy = 64;
let materialNumber = 0;
let buildnodesLength = 0;
let objInvMatrices = [];
let topLevelAABBTree = [];

let landscape_total_number_of_triangles = 0;
let landscape_vpa;
let landscape_vca;
let landscape_vna;
let landscape_triangle_array;
let landscape_triangleDataTexture;
let landscape_aabb_array;
let landscape_aabbDataTexture;
let landscape_totalWork;

let TREE_MODEL_ID = 0;
let BOULDER_MODEL_ID = 1;
let ROBOT_MODEL_ID = 2;
let SENTRY_MODEL_ID = 3;
let PEDESTAL_MODEL_ID = 4;
let SENTINEL_MODEL_ID = 5;
let MEANIE_MODEL_ID = 6;
let current_model_id = TREE_MODEL_ID;

let models_triangle_array;
let models_aabb_array;
let models_triangleDataTexture2DArray;
let models_aabbDataTexture2DArray;
let TREE_TEXTURE_OFFSET = Math.floor(256 * 256 * 4 * TREE_MODEL_ID);
let BOULDER_TEXTURE_OFFSET = Math.floor(256 * 256 * 4 * BOULDER_MODEL_ID);
let ROBOT_TEXTURE_OFFSET = Math.floor(256 * 256 * 4 * ROBOT_MODEL_ID);
let SENTRY_TEXTURE_OFFSET = Math.floor(256 * 256 * 4 * SENTRY_MODEL_ID);
let PEDESTAL_TEXTURE_OFFSET = Math.floor(256 * 256 * 4 * PEDESTAL_MODEL_ID);
let SENTINEL_TEXTURE_OFFSET = Math.floor(256 * 256 * 4 * SENTINEL_MODEL_ID);
let MEANIE_TEXTURE_OFFSET = Math.floor(256 * 256 * 4 * MEANIE_MODEL_ID);

let gameObjectCount = 0;
let numOfSentries = 0;
let game_Objects = [];
let randomThreshold = 0;

let tree_modelMesh;
let tree_modelMaterialList = [];
let tree_triangleMaterialMarkers = [];
let tree_total_number_of_triangles = 0;
let tree_vpa;
let tree_vca;
let tree_vna;
let tree_triangle_array; // needed for BVH creation
let tree_aabb_array; // needed for BVH creation
let tree_totalWork;

let boulder_modelMesh;
let boulder_modelMaterialList = [];
let boulder_triangleMaterialMarkers = [];
let boulder_total_number_of_triangles = 0;
let boulder_vpa;
let boulder_vca;
let boulder_vna;
let boulder_triangle_array;
let boulder_aabb_array;
let boulder_totalWork;

let robot_modelMesh;
let robot_modelMaterialList = [];
let robot_triangleMaterialMarkers = [];
let robot_total_number_of_triangles = 0;
let robot_vpa;
let robot_vca;
let robot_vna;
let robot_triangle_array;
let robot_aabb_array;
let robot_totalWork;

let sentry_modelMesh;
let sentry_modelMaterialList = [];
let sentry_triangleMaterialMarkers = [];
let sentry_total_number_of_triangles = 0;
let sentry_vpa;
let sentry_vca;
let sentry_vna;
let sentry_triangle_array;
let sentry_aabb_array;
let sentry_totalWork;

let meanie_modelMesh;
let meanie_modelMaterialList = [];
let meanie_triangleMaterialMarkers = [];
let meanie_total_number_of_triangles = 0;
let meanie_vpa;
let meanie_vca;
let meanie_vna;
let meanie_triangle_array;
let meanie_aabb_array;
let meanie_totalWork;

let pedestal_modelMesh;
let pedestal_modelMaterialList = [];
let pedestal_triangleMaterialMarkers = [];
let pedestal_total_number_of_triangles = 0;
let pedestal_vpa;
let pedestal_vca;
let pedestal_vna;
let pedestal_triangle_array;
let pedestal_aabb_array;
let pedestal_totalWork;

let sentinel_modelMesh;
let sentinel_modelMaterialList = [];
let sentinel_triangleMaterialMarkers = [];
let sentinel_total_number_of_triangles = 0;
let sentinel_vpa;
let sentinel_vca;
let sentinel_vna;
let sentinel_triangle_array;
let sentinel_aabb_array;
let sentinel_totalWork;

let vp0 = new THREE.Vector3();
let vp1 = new THREE.Vector3();
let vp2 = new THREE.Vector3();
let vc0 = new THREE.Vector3();
let vc1 = new THREE.Vector3();
let vc2 = new THREE.Vector3();
let vn0 = new THREE.Vector3();
let vn1 = new THREE.Vector3();
let vn2 = new THREE.Vector3();
let bounding_box_min = new THREE.Vector3();
let bounding_box_max = new THREE.Vector3();
let bounding_box_centroid = new THREE.Vector3();
let boundingSphereRadius = 0;

let topLevel_total_number_of_objects = 0;
let topLevel_aabb_array;
let topLevel_totalWork;
let iX32 = 0;
let iX9 = 0;
let iX8 = 0;
let iX4 = 0;
let modelsLoadedCount = 0;

let raycaster = new THREE.Raycaster();
let intersectArray = [];
let raycastIndex = 0;
let viewRayTargetPosition = new THREE.Vector3();
let selectedTile = 0;
let blinkAngle = 0.0;



function MaterialObject()
{
	// a list of material types and their corresponding numbers are found in the 'pathTracingCommon.js' file
	this.type = 1; // default is '1': diffuse type 		
	this.albedoTextureID = -1; // which diffuse map to use for model's color / '-1' = no textures are used
	this.color = new THREE.Color(1.0, 1.0, 1.0); // takes on different meanings, depending on 'type' above
	this.roughness = 0.0; // 0.0 to 1.0 range, perfectly smooth to extremely rough
	this.metalness = 0.0; // 0.0 to 1.0 range, usually either 0 or 1, either non-metal or metal
	this.opacity = 1.0;   // 0.0 to 1.0 range, fully transparent to fully opaque
	this.refractiveIndex = 1.0; // 1.0=air, 1.33=water, 1.4=clearCoat, 1.5=glass, etc.
}


function load_GLTF_Model(pathToThisModel, model_ID)
{
	let meshList = [];
	let geoList = [];
	let modelMesh;
	let modelMaterialList = [];
	let triangleMaterialMarkers = [];


	let gltfLoader = new THREE.GLTFLoader();

	gltfLoader.load(pathToThisModel, function (meshGroup)
	{
		if (meshGroup.scene)
			meshGroup = meshGroup.scene;

		meshGroup.traverse(function (child)
		{
			if (child.isMesh)
			{
				let mat = new MaterialObject();
				mat.type = 1;
				mat.albedoTextureID = -1;
				mat.color = child.material.color;
				mat.roughness = child.material.roughness || 0.0;
				mat.metalness = child.material.metalness || 0.0;
				mat.opacity = child.material.opacity || 1.0;
				mat.refractiveIndex = 1.0;
				modelMaterialList.push(mat);

				if (child.geometry.index)
					triangleMaterialMarkers.push(child.geometry.index.count / 3);
				else
					triangleMaterialMarkers.push(child.geometry.attributes.position.array.length / 9);

				meshList.push(child);
			}
		});

		modelMesh = meshList[0].clone();

		for (let i = 0; i < meshList.length; i++)
		{
			geoList.push(meshList[i].geometry);
		}

		modelMesh.geometry = THREE.BufferGeometryUtils.mergeBufferGeometries(geoList);

		if (modelMesh.geometry.index)
			modelMesh.geometry = modelMesh.geometry.toNonIndexed();

		modelMesh.geometry.center();

		// the following will not execute unless markers length is 2 or more
		for (let i = 1; i < triangleMaterialMarkers.length; i++)
		{
			triangleMaterialMarkers[i] += triangleMaterialMarkers[i - 1];
		}

		if (model_ID == TREE_MODEL_ID)
		{
			tree_modelMesh = modelMesh;
			tree_modelMesh.geometry.computeBoundingSphere();
			tree_modelMaterialList = modelMaterialList;
			tree_triangleMaterialMarkers = triangleMaterialMarkers;
		}
		else if (model_ID == BOULDER_MODEL_ID)
		{
			boulder_modelMesh = modelMesh;
			boulder_modelMesh.geometry.computeBoundingSphere();
			boulder_modelMaterialList = modelMaterialList;
			boulder_triangleMaterialMarkers = triangleMaterialMarkers;
		}
		else if (model_ID == ROBOT_MODEL_ID)
		{
			robot_modelMesh = modelMesh;
			robot_modelMesh.geometry.computeBoundingSphere();
			robot_modelMaterialList = modelMaterialList;
			robot_triangleMaterialMarkers = triangleMaterialMarkers;
		}
		else if (model_ID == SENTRY_MODEL_ID)
		{
			sentry_modelMesh = modelMesh;
			sentry_modelMesh.geometry.computeBoundingSphere();
			sentry_modelMaterialList = modelMaterialList;
			sentry_triangleMaterialMarkers = triangleMaterialMarkers;
		}
		else if (model_ID == PEDESTAL_MODEL_ID)
		{
			pedestal_modelMesh = modelMesh;
			pedestal_modelMesh.geometry.computeBoundingSphere();
			pedestal_modelMaterialList = modelMaterialList;
			pedestal_triangleMaterialMarkers = triangleMaterialMarkers;
		}
		else if (model_ID == SENTINEL_MODEL_ID)
		{
			sentinel_modelMesh = modelMesh;
			sentinel_modelMesh.geometry.computeBoundingSphere();
			sentinel_modelMaterialList = modelMaterialList;
			sentinel_triangleMaterialMarkers = triangleMaterialMarkers;
		}
		else if (model_ID == MEANIE_MODEL_ID)
		{
			meanie_modelMesh = modelMesh;
			meanie_modelMesh.geometry.computeBoundingSphere();
			meanie_modelMaterialList = modelMaterialList;
			meanie_triangleMaterialMarkers = triangleMaterialMarkers;
		}

		modelsLoadedCount++;

		if (modelsLoadedCount >= 7)
			init();
	});

} // end function load_GLTF_Model()



// called automatically from within initTHREEjs() function
function initSceneData() 
{

	// scene/demo-specific three.js objects setup goes here
	//pixelRatio = 1; // for computers with more powerful graphics cards

	EPS_intersect = mouseControl ? 0.01 : 1.0; // less precision on mobile

	// set camera's field of view
	worldCamera.fov = 40;
	apertureSize = 0.0;

	// position and orient camera
	cameraControlsObject.position.set(0, 100, 370);

	// look slightly downward
	cameraControlsPitchObject.rotation.x = -0.4;

	// LIGHT SPHERE
	pathTracingScene.add(parentRotationObject);
	parentRotationObject.add(sphereObject); // make this sphereObject a child of the rotation object

	axisOfRotation.set(0.5, 1, 0.5).normalize();
	if (axisOfRotation.x == 0 && axisOfRotation.y == 1 && axisOfRotation.z == 0)
		sunDirection.set(0.001, 0.999, 0).normalize();
	else if (axisOfRotation.x == 0 && axisOfRotation.y == -1 && axisOfRotation.z == 0)
		sunDirection.set(0.001, -0.999, 0).normalize();
	else
		sunDirection.set(0, 1, 0).normalize();

	sunDirection.cross(axisOfRotation);
	sunDirection.normalize();
	sphereObject.position.set(0, 0, 0);
	sphereObject.position.add(sunDirection);

	// TREE MODEL
	tree_total_number_of_triangles = tree_modelMesh.geometry.attributes.position.array.length / 9;
	tree_totalWork = new Uint32Array(tree_total_number_of_triangles);
	tree_triangle_array = new Float32Array(256 * 256 * 4);
	// 256 = width of texture, 256 = height of texture, 4 = r,g,b, and a components
	tree_aabb_array = new Float32Array(256 * 256 * 4);
	// 256 = width of texture, 256 = height of texture, 4 = r,g,b, and a components
	tree_vpa = new Float32Array(tree_modelMesh.geometry.attributes.position.array);
	tree_vna = new Float32Array(tree_modelMesh.geometry.attributes.normal.array);

	for (let i = 0; i < 64; i++) // 64 = max object inverse matrices
	{
		game_Objects[i] = new THREE.Object3D();
		game_Objects[i].tag = "";
		objInvMatrices[i] = new THREE.Matrix4();
	}
	for (let i = 0; i < 256; i++) // enough to hold ~ 64 nodes + 64 leaves * 2 (2 Vector4's for each node)
	{
		topLevelAABBTree[i] = new THREE.Vector4();
	}

	// BOULDER MODEL
	boulder_total_number_of_triangles = boulder_modelMesh.geometry.attributes.position.array.length / 9;
	boulder_totalWork = new Uint32Array(boulder_total_number_of_triangles);
	boulder_triangle_array = new Float32Array(256 * 256 * 4);
	// 256 = width of texture, 256 = height of texture, 4 = r,g,b, and a components
	boulder_aabb_array = new Float32Array(256 * 256 * 4);
	// 256 = width of texture, 256 = height of texture, 4 = r,g,b, and a components
	boulder_vpa = new Float32Array(boulder_modelMesh.geometry.attributes.position.array);
	boulder_vna = new Float32Array(boulder_modelMesh.geometry.attributes.normal.array);


	// ROBOT MODEL
	robot_total_number_of_triangles = robot_modelMesh.geometry.attributes.position.array.length / 9;
	robot_totalWork = new Uint32Array(robot_total_number_of_triangles);
	robot_triangle_array = new Float32Array(256 * 256 * 4);
	// 256 = width of texture, 256 = height of texture, 4 = r,g,b, and a components
	robot_aabb_array = new Float32Array(256 * 256 * 4);
	// 256 = width of texture, 256 = height of texture, 4 = r,g,b, and a components
	robot_vpa = new Float32Array(robot_modelMesh.geometry.attributes.position.array);
	robot_vna = new Float32Array(robot_modelMesh.geometry.attributes.normal.array);


	// SENTRY MODEL
	sentry_total_number_of_triangles = sentry_modelMesh.geometry.attributes.position.array.length / 9;
	sentry_totalWork = new Uint32Array(sentry_total_number_of_triangles);
	sentry_triangle_array = new Float32Array(256 * 256 * 4);
	// 256 = width of texture, 256 = height of texture, 4 = r,g,b, and a components
	sentry_aabb_array = new Float32Array(256 * 256 * 4);
	// 256 = width of texture, 256 = height of texture, 4 = r,g,b, and a components
	sentry_vpa = new Float32Array(sentry_modelMesh.geometry.attributes.position.array);
	sentry_vna = new Float32Array(sentry_modelMesh.geometry.attributes.normal.array);


	// PEDESTAL MODEL
	pedestal_total_number_of_triangles = pedestal_modelMesh.geometry.attributes.position.array.length / 9;
	pedestal_totalWork = new Uint32Array(pedestal_total_number_of_triangles);
	pedestal_triangle_array = new Float32Array(256 * 256 * 4);
	// 256 = width of texture, 256 = height of texture, 4 = r,g,b, and a components
	pedestal_aabb_array = new Float32Array(256 * 256 * 4);
	// 256 = width of texture, 256 = height of texture, 4 = r,g,b, and a components
	pedestal_vpa = new Float32Array(pedestal_modelMesh.geometry.attributes.position.array);
	pedestal_vna = new Float32Array(pedestal_modelMesh.geometry.attributes.normal.array);


	// SENTINEL MODEL
	sentinel_total_number_of_triangles = sentinel_modelMesh.geometry.attributes.position.array.length / 9;
	sentinel_totalWork = new Uint32Array(sentinel_total_number_of_triangles);
	sentinel_triangle_array = new Float32Array(256 * 256 * 4);
	// 256 = width of texture, 256 = height of texture, 4 = r,g,b, and a components
	sentinel_aabb_array = new Float32Array(256 * 256 * 4);
	// 256 = width of texture, 256 = height of texture, 4 = r,g,b, and a components
	sentinel_vpa = new Float32Array(sentinel_modelMesh.geometry.attributes.position.array);
	sentinel_vna = new Float32Array(sentinel_modelMesh.geometry.attributes.normal.array);


	// MEANIE MODEL
	meanie_total_number_of_triangles = meanie_modelMesh.geometry.attributes.position.array.length / 9;
	meanie_totalWork = new Uint32Array(meanie_total_number_of_triangles);
	meanie_triangle_array = new Float32Array(256 * 256 * 4);
	// 256 = width of texture, 256 = height of texture, 4 = r,g,b, and a components
	meanie_aabb_array = new Float32Array(256 * 256 * 4);
	// 256 = width of texture, 256 = height of texture, 4 = r,g,b, and a components
	meanie_vpa = new Float32Array(meanie_modelMesh.geometry.attributes.position.array);
	meanie_vna = new Float32Array(meanie_modelMesh.geometry.attributes.normal.array);

	// SETUP GAME OBJECT/MODELS 2D DATA TEXTURE ARRAYS
	models_triangle_array = new Float32Array(256 * 256 * 4 * 7); // * number of different models
	models_aabb_array = new Float32Array(256 * 256 * 4 * 7); // * number of different models

	models_triangleDataTexture2DArray = new THREE.DataTexture2DArray(models_triangle_array, 256, 256, 7);
	models_triangleDataTexture2DArray.format = THREE.RGBAFormat;
	models_triangleDataTexture2DArray.type = THREE.FloatType;

	models_aabbDataTexture2DArray = new THREE.DataTexture2DArray(models_aabb_array, 256, 256, 7);
	models_aabbDataTexture2DArray.format = THREE.RGBAFormat;
	models_aabbDataTexture2DArray.type = THREE.FloatType;




	// LANDSCAPE PLANE
	planeGeometry = new THREE.PlaneBufferGeometry(gridExtent, gridExtent, numTiles, numTiles);

	if (planeGeometry.index)
		planeGeometry = planeGeometry.toNonIndexed();

	planeGeometry.rotateX(-Math.PI * 0.5);

	planeGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

	// create tile objects(structs) to be filled in
	for (let i = 0; i < numTiles; i++)
	{
		for (let j = 0; j < numTiles; j++)
		{
			tiles.push({
				level: 0,
				code: '',
				occupied: ''
			});
		}
	}

	planeMaterial = new THREE.MeshLambertMaterial({
		//wireframe: true,
		//flatShading: true,
		vertexColors: THREE.VertexColors
	});
	planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
	pathTracingScene.add(planeMesh);

	landscape_vpa = planeMesh.geometry.attributes.position.array;
	landscape_vca = planeMesh.geometry.attributes.color.array;
	landscape_vna = planeMesh.geometry.attributes.normal.array;

	landscape_total_number_of_triangles = planeMesh.geometry.attributes.position.array.length / 9;

	landscape_totalWork = new Uint32Array(landscape_total_number_of_triangles);

	landscape_triangle_array = new Float32Array(256 * 256 * 4);
	// 256 = width of texture, 256 = height of texture, 4 = r,g,b, and a components

	landscape_aabb_array = new Float32Array(256 * 256 * 4);
	// 256 = width of texture, 256 = height of texture, 4 = r,g,b, and a components


	landscape_triangleDataTexture = new THREE.DataTexture(landscape_triangle_array,
		256,
		256,
		THREE.RGBAFormat,
		THREE.FloatType,
		THREE.Texture.DEFAULT_MAPPING,
		THREE.ClampToEdgeWrapping,
		THREE.ClampToEdgeWrapping,
		THREE.NearestFilter,
		THREE.NearestFilter,
		1,
		THREE.LinearEncoding);

	landscape_triangleDataTexture.flipY = false;
	landscape_triangleDataTexture.generateMipmaps = false;


	landscape_aabbDataTexture = new THREE.DataTexture(landscape_aabb_array,
		256,
		256,
		THREE.RGBAFormat,
		THREE.FloatType,
		THREE.Texture.DEFAULT_MAPPING,
		THREE.ClampToEdgeWrapping,
		THREE.ClampToEdgeWrapping,
		THREE.NearestFilter,
		THREE.NearestFilter,
		1,
		THREE.LinearEncoding);

	landscape_aabbDataTexture.flipY = false;
	landscape_aabbDataTexture.generateMipmaps = false;

	
	// TOP LEVEL BVH // must be large enough to hold topLevel nodes * 8 (two THREE.Vector4's)
	topLevel_aabb_array = new Float32Array(1024);


	// build various game models' BVHs
	// TREE MODEL
	for (let i = 0; i < tree_total_number_of_triangles; i++)
	{

		bounding_box_min.set(Infinity, Infinity, Infinity);
		bounding_box_max.set(-Infinity, -Infinity, -Infinity);

		for (let j = 0; j < tree_modelMaterialList.length; j++)
		{
			if (i < tree_triangleMaterialMarkers[j])
			{
				materialNumber = j;
				break;
			}
		}

		iX9 = i * 9;
		// record vertex normals
		vn0.set(tree_vna[iX9 + 0], tree_vna[iX9 + 1], tree_vna[iX9 + 2]).normalize();
		vn1.set(tree_vna[iX9 + 3], tree_vna[iX9 + 4], tree_vna[iX9 + 5]).normalize();
		vn2.set(tree_vna[iX9 + 6], tree_vna[iX9 + 7], tree_vna[iX9 + 8]).normalize();

		// record vertex positions
		vp0.set(tree_vpa[iX9 + 0], tree_vpa[iX9 + 1], tree_vpa[iX9 + 2]);
		vp1.set(tree_vpa[iX9 + 3], tree_vpa[iX9 + 4], tree_vpa[iX9 + 5]);
		vp2.set(tree_vpa[iX9 + 6], tree_vpa[iX9 + 7], tree_vpa[iX9 + 8]);

		vp0.multiplyScalar(modelScale);
		vp1.multiplyScalar(modelScale);
		vp2.multiplyScalar(modelScale);

		iX32 = i * 32;
		//slot 0
		tree_triangle_array[iX32 + 0] = vp0.x; // r or x
		tree_triangle_array[iX32 + 1] = vp0.y; // g or y 
		tree_triangle_array[iX32 + 2] = vp0.z; // b or z
		tree_triangle_array[iX32 + 3] = vp1.x; // a or w

		//slot 1
		tree_triangle_array[iX32 + 4] = vp1.y; // r or x
		tree_triangle_array[iX32 + 5] = vp1.z; // g or y
		tree_triangle_array[iX32 + 6] = vp2.x; // b or z
		tree_triangle_array[iX32 + 7] = vp2.y; // a or w

		//slot 2
		tree_triangle_array[iX32 + 8] = vp2.z; // r or x
		tree_triangle_array[iX32 + 9] = vn0.x; // g or y
		tree_triangle_array[iX32 + 10] = vn0.y; // b or z
		tree_triangle_array[iX32 + 11] = vn0.z; // a or w

		//slot 3
		tree_triangle_array[iX32 + 12] = vn1.x; // r or x
		tree_triangle_array[iX32 + 13] = vn1.y; // g or y
		tree_triangle_array[iX32 + 14] = vn1.z; // b or z
		tree_triangle_array[iX32 + 15] = vn2.x; // a or w

		//slot 4
		tree_triangle_array[iX32 + 16] = vn2.y; // r or x
		tree_triangle_array[iX32 + 17] = vn2.z; // g or y
		tree_triangle_array[iX32 + 18] = tree_modelMaterialList[materialNumber].type; // b or z
		tree_triangle_array[iX32 + 19] = tree_modelMaterialList[materialNumber].color.r; // a or w

		//slot 5
		tree_triangle_array[iX32 + 20] = tree_modelMaterialList[materialNumber].color.g; // r or x
		tree_triangle_array[iX32 + 21] = tree_modelMaterialList[materialNumber].color.b; // g or y

		bounding_box_min.min(vp0);
		bounding_box_max.max(vp0);
		bounding_box_min.min(vp1);
		bounding_box_max.max(vp1);
		bounding_box_min.min(vp2);
		bounding_box_max.max(vp2);

		bounding_box_centroid.set((bounding_box_min.x + bounding_box_max.x) * 0.5,
			(bounding_box_min.y + bounding_box_max.y) * 0.5,
			(bounding_box_min.z + bounding_box_max.z) * 0.5);

		tree_aabb_array[iX9 + 0] = bounding_box_min.x;
		tree_aabb_array[iX9 + 1] = bounding_box_min.y;
		tree_aabb_array[iX9 + 2] = bounding_box_min.z;
		tree_aabb_array[iX9 + 3] = bounding_box_max.x;
		tree_aabb_array[iX9 + 4] = bounding_box_max.y;
		tree_aabb_array[iX9 + 5] = bounding_box_max.z;
		tree_aabb_array[iX9 + 6] = bounding_box_centroid.x;
		tree_aabb_array[iX9 + 7] = bounding_box_centroid.y;
		tree_aabb_array[iX9 + 8] = bounding_box_centroid.z;

		tree_totalWork[i] = i;

	} // end for (let i = 0; i < tree_total_number_of_triangles; i++)


	//console.log("tree_triangle count:" + tree_totalWork.length);
	BVH_Build_Iterative(tree_totalWork, tree_aabb_array);

	for (let i = 0; i < tree_total_number_of_triangles; i++)
	{
		iX32 = i * 32;
		for (let j = 0; j < 32; j++)
		{
			models_triangle_array[iX32 + j + TREE_TEXTURE_OFFSET] = tree_triangle_array[iX32 + j];
		}
	}

	for (let i = 0; i < buildnodesLength; i++)
	{
		iX8 = i * 8;
		for (let j = 0; j < 8; j++)
		{
			models_aabb_array[iX8 + j + TREE_TEXTURE_OFFSET] = tree_aabb_array[iX8 + j];
		}
	}


	// BOULDER MODEL
	for (let i = 0; i < boulder_total_number_of_triangles; i++)
	{

		bounding_box_min.set(Infinity, Infinity, Infinity);
		bounding_box_max.set(-Infinity, -Infinity, -Infinity);

		for (let j = 0; j < boulder_modelMaterialList.length; j++)
		{
			if (i < boulder_triangleMaterialMarkers[j])
			{
				materialNumber = j;
				break;
			}
		}

		iX9 = i * 9;
		// record vertex normals
		vn0.set(boulder_vna[iX9 + 0], boulder_vna[iX9 + 1], boulder_vna[iX9 + 2]).normalize();
		vn1.set(boulder_vna[iX9 + 3], boulder_vna[iX9 + 4], boulder_vna[iX9 + 5]).normalize();
		vn2.set(boulder_vna[iX9 + 6], boulder_vna[iX9 + 7], boulder_vna[iX9 + 8]).normalize();

		// record vertex positions
		vp0.set(boulder_vpa[iX9 + 0], boulder_vpa[iX9 + 1], boulder_vpa[iX9 + 2]);
		vp1.set(boulder_vpa[iX9 + 3], boulder_vpa[iX9 + 4], boulder_vpa[iX9 + 5]);
		vp2.set(boulder_vpa[iX9 + 6], boulder_vpa[iX9 + 7], boulder_vpa[iX9 + 8]);

		vp0.multiplyScalar(modelScale);
		vp1.multiplyScalar(modelScale);
		vp2.multiplyScalar(modelScale);

		iX32 = i * 32;
		//slot 0
		boulder_triangle_array[iX32 + 0] = vp0.x; // r or x
		boulder_triangle_array[iX32 + 1] = vp0.y; // g or y 
		boulder_triangle_array[iX32 + 2] = vp0.z; // b or z
		boulder_triangle_array[iX32 + 3] = vp1.x; // a or w

		//slot 1
		boulder_triangle_array[iX32 + 4] = vp1.y; // r or x
		boulder_triangle_array[iX32 + 5] = vp1.z; // g or y
		boulder_triangle_array[iX32 + 6] = vp2.x; // b or z
		boulder_triangle_array[iX32 + 7] = vp2.y; // a or w

		//slot 2
		boulder_triangle_array[iX32 + 8] = vp2.z; // r or x
		boulder_triangle_array[iX32 + 9] = vn0.x; // g or y
		boulder_triangle_array[iX32 + 10] = vn0.y; // b or z
		boulder_triangle_array[iX32 + 11] = vn0.z; // a or w

		//slot 3
		boulder_triangle_array[iX32 + 12] = vn1.x; // r or x
		boulder_triangle_array[iX32 + 13] = vn1.y; // g or y
		boulder_triangle_array[iX32 + 14] = vn1.z; // b or z
		boulder_triangle_array[iX32 + 15] = vn2.x; // a or w

		//slot 4
		boulder_triangle_array[iX32 + 16] = vn2.y; // r or x
		boulder_triangle_array[iX32 + 17] = vn2.z; // g or y
		boulder_triangle_array[iX32 + 18] = boulder_modelMaterialList[materialNumber].type; // b or z
		boulder_triangle_array[iX32 + 19] = boulder_modelMaterialList[materialNumber].color.r; // a or w

		//slot 5
		boulder_triangle_array[iX32 + 20] = boulder_modelMaterialList[materialNumber].color.g; // r or x
		boulder_triangle_array[iX32 + 21] = boulder_modelMaterialList[materialNumber].color.b; // g or y

		bounding_box_min.min(vp0);
		bounding_box_max.max(vp0);
		bounding_box_min.min(vp1);
		bounding_box_max.max(vp1);
		bounding_box_min.min(vp2);
		bounding_box_max.max(vp2);

		bounding_box_centroid.set((bounding_box_min.x + bounding_box_max.x) * 0.5,
			(bounding_box_min.y + bounding_box_max.y) * 0.5,
			(bounding_box_min.z + bounding_box_max.z) * 0.5);

		boulder_aabb_array[iX9 + 0] = bounding_box_min.x;
		boulder_aabb_array[iX9 + 1] = bounding_box_min.y;
		boulder_aabb_array[iX9 + 2] = bounding_box_min.z;
		boulder_aabb_array[iX9 + 3] = bounding_box_max.x;
		boulder_aabb_array[iX9 + 4] = bounding_box_max.y;
		boulder_aabb_array[iX9 + 5] = bounding_box_max.z;
		boulder_aabb_array[iX9 + 6] = bounding_box_centroid.x;
		boulder_aabb_array[iX9 + 7] = bounding_box_centroid.y;
		boulder_aabb_array[iX9 + 8] = bounding_box_centroid.z;

		boulder_totalWork[i] = i;

	} // end for (let i = 0; i < boulder_total_number_of_triangles; i++)


	//console.log("boulder_triangle count:" + boulder_totalWork.length);
	BVH_Build_Iterative(boulder_totalWork, boulder_aabb_array);

	for (let i = 0; i < boulder_total_number_of_triangles; i++)
	{
		iX32 = i * 32;
		for (let j = 0; j < 32; j++)
		{
			models_triangle_array[iX32 + j + BOULDER_TEXTURE_OFFSET] = boulder_triangle_array[iX32 + j];
		}
	}

	for (let i = 0; i < buildnodesLength; i++)
	{
		iX8 = i * 8;
		for (let j = 0; j < 8; j++)
		{
			models_aabb_array[iX8 + j + BOULDER_TEXTURE_OFFSET] = boulder_aabb_array[iX8 + j];
		}
	}


	// ROBOT MODEL
	for (let i = 0; i < robot_total_number_of_triangles; i++)
	{

		bounding_box_min.set(Infinity, Infinity, Infinity);
		bounding_box_max.set(-Infinity, -Infinity, -Infinity);

		for (let j = 0; j < robot_modelMaterialList.length; j++)
		{
			if (i < robot_triangleMaterialMarkers[j])
			{
				materialNumber = j;
				break;
			}
		}

		iX9 = i * 9;
		// record vertex normals
		vn0.set(robot_vna[iX9 + 0], robot_vna[iX9 + 1], robot_vna[iX9 + 2]).normalize();
		vn1.set(robot_vna[iX9 + 3], robot_vna[iX9 + 4], robot_vna[iX9 + 5]).normalize();
		vn2.set(robot_vna[iX9 + 6], robot_vna[iX9 + 7], robot_vna[iX9 + 8]).normalize();

		// record vertex positions
		vp0.set(robot_vpa[iX9 + 0], robot_vpa[iX9 + 1], robot_vpa[iX9 + 2]);
		vp1.set(robot_vpa[iX9 + 3], robot_vpa[iX9 + 4], robot_vpa[iX9 + 5]);
		vp2.set(robot_vpa[iX9 + 6], robot_vpa[iX9 + 7], robot_vpa[iX9 + 8]);

		vp0.multiplyScalar(modelScale);
		vp1.multiplyScalar(modelScale);
		vp2.multiplyScalar(modelScale);

		iX32 = i * 32;
		//slot 0
		robot_triangle_array[iX32 + 0] = vp0.x; // r or x
		robot_triangle_array[iX32 + 1] = vp0.y; // g or y 
		robot_triangle_array[iX32 + 2] = vp0.z; // b or z
		robot_triangle_array[iX32 + 3] = vp1.x; // a or w

		//slot 1
		robot_triangle_array[iX32 + 4] = vp1.y; // r or x
		robot_triangle_array[iX32 + 5] = vp1.z; // g or y
		robot_triangle_array[iX32 + 6] = vp2.x; // b or z
		robot_triangle_array[iX32 + 7] = vp2.y; // a or w

		//slot 2
		robot_triangle_array[iX32 + 8] = vp2.z; // r or x
		robot_triangle_array[iX32 + 9] = vn0.x; // g or y
		robot_triangle_array[iX32 + 10] = vn0.y; // b or z
		robot_triangle_array[iX32 + 11] = vn0.z; // a or w

		//slot 3
		robot_triangle_array[iX32 + 12] = vn1.x; // r or x
		robot_triangle_array[iX32 + 13] = vn1.y; // g or y
		robot_triangle_array[iX32 + 14] = vn1.z; // b or z
		robot_triangle_array[iX32 + 15] = vn2.x; // a or w

		//slot 4
		robot_triangle_array[iX32 + 16] = vn2.y; // r or x
		robot_triangle_array[iX32 + 17] = vn2.z; // g or y
		robot_triangle_array[iX32 + 18] = robot_modelMaterialList[materialNumber].type; // b or z
		robot_triangle_array[iX32 + 19] = robot_modelMaterialList[materialNumber].color.r; // a or w

		//slot 5
		robot_triangle_array[iX32 + 20] = robot_modelMaterialList[materialNumber].color.g; // r or x
		robot_triangle_array[iX32 + 21] = robot_modelMaterialList[materialNumber].color.b; // g or y

		bounding_box_min.min(vp0);
		bounding_box_max.max(vp0);
		bounding_box_min.min(vp1);
		bounding_box_max.max(vp1);
		bounding_box_min.min(vp2);
		bounding_box_max.max(vp2);

		bounding_box_centroid.set((bounding_box_min.x + bounding_box_max.x) * 0.5,
			(bounding_box_min.y + bounding_box_max.y) * 0.5,
			(bounding_box_min.z + bounding_box_max.z) * 0.5);

		robot_aabb_array[iX9 + 0] = bounding_box_min.x;
		robot_aabb_array[iX9 + 1] = bounding_box_min.y;
		robot_aabb_array[iX9 + 2] = bounding_box_min.z;
		robot_aabb_array[iX9 + 3] = bounding_box_max.x;
		robot_aabb_array[iX9 + 4] = bounding_box_max.y;
		robot_aabb_array[iX9 + 5] = bounding_box_max.z;
		robot_aabb_array[iX9 + 6] = bounding_box_centroid.x;
		robot_aabb_array[iX9 + 7] = bounding_box_centroid.y;
		robot_aabb_array[iX9 + 8] = bounding_box_centroid.z;

		robot_totalWork[i] = i;

	} // end for (let i = 0; i < robot_total_number_of_triangles; i++)


	//console.log("robot_triangle count:" + robot_totalWork.length);
	BVH_Build_Iterative(robot_totalWork, robot_aabb_array);

	for (let i = 0; i < robot_total_number_of_triangles; i++)
	{
		iX32 = i * 32;
		for (let j = 0; j < 32; j++)
		{
			models_triangle_array[iX32 + j + ROBOT_TEXTURE_OFFSET] = robot_triangle_array[iX32 + j];
		}
	}

	for (let i = 0; i < buildnodesLength; i++)
	{
		iX8 = i * 8;
		for (let j = 0; j < 8; j++)
		{
			models_aabb_array[iX8 + j + ROBOT_TEXTURE_OFFSET] = robot_aabb_array[iX8 + j];
		}
	}



	// SENTRY MODEL
	for (let i = 0; i < sentry_total_number_of_triangles; i++)
	{

		bounding_box_min.set(Infinity, Infinity, Infinity);
		bounding_box_max.set(-Infinity, -Infinity, -Infinity);

		for (let j = 0; j < sentry_modelMaterialList.length; j++)
		{
			if (i < sentry_triangleMaterialMarkers[j])
			{
				materialNumber = j;
				break;
			}
		}

		iX9 = i * 9;
		// record vertex normals
		vn0.set(sentry_vna[iX9 + 0], sentry_vna[iX9 + 1], sentry_vna[iX9 + 2]).normalize();
		vn1.set(sentry_vna[iX9 + 3], sentry_vna[iX9 + 4], sentry_vna[iX9 + 5]).normalize();
		vn2.set(sentry_vna[iX9 + 6], sentry_vna[iX9 + 7], sentry_vna[iX9 + 8]).normalize();

		// record vertex positions
		vp0.set(sentry_vpa[iX9 + 0], sentry_vpa[iX9 + 1], sentry_vpa[iX9 + 2]);
		vp1.set(sentry_vpa[iX9 + 3], sentry_vpa[iX9 + 4], sentry_vpa[iX9 + 5]);
		vp2.set(sentry_vpa[iX9 + 6], sentry_vpa[iX9 + 7], sentry_vpa[iX9 + 8]);

		vp0.multiplyScalar(modelScale);
		vp1.multiplyScalar(modelScale);
		vp2.multiplyScalar(modelScale);

		iX32 = i * 32;
		//slot 0
		sentry_triangle_array[iX32 + 0] = vp0.x; // r or x
		sentry_triangle_array[iX32 + 1] = vp0.y; // g or y 
		sentry_triangle_array[iX32 + 2] = vp0.z; // b or z
		sentry_triangle_array[iX32 + 3] = vp1.x; // a or w

		//slot 1
		sentry_triangle_array[iX32 + 4] = vp1.y; // r or x
		sentry_triangle_array[iX32 + 5] = vp1.z; // g or y
		sentry_triangle_array[iX32 + 6] = vp2.x; // b or z
		sentry_triangle_array[iX32 + 7] = vp2.y; // a or w

		//slot 2
		sentry_triangle_array[iX32 + 8] = vp2.z; // r or x
		sentry_triangle_array[iX32 + 9] = vn0.x; // g or y
		sentry_triangle_array[iX32 + 10] = vn0.y; // b or z
		sentry_triangle_array[iX32 + 11] = vn0.z; // a or w

		//slot 3
		sentry_triangle_array[iX32 + 12] = vn1.x; // r or x
		sentry_triangle_array[iX32 + 13] = vn1.y; // g or y
		sentry_triangle_array[iX32 + 14] = vn1.z; // b or z
		sentry_triangle_array[iX32 + 15] = vn2.x; // a or w

		//slot 4
		sentry_triangle_array[iX32 + 16] = vn2.y; // r or x
		sentry_triangle_array[iX32 + 17] = vn2.z; // g or y
		sentry_triangle_array[iX32 + 18] = sentry_modelMaterialList[materialNumber].type; // b or z
		sentry_triangle_array[iX32 + 19] = sentry_modelMaterialList[materialNumber].color.r; // a or w

		//slot 5
		sentry_triangle_array[iX32 + 20] = sentry_modelMaterialList[materialNumber].color.g; // r or x
		sentry_triangle_array[iX32 + 21] = sentry_modelMaterialList[materialNumber].color.b; // g or y

		bounding_box_min.min(vp0);
		bounding_box_max.max(vp0);
		bounding_box_min.min(vp1);
		bounding_box_max.max(vp1);
		bounding_box_min.min(vp2);
		bounding_box_max.max(vp2);

		bounding_box_centroid.set((bounding_box_min.x + bounding_box_max.x) * 0.5,
			(bounding_box_min.y + bounding_box_max.y) * 0.5,
			(bounding_box_min.z + bounding_box_max.z) * 0.5);

		sentry_aabb_array[iX9 + 0] = bounding_box_min.x;
		sentry_aabb_array[iX9 + 1] = bounding_box_min.y;
		sentry_aabb_array[iX9 + 2] = bounding_box_min.z;
		sentry_aabb_array[iX9 + 3] = bounding_box_max.x;
		sentry_aabb_array[iX9 + 4] = bounding_box_max.y;
		sentry_aabb_array[iX9 + 5] = bounding_box_max.z;
		sentry_aabb_array[iX9 + 6] = bounding_box_centroid.x;
		sentry_aabb_array[iX9 + 7] = bounding_box_centroid.y;
		sentry_aabb_array[iX9 + 8] = bounding_box_centroid.z;

		sentry_totalWork[i] = i;

	} // end for (let i = 0; i < robot_total_number_of_triangles; i++)


	//console.log("sentry_triangle count:" + sentry_totalWork.length);
	BVH_Build_Iterative(sentry_totalWork, sentry_aabb_array);

	for (let i = 0; i < sentry_total_number_of_triangles; i++)
	{
		iX32 = i * 32;
		for (let j = 0; j < 32; j++)
		{
			models_triangle_array[iX32 + j + SENTRY_TEXTURE_OFFSET] = sentry_triangle_array[iX32 + j];
		}
	}

	for (let i = 0; i < buildnodesLength; i++)
	{
		iX8 = i * 8;
		for (let j = 0; j < 8; j++)
		{
			models_aabb_array[iX8 + j + SENTRY_TEXTURE_OFFSET] = sentry_aabb_array[iX8 + j];
		}
	}



	// PEDESTAL MODEL
	for (let i = 0; i < pedestal_total_number_of_triangles; i++)
	{

		bounding_box_min.set(Infinity, Infinity, Infinity);
		bounding_box_max.set(-Infinity, -Infinity, -Infinity);

		for (let j = 0; j < pedestal_modelMaterialList.length; j++)
		{
			if (i < pedestal_triangleMaterialMarkers[j])
			{
				materialNumber = j;
				break;
			}
		}

		iX9 = i * 9;
		// record vertex normals
		vn0.set(pedestal_vna[iX9 + 0], pedestal_vna[iX9 + 1], pedestal_vna[iX9 + 2]).normalize();
		vn1.set(pedestal_vna[iX9 + 3], pedestal_vna[iX9 + 4], pedestal_vna[iX9 + 5]).normalize();
		vn2.set(pedestal_vna[iX9 + 6], pedestal_vna[iX9 + 7], pedestal_vna[iX9 + 8]).normalize();

		// record vertex positions
		vp0.set(pedestal_vpa[iX9 + 0], pedestal_vpa[iX9 + 1], pedestal_vpa[iX9 + 2]);
		vp1.set(pedestal_vpa[iX9 + 3], pedestal_vpa[iX9 + 4], pedestal_vpa[iX9 + 5]);
		vp2.set(pedestal_vpa[iX9 + 6], pedestal_vpa[iX9 + 7], pedestal_vpa[iX9 + 8]);

		vp0.multiplyScalar(modelScale);
		vp1.multiplyScalar(modelScale);
		vp2.multiplyScalar(modelScale);

		iX32 = i * 32;
		//slot 0
		pedestal_triangle_array[iX32 + 0] = vp0.x; // r or x
		pedestal_triangle_array[iX32 + 1] = vp0.y; // g or y 
		pedestal_triangle_array[iX32 + 2] = vp0.z; // b or z
		pedestal_triangle_array[iX32 + 3] = vp1.x; // a or w

		//slot 1
		pedestal_triangle_array[iX32 + 4] = vp1.y; // r or x
		pedestal_triangle_array[iX32 + 5] = vp1.z; // g or y
		pedestal_triangle_array[iX32 + 6] = vp2.x; // b or z
		pedestal_triangle_array[iX32 + 7] = vp2.y; // a or w

		//slot 2
		pedestal_triangle_array[iX32 + 8] = vp2.z; // r or x
		pedestal_triangle_array[iX32 + 9] = vn0.x; // g or y
		pedestal_triangle_array[iX32 + 10] = vn0.y; // b or z
		pedestal_triangle_array[iX32 + 11] = vn0.z; // a or w

		//slot 3
		pedestal_triangle_array[iX32 + 12] = vn1.x; // r or x
		pedestal_triangle_array[iX32 + 13] = vn1.y; // g or y
		pedestal_triangle_array[iX32 + 14] = vn1.z; // b or z
		pedestal_triangle_array[iX32 + 15] = vn2.x; // a or w

		//slot 4
		pedestal_triangle_array[iX32 + 16] = vn2.y; // r or x
		pedestal_triangle_array[iX32 + 17] = vn2.z; // g or y
		pedestal_triangle_array[iX32 + 18] = pedestal_modelMaterialList[materialNumber].type; // b or z
		pedestal_triangle_array[iX32 + 19] = pedestal_modelMaterialList[materialNumber].color.r; // a or w

		//slot 5
		pedestal_triangle_array[iX32 + 20] = pedestal_modelMaterialList[materialNumber].color.g; // r or x
		pedestal_triangle_array[iX32 + 21] = pedestal_modelMaterialList[materialNumber].color.b; // g or y

		bounding_box_min.min(vp0);
		bounding_box_max.max(vp0);
		bounding_box_min.min(vp1);
		bounding_box_max.max(vp1);
		bounding_box_min.min(vp2);
		bounding_box_max.max(vp2);

		bounding_box_centroid.set((bounding_box_min.x + bounding_box_max.x) * 0.5,
			(bounding_box_min.y + bounding_box_max.y) * 0.5,
			(bounding_box_min.z + bounding_box_max.z) * 0.5);

		pedestal_aabb_array[iX9 + 0] = bounding_box_min.x;
		pedestal_aabb_array[iX9 + 1] = bounding_box_min.y;
		pedestal_aabb_array[iX9 + 2] = bounding_box_min.z;
		pedestal_aabb_array[iX9 + 3] = bounding_box_max.x;
		pedestal_aabb_array[iX9 + 4] = bounding_box_max.y;
		pedestal_aabb_array[iX9 + 5] = bounding_box_max.z;
		pedestal_aabb_array[iX9 + 6] = bounding_box_centroid.x;
		pedestal_aabb_array[iX9 + 7] = bounding_box_centroid.y;
		pedestal_aabb_array[iX9 + 8] = bounding_box_centroid.z;

		pedestal_totalWork[i] = i;

	} // end for (let i = 0; i < robot_total_number_of_triangles; i++)


	//console.log("pedestal_triangle count:" + pedestal_totalWork.length);
	BVH_Build_Iterative(pedestal_totalWork, pedestal_aabb_array);

	for (let i = 0; i < pedestal_total_number_of_triangles; i++)
	{
		iX32 = i * 32;
		for (let j = 0; j < 32; j++)
		{
			models_triangle_array[iX32 + j + PEDESTAL_TEXTURE_OFFSET] = pedestal_triangle_array[iX32 + j];
		}
	}

	for (let i = 0; i < buildnodesLength; i++)
	{
		iX8 = i * 8;
		for (let j = 0; j < 8; j++)
		{
			models_aabb_array[iX8 + j + PEDESTAL_TEXTURE_OFFSET] = pedestal_aabb_array[iX8 + j];
		}
	}



	// SENTINEL MODEL
	for (let i = 0; i < sentinel_total_number_of_triangles; i++)
	{

		bounding_box_min.set(Infinity, Infinity, Infinity);
		bounding_box_max.set(-Infinity, -Infinity, -Infinity);

		for (let j = 0; j < sentinel_modelMaterialList.length; j++)
		{
			if (i < sentinel_triangleMaterialMarkers[j])
			{
				materialNumber = j;
				break;
			}
		}

		iX9 = i * 9;
		// record vertex normals
		vn0.set(sentinel_vna[iX9 + 0], sentinel_vna[iX9 + 1], sentinel_vna[iX9 + 2]).normalize();
		vn1.set(sentinel_vna[iX9 + 3], sentinel_vna[iX9 + 4], sentinel_vna[iX9 + 5]).normalize();
		vn2.set(sentinel_vna[iX9 + 6], sentinel_vna[iX9 + 7], sentinel_vna[iX9 + 8]).normalize();

		// record vertex positions
		vp0.set(sentinel_vpa[iX9 + 0], sentinel_vpa[iX9 + 1], sentinel_vpa[iX9 + 2]);
		vp1.set(sentinel_vpa[iX9 + 3], sentinel_vpa[iX9 + 4], sentinel_vpa[iX9 + 5]);
		vp2.set(sentinel_vpa[iX9 + 6], sentinel_vpa[iX9 + 7], sentinel_vpa[iX9 + 8]);

		vp0.multiplyScalar(modelScale);
		vp1.multiplyScalar(modelScale);
		vp2.multiplyScalar(modelScale);

		iX32 = i * 32;
		//slot 0
		sentinel_triangle_array[iX32 + 0] = vp0.x; // r or x
		sentinel_triangle_array[iX32 + 1] = vp0.y; // g or y 
		sentinel_triangle_array[iX32 + 2] = vp0.z; // b or z
		sentinel_triangle_array[iX32 + 3] = vp1.x; // a or w

		//slot 1
		sentinel_triangle_array[iX32 + 4] = vp1.y; // r or x
		sentinel_triangle_array[iX32 + 5] = vp1.z; // g or y
		sentinel_triangle_array[iX32 + 6] = vp2.x; // b or z
		sentinel_triangle_array[iX32 + 7] = vp2.y; // a or w

		//slot 2
		sentinel_triangle_array[iX32 + 8] = vp2.z; // r or x
		sentinel_triangle_array[iX32 + 9] = vn0.x; // g or y
		sentinel_triangle_array[iX32 + 10] = vn0.y; // b or z
		sentinel_triangle_array[iX32 + 11] = vn0.z; // a or w

		//slot 3
		sentinel_triangle_array[iX32 + 12] = vn1.x; // r or x
		sentinel_triangle_array[iX32 + 13] = vn1.y; // g or y
		sentinel_triangle_array[iX32 + 14] = vn1.z; // b or z
		sentinel_triangle_array[iX32 + 15] = vn2.x; // a or w

		//slot 4
		sentinel_triangle_array[iX32 + 16] = vn2.y; // r or x
		sentinel_triangle_array[iX32 + 17] = vn2.z; // g or y
		sentinel_triangle_array[iX32 + 18] = sentinel_modelMaterialList[materialNumber].type; // b or z
		sentinel_triangle_array[iX32 + 19] = sentinel_modelMaterialList[materialNumber].color.r; // a or w

		//slot 5
		sentinel_triangle_array[iX32 + 20] = sentinel_modelMaterialList[materialNumber].color.g; // r or x
		sentinel_triangle_array[iX32 + 21] = sentinel_modelMaterialList[materialNumber].color.b; // g or y

		bounding_box_min.min(vp0);
		bounding_box_max.max(vp0);
		bounding_box_min.min(vp1);
		bounding_box_max.max(vp1);
		bounding_box_min.min(vp2);
		bounding_box_max.max(vp2);

		bounding_box_centroid.set((bounding_box_min.x + bounding_box_max.x) * 0.5,
			(bounding_box_min.y + bounding_box_max.y) * 0.5,
			(bounding_box_min.z + bounding_box_max.z) * 0.5);

		sentinel_aabb_array[iX9 + 0] = bounding_box_min.x;
		sentinel_aabb_array[iX9 + 1] = bounding_box_min.y;
		sentinel_aabb_array[iX9 + 2] = bounding_box_min.z;
		sentinel_aabb_array[iX9 + 3] = bounding_box_max.x;
		sentinel_aabb_array[iX9 + 4] = bounding_box_max.y;
		sentinel_aabb_array[iX9 + 5] = bounding_box_max.z;
		sentinel_aabb_array[iX9 + 6] = bounding_box_centroid.x;
		sentinel_aabb_array[iX9 + 7] = bounding_box_centroid.y;
		sentinel_aabb_array[iX9 + 8] = bounding_box_centroid.z;

		sentinel_totalWork[i] = i;

	} // end for (let i = 0; i < robot_total_number_of_triangles; i++)


	//console.log("sentinel_triangle count:" + sentinel_totalWork.length);
	BVH_Build_Iterative(sentinel_totalWork, sentinel_aabb_array);

	for (let i = 0; i < sentinel_total_number_of_triangles; i++)
	{
		iX32 = i * 32;
		for (let j = 0; j < 32; j++)
		{
			models_triangle_array[iX32 + j + SENTINEL_TEXTURE_OFFSET] = sentinel_triangle_array[iX32 + j];
		}
	}

	for (let i = 0; i < buildnodesLength; i++)
	{
		iX8 = i * 8;
		for (let j = 0; j < 8; j++)
		{
			models_aabb_array[iX8 + j + SENTINEL_TEXTURE_OFFSET] = sentinel_aabb_array[iX8 + j];
		}
	}



	// MEANIE MODEL
	for (let i = 0; i < meanie_total_number_of_triangles; i++)
	{

		bounding_box_min.set(Infinity, Infinity, Infinity);
		bounding_box_max.set(-Infinity, -Infinity, -Infinity);

		for (let j = 0; j < meanie_modelMaterialList.length; j++)
		{
			if (i < meanie_triangleMaterialMarkers[j])
			{
				materialNumber = j;
				break;
			}
		}

		iX9 = i * 9;
		// record vertex normals
		vn0.set(meanie_vna[iX9 + 0], meanie_vna[iX9 + 1], meanie_vna[iX9 + 2]).normalize();
		vn1.set(meanie_vna[iX9 + 3], meanie_vna[iX9 + 4], meanie_vna[iX9 + 5]).normalize();
		vn2.set(meanie_vna[iX9 + 6], meanie_vna[iX9 + 7], meanie_vna[iX9 + 8]).normalize();

		// record vertex positions
		vp0.set(meanie_vpa[iX9 + 0], meanie_vpa[iX9 + 1], meanie_vpa[iX9 + 2]);
		vp1.set(meanie_vpa[iX9 + 3], meanie_vpa[iX9 + 4], meanie_vpa[iX9 + 5]);
		vp2.set(meanie_vpa[iX9 + 6], meanie_vpa[iX9 + 7], meanie_vpa[iX9 + 8]);

		vp0.multiplyScalar(modelScale);
		vp1.multiplyScalar(modelScale);
		vp2.multiplyScalar(modelScale);

		iX32 = i * 32;
		//slot 0
		meanie_triangle_array[iX32 + 0] = vp0.x; // r or x
		meanie_triangle_array[iX32 + 1] = vp0.y; // g or y 
		meanie_triangle_array[iX32 + 2] = vp0.z; // b or z
		meanie_triangle_array[iX32 + 3] = vp1.x; // a or w

		//slot 1
		meanie_triangle_array[iX32 + 4] = vp1.y; // r or x
		meanie_triangle_array[iX32 + 5] = vp1.z; // g or y
		meanie_triangle_array[iX32 + 6] = vp2.x; // b or z
		meanie_triangle_array[iX32 + 7] = vp2.y; // a or w

		//slot 2
		meanie_triangle_array[iX32 + 8] = vp2.z; // r or x
		meanie_triangle_array[iX32 + 9] = vn0.x; // g or y
		meanie_triangle_array[iX32 + 10] = vn0.y; // b or z
		meanie_triangle_array[iX32 + 11] = vn0.z; // a or w

		//slot 3
		meanie_triangle_array[iX32 + 12] = vn1.x; // r or x
		meanie_triangle_array[iX32 + 13] = vn1.y; // g or y
		meanie_triangle_array[iX32 + 14] = vn1.z; // b or z
		meanie_triangle_array[iX32 + 15] = vn2.x; // a or w

		//slot 4
		meanie_triangle_array[iX32 + 16] = vn2.y; // r or x
		meanie_triangle_array[iX32 + 17] = vn2.z; // g or y
		meanie_triangle_array[iX32 + 18] = meanie_modelMaterialList[materialNumber].type; // b or z
		meanie_triangle_array[iX32 + 19] = meanie_modelMaterialList[materialNumber].color.r; // a or w

		//slot 5
		meanie_triangle_array[iX32 + 20] = meanie_modelMaterialList[materialNumber].color.g; // r or x
		meanie_triangle_array[iX32 + 21] = meanie_modelMaterialList[materialNumber].color.b; // g or y

		bounding_box_min.min(vp0);
		bounding_box_max.max(vp0);
		bounding_box_min.min(vp1);
		bounding_box_max.max(vp1);
		bounding_box_min.min(vp2);
		bounding_box_max.max(vp2);

		bounding_box_centroid.set((bounding_box_min.x + bounding_box_max.x) * 0.5,
			(bounding_box_min.y + bounding_box_max.y) * 0.5,
			(bounding_box_min.z + bounding_box_max.z) * 0.5);

		meanie_aabb_array[iX9 + 0] = bounding_box_min.x;
		meanie_aabb_array[iX9 + 1] = bounding_box_min.y;
		meanie_aabb_array[iX9 + 2] = bounding_box_min.z;
		meanie_aabb_array[iX9 + 3] = bounding_box_max.x;
		meanie_aabb_array[iX9 + 4] = bounding_box_max.y;
		meanie_aabb_array[iX9 + 5] = bounding_box_max.z;
		meanie_aabb_array[iX9 + 6] = bounding_box_centroid.x;
		meanie_aabb_array[iX9 + 7] = bounding_box_centroid.y;
		meanie_aabb_array[iX9 + 8] = bounding_box_centroid.z;

		meanie_totalWork[i] = i;

	} // end for (let i = 0; i < robot_total_number_of_triangles; i++)


	//console.log("meanie_triangle count:" + meanie_totalWork.length);
	BVH_Build_Iterative(meanie_totalWork, meanie_aabb_array);

	for (let i = 0; i < meanie_total_number_of_triangles; i++)
	{
		iX32 = i * 32;
		for (let j = 0; j < 32; j++)
		{
			models_triangle_array[iX32 + j + MEANIE_TEXTURE_OFFSET] = meanie_triangle_array[iX32 + j];
		}
	}

	for (let i = 0; i < buildnodesLength; i++)
	{
		iX8 = i * 8;
		for (let j = 0; j < 8; j++)
		{
			models_aabb_array[iX8 + j + MEANIE_TEXTURE_OFFSET] = meanie_aabb_array[iX8 + j];
		}
	}


	// PLACE THIS AT END OF ALL MODEL DATA TEXTURE ARRAY FILLING
	models_triangleDataTexture2DArray.needsUpdate = true;
	models_aabbDataTexture2DArray.needsUpdate = true;



	// generate random landscape
	buildNewLevel();


} // end function initSceneData()



// called automatically from within initTHREEjs() function
function initPathTracingShaders() 
{
	// scene/demo-specific uniforms go here	
	pathTracingUniforms.tModels_triangleDataTexture2DArray = { value: models_triangleDataTexture2DArray };
	pathTracingUniforms.tModels_aabbDataTexture2DArray = { value: models_aabbDataTexture2DArray };
	pathTracingUniforms.tLandscape_TriangleTexture = { value: landscape_triangleDataTexture };
	pathTracingUniforms.tLandscape_AABBTexture = { value: landscape_aabbDataTexture };
	pathTracingUniforms.uTopLevelAABBTree = { value: topLevelAABBTree };
	pathTracingUniforms.uObjInvMatrices = { value: objInvMatrices };
	pathTracingUniforms.uSunDirection = { value: new THREE.Vector3() };
	pathTracingUniforms.uViewRayTargetPosition = { value: viewRayTargetPosition };
	pathTracingUniforms.uSelectedTile = { value: selectedTile };

	pathTracingDefines = {
		//NUMBER_OF_TRIANGLES: total_number_of_triangles
	};

	// load vertex and fragment shader files that are used in the pathTracing material, mesh and scene
	fileLoader.load('shaders/common_PathTracing_Vertex.glsl', function (shaderText)
	{
		pathTracingVertexShader = shaderText;

		createPathTracingMaterial();
	});

} // end function initPathTracingShaders()



// called automatically from within initPathTracingShaders() function above
function createPathTracingMaterial() 
{
	fileLoader.load('shaders/TheSentinel_Fragment.glsl', function (shaderText)
	{

		pathTracingFragmentShader = shaderText;

		pathTracingMaterial = new THREE.ShaderMaterial({
			uniforms: pathTracingUniforms,
			defines: pathTracingDefines,
			vertexShader: pathTracingVertexShader,
			fragmentShader: pathTracingFragmentShader,
			depthTest: false,
			depthWrite: false
		});

		pathTracingMesh = new THREE.Mesh(pathTracingGeometry, pathTracingMaterial);
		pathTracingScene.add(pathTracingMesh);

		// the following keeps the large scene ShaderMaterial quad right in front 
		//   of the camera at all times. This is necessary because without it, the scene 
		//   quad will fall out of view and get clipped when the camera rotates past 180 degrees.
		worldCamera.add(pathTracingMesh);

	});

} // end function createPathTracingMaterial()



function buildNewLevel()
{

	for (let i = 0; i < numVertices; i++)
	{
		for (let j = 0; j < numVertices; j++)
		{
			index = i * numVertices + j;
			vertexHeights[index] = 0;
		}
	}

	// reset any tiles that had their triangle vertices flipped 'flipped' to correctly render certain connectors
	for (let i = 0; i < numTiles; i++)
	{
		for (let j = 0; j < numTiles; j++)
		{
			tileIndex = i * numTiles + j;
			vertexIndex = (i * numTiles * 18) + (j * 18);

			if (tiles[tileIndex].code == 'flipped')
			{
				landscape_vpa[vertexIndex + 6] = landscape_vpa[vertexIndex + 15];
				landscape_vpa[vertexIndex + 7] = landscape_vpa[vertexIndex + 16];
				landscape_vpa[vertexIndex + 8] = landscape_vpa[vertexIndex + 17];
				landscape_vpa[vertexIndex + 9] = landscape_vpa[vertexIndex + 3];
				landscape_vpa[vertexIndex + 10] = landscape_vpa[vertexIndex + 4];
				landscape_vpa[vertexIndex + 11] = landscape_vpa[vertexIndex + 5];
			}
		}
	}

	levelCounter++;
	if (levelCounter % 4 == 0)
	{
		checkColor0.setRGB(0.001, 0.3, 0.001); // green // GREEN/BLUE combo
		checkColor1.setRGB(0.001, 0.001, 0.3); // blue
	}
	else if (levelCounter % 4 == 1)
	{
		checkColor0.setRGB(0.35, 0.35, 0.1); // yellow // YELLOW/PURPLE combo
		checkColor1.setRGB(0.05, 0.001, 0.25); // purple
	}
	else if (levelCounter % 4 == 2)
	{
		checkColor0.setRGB(0.25, 0.001, 0.01); // red // RED/BLUE combo
		checkColor1.setRGB(0.001, 0.001, 0.15); // dark blue
	}
	else if (levelCounter % 4 == 3)
	{
		checkColor0.setRGB(0.35, 0.35, 0.1); // yellow // YELLOW/RED combo
		checkColor1.setRGB(0.25, 0.001, 0.01); // red
	}


	// initialize object properties and arrays
	code = '';
	for (let i = 0; i < numTiles; i++)
	{
		if (code == 'checkColor0')
			code = 'checkColor1';
		else code = 'checkColor0';

		for (let j = 0; j < numTiles; j++)
		{
			tileIndex = i * numTiles + j;
			vertexIndex = (i * numTiles * 18) + (j * 18);
			if (code == 'checkColor0')
			{
				// 1st triangle of square tile
				landscape_vca[vertexIndex + 0] = checkColor0.r; landscape_vca[vertexIndex + 1] = checkColor0.g; landscape_vca[vertexIndex + 2] = checkColor0.b;
				landscape_vca[vertexIndex + 3] = checkColor0.r; landscape_vca[vertexIndex + 4] = checkColor0.g; landscape_vca[vertexIndex + 5] = checkColor0.b;
				landscape_vca[vertexIndex + 6] = checkColor0.r; landscape_vca[vertexIndex + 7] = checkColor0.g; landscape_vca[vertexIndex + 8] = checkColor0.b;
				// 2nd triangle of square tile
				landscape_vca[vertexIndex + 9] = checkColor0.r; landscape_vca[vertexIndex + 10] = checkColor0.g; landscape_vca[vertexIndex + 11] = checkColor0.b;
				landscape_vca[vertexIndex + 12] = checkColor0.r; landscape_vca[vertexIndex + 13] = checkColor0.g; landscape_vca[vertexIndex + 14] = checkColor0.b;
				landscape_vca[vertexIndex + 15] = checkColor0.r; landscape_vca[vertexIndex + 16] = checkColor0.g; landscape_vca[vertexIndex + 17] = checkColor0.b;
			}
			else
			{
				// 1st triangle of square tile
				landscape_vca[vertexIndex + 0] = checkColor1.r; landscape_vca[vertexIndex + 1] = checkColor1.g; landscape_vca[vertexIndex + 2] = checkColor1.b;
				landscape_vca[vertexIndex + 3] = checkColor1.r; landscape_vca[vertexIndex + 4] = checkColor1.g; landscape_vca[vertexIndex + 5] = checkColor1.b;
				landscape_vca[vertexIndex + 6] = checkColor1.r; landscape_vca[vertexIndex + 7] = checkColor1.g; landscape_vca[vertexIndex + 8] = checkColor1.b;
				// 2nd triangle of square tile
				landscape_vca[vertexIndex + 9] = checkColor1.r; landscape_vca[vertexIndex + 10] = checkColor1.g; landscape_vca[vertexIndex + 11] = checkColor1.b;
				landscape_vca[vertexIndex + 12] = checkColor1.r; landscape_vca[vertexIndex + 13] = checkColor1.g; landscape_vca[vertexIndex + 14] = checkColor1.b;
				landscape_vca[vertexIndex + 15] = checkColor1.r; landscape_vca[vertexIndex + 16] = checkColor1.g; landscape_vca[vertexIndex + 17] = checkColor1.b;
			}

			// initialize geometry height values
			// 1st triangle
			// top left corner
			landscape_vpa[vertexIndex + 1] = 0; // + 1 = the Y component
			// bottom left corner
			landscape_vpa[vertexIndex + 4] = 0; // + 4 = the Y component
			// top right corner
			landscape_vpa[vertexIndex + 7] = 0; // + 7 = the Y component
			// 2nd tringle
			// bottom left corner
			landscape_vpa[vertexIndex + 10] = 0;
			// bottom right corner
			landscape_vpa[vertexIndex + 13] = 0;
			// top right corner
			landscape_vpa[vertexIndex + 16] = 0;

			tiles[tileIndex].level = -Infinity;
			tiles[tileIndex].code = code;

			if (code == 'checkColor0')
				code = 'checkColor1';
			else code = 'checkColor0';
		}
	}


	i_offset = Math.round(Math.random() * numVertices);
	j_offset = Math.round(Math.random() * numVertices);
	frequency = 0.02;
	amplitude = 2;
	for (let i = 0; i < numVertices; i++)
	{
		for (let j = 0; j < numVertices; j++)
		{
			raiseAmount = simplex.noise((i + i_offset) * frequency, (j + j_offset) * frequency) * amplitude;
			index = i * numVertices + j;
			vertexHeights[index] += raiseAmount;
		}
	}
	i_offset = Math.round(Math.random() * numVertices);
	j_offset = Math.round(Math.random() * numVertices);
	frequency += 0.02;
	//amplitude -= 0.5;
	for (let i = 0; i < numVertices; i++)
	{
		for (let j = 0; j < numVertices; j++)
		{
			raiseAmount = simplex.noise((i + i_offset) * frequency, (j + j_offset) * frequency) * amplitude;
			index = i * numVertices + j;
			vertexHeights[index] += raiseAmount;
		}
	}
	i_offset = Math.round(Math.random() * numVertices);
	j_offset = Math.round(Math.random() * numVertices);
	frequency += 0.02;
	//amplitude -= 0.5;
	for (let i = 0; i < numVertices; i++)
	{
		for (let j = 0; j < numVertices; j++)
		{
			raiseAmount = simplex.noise((i + i_offset) * frequency, (j + j_offset) * frequency) * amplitude;
			index = i * numVertices + j;
			vertexHeights[index] += raiseAmount;
		}
	}
	i_offset = Math.round(Math.random() * numVertices);
	j_offset = Math.round(Math.random() * numVertices);
	frequency += 0.02;
	//amplitude -= 0.5;
	for (let i = 0; i < numVertices; i++)
	{
		for (let j = 0; j < numVertices; j++)
		{
			raiseAmount = simplex.noise((i + i_offset) * frequency, (j + j_offset) * frequency) * amplitude;
			index = i * numVertices + j;
			vertexHeights[index] += raiseAmount;
			vertexHeights[index] = Math.floor(vertexHeights[index]) * 10;
		}
	}


	for (let i = 0; i < numTiles; i++)
	{
		for (let j = 0; j < numTiles; j++)
		{
			index = i * numVertices + j;
			nextRowIndex = (i + 1) * numVertices + j;
			vertexIndex = (i * numTiles * 18) + (j * 18);

			landscape_vpa[vertexIndex + 1] = vertexHeights[index];// top left corner

			landscape_vpa[vertexIndex + 4] = vertexHeights[nextRowIndex];// bottom left corner

			landscape_vpa[vertexIndex + 7] = vertexHeights[index + 1];// top right corner

			landscape_vpa[vertexIndex + 10] = vertexHeights[nextRowIndex];// bottom left corner

			landscape_vpa[vertexIndex + 13] = vertexHeights[nextRowIndex + 1];// bottom right corner

			landscape_vpa[vertexIndex + 16] = vertexHeights[index + 1];// top right corner

		} // for (let j = 0; j < numTiles; j++)
	} // end for (let i = 0; i < numTiles; i++)


	// make connecting panels a white color
	for (let i = 0; i < numTiles; i++)
	{
		for (let j = 0; j < numTiles; j++)
		{
			tileIndex = i * numTiles + j;
			index = i * numVertices + j;
			nextRowIndex = (i + 1) * numVertices + j;
			vertexIndex = (i * numTiles * 18) + (j * 18);

			if (vertexHeights[index] != vertexHeights[index + 1] ||
				vertexHeights[index] != vertexHeights[nextRowIndex] ||
				vertexHeights[index] != vertexHeights[nextRowIndex + 1] ||
				vertexHeights[nextRowIndex + 1] != vertexHeights[index + 1] ||
				vertexHeights[nextRowIndex + 1] != vertexHeights[nextRowIndex])
			{
				for (let k = 0; k < 18; k++)
					landscape_vca[vertexIndex + k] = 1.0;
				tiles[tileIndex].code = 'connector';

				// check if some of the 2 triangles' vertices need to be swapped in order to make a concave connector
				if ((vertexHeights[index] < vertexHeights[index + 1] &&
					vertexHeights[index] < vertexHeights[nextRowIndex] &&
					vertexHeights[index] < vertexHeights[nextRowIndex + 1]) ||
					(vertexHeights[index] > vertexHeights[index + 1] &&
						vertexHeights[index] > vertexHeights[nextRowIndex] &&
						vertexHeights[index] > vertexHeights[nextRowIndex + 1]))
				{
					landscape_vpa[vertexIndex + 6] = landscape_vpa[vertexIndex + 12];
					landscape_vpa[vertexIndex + 7] = landscape_vpa[vertexIndex + 13];
					landscape_vpa[vertexIndex + 8] = landscape_vpa[vertexIndex + 14];
					landscape_vpa[vertexIndex + 9] = landscape_vpa[vertexIndex + 0];
					landscape_vpa[vertexIndex + 10] = landscape_vpa[vertexIndex + 1];
					landscape_vpa[vertexIndex + 11] = landscape_vpa[vertexIndex + 2];

					tiles[tileIndex].code = 'flipped';
				}

				if ((vertexHeights[nextRowIndex + 1] < vertexHeights[index] &&
					vertexHeights[nextRowIndex + 1] < vertexHeights[index + 1] &&
					vertexHeights[nextRowIndex + 1] < vertexHeights[nextRowIndex]) ||
					(vertexHeights[nextRowIndex + 1] > vertexHeights[index] &&
						vertexHeights[nextRowIndex + 1] > vertexHeights[index + 1] &&
						vertexHeights[nextRowIndex + 1] > vertexHeights[nextRowIndex]))
				{
					landscape_vpa[vertexIndex + 6] = landscape_vpa[vertexIndex + 12];
					landscape_vpa[vertexIndex + 7] = landscape_vpa[vertexIndex + 13];
					landscape_vpa[vertexIndex + 8] = landscape_vpa[vertexIndex + 14];
					landscape_vpa[vertexIndex + 9] = landscape_vpa[vertexIndex + 0];
					landscape_vpa[vertexIndex + 10] = landscape_vpa[vertexIndex + 1];
					landscape_vpa[vertexIndex + 11] = landscape_vpa[vertexIndex + 2];

					tiles[tileIndex].code = 'flipped';
				}
			}

		} // for (let j = 0; j < numTiles; j++)
	} // end for (let i = 0; i < numTiles; i++)

	// record height levels for all playable checkerboard tiles
	for (let i = 0; i < numTiles; i++)
	{
		for (let j = 0; j < numTiles; j++)
		{
			tileIndex = i * numTiles + j;
			index = i * numVertices + j;
			if (tiles[tileIndex].code == 'checkColor0' || tiles[tileIndex].code == 'checkColor1')
			{
				tiles[tileIndex].level = vertexHeights[index];
			}
		}
	}

	// LANDSCAPE
	//planeGeometry.computeFaceNormals();
	planeMesh.geometry.computeVertexNormals();
	planeMesh.geometry.attributes.position.needsUpdate = true;
	planeMesh.geometry.attributes.normal.needsUpdate = true;
	planeMesh.geometry.attributes.color.needsUpdate = true;


	for (let i = 0; i < landscape_total_number_of_triangles; i++) 
	{

		bounding_box_min.set(Infinity, Infinity, Infinity);
		bounding_box_max.set(-Infinity, -Infinity, -Infinity);

		iX9 = i * 9;
		// record vertex positions
		vp0.set(landscape_vpa[iX9 + 0], landscape_vpa[iX9 + 1], landscape_vpa[iX9 + 2]);
		vp1.set(landscape_vpa[iX9 + 3], landscape_vpa[iX9 + 4], landscape_vpa[iX9 + 5]);
		vp2.set(landscape_vpa[iX9 + 6], landscape_vpa[iX9 + 7], landscape_vpa[iX9 + 8]);

		// record vertex colors
		vc0.set(landscape_vca[iX9 + 0], landscape_vca[iX9 + 1], landscape_vca[iX9 + 2]);
		vc1.set(landscape_vca[iX9 + 3], landscape_vca[iX9 + 4], landscape_vca[iX9 + 5]);
		vc2.set(landscape_vca[iX9 + 6], landscape_vca[iX9 + 7], landscape_vca[iX9 + 8]);

		// record vertex normals
		vn0.set(landscape_vna[iX9 + 0], landscape_vna[iX9 + 1], landscape_vna[iX9 + 2]);
		vn1.set(landscape_vna[iX9 + 3], landscape_vna[iX9 + 4], landscape_vna[iX9 + 5]);
		vn2.set(landscape_vna[iX9 + 6], landscape_vna[iX9 + 7], landscape_vna[iX9 + 8]);

		iX32 = i * 32;
		//slot 0
		landscape_triangle_array[iX32 + 0] = vp0.x; // r or x
		landscape_triangle_array[iX32 + 1] = vp0.y; // g or y 
		landscape_triangle_array[iX32 + 2] = vp0.z; // b or z
		landscape_triangle_array[iX32 + 3] = vp1.x; // a or w

		//slot 1
		landscape_triangle_array[iX32 + 4] = vp1.y; // r or x
		landscape_triangle_array[iX32 + 5] = vp1.z; // g or y
		landscape_triangle_array[iX32 + 6] = vp2.x; // b or z
		landscape_triangle_array[iX32 + 7] = vp2.y; // a or w

		//slot 2
		landscape_triangle_array[iX32 + 8] = vp2.z; // r or x
		landscape_triangle_array[iX32 + 9] = vc0.x; // g or y
		landscape_triangle_array[iX32 + 10] = vc0.y; // b or z
		landscape_triangle_array[iX32 + 11] = vc0.z; // a or w

		//slot 3
		landscape_triangle_array[iX32 + 12] = vc1.x; // r or x
		landscape_triangle_array[iX32 + 13] = vc1.y; // g or y
		landscape_triangle_array[iX32 + 14] = vc1.z; // b or z
		landscape_triangle_array[iX32 + 15] = vc2.x; // a or w

		//slot 4
		landscape_triangle_array[iX32 + 16] = vc2.y; // r or x
		landscape_triangle_array[iX32 + 17] = vc2.z; // g or y
		landscape_triangle_array[iX32 + 18] = vn0.x; // b or z
		landscape_triangle_array[iX32 + 19] = vn0.y; // a or w

		//slot 5
		landscape_triangle_array[iX32 + 20] = vn0.z; // r or x
		landscape_triangle_array[iX32 + 21] = vn1.x; // g or y
		landscape_triangle_array[iX32 + 22] = vn1.y; // b or z
		landscape_triangle_array[iX32 + 23] = vn1.z; // a or w

		//slot 6
		landscape_triangle_array[iX32 + 24] = vn2.x; // r or x 
		landscape_triangle_array[iX32 + 25] = vn2.y; // g or y
		landscape_triangle_array[iX32 + 26] = vn2.z; // b or z
		landscape_triangle_array[iX32 + 27] = 0; // a or w
		/*
		//slot 7
		landscape_triangle_array[iX32 + 28] = 0; // r or x
		landscape_triangle_array[iX32 + 29] = 0; // g or y
		landscape_triangle_array[iX32 + 30] = 0; // b or z
		landscape_triangle_array[iX32 + 31] = 0; // a or w */

		bounding_box_min.min(vp0);
		bounding_box_max.max(vp0);
		bounding_box_min.min(vp1);
		bounding_box_max.max(vp1);
		bounding_box_min.min(vp2);
		bounding_box_max.max(vp2);

		bounding_box_centroid.set((bounding_box_min.x + bounding_box_max.x) * 0.5,
			(bounding_box_min.y + bounding_box_max.y) * 0.5,
			(bounding_box_min.z + bounding_box_max.z) * 0.5);

		landscape_aabb_array[iX9 + 0] = bounding_box_min.x;
		landscape_aabb_array[iX9 + 1] = bounding_box_min.y;
		landscape_aabb_array[iX9 + 2] = bounding_box_min.z;
		landscape_aabb_array[iX9 + 3] = bounding_box_max.x;
		landscape_aabb_array[iX9 + 4] = bounding_box_max.y;
		landscape_aabb_array[iX9 + 5] = bounding_box_max.z;
		landscape_aabb_array[iX9 + 6] = bounding_box_centroid.x;
		landscape_aabb_array[iX9 + 7] = bounding_box_centroid.y;
		landscape_aabb_array[iX9 + 8] = bounding_box_centroid.z;

		landscape_totalWork[i] = i;
	} // end for (let i = 0; i < landscape_total_number_of_triangles; i++)


	console.log("landscape_triangle count:" + landscape_totalWork.length);
	// Build the BVH acceleration structure, which places a bounding box ('root' of the tree) around all of the 
	// triangles of the entire mesh, then subdivides each box into 2 smaller boxes.  It continues until it reaches 1 triangle,
	// which it then designates as a 'leaf'
	BVH_Build_Iterative(landscape_totalWork, landscape_aabb_array);


	landscape_triangleDataTexture.needsUpdate = true;
	landscape_aabbDataTexture.needsUpdate = true;


	// populate game objects: pedestal, Sentinel, sentries (in later levels), and trees
	populateLevel();
	
} // end function buildNewLevel()




function populateLevel()
{
	numOfSentries = 2;
	MaxUnitsOfEnergy = 64;
	// Starting Player Inventory: 10 units (3 robots and 1 tree), 
	//    Sentinel: +3 units max if converted to trees, Sentries: +2 units max each (if any) 
	MaxUnitsOfEnergy -= 13;
	MaxUnitsOfEnergy -= (2 * numOfSentries);
	gameObjectCount = 0;

	highestLevel = -Infinity;
	// record highest level
	for (let i = 0; i < numTiles; i++)
	{
		for (let j = 0; j < numTiles; j++)
		{
			tileIndex = i * numTiles + j;
			tiles[tileIndex].occupied = ''; // clear occupied fields

			if (tiles[tileIndex].level > highestLevel)
				highestLevel = tiles[tileIndex].level;
		}
	}

	// place the pedestal on highest level and the Sentinel on top of that
	for (let i = 0; i < numTiles; i++)
	{
		for (let j = 0; j < numTiles; j++)
		{
			tileIndex = i * numTiles + j;
			if (tiles[tileIndex].level == highestLevel)
			{
				vertexIndex = (i * numTiles * 18) + (j * 18);
				game_Objects[gameObjectCount].tag = "PEDESTAL_MODEL_ID";
				tiles[tileIndex].occupied = 'pedestal';

				game_Objects[gameObjectCount].position.set(landscape_vpa[vertexIndex + 0] + 5,
					landscape_vpa[vertexIndex + 1] + 9,
					landscape_vpa[vertexIndex + 2] + 5);

				gameObjectCount++;

				game_Objects[gameObjectCount].tag = "SENTINEL_MODEL_ID";
				///tiles[tileIndex].occupied = 'sentinel';
				game_Objects[gameObjectCount].position.set(landscape_vpa[vertexIndex + 0] + 5,
					landscape_vpa[vertexIndex + 1] + 19,
					landscape_vpa[vertexIndex + 2] + 5);
				
				gameObjectCount++;
				
				i = j = numTiles; // exit both loops
			}
		} // end for (let j = 0; j < numTiles; j++)
	} // end for (let i = 0; i < numTiles; i++)
	
	randomThreshold = 0;
	while (gameObjectCount < numOfSentries + 2) // + 2 is counting previously placed pedestal and Sentinel
	{
		randomThreshold += 0.00001;
		// place the sentries on the next highest available levels below the head Sentinel's top level
		for (let i = 0; i < numTiles; i++)
		{
			for (let j = 0; j < numTiles; j++)
			{
				
				if (gameObjectCount < numOfSentries + 2) // + 2 is counting previously placed pedestal and Sentinel
				{
					tileIndex = i * numTiles + j;
					if ( tiles[tileIndex].occupied == "" && (tiles[tileIndex].level == highestLevel || tiles[tileIndex].level == (highestLevel - 10) ||
					tiles[tileIndex].level == (highestLevel - 20)) && Math.random() < randomThreshold )
					{
						vertexIndex = (i * numTiles * 18) + (j * 18);
						game_Objects[gameObjectCount].tag = "SENTRY_MODEL_ID";
						tiles[tileIndex].occupied = 'sentry';

						game_Objects[gameObjectCount].position.set(landscape_vpa[vertexIndex + 0] + 5,
							landscape_vpa[vertexIndex + 1] + 9,
							landscape_vpa[vertexIndex + 2] + 5);

						gameObjectCount++;	
					}
				}
				else i = j = numTiles; // exit both loops
			} // end for (let j = 0; j < numTiles; j++)
		} // end for (let i = 0; i < numTiles; i++)
	} //end while (gameObjectCount < numOfSentries + 2)
	


	for (let i = 0; i < numTiles; i++)
	{
		for (let j = 0; j < numTiles; j++)
		{
			tileIndex = i * numTiles + j;
			
			if (tiles[tileIndex].code == 'checkColor0' || tiles[tileIndex].code == 'checkColor1')
			{
				if (tiles[tileIndex].occupied == "" && Math.random() < 0.05)
				{
					vertexIndex = (i * numTiles * 18) + (j * 18);
					if (gameObjectCount < MaxUnitsOfEnergy)
					{
						game_Objects[gameObjectCount].tag = "TREE_MODEL_ID";
						tiles[tileIndex].occupied = 'tree';
								
						game_Objects[gameObjectCount].position.set(landscape_vpa[vertexIndex + 0] + 5,
						landscape_vpa[vertexIndex + 1] + 9,
						landscape_vpa[vertexIndex + 2] + 5);

						gameObjectCount++;
					}
					else gameObjectCount = MaxUnitsOfEnergy;
				}
			}
		} // end for (let j = 0; j < numTiles; j++)
	} // end for (let i = 0; i < numTiles; i++)


	topLevel_total_number_of_objects = gameObjectCount;
	topLevel_totalWork = new Uint32Array(topLevel_total_number_of_objects);

	for (let i = 0; i < topLevel_total_number_of_objects; i++)
	{
		if (game_Objects[i].tag == "TREE_MODEL_ID")
		{
			current_model_id = TREE_MODEL_ID;
			boundingSphereRadius = tree_modelMesh.geometry.boundingSphere.radius;
			bounding_box_min.set(boundingSphereRadius, boundingSphereRadius, boundingSphereRadius);
			bounding_box_min.multiplyScalar(-modelScale);
			bounding_box_max.set(boundingSphereRadius, boundingSphereRadius, boundingSphereRadius);
			bounding_box_max.multiplyScalar(modelScale);
		}
		else if (game_Objects[i].tag == "BOULDER_MODEL_ID")
		{
			current_model_id = BOULDER_MODEL_ID;
			game_Objects[i].position.y -= 6.5;
			boundingSphereRadius = boulder_modelMesh.geometry.boundingSphere.radius;
			bounding_box_min.set(boundingSphereRadius, boundingSphereRadius, boundingSphereRadius);
			bounding_box_min.multiplyScalar(-modelScale);
			bounding_box_max.set(boundingSphereRadius, boundingSphereRadius, boundingSphereRadius);
			bounding_box_max.multiplyScalar(modelScale);
		}
		else if (game_Objects[i].tag == "ROBOT_MODEL_ID")
		{
			current_model_id = ROBOT_MODEL_ID;
			game_Objects[i].position.y -= 4.4;
			boundingSphereRadius = robot_modelMesh.geometry.boundingSphere.radius;
			bounding_box_min.set(boundingSphereRadius, boundingSphereRadius, boundingSphereRadius);
			bounding_box_min.multiplyScalar(-modelScale);
			bounding_box_max.set(boundingSphereRadius, boundingSphereRadius, boundingSphereRadius);
			bounding_box_max.multiplyScalar(modelScale);
		}
		else if (game_Objects[i].tag == "SENTRY_MODEL_ID")
		{
			current_model_id = SENTRY_MODEL_ID;
			game_Objects[i].position.y -= 4.4;
			boundingSphereRadius = sentry_modelMesh.geometry.boundingSphere.radius;
			bounding_box_min.set(boundingSphereRadius, boundingSphereRadius, boundingSphereRadius);
			bounding_box_min.multiplyScalar(-modelScale);
			bounding_box_max.set(boundingSphereRadius, boundingSphereRadius, boundingSphereRadius);
			bounding_box_max.multiplyScalar(modelScale);
		}
		else if (game_Objects[i].tag == "PEDESTAL_MODEL_ID")
		{
			current_model_id = PEDESTAL_MODEL_ID;
			game_Objects[i].position.y -= 4.1;
			boundingSphereRadius = pedestal_modelMesh.geometry.boundingSphere.radius;
			bounding_box_min.set(boundingSphereRadius, boundingSphereRadius, boundingSphereRadius);
			bounding_box_min.multiplyScalar(-modelScale);
			bounding_box_max.set(boundingSphereRadius, boundingSphereRadius, boundingSphereRadius);
			bounding_box_max.multiplyScalar(modelScale);
		}
		else if (game_Objects[i].tag == "SENTINEL_MODEL_ID")
		{
			current_model_id = SENTINEL_MODEL_ID;
			game_Objects[i].position.y -= 3.3;
			boundingSphereRadius = sentinel_modelMesh.geometry.boundingSphere.radius;
			bounding_box_min.set(boundingSphereRadius, boundingSphereRadius, boundingSphereRadius);
			bounding_box_min.multiplyScalar(-modelScale);
			bounding_box_max.set(boundingSphereRadius, boundingSphereRadius, boundingSphereRadius);
			bounding_box_max.multiplyScalar(modelScale);
		}
		else if (game_Objects[i].tag == "MEANIE_MODEL_ID")
		{
			current_model_id = MEANIE_MODEL_ID;
			game_Objects[i].position.y -= 4.4;
			boundingSphereRadius = meanie_modelMesh.geometry.boundingSphere.radius;
			bounding_box_min.set(boundingSphereRadius, boundingSphereRadius, boundingSphereRadius);
			bounding_box_min.multiplyScalar(-modelScale);
			bounding_box_max.set(boundingSphereRadius, boundingSphereRadius, boundingSphereRadius);
			bounding_box_max.multiplyScalar(modelScale);
		}

		game_Objects[i].rotateOnAxis(upVector, Math.random() * Math.PI * 2);
		game_Objects[i].updateMatrixWorld(true);
		objInvMatrices[i].copy(game_Objects[i].matrixWorld).invert();
		objInvMatrices[i].elements[15] = current_model_id;

		bounding_box_min.add(game_Objects[i].position);
		bounding_box_max.add(game_Objects[i].position);
		bounding_box_centroid.copy(game_Objects[i].position);


		iX9 = i * 9;
		topLevel_aabb_array[iX9 + 0] = bounding_box_min.x;
		topLevel_aabb_array[iX9 + 1] = bounding_box_min.y;
		topLevel_aabb_array[iX9 + 2] = bounding_box_min.z;
		topLevel_aabb_array[iX9 + 3] = bounding_box_max.x;
		topLevel_aabb_array[iX9 + 4] = bounding_box_max.y;
		topLevel_aabb_array[iX9 + 5] = bounding_box_max.z;
		topLevel_aabb_array[iX9 + 6] = bounding_box_centroid.x;
		topLevel_aabb_array[iX9 + 7] = bounding_box_centroid.y;
		topLevel_aabb_array[iX9 + 8] = bounding_box_centroid.z;

		topLevel_totalWork[i] = i;
	} // end for (let i = 0; i < topLevel_total_number_of_objects; i++)

	console.log("topLevel_objects count:" + topLevel_totalWork.length);
	BVH_Build_Iterative(topLevel_totalWork, topLevel_aabb_array);

	for (let i = 0; i < 256; i++)
	{
		iX4 = i * 4;
		topLevelAABBTree[i].set(topLevel_aabb_array[iX4 + 0], topLevel_aabb_array[iX4 + 1],
			topLevel_aabb_array[iX4 + 2], topLevel_aabb_array[iX4 + 3]);
	}

} // end function populateLevel()



// called automatically from within the animate() function
function updateVariablesAndUniforms()
{
	
	if (keyboard.pressed('space') && canPressSpace)
	{
		buildNewLevel();
		canPressSpace = false;
	}
	if (!keyboard.pressed('space'))
	{
		canPressSpace = true;
	}


	if (keyboard.pressed('R') && canPressR)
	{
		populateLevel();
		canPressR = false;
	}
	if (!keyboard.pressed('R'))
	{
		canPressR = true;
	}

	if (apertureSize > 1.0)
		apertureSize = 1.0;


	// SPHERE LIGHT
	lightAngle += 0.02 * frameTime;
	if (lightAngle > Math.PI)
	{
		lightAngle = 0.0;
		axisOfRotation.set(Math.random() * 2 - 1, Math.random() * 0.5 + 0.5, Math.random() * 2 - 1).normalize();
		if (axisOfRotation.x == 0 && axisOfRotation.y == 1 && axisOfRotation.z == 0)
			sunDirection.set(0.001, 0.999, 0).normalize();
		else if (axisOfRotation.x == 0 && axisOfRotation.y == -1 && axisOfRotation.z == 0)
			sunDirection.set(0.001, -0.999, 0).normalize();
		else
			sunDirection.set(0, 1, 0).normalize();

		sunDirection.cross(axisOfRotation);
		sunDirection.normalize();
		sphereObject.position.set(0, 0, 0);
		sphereObject.position.add(sunDirection);
	}

	parentRotationObject.rotation.set(0, 0, 0); // clear rotation
	parentRotationObject.rotateOnAxis(axisOfRotation, lightAngle);
	sphereObject.getWorldPosition(sphereObjectPosition);
	pathTracingUniforms.uSunDirection.value.copy(sphereObjectPosition.normalize());

	for (let i = 0; i < topLevel_total_number_of_objects; i++)
	{
		game_Objects[i].rotateOnAxis(upVector, 0.5 * frameTime);
		game_Objects[i].updateMatrixWorld(true);
		current_model_id = objInvMatrices[i].elements[15];
		objInvMatrices[i].copy(game_Objects[i].matrixWorld).invert();
		objInvMatrices[i].elements[15] = current_model_id;
	}

	// lock FOV to 40 degrees, similar to original game
	worldCamera.fov = 40;
	fovScale = worldCamera.fov * 0.5 * (Math.PI / 180.0);
	pathTracingUniforms.uVLen.value = Math.tan(fovScale);
	pathTracingUniforms.uULen.value = pathTracingUniforms.uVLen.value * worldCamera.aspect;

	intersectArray.length = 0;
	raycaster.set(cameraControlsObject.position, cameraDirectionVector);
	raycaster.intersectObject(planeMesh, false, intersectArray);
	selectedTile = -10;
	if (intersectArray.length > 0)
	{
		raycastIndex = Math.floor(intersectArray[0].face.a / 6);
		
		if (tiles[raycastIndex].code != 'connector' && tiles[raycastIndex].code != 'flipped')
		{
			if (Math.cos(blinkAngle % (Math.PI * 2)) > 0)
			{
				if (intersectArray[0].face.a % 6 > 0)
					selectedTile = ((intersectArray[0].face.a - 3) / 3) * 8;
				else selectedTile = (intersectArray[0].face.a / 3) * 8;
			}

			blinkAngle += Math.PI * 3 * frameTime;
		}
		else blinkAngle = 0;
		
		cameraInfoElement.innerHTML = "tile code: " + tiles[raycastIndex].code + " | level: " + tiles[raycastIndex].level.toFixed(0) + 
			" | occupied: " + tiles[raycastIndex].occupied + "<br>";
		viewRayTargetPosition.copy(intersectArray[0].point);
		viewRayTargetPosition.add(intersectArray[0].face.normal.multiplyScalar(2));
		focusDistance = intersectArray[0].distance;
		//pathTracingUniforms.uFocusDistance.value = focusDistance;
	}	
	else 
	{
		viewRayTargetPosition.set(10000, 10000, 10000);
		cameraInfoElement.innerHTML = "no intersection" + "<br>";
	}

	pathTracingUniforms.uSelectedTile.value = selectedTile;
	
	// INFO
	cameraInfoElement.innerHTML += "Aperture: " + apertureSize.toFixed(2) +
		" / FocusDistance: " + focusDistance.toFixed(1) + "<br>" + "Press SPACEBAR to generate new landscape | Press R to randomize game objects";

} // end function updateVariablesAndUniforms()


// load models
load_GLTF_Model("models/TheSentinel_tree_GeoffCrammond.glb", TREE_MODEL_ID);
load_GLTF_Model("models/TheSentinel_boulder_GeoffCrammond.glb", BOULDER_MODEL_ID);
load_GLTF_Model("models/TheSentinel_robot_GeoffCrammond.glb", ROBOT_MODEL_ID);
load_GLTF_Model("models/TheSentinel_sentry_GeoffCrammond.glb", SENTRY_MODEL_ID);
load_GLTF_Model("models/TheSentinel_pedestal_GeoffCrammond.glb", PEDESTAL_MODEL_ID);
load_GLTF_Model("models/TheSentinel_sentinel_GeoffCrammond.glb", SENTINEL_MODEL_ID);
load_GLTF_Model("models/TheSentinel_meanie_GeoffCrammond.glb", MEANIE_MODEL_ID);

// when all the models have been loaded, we can init app and start animating
