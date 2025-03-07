// scene/demo-specific variables go here
let parentRotationObject = new THREE.Object3D();
let sphereObject = new THREE.Object3D();
let sphereObjectPosition = new THREE.Vector3();
let axisOfRotation = new THREE.Vector3();
let sunDirection = new THREE.Vector3();
let lightAngle = 0;
let sentinelTurnAngle = 0;
let sentinelFacingVec = new THREE.Vector3();
let testVec = new THREE.Vector3();
let crossProduct = new THREE.Vector3();
let playerHeadToEnemyVec = new THREE.Vector3();
let playerTileToEnemyVec = new THREE.Vector3();
let playerHeadPos = new THREE.Vector3();
let playerTilePos = new THREE.Vector3();
let playerHeadIsVisibleToSentinel = false;
let playerTileIsVisibleToSentinel = false;
let planeGeometry, planeMaterial, planeMesh;
let numTiles = 40; // 40
let numVertices = numTiles + 1;
let gridExtent = numTiles * 10;
let raiseAmount = 0;
let frequency = 0;
let amplitude = 0;
let i_offset = 0;
let j_offset = 0;
let checkColor0 = new THREE.Color();
let checkColor1 = new THREE.Color();
let colors = new Float32Array(numTiles * numTiles * 18);
let tiles = [];
let code = '';
let index = 0;
let tileIndex = 0;
let potentialPlacementTileIndeces = [];
let randomlyChosenTileIndex = -10;
let vertexIndex = 0;
let nextRowIndex = 0;
let highestLevel = 0;
let lowestLevel = 0;
let canPressSpace = true;
let canPressEnter = true;
let canPressB = true;
let canPressR = true;
let canPressE = true;
let canPressA = true;
let canPressT = true;
let canPressH = true;
let inGame = false;
let simplex = new SimplexNoise();
let vertexHeights = new Float32Array(numVertices * numVertices);
let levelCounter = -1;
let upVector = new THREE.Vector3(0, 1, 0);
let modelScale = 10.0;
let scaleFactor = 0.9;
let MAX_UNITS_OF_ENERGY = 64; // 64
let levelPlacementUnitsAvailable = 0;
let STARTING_PLAYER_UNITS_OF_ENERGY = 10; // 10
let playerUnitsOfEnergy = 0;
let materialNumber = 0;


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

let gameObjectIndex = -1;
let numOfSentries = 0;
let game_Objects = [];
let gameObject_boundingBoxes = [];
let InvMatrices_UniformsGroup, TopLevelBVH_UniformsGroup;
let uObj3D_InvMatrices = [];
let uTopLevelBVH_aabbData = [];
let randomThreshold = 0;
let okToPlaceRobot = false;

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
let hitPoint = new THREE.Vector3();
let closestHitPoint = new THREE.Vector3();
let testD = Infinity;
let closestT = Infinity;
let testT = Infinity;
let selectedObjectIndex = -10.0;
let raycastIndex = 0;
let testIndex = 0;
let selectionIsValid = false;
let sentinelAbsorbed = false;
let winningRobotPlaced = false;
let viewRaySphereRadius = 2.0;
let viewRayTargetPosition = new THREE.Vector3();
let testPlacementPosition = new THREE.Vector3();
let selectedTileIndex = -10.0;
let blinkAngle = 0.0;
let playerRobotIndex = 0;
let absorbedIndex = 0; 
let targetVector = new THREE.Vector3();
let ZVector = new THREE.Vector3(0, 0, 1);
let turnAngle = 0;

let playingTeleportAnimation = false;
let playingStartGameAnimation = false;
let playingLoseAnimation = false;
let playingWinAnimation = false;
let doingDissolveEffect = false;
let doingResolveEffect = false;
let canDoResolveEffect = true;
let dissolveEffectStrength = 0;
let animationProgress = 0;
let progressAcceleration = 0;
let animationOldRotationX = 0;
let animationTargetRotationX = 0;
let animationOldRotationY = 0;
let differenceY = 0;
let userCurrentAperture = 0.01;
let animationOldPosition = new THREE.Vector3();
let animationTargetPosition = new THREE.Vector3();
let animationTargetVector = new THREE.Vector3();


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


	let gltfLoader = new GLTFLoader();

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

		modelMesh.geometry = mergeGeometries(geoList);

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



