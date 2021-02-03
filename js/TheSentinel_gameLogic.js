function doGameLogic()
{
        // get player Input
        if (keyboard.pressed('T') && canPressT && !keyboard.pressed('B') && !keyboard.pressed('R'))
        {
                if (tiles[raycastIndex].code != 'connector' && tiles[raycastIndex].code != 'flipped' &&
                        tiles[raycastIndex].occupied == '')
                {
                        vertexIndex = raycastIndex * 18;

                        game_Objects[gameObjectCount].tag = "TREE_MODEL_ID";
                        game_Objects[gameObjectCount].tileIndex = raycastIndex;
                        tiles[raycastIndex].occupied = 'tree';
                        tiles[raycastIndex].occupiedIndex = gameObjectCount;

                        game_Objects[gameObjectCount].position.set(landscape_vpa[vertexIndex + 0] + 5,
                                landscape_vpa[vertexIndex + 1] + 9,
                                landscape_vpa[vertexIndex + 2] + 5);

                        game_Objects[gameObjectCount].rotation.y = Math.random() * Math.PI * 2;
                        game_Objects[gameObjectCount].updateMatrixWorld(true);
                        objInvMatrices[gameObjectCount].copy(game_Objects[gameObjectCount].matrixWorld).invert();
                        objInvMatrices[gameObjectCount].elements[15] = TREE_MODEL_ID;

                        gameObjectCount++;

                        updateTopLevel_BVH();
                }

                canPressT = false;
        }
        if (!keyboard.pressed('T'))
        {
                canPressT = true;
        }

        if (keyboard.pressed('B') && canPressB && !keyboard.pressed('T') && !keyboard.pressed('R'))
        {
                if (tiles[raycastIndex].code != 'connector' && tiles[raycastIndex].code != 'flipped' &&
                        tiles[raycastIndex].occupied == '')
                {
                        vertexIndex = raycastIndex * 18;

                        game_Objects[gameObjectCount].tag = "BOULDER_MODEL_ID";
                        game_Objects[gameObjectCount].tileIndex = raycastIndex;
                        tiles[raycastIndex].occupied = 'boulder';
                        tiles[raycastIndex].occupiedIndex = gameObjectCount;

                        game_Objects[gameObjectCount].position.set(landscape_vpa[vertexIndex + 0] + 5,
                                landscape_vpa[vertexIndex + 1] + 9,
                                landscape_vpa[vertexIndex + 2] + 5);
                        game_Objects[gameObjectCount].position.y -= 6.5;

                        game_Objects[gameObjectCount].rotation.y = Math.random() * Math.PI * 2;
                        game_Objects[gameObjectCount].updateMatrixWorld(true);
                        objInvMatrices[gameObjectCount].copy(game_Objects[gameObjectCount].matrixWorld).invert();
                        objInvMatrices[gameObjectCount].elements[15] = BOULDER_MODEL_ID;

                        gameObjectCount++;

                        updateTopLevel_BVH();
                }

                canPressB = false;
        }
        if (!keyboard.pressed('B'))
        {
                canPressB = true;
        }

        if (keyboard.pressed('R') && canPressR && !keyboard.pressed('B') && !keyboard.pressed('T'))
        {
                if (tiles[raycastIndex].code != 'connector' && tiles[raycastIndex].code != 'flipped' &&
                        tiles[raycastIndex].occupied == '')
                {
                        vertexIndex = raycastIndex * 18;

                        game_Objects[gameObjectCount].tag = "ROBOT_MODEL_ID";
                        game_Objects[gameObjectCount].tileIndex = raycastIndex;
                        tiles[raycastIndex].occupied = 'robot';
                        tiles[raycastIndex].occupiedIndex = gameObjectCount;

                        game_Objects[gameObjectCount].position.set(landscape_vpa[vertexIndex + 0] + 5,
                                landscape_vpa[vertexIndex + 1] + 9,
                                landscape_vpa[vertexIndex + 2] + 5);
                        game_Objects[gameObjectCount].position.y -= 4.4;

                        game_Objects[gameObjectCount].rotation.y = cameraControlsYawObject.rotation.y;

                        game_Objects[gameObjectCount].updateMatrixWorld(true); // required for writing to uniforms below

                        objInvMatrices[gameObjectCount].copy(game_Objects[gameObjectCount].matrixWorld).invert();
                        objInvMatrices[gameObjectCount].elements[15] = ROBOT_MODEL_ID;

                        gameObjectCount++;

                        updateTopLevel_BVH();
                }

                canPressR = false;
        }
        if (!keyboard.pressed('R'))
        {
                canPressR = true;
        }

        if (keyboard.pressed('E') && canPressE)
        {
		if (raycastIndex >= 0 && tiles[raycastIndex].occupied == 'robot')
                {
			tiles[game_Objects[playerRobotIndex].tileIndex].occupied = 'robot';
			tiles[raycastIndex].occupied = 'playerRobot';
                        playerRobotIndex = tiles[raycastIndex].occupiedIndex;    

                        cameraControlsObject.position.copy(game_Objects[playerRobotIndex].position);
                        cameraControlsObject.position.y += 4;
                        cameraControlsYawObject.rotation.y = game_Objects[playerRobotIndex].rotation.y;
                        cameraControlsYawObject.rotation.y += Math.PI;
                        cameraControlsPitchObject.rotation.x = 0;
		}
		else if (selectedObject >= 0 && game_Objects[selectedObject].tag == 'ROBOT_MODEL_ID')
		{
			tiles[game_Objects[playerRobotIndex].tileIndex].occupied = 'robot';
			tiles[game_Objects[selectedObject].tileIndex].occupied = 'playerRobot';
			playerRobotIndex = selectedObject;

			cameraControlsObject.position.copy(game_Objects[playerRobotIndex].position);
			cameraControlsObject.position.y += 4;
			cameraControlsYawObject.rotation.y = game_Objects[playerRobotIndex].rotation.y;
			cameraControlsYawObject.rotation.y += Math.PI;
			cameraControlsPitchObject.rotation.x = 0;
		}

                canPressE = false;
        }
        if (!keyboard.pressed('E'))
        {
                canPressE = true;
        }

        
        // rotate player's robot to match mouse rotation
        game_Objects[playerRobotIndex].rotation.y = cameraControlsYawObject.rotation.y;
        // initial robot model is facing us (which is backwards), 
        //   so we must turn it around in order for our robot to look where our camera is looking
        game_Objects[playerRobotIndex].rotation.y += Math.PI;
        game_Objects[playerRobotIndex].updateMatrixWorld(true); // required for writing to uniforms below

        objInvMatrices[playerRobotIndex].copy(game_Objects[playerRobotIndex].matrixWorld).invert();
        objInvMatrices[playerRobotIndex].elements[15] = ROBOT_MODEL_ID;


        raycaster.set(cameraControlsObject.position, cameraDirectionVector);
        cameraInfoElement.innerHTML = "no intersection" + "<br>";
        viewRayTargetPosition.set(100000, 100000, 100000);

        // raycast game objects
        testD = Infinity;
        closestT = Infinity;
        selectedObject = -10;

        for (let i = 0; i < 64; i++)
        {
		if (i == playerRobotIndex || game_Objects[i].tileIndex < 0 || (game_Objects[i].tag != 'ROBOT_MODEL_ID' && 
		   game_Objects[i].tag != 'BOULDER_MODEL_ID' && tiles[ game_Objects[i].tileIndex ].level <= tiles[ game_Objects[playerRobotIndex].tileIndex ].level) )
                        continue;

                if (raycaster.ray.intersectBox(gameObject_boundingBoxes[i], hitPoint) != null)
                {
                        testD = raycaster.ray.origin.distanceTo(hitPoint);
                        if (testD < closestT)
                        {
                                closestT = testD;
                                selectedObject = i;
                                closestHitPoint.copy(hitPoint);
                        }
                }
        }
        
        if (closestT < Infinity)
        {
                cameraInfoElement.innerHTML = "object: " + game_Objects[selectedObject].tag + ": " + selectedObject + "<br>";
                viewRayTargetPosition.copy(closestHitPoint);
                focusDistance = closestT; 
        }
	
	// check if the selected object (except boulder or robot) is on a different level than us - if so, disregard
	if (selectedObject >= 0 && game_Objects[selectedObject].tag != 'BOULDER_MODEL_ID' && game_Objects[selectedObject].tag != 'ROBOT_MODEL_ID')
	{
		selectedObject = -10;
	}
	

        // raycast landscape terrain
        intersectArray.length = 0;
        raycaster.intersectObject(planeMesh, false, intersectArray);
	selectedTile = -10; // reset index
	raycastIndex = -10; // reset index
        if (intersectArray.length > 0 && intersectArray[0].distance < closestT)
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

                cameraInfoElement.innerHTML = "DEBUG tile index:" + raycastIndex + " | tile code:" + tiles[raycastIndex].code + " | level:" + tiles[raycastIndex].level.toFixed(0) +
                        " | occupied:" + tiles[raycastIndex].occupied + " | occupiedIndex:" + tiles[raycastIndex].occupiedIndex + "<br>";
                viewRayTargetPosition.copy(intersectArray[0].point);
                viewRayTargetPosition.add(intersectArray[0].face.normal.multiplyScalar(2));
                focusDistance = intersectArray[0].distance;
        }
        
        pathTracingUniforms.uSelectedTile.value = selectedTile;
        pathTracingUniforms.uSelectedObject.value = selectedObject;

} // end function doGameLogic()


