function doGameLogic()
{
        // get player Input
        if (keyboard.pressed('T') && canPressT && !keyboard.pressed('B') && !keyboard.pressed('R'))
        {
                if (playerUnitsOfEnergy > 0 && raycastIndex >= 0 && tiles[raycastIndex].code != 'connector' && 
                        tiles[raycastIndex].code != 'flipped' && tiles[raycastIndex].occupied == '')
                {
                        gameObjectIndex++;

                        vertexIndex = raycastIndex * 18;

                        game_Objects[gameObjectIndex].tag = "TREE_MODEL_ID";
                        game_Objects[gameObjectIndex].level = tiles[raycastIndex].level;
                        game_Objects[gameObjectIndex].tileIndex = raycastIndex;
                        tiles[raycastIndex].occupied = 'tree';
                        tiles[raycastIndex].occupiedIndex = gameObjectIndex;

                        game_Objects[gameObjectIndex].position.set(landscape_vpa[vertexIndex + 0] + 5,
                                landscape_vpa[vertexIndex + 1] + 0,
                                landscape_vpa[vertexIndex + 2] + 5);
                        game_Objects[gameObjectIndex].position.y += 9;

                        game_Objects[gameObjectIndex].rotation.y = Math.random() * Math.PI * 2;
                        game_Objects[gameObjectIndex].updateMatrixWorld(true);
                        objInvMatrices[gameObjectIndex].copy(game_Objects[gameObjectIndex].matrixWorld).invert();
                        objInvMatrices[gameObjectIndex].elements[15] = TREE_MODEL_ID;

                        playerUnitsOfEnergy -= 1;

                        updateTopLevel_BVH();
                }
                else if (playerUnitsOfEnergy > 0 && selectedObjectIndex >= 0 && game_Objects[selectedObjectIndex].tag == 'BOULDER_MODEL_ID')
                {
                        gameObjectIndex++;

                        game_Objects[gameObjectIndex].tag = "TREE_MODEL_ID";
                        game_Objects[gameObjectIndex].level = game_Objects[selectedObjectIndex].level + 5; // stacked on top of a boulder
                        game_Objects[gameObjectIndex].tileIndex = game_Objects[selectedObjectIndex].tileIndex;
                        tiles[game_Objects[gameObjectIndex].tileIndex].stackedObjectIDs.push(gameObjectIndex);

                        game_Objects[gameObjectIndex].position.copy(game_Objects[selectedObjectIndex].position);
                        game_Objects[gameObjectIndex].position.y = game_Objects[gameObjectIndex].level + 9;

                        game_Objects[gameObjectIndex].rotation.y = Math.random() * Math.PI * 2;
                        game_Objects[gameObjectIndex].updateMatrixWorld(true);
                        objInvMatrices[gameObjectIndex].copy(game_Objects[gameObjectIndex].matrixWorld).invert();
                        objInvMatrices[gameObjectIndex].elements[15] = TREE_MODEL_ID;

                        playerUnitsOfEnergy -= 1;

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
                if (playerUnitsOfEnergy > 1 && raycastIndex >= 0 && tiles[raycastIndex].code != 'connector' && 
                        tiles[raycastIndex].code != 'flipped' && tiles[raycastIndex].occupied == '')
                {
                        gameObjectIndex++;

                        vertexIndex = raycastIndex * 18;

                        game_Objects[gameObjectIndex].tag = "BOULDER_MODEL_ID";
                        game_Objects[gameObjectIndex].level = tiles[raycastIndex].level;
                        game_Objects[gameObjectIndex].tileIndex = raycastIndex;
                        tiles[raycastIndex].occupied = 'boulder';
                        tiles[raycastIndex].occupiedIndex = gameObjectIndex;
                        tiles[raycastIndex].stackedObjectIDs.push(gameObjectIndex);

                        game_Objects[gameObjectIndex].position.set(landscape_vpa[vertexIndex + 0] + 5,
                                landscape_vpa[vertexIndex + 1] + 0,
                                landscape_vpa[vertexIndex + 2] + 5);
                        game_Objects[gameObjectIndex].position.y += 2.5;

                        game_Objects[gameObjectIndex].rotation.y = Math.random() * Math.PI * 2;
                        game_Objects[gameObjectIndex].updateMatrixWorld(true);
                        objInvMatrices[gameObjectIndex].copy(game_Objects[gameObjectIndex].matrixWorld).invert();
                        objInvMatrices[gameObjectIndex].elements[15] = BOULDER_MODEL_ID;

                        playerUnitsOfEnergy -= 2;
                        
                        updateTopLevel_BVH();
                }
                else if (playerUnitsOfEnergy > 1 && selectedObjectIndex >= 0 && game_Objects[selectedObjectIndex].tag == 'BOULDER_MODEL_ID')
                {
                        gameObjectIndex++;

                        game_Objects[gameObjectIndex].tag = "BOULDER_MODEL_ID";
                        game_Objects[gameObjectIndex].level = game_Objects[selectedObjectIndex].level + 5; // stacked on top of another boulder
                        game_Objects[gameObjectIndex].tileIndex = game_Objects[selectedObjectIndex].tileIndex;
                        tiles[game_Objects[gameObjectIndex].tileIndex].stackedObjectIDs.push(gameObjectIndex);

                        game_Objects[gameObjectIndex].position.copy(game_Objects[selectedObjectIndex].position);
                        game_Objects[gameObjectIndex].position.y = game_Objects[gameObjectIndex].level;
                        game_Objects[gameObjectIndex].position.y += 2.5;

                        game_Objects[gameObjectIndex].rotation.y = Math.random() * Math.PI * 2;
                        game_Objects[gameObjectIndex].updateMatrixWorld(true);
                        objInvMatrices[gameObjectIndex].copy(game_Objects[gameObjectIndex].matrixWorld).invert();
                        objInvMatrices[gameObjectIndex].elements[15] = BOULDER_MODEL_ID;

                        playerUnitsOfEnergy -= 2;

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
                if (playerUnitsOfEnergy > 2 && raycastIndex >= 0 && tiles[raycastIndex].code != 'connector' && 
                        tiles[raycastIndex].code != 'flipped' && tiles[raycastIndex].occupied == '')
                {
                        gameObjectIndex++;

                        vertexIndex = raycastIndex * 18;

                        game_Objects[gameObjectIndex].tag = "ROBOT_MODEL_ID";
                        game_Objects[gameObjectIndex].level = tiles[raycastIndex].level;
                        game_Objects[gameObjectIndex].tileIndex = raycastIndex;
                        tiles[raycastIndex].occupied = 'robot';
                        tiles[raycastIndex].occupiedIndex = gameObjectIndex;

                        game_Objects[gameObjectIndex].position.set(landscape_vpa[vertexIndex + 0] + 5,
                                landscape_vpa[vertexIndex + 1] + 0,
                                landscape_vpa[vertexIndex + 2] + 5);
                        game_Objects[gameObjectIndex].position.y += 4.6;

                        game_Objects[gameObjectIndex].rotation.y = cameraControlsYawObject.rotation.y;

                        game_Objects[gameObjectIndex].updateMatrixWorld(true); // required for writing to uniforms below

                        objInvMatrices[gameObjectIndex].copy(game_Objects[gameObjectIndex].matrixWorld).invert();
                        objInvMatrices[gameObjectIndex].elements[15] = ROBOT_MODEL_ID;

                        playerUnitsOfEnergy -= 3;
                        
                        updateTopLevel_BVH();
                }
                else if (playerUnitsOfEnergy > 2 && selectedObjectIndex >= 0 && game_Objects[selectedObjectIndex].tag == 'BOULDER_MODEL_ID')
                {
                        gameObjectIndex++;

                        game_Objects[gameObjectIndex].tag = "ROBOT_MODEL_ID";
                        game_Objects[gameObjectIndex].level = game_Objects[selectedObjectIndex].level + 5; // stacked on top of a boulder
                        game_Objects[gameObjectIndex].tileIndex = game_Objects[selectedObjectIndex].tileIndex;
                        tiles[game_Objects[gameObjectIndex].tileIndex].stackedObjectIDs.push(gameObjectIndex);

                        game_Objects[gameObjectIndex].position.copy(game_Objects[selectedObjectIndex].position);
                        game_Objects[gameObjectIndex].position.y = game_Objects[gameObjectIndex].level;
                        game_Objects[gameObjectIndex].position.y += 4.6;

                        game_Objects[gameObjectIndex].rotation.y = cameraControlsYawObject.rotation.y;
                        game_Objects[gameObjectIndex].updateMatrixWorld(true);
                        objInvMatrices[gameObjectIndex].copy(game_Objects[gameObjectIndex].matrixWorld).invert();
                        objInvMatrices[gameObjectIndex].elements[15] = ROBOT_MODEL_ID;

                        playerUnitsOfEnergy -= 3;

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
		else if (selectedObjectIndex >= 0 && game_Objects[selectedObjectIndex].tag == 'ROBOT_MODEL_ID')
		{
			tiles[game_Objects[playerRobotIndex].tileIndex].occupied = 'robot';
			tiles[game_Objects[selectedObjectIndex].tileIndex].occupied = 'playerRobot';
			playerRobotIndex = selectedObjectIndex;

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
        selectedObjectIndex = -10; // reset index

        for (let i = 0; i <= gameObjectIndex; i++)
        {
                if (i == playerRobotIndex)
                        continue;
		if (game_Objects[i].tag == 'TREE_MODEL_ID' && game_Objects[i].level < game_Objects[playerRobotIndex].level)
			continue;

                if (raycaster.ray.intersectBox(gameObject_boundingBoxes[i], hitPoint) != null)
                {
                        testD = raycaster.ray.origin.distanceTo(hitPoint);
                        if (testD < closestT)
                        {
                                closestT = testD;
                                selectedObjectIndex = i;
                                closestHitPoint.copy(hitPoint);
                        }
                }
        }
        
        if (closestT < Infinity)
        {
                cameraInfoElement.innerHTML = "object: " + game_Objects[selectedObjectIndex].tag + ": " + selectedObjectIndex + "<br>";
                viewRayTargetPosition.copy(closestHitPoint);
                focusDistance = closestT; 
        }

        if (selectedObjectIndex >= 0)
        {
		testIndex = game_Objects[selectedObjectIndex].tileIndex;

		// check if the selected object (except boulder or robot) is on a different level than us - if so, disregard highlighting selection
		if (game_Objects[selectedObjectIndex].tag != 'BOULDER_MODEL_ID' && game_Objects[selectedObjectIndex].tag != 'ROBOT_MODEL_ID')
		{
			if (game_Objects[selectedObjectIndex].level >= game_Objects[playerRobotIndex].level )
				selectedObjectIndex = -10;
		}
		// if boulder was selected, check if the selected boulder is the top of its stack. If not, disregard selection
		if (tiles[testIndex].stackedObjectIDs.length > 1 &&
			selectedObjectIndex != tiles[testIndex].stackedObjectIDs[tiles[testIndex].stackedObjectIDs.length - 1])
		{
			selectedObjectIndex = -10;
		}
	} // end if (selectedObjectIndex >= 0)

        

        // raycast landscape terrain
        intersectArray.length = 0;
        raycaster.intersectObject(planeMesh, false, intersectArray);
	selectedTileIndex = -10; // reset index
	raycastIndex = -10; // reset index
        if (intersectArray.length > 0 && intersectArray[0].distance < closestT)
        {
                raycastIndex = Math.floor(intersectArray[0].face.a / 6);
                selectedObjectIndex = tiles[raycastIndex].occupiedIndex;
                if (tiles[raycastIndex].stackedObjectIDs.length > 1 || selectedObjectIndex == playerRobotIndex)
                        selectedObjectIndex = -10;

                if (tiles[raycastIndex].code != 'connector' && tiles[raycastIndex].code != 'flipped')
                {  
                        if (Math.cos(blinkAngle % (Math.PI * 2)) > 0)
                        {
                                if (intersectArray[0].face.a % 6 > 0)
                                        selectedTileIndex = ((intersectArray[0].face.a - 3) / 3) * 8;
                                else selectedTileIndex = (intersectArray[0].face.a / 3) * 8;
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
        
        pathTracingUniforms.uSelectedTileIndex.value = selectedTileIndex;
        pathTracingUniforms.uSelectedObjectIndex.value = selectedObjectIndex;

} // end function doGameLogic()


function onDocumentMouseDown(event)
{
	if ( !inGame || keyboard.pressed('R') || keyboard.pressed('E') || 
		keyboard.pressed('B') || keyboard.pressed('T') || keyboard.pressed('space') || keyboard.pressed('enter') )
                return;

        event.preventDefault();
        
        // Player has Absorbed an item

        // remove a gameObject from anywhere inside the array list. Starting at the selectObject index,
        // do a deep copy of each gameObject's higher neighbor element, essentially shortening the gameObject array by 1 element
        if (selectedObjectIndex >= 0 && game_Objects[selectedObjectIndex].tag != 'PEDESTAL_MODEL_ID')
	{
                if (game_Objects[selectedObjectIndex].tag == 'TREE_MODEL_ID')
                        playerUnitsOfEnergy += 1;
                else if (game_Objects[selectedObjectIndex].tag == 'MEANIE_MODEL_ID')
                        playerUnitsOfEnergy += 1;
                else if (game_Objects[selectedObjectIndex].tag == 'BOULDER_MODEL_ID')
                        playerUnitsOfEnergy += 2;
                else if (game_Objects[selectedObjectIndex].tag == 'ROBOT_MODEL_ID')
                        playerUnitsOfEnergy += 3;
                else if (game_Objects[selectedObjectIndex].tag == 'SENTRY_MODEL_ID')
                        playerUnitsOfEnergy += 3;
                else if (game_Objects[selectedObjectIndex].tag == 'SENTINEL_MODEL_ID')
                        playerUnitsOfEnergy += 4;

		testIndex = game_Objects[selectedObjectIndex].tileIndex;
                
                if (tiles[testIndex].stackedObjectIDs.length > 0)
                        tiles[testIndex].stackedObjectIDs.length -= 1;
                
                if (tiles[testIndex].stackedObjectIDs.length == 0)
                {
                        tiles[testIndex].occupied = '';
                        tiles[testIndex].occupiedIndex = -10;
                }
                
                if (playerRobotIndex > selectedObjectIndex)
                        playerRobotIndex -= 1;
                
                for (let i = selectedObjectIndex; i < gameObjectIndex; i++)
                {
                        if ((i + 1) == tiles[game_Objects[i + 1].tileIndex].occupiedIndex)
                        {
                                for (let j = 0; j < tiles[game_Objects[i + 1].tileIndex].stackedObjectIDs.length; j++)
                                {
                                        tiles[game_Objects[i + 1].tileIndex].stackedObjectIDs[j] -= 1;
                                }

                                tiles[game_Objects[i + 1].tileIndex].occupiedIndex -= 1;
                        }
                        
                        game_Objects[i].tag = game_Objects[i + 1].tag;
                        game_Objects[i].level = game_Objects[i + 1].level;
                        game_Objects[i].tileIndex = game_Objects[i + 1].tileIndex;
                        game_Objects[i].position.copy(game_Objects[i + 1].position);
                        game_Objects[i].rotation.copy(game_Objects[i + 1].rotation);
                        game_Objects[i].updateMatrixWorld(true);

                        objInvMatrices[i].copy(objInvMatrices[i + 1]);
                }

                gameObjectIndex -= 1; // now that the item has been removed, decrease gameObjectIndex by 1
                updateTopLevel_BVH();
	}

} // end function onDocumentMouseDown(event)