// called automatically from within initTHREEjs() function (located in InitCommon.js file)
function initSceneData() 
{
	demoFragmentShaderFileName = 'TheSentinel_Fragment.glsl';

	// scene/demo-specific three.js objects setup goes here
	sceneIsDynamic = true;
	
	allowOrthographicCamera = false;
	
	cameraFlightSpeed = 60;

	document.addEventListener('mousedown', onDocumentMouseDown);

	// pixelRatio is resolution - range: 0.5(half resolution) to 1.0(full resolution)
	pixelRatio = mouseControl ? 0.75 : 0.75; // less demanding on battery-powered mobile devices
	
	EPS_intersect = 0.01;

	// position and orient camera
	cameraControlsObject.position.set(0, 140, 450);

	// look slightly downward
	cameraControlsPitchObject.rotation.x = -0.4;

	worldCamera.fov = 30;

	// Sun
	parentRotationObject.visible = false;
	sphereObject.visible = false;
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

	
	
	// GAME OBJECTS (THREE.Object3Ds), their Bounding Boxes (THREE.Box3s) and their Inverse Matrices (THREE.Matrix4s)
	InvMatrices_UniformsGroup = new THREE.UniformsGroup();
	InvMatrices_UniformsGroup.setName('InvMatrices_UniformsGroup');
	InvMatrices_UniformsGroup.setUsage(THREE.DynamicDrawUsage);
	for (let i = 0; i < MAX_UNITS_OF_ENERGY; i++) // 64 = max object inverse matrices
	{
		game_Objects[i] = new THREE.Object3D(); // contains useful info like position, rotation, etc.
		game_Objects[i].visible = false; // these game_Objects are just mathematical placeholders, not to be rendered
		game_Objects[i].tag = ""; // custom property added
		game_Objects[i].level = -Infinity; // custom property added
		game_Objects[i].tileIndex = -10; // custom property added

		// store these game objects' bounding boxes for raycasting against and collision detection
		gameObject_boundingBoxes[i] = new THREE.Box3();

		// store these game objects' matrices (transforms), specifically their matrix 'inverses' for later efficiently ray tracing
		uObj3D_InvMatrices[i] = new THREE.Matrix4();
		InvMatrices_UniformsGroup.add(new THREE.Uniform(uObj3D_InvMatrices[i]));
	}
	// GAME OBJECTS AABB Tree (array of THREE.Vector4 uniforms to be sent to the GPU)
	TopLevelBVH_UniformsGroup = new THREE.UniformsGroup();
	TopLevelBVH_UniformsGroup.setName('TopLevelBVH_UniformsGroup');
	TopLevelBVH_UniformsGroup.setUsage(THREE.DynamicDrawUsage);
	for (let i = 0; i < 256; i++) // enough to hold ~ 64 nodes + 64 leaves * 2 (2 Vector4's for each node)
	{
		uTopLevelBVH_aabbData[i] = new THREE.Vector4();
		TopLevelBVH_UniformsGroup.add(new THREE.Uniform(uTopLevelBVH_aabbData[i]));
	}


	// TREE MODEL
	tree_total_number_of_triangles = tree_modelMesh.geometry.attributes.position.array.length / 9;
	tree_totalWork = new Uint32Array(tree_total_number_of_triangles);
	tree_triangle_array = new Float32Array(256 * 256 * 4);
	// 256 = width of texture, 256 = height of texture, 4 = r,g,b, and a components
	tree_aabb_array = new Float32Array(256 * 256 * 4);
	// 256 = width of texture, 256 = height of texture, 4 = r,g,b, and a components
	tree_vpa = new Float32Array(tree_modelMesh.geometry.attributes.position.array);
	tree_vna = new Float32Array(tree_modelMesh.geometry.attributes.normal.array);

	
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


	// SETUP GAME MODELS 2D DATA TEXTURE ARRAYS
	models_triangle_array = new Float32Array(256 * 256 * 4 * 7); // * number of different models
	models_aabb_array = new Float32Array(256 * 256 * 4 * 7); // * number of different models

	models_triangleDataTexture2DArray = new THREE.DataArrayTexture(models_triangle_array, 256, 256, 7);
	models_triangleDataTexture2DArray.format = THREE.RGBAFormat;
	models_triangleDataTexture2DArray.type = THREE.FloatType;

	models_aabbDataTexture2DArray = new THREE.DataArrayTexture(models_aabb_array, 256, 256, 7);
	models_aabbDataTexture2DArray.format = THREE.RGBAFormat;
	models_aabbDataTexture2DArray.type = THREE.FloatType;




	// LANDSCAPE PLANE
	planeGeometry = new THREE.PlaneGeometry(gridExtent, gridExtent, numTiles, numTiles);

	if (planeGeometry.index)
		planeGeometry = planeGeometry.toNonIndexed();

	planeGeometry.rotateX(-Math.PI * 0.5);

	planeGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

	// create tile objects(structs) to be filled in later
	for (let i = 0; i < numTiles; i++)
	{
		for (let j = 0; j < numTiles; j++)
		{
			tiles.push({
				level: 0,
				code: '',
				occupied: '',
				occupiedIndex: -10
			});
		}
	}

	planeMaterial = new THREE.MeshLambertMaterial({
		//wireframe: true,
		//flatShading: true,
		vertexColors: THREE.VertexColors
	});
	planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
	planeMesh.visible = false;
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
		THREE.NoColorSpace);

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
		THREE.NoColorSpace);

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

	for (let i = 0; i < buildnodes.length; i++)
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

	for (let i = 0; i < buildnodes.length; i++)
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

	for (let i = 0; i < buildnodes.length; i++)
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

	for (let i = 0; i < buildnodes.length; i++)
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

	for (let i = 0; i < buildnodes.length; i++)
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

	for (let i = 0; i < buildnodes.length; i++)
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

	for (let i = 0; i < buildnodes.length; i++)
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


	// scene/demo-specific uniforms go here	
	pathTracingUniforms.tModels_triangleDataTexture2DArray = { value: models_triangleDataTexture2DArray };
	pathTracingUniforms.tModels_aabbDataTexture2DArray = { value: models_aabbDataTexture2DArray };
	pathTracingUniforms.tLandscape_TriangleTexture = { value: landscape_triangleDataTexture };
	pathTracingUniforms.tLandscape_AABBTexture = { value: landscape_aabbDataTexture };
	pathTracingUniforms.uSunDirection = { value: new THREE.Vector3() };//new THREE.Vector3 because another variable value is used
	pathTracingUniforms.uViewRayTargetPosition = { value: viewRayTargetPosition };
	pathTracingUniforms.uViewRaySphereRadius = { value: viewRaySphereRadius };
	pathTracingUniforms.uSelectedTileIndex = { value: selectedTileIndex };
	pathTracingUniforms.uSelectedObjectIndex = { value: selectedObjectIndex };
	pathTracingUniforms.uPlayingTeleportAnimation = { value: playingTeleportAnimation };
	pathTracingUniforms.uDoingDissolveEffect = { value: doingDissolveEffect };
	pathTracingUniforms.uDissolveEffectStrength = { value: dissolveEffectStrength };
	pathTracingUniforms.uResolvingObjectIndex = { value: -10 };

	pathTracingUniformsGroups = [InvMatrices_UniformsGroup, TopLevelBVH_UniformsGroup];


	// generate random landscape
	buildNewLevel(true);

} // end function initSceneData()




