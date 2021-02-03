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

                        game_Objects[gameObjectCount].position.set(landscape_vpa[vertexIndex + 0] + 5,
                                landscape_vpa[vertexIndex + 1] + 9,
                                landscape_vpa[vertexIndex + 2] + 5);

                        game_Objects[gameObjectCount].rotateOnAxis(upVector, Math.random() * Math.PI * 2);
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

                        game_Objects[gameObjectCount].position.set(landscape_vpa[vertexIndex + 0] + 5,
                                landscape_vpa[vertexIndex + 1] + 9,
                                landscape_vpa[vertexIndex + 2] + 5);
                        game_Objects[gameObjectCount].position.y -= 6.5;

                        game_Objects[gameObjectCount].rotateOnAxis(upVector, Math.random() * Math.PI * 2);
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
                if (tiles[raycastIndex].occupied == 'robot' || (selectedObject >= 0 && game_Objects[selectedObject].tag == 'ROBOT_MODEL_ID'))
                {
                        for (let i = 0; i < 64; i++)
                        {
                                if (game_Objects[i].tileIndex == raycastIndex)
                                {
                                        playerRobotIndex = i;
                                        break;
                                }
                        }

                        if (selectedObject >= 0 && game_Objects[selectedObject].tag == 'ROBOT_MODEL_ID')
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
                if (i == playerRobotIndex || (game_Objects[i].tag != 'ROBOT_MODEL_ID' && game_Objects[i].tag != 'BOULDER_MODEL_ID') ) 
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
        

        // raycast landscape terrain
        intersectArray.length = 0;
        raycaster.intersectObject(planeMesh, false, intersectArray);
        selectedTile = -10;
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

                cameraInfoElement.innerHTML = "tile code: " + tiles[raycastIndex].code + " | level: " + tiles[raycastIndex].level.toFixed(0) +
                        " | occupied: " + tiles[raycastIndex].occupied + "<br>";
                viewRayTargetPosition.copy(intersectArray[0].point);
                viewRayTargetPosition.add(intersectArray[0].face.normal.multiplyScalar(2));
                focusDistance = intersectArray[0].distance;
        }
        
        pathTracingUniforms.uSelectedTile.value = selectedTile;
        pathTracingUniforms.uSelectedObject.value = selectedObject;

} // end doGameLogic()