function onDocumentMouseDown(event)
{
	if ( !inGame || keyboard.pressed('R') || keyboard.pressed('E') || 
		keyboard.pressed('B') || keyboard.pressed('T') || keyboard.pressed('space') || keyboard.pressed('enter') )
                return;

	event.preventDefault();
	
	if (selectedObject >= 0)
	{
		absorbedIndex = selectedObject;
		game_Objects[absorbedIndex].rotation.z += Math.PI * 0.5; // temporary debug action to see if mousebutton interaction is working
		game_Objects[absorbedIndex].updateMatrixWorld(true); // required for writing to uniforms below

		objInvMatrices[absorbedIndex].copy(game_Objects[absorbedIndex].matrixWorld).invert();
		if (game_Objects[absorbedIndex].tag == 'ROBOT_MODEL_ID')
			objInvMatrices[absorbedIndex].elements[15] = ROBOT_MODEL_ID;
		else if (game_Objects[absorbedIndex].tag == 'TREE_MODEL_ID')
			objInvMatrices[absorbedIndex].elements[15] = TREE_MODEL_ID;
		else if (game_Objects[absorbedIndex].tag == 'BOULDER_MODEL_ID')
			objInvMatrices[absorbedIndex].elements[15] = BOULDER_MODEL_ID;
	}
	else if (raycastIndex >= 0 && tiles[raycastIndex].occupied != '' && tiles[raycastIndex].occupied != 'playerRobot')
	{
		absorbedIndex = tiles[raycastIndex].occupiedIndex;
		game_Objects[absorbedIndex].rotation.z += Math.PI * 0.5; // temporary debug action to see if mousebutton interaction is working
		game_Objects[absorbedIndex].updateMatrixWorld(true); // required for writing to uniforms below

		objInvMatrices[absorbedIndex].copy(game_Objects[absorbedIndex].matrixWorld).invert();
		if (game_Objects[absorbedIndex].tag == 'ROBOT_MODEL_ID')
			objInvMatrices[absorbedIndex].elements[15] = ROBOT_MODEL_ID;
		else if (game_Objects[absorbedIndex].tag == 'TREE_MODEL_ID')
			objInvMatrices[absorbedIndex].elements[15] = TREE_MODEL_ID;
		else if (game_Objects[absorbedIndex].tag == 'BOULDER_MODEL_ID')
			objInvMatrices[absorbedIndex].elements[15] = BOULDER_MODEL_ID;
	}

} // end function onDocumentMouseDown(event)