function buildNewLevel(changeLevelColor)
{
	dissolveEffectStrength = 0;

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

	if (changeLevelColor)
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
	amplitude = 1.2;
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
	
} // end function buildNewLevel(changeLevelColor)




function populateLevel()
{
	playerUnitsOfEnergy = STARTING_PLAYER_UNITS_OF_ENERGY; // 10
	sentinelAbsorbed = false;
	winningRobotPlaced = false;

	viewRayTargetPosition.set(100000, 100000, 100000);

	// clear out game object rotations
	for (let i = 0; i < MAX_UNITS_OF_ENERGY; i++)
	{
		game_Objects[i].rotation.set(0, 0, 0);
	}

	numOfSentries = 2; // 0 for beginning players, increasing by 1 as the player passes more levels, max: 7 sentries

	levelPlacementUnitsAvailable = MAX_UNITS_OF_ENERGY; // 64
	// Starting Player Robot Energy Inventory: 10 units (3 robots and 1 tree)
	// Sentinel: 4 units
	// sentries(if any): 3 units each
	// robots (created by player): 3 units each
	// boulders(none at start of levels, used/created by player): 2 units each
	// meanies(none at start of levels): 1 unit each (converted/made from a tree by Sentinel/sentries)
	// trees: 1 unit each (randomly placed at level start, used/created by player and Sentinel/sentries)

	// Starting Player Robot: +9 units more if converted to trees, Sentinel: +3 units more if converted to trees, Sentries: +2 units more each (if any)
	levelPlacementUnitsAvailable -= 12; // 9 + 3 reserved for extra tree objects if Starting Robot or Sentinel are converted to trees
	levelPlacementUnitsAvailable -= (2 * numOfSentries); // 2 * numOfSentries (if any) for extra tree objects if each sentry were to be converted to trees
	levelPlacementUnitsAvailable -= 1; // reserved spot - must always render player's robot, even if the robot has no energy units left
	levelPlacementUnitsAvailable -= 1; // reserved spot - must always render the Sentinel's pedestal, it cannot be absorbed
	
	gameObjectIndex = -1;

	highestLevel = -Infinity; // initialize to lowest possible
	lowestLevel = Infinity; // initialize to highest possible
	// record highest and lowest levels after initializing/clearing the 'tiles' array's fields 
	for (let i = 0; i < numTiles; i++)
	{
		for (let j = 0; j < numTiles; j++)
		{
			tileIndex = i * numTiles + j;
			tiles[tileIndex].occupied = ''; // clear all 'occupied' fields
			tiles[tileIndex].occupiedIndex = -10; // re-initialize all 'occupiedIndex' fields

			if (tiles[tileIndex].level > highestLevel)
				highestLevel = tiles[tileIndex].level;
			if (tiles[tileIndex].level != -Infinity && tiles[tileIndex].level < lowestLevel)
				lowestLevel = tiles[tileIndex].level;
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
				gameObjectIndex++;

				vertexIndex = (i * numTiles * 18) + (j * 18);
				game_Objects[gameObjectIndex].tag = "PEDESTAL_MODEL_ID";
				game_Objects[gameObjectIndex].level = tiles[tileIndex].level + 10; // pedestal level is higher
				game_Objects[gameObjectIndex].tileIndex = tileIndex;
				tiles[tileIndex].occupied = 'pedestal';
				tiles[tileIndex].occupiedIndex = gameObjectIndex;

				game_Objects[gameObjectIndex].position.set(landscape_vpa[vertexIndex + 0] + 5,
					landscape_vpa[vertexIndex + 1] + 0,
					landscape_vpa[vertexIndex + 2] + 5);

				gameObjectIndex++;

				game_Objects[gameObjectIndex].tag = "SENTINEL_MODEL_ID";
				//tiles[tileIndex].occupied = 'sentinel';
				game_Objects[gameObjectIndex].level = tiles[tileIndex].level + 10; // on top of higher pedestal
				game_Objects[gameObjectIndex].tileIndex = tileIndex;
				game_Objects[gameObjectIndex].position.set(landscape_vpa[vertexIndex + 0] + 5,
					landscape_vpa[vertexIndex + 1] + 0,
					landscape_vpa[vertexIndex + 2] + 5);
				
				i = j = numTiles; // exit both loops
			}
		} // end for (let j = 0; j < numTiles; j++)
	} // end for (let i = 0; i < numTiles; i++)
	
	randomThreshold = 0;
	while (gameObjectIndex < numOfSentries + 1) // + 1 is counting previously placed Sentinel
	{
		randomThreshold += 0.00001;
		// place the sentries on the next highest available levels below the head Sentinel's top level
		for (let i = 0; i < numTiles; i++)
		{
			for (let j = 0; j < numTiles; j++)
			{
				if (gameObjectIndex < numOfSentries + 1) // + 1 is counting previously placed Sentinel
				{
					tileIndex = i * numTiles + j;
					if ( tiles[tileIndex].occupied == "" && tiles[tileIndex].level > 0 && Math.random() < randomThreshold )
					{
						gameObjectIndex++;

						vertexIndex = (i * numTiles * 18) + (j * 18);
						game_Objects[gameObjectIndex].tag = "SENTRY_MODEL_ID";
						game_Objects[gameObjectIndex].level = tiles[tileIndex].level;
						game_Objects[gameObjectIndex].tileIndex = tileIndex;
						tiles[tileIndex].occupied = 'sentry';
						tiles[tileIndex].occupiedIndex = gameObjectIndex;

						game_Objects[gameObjectIndex].position.set(landscape_vpa[vertexIndex + 0] + 5,
							landscape_vpa[vertexIndex + 1] + 0,
							landscape_vpa[vertexIndex + 2] + 5);		
					}
				}
				else i = j = numTiles; // exit both loops
			} // end for (let j = 0; j < numTiles; j++)
		} // end for (let i = 0; i < numTiles; i++)
	} //end while (gameObjectIndex < numOfSentries + 1)


	// place the player's initial robot on the lowest level
	okToPlaceRobot = false;

	for (let i = 0; i < numTiles; i++)
	{
		for (let j = 0; j < numTiles; j++)
		{
			tileIndex = i * numTiles + j;
			if (tiles[tileIndex].level == lowestLevel)
			{ // check surrounding tiles to see if any are playable, want to avoid starting player in 1 isolated square
				if (i > 0)
				{	//check North
					if (tiles[(i - 1) * numTiles + j].level == lowestLevel)
						okToPlaceRobot = true;
				}
				if (i < numTiles - 1)
				{	//check South
					if (tiles[(i + 1) * numTiles + j].level == lowestLevel)
						okToPlaceRobot = true;
				}
				if (j > 0)
				{	//check West
					if (tiles[i * numTiles + (j - 1)].level == lowestLevel)
						okToPlaceRobot = true;
				}
				if (j < numTiles - 1)
				{	//check East
					if (tiles[i * numTiles + (j + 1)].level == lowestLevel)
						okToPlaceRobot = true;
				}	
			}
			if (okToPlaceRobot)
			{
				gameObjectIndex++;

				vertexIndex = (i * numTiles * 18) + (j * 18);
				game_Objects[gameObjectIndex].tag = "ROBOT_MODEL_ID";
				game_Objects[gameObjectIndex].level = tiles[tileIndex].level;
				game_Objects[gameObjectIndex].tileIndex = tileIndex;
				tiles[tileIndex].occupied = 'playerRobot';
				tiles[tileIndex].occupiedIndex = gameObjectIndex;
				playerRobotIndex = gameObjectIndex; // record player's robot Object3D array index

				game_Objects[gameObjectIndex].position.set(landscape_vpa[vertexIndex + 0] + 5,
					landscape_vpa[vertexIndex + 1] + 0,
					landscape_vpa[vertexIndex + 2] + 5);

				i = j = numTiles; // exit both loops
			}
		} // end for (let j = 0; j < numTiles; j++)
	} // end for (let i = 0; i < numTiles; i++)


	// if we failed to find a decent starting position for player's Robot, try again with less restrictions
	if (!okToPlaceRobot)
	{
		for (let i = 0; i < numTiles; i++)
		{
			for (let j = 0; j < numTiles; j++)
			{
				tileIndex = i * numTiles + j;
				
				if (tiles[tileIndex].level == lowestLevel + 10)
				{// check surrounding tiles to see if any are playable, want to avoid starting player in 1 isolated square
					if (i > 0)
					{	//check North
						if (tiles[(i - 1) * numTiles + j].level == lowestLevel + 10)
							okToPlaceRobot = true;
					}
					if (i < numTiles - 1)
					{	//check South
						if (tiles[(i + 1) * numTiles + j].level == lowestLevel + 10)
							okToPlaceRobot = true;
					}
					if (j > 0)
					{	//check West
						if (tiles[i * numTiles + (j - 1)].level == lowestLevel + 10)
							okToPlaceRobot = true;
					}
					if (j < numTiles - 1)
					{	//check East
						if (tiles[i * numTiles + (j + 1)].level == lowestLevel + 10)
							okToPlaceRobot = true;
					}
				}
				if (okToPlaceRobot)
				{
					gameObjectIndex++;

					vertexIndex = (i * numTiles * 18) + (j * 18);
					game_Objects[gameObjectIndex].tag = "ROBOT_MODEL_ID";
					game_Objects[gameObjectIndex].level = tiles[tileIndex].level;
					game_Objects[gameObjectIndex].tileIndex = tileIndex;
					tiles[tileIndex].occupied = 'playerRobot';
					tiles[tileIndex].occupiedIndex = gameObjectIndex;
					playerRobotIndex = gameObjectIndex; // record player's robot Object3D array index

					game_Objects[gameObjectIndex].position.set(landscape_vpa[vertexIndex + 0] + 5,
						landscape_vpa[vertexIndex + 1] + 0,
						landscape_vpa[vertexIndex + 2] + 5);

					i = j = numTiles; // exit both loops
				}
			} // end for (let j = 0; j < numTiles; j++)
		} // end for (let i = 0; i < numTiles; i++)

	} // end if (!okToPlaceRobot)
	

	// finally fill up the remaining landscape's levelPlacementUnitsAvailable with trees (worth 1 energy unit each)
	randomThreshold = 0;
	while (gameObjectIndex < levelPlacementUnitsAvailable)
	{
		randomThreshold += 0.001;
		for (let i = 0; i < numTiles; i++)
		{
			for (let j = 0; j < numTiles; j++)
			{
				tileIndex = i * numTiles + j;

				if (tiles[tileIndex].code == 'checkColor0' || tiles[tileIndex].code == 'checkColor1')
				{
					if (tiles[tileIndex].occupied == "" && tiles[tileIndex].level < highestLevel && Math.random() < randomThreshold)
					{
						vertexIndex = (i * numTiles * 18) + (j * 18);
						if (gameObjectIndex < levelPlacementUnitsAvailable)
						{
							gameObjectIndex++;

							game_Objects[gameObjectIndex].tag = "TREE_MODEL_ID";
							game_Objects[gameObjectIndex].level = tiles[tileIndex].level;
							game_Objects[gameObjectIndex].tileIndex = tileIndex;
							tiles[tileIndex].occupied = 'tree';
							tiles[tileIndex].occupiedIndex = gameObjectIndex;

							game_Objects[gameObjectIndex].position.set(landscape_vpa[vertexIndex + 0] + 5,
								landscape_vpa[vertexIndex + 1] + 0,
								landscape_vpa[vertexIndex + 2] + 5);
						}
						else i = j = numTiles;
					}
				}
			} // end for (let j = 0; j < numTiles; j++)
		} // end for (let i = 0; i < numTiles; i++)

	} // end while (gameObjectIndex < levelPlacementUnitsAvailable)
	


	topLevel_total_number_of_objects = gameObjectIndex + 1;
	topLevel_totalWork = new Uint32Array(topLevel_total_number_of_objects);

	for (let i = 0; i < topLevel_total_number_of_objects; i++)
	{
		if (game_Objects[i].tag == "TREE_MODEL_ID")
		{
			current_model_id = TREE_MODEL_ID;
			// create slightly larger axis-aligned bounding box for raytracing traversal of the topLevel gameObjects' AABBTree on the GPU.
			// Use slightly larger boundingSphere radius so the object can rotate arbitrarily on any axis
			game_Objects[i].position.y += 9;
			boundingSphereRadius = tree_modelMesh.geometry.boundingSphere.radius;
			bounding_box_min.set(boundingSphereRadius, boundingSphereRadius, boundingSphereRadius);
			bounding_box_min.multiplyScalar(-modelScale);
			bounding_box_max.set(boundingSphereRadius, boundingSphereRadius, boundingSphereRadius);
			bounding_box_max.multiplyScalar(modelScale);
			// now create the usual slimmer axis-aligned bounding box for ray casting/collision detection(lower precision) routines on the js (CPU) side
			gameObject_boundingBoxes[i].copy(tree_modelMesh.geometry.boundingBox);
			// js-side bounding boxes are still in original model object space - so scale them up(or down, if desired) into world space size 
			gameObject_boundingBoxes[i].min.multiplyScalar(modelScale * scaleFactor * 0.8);
			gameObject_boundingBoxes[i].max.multiplyScalar(modelScale * scaleFactor * 0.8);
			// finally translate the bounding box origin to its parent gameObject's world space location
			gameObject_boundingBoxes[i].translate(game_Objects[i].position);
		}
		else if (game_Objects[i].tag == "BOULDER_MODEL_ID")
		{
			current_model_id = BOULDER_MODEL_ID;
			game_Objects[i].position.y += 2.5;
			boundingSphereRadius = boulder_modelMesh.geometry.boundingSphere.radius;
			bounding_box_min.set(boundingSphereRadius, boundingSphereRadius, boundingSphereRadius);
			bounding_box_min.multiplyScalar(-modelScale);
			bounding_box_max.set(boundingSphereRadius, boundingSphereRadius, boundingSphereRadius);
			bounding_box_max.multiplyScalar(modelScale);

			gameObject_boundingBoxes[i].copy(boulder_modelMesh.geometry.boundingBox);
			gameObject_boundingBoxes[i].min.multiplyScalar(modelScale * scaleFactor);
			gameObject_boundingBoxes[i].max.multiplyScalar(modelScale * scaleFactor);
			gameObject_boundingBoxes[i].translate(game_Objects[i].position);
		}
		else if (game_Objects[i].tag == "ROBOT_MODEL_ID")
		{
			current_model_id = ROBOT_MODEL_ID;
			game_Objects[i].position.y += 4.6;
			boundingSphereRadius = robot_modelMesh.geometry.boundingSphere.radius;
			bounding_box_min.set(boundingSphereRadius, boundingSphereRadius, boundingSphereRadius);
			bounding_box_min.multiplyScalar(-modelScale);
			bounding_box_max.set(boundingSphereRadius, boundingSphereRadius, boundingSphereRadius);
			bounding_box_max.multiplyScalar(modelScale);

			gameObject_boundingBoxes[i].copy(robot_modelMesh.geometry.boundingBox);
			gameObject_boundingBoxes[i].min.multiplyScalar(modelScale * scaleFactor);
			gameObject_boundingBoxes[i].max.multiplyScalar(modelScale * scaleFactor);
			gameObject_boundingBoxes[i].translate(game_Objects[i].position);
		}
		else if (game_Objects[i].tag == "SENTRY_MODEL_ID")
		{
			current_model_id = SENTRY_MODEL_ID;
			game_Objects[i].position.y += 4.6;
			boundingSphereRadius = sentry_modelMesh.geometry.boundingSphere.radius;
			bounding_box_min.set(boundingSphereRadius, boundingSphereRadius, boundingSphereRadius);
			bounding_box_min.multiplyScalar(-modelScale);
			bounding_box_max.set(boundingSphereRadius, boundingSphereRadius, boundingSphereRadius);
			bounding_box_max.multiplyScalar(modelScale);

			gameObject_boundingBoxes[i].copy(sentry_modelMesh.geometry.boundingBox);
			gameObject_boundingBoxes[i].min.multiplyScalar(modelScale * scaleFactor);
			gameObject_boundingBoxes[i].max.multiplyScalar(modelScale * scaleFactor);
			gameObject_boundingBoxes[i].translate(game_Objects[i].position);
		}
		else if (game_Objects[i].tag == "PEDESTAL_MODEL_ID")
		{
			current_model_id = PEDESTAL_MODEL_ID;
			game_Objects[i].position.y += 5;
			boundingSphereRadius = pedestal_modelMesh.geometry.boundingSphere.radius;
			bounding_box_min.set(boundingSphereRadius, boundingSphereRadius, boundingSphereRadius);
			bounding_box_min.multiplyScalar(-modelScale);
			bounding_box_max.set(boundingSphereRadius, boundingSphereRadius, boundingSphereRadius);
			bounding_box_max.multiplyScalar(modelScale);

			gameObject_boundingBoxes[i].copy(pedestal_modelMesh.geometry.boundingBox);
			gameObject_boundingBoxes[i].min.multiplyScalar(modelScale * scaleFactor);
			gameObject_boundingBoxes[i].max.multiplyScalar(modelScale * scaleFactor);
			gameObject_boundingBoxes[i].translate(game_Objects[i].position);
		}
		else if (game_Objects[i].tag == "SENTINEL_MODEL_ID")
		{
			current_model_id = SENTINEL_MODEL_ID;
			game_Objects[i].position.y += 15.9;
			boundingSphereRadius = sentinel_modelMesh.geometry.boundingSphere.radius;
			bounding_box_min.set(boundingSphereRadius, boundingSphereRadius, boundingSphereRadius);
			bounding_box_min.multiplyScalar(-modelScale);
			bounding_box_max.set(boundingSphereRadius, boundingSphereRadius, boundingSphereRadius);
			bounding_box_max.multiplyScalar(modelScale);

			gameObject_boundingBoxes[i].copy(sentinel_modelMesh.geometry.boundingBox);
			gameObject_boundingBoxes[i].min.multiplyScalar(modelScale * scaleFactor);
			gameObject_boundingBoxes[i].max.multiplyScalar(modelScale * scaleFactor);
			gameObject_boundingBoxes[i].translate(game_Objects[i].position);
		}
		else if (game_Objects[i].tag == "MEANIE_MODEL_ID")
		{
			current_model_id = MEANIE_MODEL_ID;
			game_Objects[i].position.y += 4.6;
			boundingSphereRadius = meanie_modelMesh.geometry.boundingSphere.radius;
			bounding_box_min.set(boundingSphereRadius, boundingSphereRadius, boundingSphereRadius);
			bounding_box_min.multiplyScalar(-modelScale);
			bounding_box_max.set(boundingSphereRadius, boundingSphereRadius, boundingSphereRadius);
			bounding_box_max.multiplyScalar(modelScale);

			gameObject_boundingBoxes[i].copy(meanie_modelMesh.geometry.boundingBox);
			gameObject_boundingBoxes[i].min.multiplyScalar(modelScale * scaleFactor);
			gameObject_boundingBoxes[i].max.multiplyScalar(modelScale * scaleFactor);
			gameObject_boundingBoxes[i].translate(game_Objects[i].position);
		}
		

		if (i != 0 && i != playerRobotIndex) // don't randomly rotate pedestal or player robot
			game_Objects[i].rotation.y = Math.random() * Math.PI * 2;
		else game_Objects[i].rotation.set(0,0,0);
		
		game_Objects[i].updateMatrixWorld(true);
		uObj3D_InvMatrices[i].copy(game_Objects[i].matrixWorld).invert();
		uObj3D_InvMatrices[i].elements[15] = current_model_id;
		
		
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
			//  256
	for (let i = 0; i < 256; i++)
	{
		iX4 = i * 4;
		uTopLevelBVH_aabbData[i].set(topLevel_aabb_array[iX4 + 0], topLevel_aabb_array[iX4 + 1],
			topLevel_aabb_array[iX4 + 2], topLevel_aabb_array[iX4 + 3]);
	}

	game_Objects[1].getWorldDirection(sentinelFacingVec);
	testVec.copy(game_Objects[playerRobotIndex].position);
	testVec.sub(game_Objects[1].position);
	testVec.y = 0;
	testVec.normalize();
	crossProduct.crossVectors(sentinelFacingVec, testVec);
	if (crossProduct.y < 0)
		sentinelTurnAngle = -0.0523598776;
	else sentinelTurnAngle = 0.0523598776

} // end function populateLevel()


function updateTopLevel_BVH()
{
	topLevel_total_number_of_objects = gameObjectIndex + 1;
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

			gameObject_boundingBoxes[i].copy(tree_modelMesh.geometry.boundingBox);
			gameObject_boundingBoxes[i].min.multiplyScalar(modelScale * scaleFactor * 0.8);
			gameObject_boundingBoxes[i].max.multiplyScalar(modelScale * scaleFactor * 0.8);
			gameObject_boundingBoxes[i].translate(game_Objects[i].position);
		}
		else if (game_Objects[i].tag == "BOULDER_MODEL_ID")
		{
			current_model_id = BOULDER_MODEL_ID;
			boundingSphereRadius = boulder_modelMesh.geometry.boundingSphere.radius;
			bounding_box_min.set(boundingSphereRadius, boundingSphereRadius, boundingSphereRadius);
			bounding_box_min.multiplyScalar(-modelScale);
			bounding_box_max.set(boundingSphereRadius, boundingSphereRadius, boundingSphereRadius);
			bounding_box_max.multiplyScalar(modelScale);

			gameObject_boundingBoxes[i].copy(boulder_modelMesh.geometry.boundingBox);
			gameObject_boundingBoxes[i].min.multiplyScalar(modelScale * scaleFactor);
			gameObject_boundingBoxes[i].max.multiplyScalar(modelScale * scaleFactor);
			gameObject_boundingBoxes[i].translate(game_Objects[i].position);
		}
		else if (game_Objects[i].tag == "ROBOT_MODEL_ID")
		{
			current_model_id = ROBOT_MODEL_ID;
			boundingSphereRadius = robot_modelMesh.geometry.boundingSphere.radius;
			bounding_box_min.set(boundingSphereRadius, boundingSphereRadius, boundingSphereRadius);
			bounding_box_min.multiplyScalar(-modelScale);
			bounding_box_max.set(boundingSphereRadius, boundingSphereRadius, boundingSphereRadius);
			bounding_box_max.multiplyScalar(modelScale);

			gameObject_boundingBoxes[i].copy(robot_modelMesh.geometry.boundingBox);
			gameObject_boundingBoxes[i].min.multiplyScalar(modelScale * scaleFactor);
			gameObject_boundingBoxes[i].max.multiplyScalar(modelScale * scaleFactor);
			gameObject_boundingBoxes[i].translate(game_Objects[i].position);
		}
		else if (game_Objects[i].tag == "SENTRY_MODEL_ID")
		{
			current_model_id = SENTRY_MODEL_ID;
			boundingSphereRadius = sentry_modelMesh.geometry.boundingSphere.radius;
			bounding_box_min.set(boundingSphereRadius, boundingSphereRadius, boundingSphereRadius);
			bounding_box_min.multiplyScalar(-modelScale);
			bounding_box_max.set(boundingSphereRadius, boundingSphereRadius, boundingSphereRadius);
			bounding_box_max.multiplyScalar(modelScale);

			gameObject_boundingBoxes[i].copy(sentry_modelMesh.geometry.boundingBox);
			gameObject_boundingBoxes[i].min.multiplyScalar(modelScale * scaleFactor);
			gameObject_boundingBoxes[i].max.multiplyScalar(modelScale * scaleFactor);
			gameObject_boundingBoxes[i].translate(game_Objects[i].position);
		}
		else if (game_Objects[i].tag == "PEDESTAL_MODEL_ID")
		{
			current_model_id = PEDESTAL_MODEL_ID;
			boundingSphereRadius = pedestal_modelMesh.geometry.boundingSphere.radius;
			bounding_box_min.set(boundingSphereRadius, boundingSphereRadius, boundingSphereRadius);
			bounding_box_min.multiplyScalar(-modelScale);
			bounding_box_max.set(boundingSphereRadius, boundingSphereRadius, boundingSphereRadius);
			bounding_box_max.multiplyScalar(modelScale);

			gameObject_boundingBoxes[i].copy(pedestal_modelMesh.geometry.boundingBox);
			gameObject_boundingBoxes[i].min.multiplyScalar(modelScale * scaleFactor);
			gameObject_boundingBoxes[i].max.multiplyScalar(modelScale * scaleFactor);
			gameObject_boundingBoxes[i].translate(game_Objects[i].position);
		}
		else if (game_Objects[i].tag == "SENTINEL_MODEL_ID")
		{
			current_model_id = SENTINEL_MODEL_ID;
			boundingSphereRadius = sentinel_modelMesh.geometry.boundingSphere.radius;
			bounding_box_min.set(boundingSphereRadius, boundingSphereRadius, boundingSphereRadius);
			bounding_box_min.multiplyScalar(-modelScale);
			bounding_box_max.set(boundingSphereRadius, boundingSphereRadius, boundingSphereRadius);
			bounding_box_max.multiplyScalar(modelScale);

			gameObject_boundingBoxes[i].copy(sentinel_modelMesh.geometry.boundingBox);
			gameObject_boundingBoxes[i].min.multiplyScalar(modelScale * scaleFactor);
			gameObject_boundingBoxes[i].max.multiplyScalar(modelScale * scaleFactor);
			gameObject_boundingBoxes[i].translate(game_Objects[i].position);
		}
		else if (game_Objects[i].tag == "MEANIE_MODEL_ID")
		{
			current_model_id = MEANIE_MODEL_ID;
			boundingSphereRadius = meanie_modelMesh.geometry.boundingSphere.radius;
			bounding_box_min.set(boundingSphereRadius, boundingSphereRadius, boundingSphereRadius);
			bounding_box_min.multiplyScalar(-modelScale);
			bounding_box_max.set(boundingSphereRadius, boundingSphereRadius, boundingSphereRadius);
			bounding_box_max.multiplyScalar(modelScale);

			gameObject_boundingBoxes[i].copy(meanie_modelMesh.geometry.boundingBox);
			gameObject_boundingBoxes[i].min.multiplyScalar(modelScale * scaleFactor);
			gameObject_boundingBoxes[i].max.multiplyScalar(modelScale * scaleFactor);
			gameObject_boundingBoxes[i].translate(game_Objects[i].position);
		}

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

	//console.log("topLevel_objects count:" + topLevel_totalWork.length);
	BVH_Build_Iterative(topLevel_totalWork, topLevel_aabb_array);
			//  256
	for (let i = 0; i < 256; i++)
	{
		iX4 = i * 4;
		uTopLevelBVH_aabbData[i].set(topLevel_aabb_array[iX4 + 0], topLevel_aabb_array[iX4 + 1],
			topLevel_aabb_array[iX4 + 2], topLevel_aabb_array[iX4 + 3]);
	}
} // end function updateTopLevel_BVH()



// called automatically from within the animate() function (located in InitCommon.js file)
function updateVariablesAndUniforms()
{
	if ( !inGame )
	{
		if (keyPressed('Enter') && canPressEnter)
		{
			canPressEnter = false;
			useGenericInput = false;
			inGame = true;
			playingStartGameAnimation = true;
			viewRaySphereRadius = 0.01;
			//pathTracingUniforms.uViewRaySphereRadius.value = 0.01;

			animationOldPosition.copy(cameraControlsObject.position);
			animationTargetPosition.copy(game_Objects[playerRobotIndex].position);
			animationTargetPosition.y += 4;

			/* // the following points the player's robot towards the middle of the landscape
			cameraControlsYawObject.rotation.set(0, 0, 0);
			cameraControlsPitchObject.rotation.set(0, 0, 0);
			targetVector.copy(game_Objects[playerRobotIndex].position);
			targetVector.y = 0;
			targetVector.normalize();
			
			turnAngle = Math.acos(ZVector.dot(targetVector));
			if (game_Objects[playerRobotIndex].position.x < 0)
				turnAngle = (Math.PI * 2) - turnAngle;
			cameraControlsYawObject.rotation.y = turnAngle; */
		}
		if (!keyPressed('Enter') )
		{
			canPressEnter = true;
		}
	

		if (keyPressed('Space') && canPressSpace)
		{
			canPressSpace = false;
			useGenericInput = true;
			inGame = false;

			cameraControlsObject.position.set(0, 140, 450);
			cameraControlsYawObject.rotation.set(0, 0, 0);
			cameraControlsPitchObject.rotation.set(-0.4, 0, 0);
			apertureSize = 0.0;
			pathTracingUniforms.uApertureSize.value = apertureSize;

			buildNewLevel(true);
		}
		if (!keyPressed('Space') )
		{
			canPressSpace = true;
		}

	} // end if ( !inGame )

	if (worldCamera.fov > 30)	
	{
		worldCamera.fov = 30;
		fovScale = worldCamera.fov * 0.5 * (Math.PI / 180.0);
		pathTracingUniforms.uVLen.value = Math.tan(fovScale);
		pathTracingUniforms.uULen.value = pathTracingUniforms.uVLen.value * worldCamera.aspect;
	}
	if (apertureSize > 1.0)
	{
		apertureSize = 1.0;
		pathTracingUniforms.uApertureSize.value = apertureSize;
	}
		
	
	if (inGame)
	{
		doGameLogic();
	}

	if (!useGenericInput)
	{
		// cap FOV to 30 degrees max, similar to original game's 'tense tight view' feeling
		if (increaseFOV)
		{
			worldCamera.fov++;
			if (worldCamera.fov > 30)
				worldCamera.fov = 30;
			fovScale = worldCamera.fov * 0.5 * (Math.PI / 180.0);
			pathTracingUniforms.uVLen.value = Math.tan(fovScale);
			pathTracingUniforms.uULen.value = pathTracingUniforms.uVLen.value * worldCamera.aspect;

			cameraIsMoving = true;
			increaseFOV = false;
		}
		if (decreaseFOV)
		{
			worldCamera.fov--;
			if (worldCamera.fov < 1)
				worldCamera.fov = 1;
			fovScale = worldCamera.fov * 0.5 * (Math.PI / 180.0);
			pathTracingUniforms.uVLen.value = Math.tan(fovScale);
			pathTracingUniforms.uULen.value = pathTracingUniforms.uVLen.value * worldCamera.aspect;

			cameraIsMoving = true;
			decreaseFOV = false;
		}

		if (keyPressed('ArrowRight') && !keyPressed('ArrowLeft'))
		{
			increaseAperture = true;
		}
		if (keyPressed('ArrowLeft') && !keyPressed('ArrowRight'))
		{
			decreaseAperture = true;
		}
		if (increaseAperture)
		{
			apertureSize += 0.01;
			if (apertureSize > 1.0)
				apertureSize = 1.0;
			pathTracingUniforms.uApertureSize.value = apertureSize;
			cameraIsMoving = true;
			increaseAperture = false;
		}
		if (decreaseAperture)
		{
			apertureSize -= 0.01;
			if (apertureSize < 0.0)
				apertureSize = 0.0;
			pathTracingUniforms.uApertureSize.value = apertureSize;
			cameraIsMoving = true;
			decreaseAperture = false;
		}
	} // end if (!useGenericInput)

	
	// SUN
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

	// update all other uniforms
	pathTracingUniforms.uViewRaySphereRadius.value = viewRaySphereRadius;
	pathTracingUniforms.uDissolveEffectStrength.value = dissolveEffectStrength;


	// INFO

	if (inGame)
		cameraInfoElement.innerHTML += "player Energy: " + playerUnitsOfEnergy + "<br>" + "FOV: " + worldCamera.fov + " / Aperture: " + apertureSize.toFixed(2) +
		" / FocusDistance: " + focusDistance.toFixed(1) + "<br>" + "Click to start | " + "Press SPACEBAR to generate new landscape | Press ENTER to enter landscape" + "<br>" +
		"Press T: place Tree | B: place Boulder | R: place Robot | E: Enter another robot | Click: Absorb object" + "<br>" +
		"Press H: Hyperspace to random tile- warning, costs 3 energy! | Hyperspace while standing on Sentinel's pedestal to Win!";
	else
		cameraInfoElement.innerHTML = "player Energy: " + playerUnitsOfEnergy + "<br>" + "FOV: " + worldCamera.fov + " / Aperture: " + apertureSize.toFixed(2) +
		" / FocusDistance: " + focusDistance.toFixed(1) + "<br>" + "Click to start | " + "Press SPACEBAR to generate new landscape | Press ENTER to enter landscape" + "<br>" +
		"Press T: place Tree | B: place Boulder | R: place Robot | E: Enter another robot | Click: Absorb object" + "<br>" + 
		"Press H: Hyperspace to random tile- warning, costs 3 energy! | Hyperspace while standing on Sentinel's pedestal to Win!";
			

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
