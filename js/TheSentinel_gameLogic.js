function doGameLogic()
{
	// rotate the Sentinel and her Sentries(if any)
	for (let i = 1; i <= 1 + numOfSentries; i++)
	{
		if (game_Objects[i].tag == 'SENTINEL_MODEL_ID' || game_Objects[i].tag == 'SENTRY_MODEL_ID')
		{
			// will complete 1 total revolution (2 PI radians) every 120 seconds (2 minutes)
			game_Objects[i].rotation.y += sentinelTurnAngle * frameTime;
			game_Objects[i].rotation.y %= (Math.PI * 2);
			game_Objects[i].updateMatrixWorld(true); // required for writing to uniforms below

			uObj3D_InvMatrices[i].copy(game_Objects[i].matrixWorld).invert();
			if (i == 1)
				uObj3D_InvMatrices[i].elements[15] = SENTINEL_MODEL_ID;
			else
				uObj3D_InvMatrices[i].elements[15] = SENTRY_MODEL_ID;
		}
	}

	// see if player's robot is within Sentinel's narrow field of view
	game_Objects[1].getWorldDirection(sentinelFacingVec);
	testVec.copy(game_Objects[playerRobotIndex].position);
	testVec.sub(game_Objects[1].position);
	testVec.y = 0;
	testVec.normalize();
	if ( THREE.MathUtils.radToDeg(sentinelFacingVec.angleTo(testVec)) < 20)
		playerHeadIsVisibleToSentinel = true;
	else playerHeadIsVisibleToSentinel = false;

	if (!playingTeleportAnimation)
	{
		// raycast backwards from player's head toward the Sentinel to see if we are visible or partially visible to her.
		// Also, to be visible/partially visible, our player robot must be within the Sentinel's narrow field of view
		playerHeadPos.copy(game_Objects[playerRobotIndex].position);
		playerHeadPos.y += 4;
		playerHeadToEnemyVec.copy(game_Objects[1].position);
		playerHeadToEnemyVec.y += 4.5;
		playerHeadToEnemyVec.sub(playerHeadPos).normalize();
		raycaster.set(playerHeadPos, playerHeadToEnemyVec);
		raycaster.ray.intersectBox(gameObject_boundingBoxes[1], hitPoint);
		closestT = raycaster.ray.origin.distanceTo(hitPoint);

		playerTileIsVisibleToSentinel = false; // reset flag
		// check if any other game objects are blocking the Sentinel's line of sight towards player's head
		for (let i = 0; i <= gameObjectIndex; i++)
		{
			if (i == playerRobotIndex || i == 1)
				continue;

			if (raycaster.ray.intersectBox(gameObject_boundingBoxes[i], hitPoint) != null)
			{
				testD = raycaster.ray.origin.distanceTo(hitPoint);
				if (testD < closestT)
				{
					playerHeadIsVisibleToSentinel = false;
				}
			}
		}
		// check if any part of the terrain is blocking the Sentinel's line of sight towards player's head
		// now raycast landscape terrain
		intersectArray.length = 0;
		raycaster.intersectObject(planeMesh, false, intersectArray);
		if (intersectArray.length > 0 && intersectArray[0].distance < closestT)
			playerHeadIsVisibleToSentinel = false;

		// only if player's head is visible to the Sentinel do we want to further check if the tile the player's robot 
		// is standing on is also visible.  If so, start draining player's energy.
		if (playerHeadIsVisibleToSentinel)
		{
			playerTilePos.copy(game_Objects[playerRobotIndex].position);
			playerTilePos.y -= 4.5;
			playerTileToEnemyVec.copy(game_Objects[1].position);
			playerTileToEnemyVec.y += 4.5;
			playerTileToEnemyVec.sub(playerTilePos).normalize();
			raycaster.set(playerTilePos, playerTileToEnemyVec);
			raycaster.ray.intersectBox(gameObject_boundingBoxes[1], hitPoint);
			closestT = raycaster.ray.origin.distanceTo(hitPoint);
			playerTileIsVisibleToSentinel = true;

			// check if any other game objects are blocking the Sentinel's line of sight towards player's tile
			for (let i = 0; i <= gameObjectIndex; i++)
			{
				if (i == playerRobotIndex || i == 1 || game_Objects[i].tileIndex == game_Objects[playerRobotIndex].tileIndex)
					continue;

				if (raycaster.ray.intersectBox(gameObject_boundingBoxes[i], hitPoint) != null)
				{
					testD = raycaster.ray.origin.distanceTo(hitPoint);
					if (testD < closestT)
					{
						playerTileIsVisibleToSentinel = false;
					}
				}
			}
			// check if any part of the terrain is blocking the Sentinel's line of sight towards player's head
			// now raycast landscape terrain
			intersectArray.length = 0;
			raycaster.intersectObject(planeMesh, false, intersectArray);
			if (intersectArray.length > 0 && intersectArray[0].distance < closestT)
				playerTileIsVisibleToSentinel = false;
		}

	} // end if (!playingTeleportAnimation)
	

	cameraInfoElement.innerHTML = "DEBUG: Sentinel sees your Head: " + playerHeadIsVisibleToSentinel + 
					" | Sentinel sees your standingTile/Boulder: " + playerTileIsVisibleToSentinel + "<br>";



	// if doing any animations, temporarily skip player input until the animation is finished
	if (playingStartGameAnimation)
	{
		doStartGameAnimation();
		return;
	}
	if (playingTeleportAnimation)
	{
		doTeleportAnimation();
		return;
	}
	if (playingLoseAnimation)
	{
		doLoseAnimation();
		return;
	}
	if (playingWinAnimation)
	{
		doWinAnimation();
		return;
	}
	if (doingDissolveEffect)
	{
		doDissolveEffect();
		return;
	}
	if (doingResolveEffect)
	{
		doResolveEffect();
		return;
	}


	// otherwise if no animations are playing, get player Input during game mode

	if (keyPressed('KeyT') && canPressT && !keyPressed('KeyB') && !keyPressed('KeyR') && raycastIndex != game_Objects[playerRobotIndex].tileIndex)
	{
		canPressT = false;

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
			uObj3D_InvMatrices[gameObjectIndex].copy(game_Objects[gameObjectIndex].matrixWorld).invert();
			uObj3D_InvMatrices[gameObjectIndex].elements[15] = TREE_MODEL_ID;

			playerUnitsOfEnergy -= 1;
			canDoResolveEffect = true;
			updateTopLevel_BVH();
		}
		else if (playerUnitsOfEnergy > 0 && selectedObjectIndex >= 0 && game_Objects[selectedObjectIndex].tag == 'BOULDER_MODEL_ID')
		{
			gameObjectIndex++;

			game_Objects[gameObjectIndex].tag = "TREE_MODEL_ID";
			game_Objects[gameObjectIndex].level = game_Objects[selectedObjectIndex].level + 5; // stacked on top of a boulder
			game_Objects[gameObjectIndex].tileIndex = game_Objects[selectedObjectIndex].tileIndex;

			game_Objects[gameObjectIndex].position.copy(game_Objects[selectedObjectIndex].position);
			game_Objects[gameObjectIndex].position.y = game_Objects[gameObjectIndex].level + 9;

			game_Objects[gameObjectIndex].rotation.y = Math.random() * Math.PI * 2;
			game_Objects[gameObjectIndex].updateMatrixWorld(true);
			uObj3D_InvMatrices[gameObjectIndex].copy(game_Objects[gameObjectIndex].matrixWorld).invert();
			uObj3D_InvMatrices[gameObjectIndex].elements[15] = TREE_MODEL_ID;

			playerUnitsOfEnergy -= 1;
			canDoResolveEffect = true;
			updateTopLevel_BVH();
		}

		if (canDoResolveEffect)
		{
			viewRaySphereRadius = 0.01;
			dissolveEffectStrength = 1.0;
			doingResolveEffect = true;
			pathTracingUniforms.uDoingDissolveEffect.value = doingResolveEffect;
			pathTracingUniforms.uResolvingObjectIndex.value = gameObjectIndex;
		}
		canDoResolveEffect = false;
		
	} // end if (keyPressed('KeyT') && canPressT && !keyPressed('KeyB') && !keyPressed('KeyR'))
	if ( !keyPressed('KeyT') )
	{
		canPressT = true;
	}

	if (keyPressed('KeyB') && canPressB && !keyPressed('KeyT') && !keyPressed('KeyR') && raycastIndex != game_Objects[playerRobotIndex].tileIndex)
	{
		canPressB = false;

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

			game_Objects[gameObjectIndex].position.set(landscape_vpa[vertexIndex + 0] + 5,
				landscape_vpa[vertexIndex + 1] + 0,
				landscape_vpa[vertexIndex + 2] + 5);
			game_Objects[gameObjectIndex].position.y += 2.5;

			game_Objects[gameObjectIndex].rotation.y = Math.random() * Math.PI * 2;
			game_Objects[gameObjectIndex].updateMatrixWorld(true);
			uObj3D_InvMatrices[gameObjectIndex].copy(game_Objects[gameObjectIndex].matrixWorld).invert();
			uObj3D_InvMatrices[gameObjectIndex].elements[15] = BOULDER_MODEL_ID;

			playerUnitsOfEnergy -= 2;
			canDoResolveEffect = true;
			updateTopLevel_BVH();
		}
		else if (playerUnitsOfEnergy > 1 && selectedObjectIndex >= 0 && game_Objects[selectedObjectIndex].tag == 'BOULDER_MODEL_ID')
		{
			gameObjectIndex++;

			game_Objects[gameObjectIndex].tag = "BOULDER_MODEL_ID";
			game_Objects[gameObjectIndex].level = game_Objects[selectedObjectIndex].level + 5; // stacked on top of another boulder
			game_Objects[gameObjectIndex].tileIndex = game_Objects[selectedObjectIndex].tileIndex;

			game_Objects[gameObjectIndex].position.copy(game_Objects[selectedObjectIndex].position);
			game_Objects[gameObjectIndex].position.y = game_Objects[gameObjectIndex].level;
			game_Objects[gameObjectIndex].position.y += 2.5;

			game_Objects[gameObjectIndex].rotation.y = Math.random() * Math.PI * 2;
			game_Objects[gameObjectIndex].updateMatrixWorld(true);
			uObj3D_InvMatrices[gameObjectIndex].copy(game_Objects[gameObjectIndex].matrixWorld).invert();
			uObj3D_InvMatrices[gameObjectIndex].elements[15] = BOULDER_MODEL_ID;

			playerUnitsOfEnergy -= 2;
			canDoResolveEffect = true;
			updateTopLevel_BVH();
		}

		if (canDoResolveEffect)
		{
			viewRaySphereRadius = 0.01;
			dissolveEffectStrength = 1.0;
			doingResolveEffect = true;
			pathTracingUniforms.uDoingDissolveEffect.value = doingResolveEffect;
			pathTracingUniforms.uResolvingObjectIndex.value = gameObjectIndex;
		}
		canDoResolveEffect = false;
		
	} // end if (keyPressed('KeyB') && canPressB && !keyPressed('KeyT') && !keyPressed('KeyR'))
	if ( !keyPressed('KeyB') )
	{
		canPressB = true;
	}

	if (keyPressed('KeyR') && canPressR && !keyPressed('KeyB') && !keyPressed('KeyT') && raycastIndex != game_Objects[playerRobotIndex].tileIndex)
	{
		canPressR = false;

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

			game_Objects[gameObjectIndex].rotation.copy(cameraControlsYawObject.rotation);
			game_Objects[gameObjectIndex].updateMatrixWorld(true); // required for writing to uniforms below

			uObj3D_InvMatrices[gameObjectIndex].copy(game_Objects[gameObjectIndex].matrixWorld).invert();
			uObj3D_InvMatrices[gameObjectIndex].elements[15] = ROBOT_MODEL_ID;

			playerUnitsOfEnergy -= 3;
			canDoResolveEffect = true;
			updateTopLevel_BVH();
		}
		else if (playerUnitsOfEnergy > 2 && selectedObjectIndex >= 0 && game_Objects[selectedObjectIndex].tag == 'BOULDER_MODEL_ID')
		{
			gameObjectIndex++;

			game_Objects[gameObjectIndex].tag = "ROBOT_MODEL_ID";
			game_Objects[gameObjectIndex].level = game_Objects[selectedObjectIndex].level + 5; // stacked on top of a boulder
			game_Objects[gameObjectIndex].tileIndex = game_Objects[selectedObjectIndex].tileIndex;

			game_Objects[gameObjectIndex].position.copy(game_Objects[selectedObjectIndex].position);
			game_Objects[gameObjectIndex].position.y = game_Objects[gameObjectIndex].level;
			game_Objects[gameObjectIndex].position.y += 4.6;

			game_Objects[gameObjectIndex].rotation.copy(cameraControlsYawObject.rotation);
			game_Objects[gameObjectIndex].updateMatrixWorld(true);
			uObj3D_InvMatrices[gameObjectIndex].copy(game_Objects[gameObjectIndex].matrixWorld).invert();
			uObj3D_InvMatrices[gameObjectIndex].elements[15] = ROBOT_MODEL_ID;

			playerUnitsOfEnergy -= 3;
			canDoResolveEffect = true;
			updateTopLevel_BVH();
		}
		else if (!winningRobotPlaced && sentinelAbsorbed && playerUnitsOfEnergy > 2 && selectedObjectIndex >= 0 && 
				game_Objects[selectedObjectIndex].tag == 'PEDESTAL_MODEL_ID')
		{
			winningRobotPlaced = true;

			gameObjectIndex++;

			game_Objects[gameObjectIndex].tag = "ROBOT_MODEL_ID";
			game_Objects[gameObjectIndex].level = game_Objects[selectedObjectIndex].level; // stacked on top of the Sentinel's pedestal
			game_Objects[gameObjectIndex].tileIndex = game_Objects[selectedObjectIndex].tileIndex;

			game_Objects[gameObjectIndex].position.copy(game_Objects[selectedObjectIndex].position);
			game_Objects[gameObjectIndex].position.y = game_Objects[gameObjectIndex].level;
			game_Objects[gameObjectIndex].position.y += 4.6;

			game_Objects[gameObjectIndex].rotation.copy(cameraControlsYawObject.rotation);
			game_Objects[gameObjectIndex].updateMatrixWorld(true);
			uObj3D_InvMatrices[gameObjectIndex].copy(game_Objects[gameObjectIndex].matrixWorld).invert();
			uObj3D_InvMatrices[gameObjectIndex].elements[15] = ROBOT_MODEL_ID;

			playerUnitsOfEnergy -= 3;
			canDoResolveEffect = true;
			updateTopLevel_BVH();
		}

		if (canDoResolveEffect)
		{
			viewRaySphereRadius = 0.01;
			dissolveEffectStrength = 1.0;
			doingResolveEffect = true;
			pathTracingUniforms.uDoingDissolveEffect.value = doingResolveEffect;
			pathTracingUniforms.uResolvingObjectIndex.value = gameObjectIndex;
		}
		canDoResolveEffect = false;
	} // end if (keyPressed('KeyR') && canPressR && !keyPressed('KeyB') && !keyPressed('KeyT'))
	if (!keyPressed('KeyR') )
	{
		canPressR = true;
	}

	if (keyPressed('KeyE') && canPressE)
	{
		canPressE = false;

		if (raycastIndex >= 0 && tiles[raycastIndex].occupied == 'robot')
		{
			animationOldPosition.copy(cameraControlsObject.position);
			animationOldRotationY = cameraControlsYawObject.rotation.y;
			animationOldRotationX = cameraControlsPitchObject.rotation.x;
			animationTargetRotationX = -animationOldRotationX;

			tiles[game_Objects[playerRobotIndex].tileIndex].occupied = 'robot';
			tiles[raycastIndex].occupied = 'playerRobot';
			playerRobotIndex = tiles[raycastIndex].occupiedIndex;
			differenceY = (game_Objects[playerRobotIndex].position.y + 6) - viewRayTargetPosition.y;
			animationTargetRotationX -= differenceY / cameraControlsObject.position.distanceTo(game_Objects[playerRobotIndex].position);

			animationTargetPosition.copy(game_Objects[playerRobotIndex].position);
			animationTargetPosition.y += 4;

			//worldCamera.lookAt(animationTargetPosition); // a little too jarring when teleport starts

			userCurrentAperture = apertureSize;
			viewRaySphereRadius = 0.01;

			playingTeleportAnimation = true;
			pathTracingUniforms.uPlayingTeleportAnimation.value = playingTeleportAnimation;
			return;
		}
		else if (selectedObjectIndex >= 0 && game_Objects[selectedObjectIndex].tag == 'ROBOT_MODEL_ID')
		{
			animationOldPosition.copy(cameraControlsObject.position);
			animationOldRotationY = cameraControlsYawObject.rotation.y;
			animationOldRotationX = cameraControlsPitchObject.rotation.x;
			animationTargetRotationX = -animationOldRotationX;

			tiles[game_Objects[playerRobotIndex].tileIndex].occupied = 'robot';
			tiles[game_Objects[selectedObjectIndex].tileIndex].occupied = 'playerRobot';
			playerRobotIndex = selectedObjectIndex;
			differenceY = (game_Objects[playerRobotIndex].position.y + 6) - viewRayTargetPosition.y;
			animationTargetRotationX -= differenceY / cameraControlsObject.position.distanceTo(game_Objects[playerRobotIndex].position);

			animationTargetPosition.copy(game_Objects[playerRobotIndex].position);
			animationTargetPosition.y += 4;

			//worldCamera.lookAt(animationTargetPosition); // a little too jarring when teleport starts

			userCurrentAperture = apertureSize;
			viewRaySphereRadius = 0.01;

			playingTeleportAnimation = true;
			pathTracingUniforms.uPlayingTeleportAnimation.value = playingTeleportAnimation;
			return;
		}
	} // end if (keyPressed('KeyE') && canPressE)
	if (!keyPressed('KeyE') )
	{
		canPressE = true;
	}

	if (keyPressed('KeyH') && canPressH)
	{
		canPressH = false;

		// if player robot is on top of Sentinel's pedestal - the winning endgame position
		if (game_Objects[playerRobotIndex].tileIndex == game_Objects[0].tileIndex)
		{
			// player has won the level!
			animationTargetPosition.copy(game_Objects[playerRobotIndex].position);
			animationTargetPosition.y += 4;

			animationOldRotationY = cameraControlsYawObject.rotation.y;
			animationOldRotationX = cameraControlsPitchObject.rotation.x;

			userCurrentAperture = apertureSize;
			viewRaySphereRadius = 0.01;

			playingWinAnimation = true;
			return;
		}
		// else if the player doesn't have enough energy to hyperspace
		if (playerUnitsOfEnergy < 3)
		{
			// hyperspace costs 3 energy units, so player robot now has negative energy
			// player lost this level by suicide
			animationTargetPosition.copy(game_Objects[0].position);
			animationTargetPosition.y += 10;

			animationOldRotationY = cameraControlsYawObject.rotation.y;
			animationOldRotationX = cameraControlsPitchObject.rotation.x;

			userCurrentAperture = apertureSize;
			viewRaySphereRadius = 0.01;

			playingLoseAnimation = true;
			return;
		}

		// else this is a normal Hyperspace to a random tile location

		potentialPlacementTileIndeces.length = 0; // clear out array
		// loop through all tiles to add potential tiles to a list to choose from for random robot placement
		for (let i = 0; i < numTiles; i++)
		{
			for (let j = 0; j < numTiles; j++)
			{
				okToPlaceRobot = false;

				tileIndex = i * numTiles + j;

				if (tiles[tileIndex].level == -Infinity || tiles[tileIndex].occupied != "" ||
					tiles[tileIndex].level > game_Objects[playerRobotIndex].level)
					continue;

				vertexIndex = tileIndex * 18;
				
				testPlacementPosition.set(landscape_vpa[vertexIndex + 0] + 5,
					landscape_vpa[vertexIndex + 1] + 0,
					landscape_vpa[vertexIndex + 2] + 5);
				testPlacementPosition.y += 4.6;

				if (testPlacementPosition.distanceTo(game_Objects[playerRobotIndex].position) < 100)
					continue;

				 // check surrounding tiles to see if any are playable, want to avoid hyperspacing player to 1 isolated square
				if (i > 0)
				{	//check North
					if (tiles[(i - 1) * numTiles + j].level == tiles[tileIndex].level)
						okToPlaceRobot = true;
				}
				if (i < numTiles - 1)
				{	//check South
					if (tiles[(i + 1) * numTiles + j].level == tiles[tileIndex].level)
						okToPlaceRobot = true;
				}
				if (j > 0)
				{	//check West
					if (tiles[i * numTiles + (j - 1)].level == tiles[tileIndex].level)
						okToPlaceRobot = true;
				}
				if (j < numTiles - 1)
				{	//check East
					if (tiles[i * numTiles + (j + 1)].level == tiles[tileIndex].level)
						okToPlaceRobot = true;
				}
				
				if (okToPlaceRobot)
				{
					potentialPlacementTileIndeces.push(tileIndex);
				}
			} // end for (let j = 0; j < numTiles; j++)
		} // end for (let i = 0; i < numTiles; i++)

		// if we failed to find a decent hyperspace position for player's Robot, try again with less restrictions
		if (potentialPlacementTileIndeces.length == 0)
		{
			console.log("DEBUG: 1st attempt to hyperspace failed, trying again...");
			
			for (let i = 0; i < numTiles; i++)
			{
				for (let j = 0; j < numTiles; j++)
				{
					tileIndex = i * numTiles + j;

					if (tiles[tileIndex].level == -Infinity || tiles[tileIndex].occupied != "" ||
						tiles[tileIndex].level > game_Objects[playerRobotIndex].level + 10)
						continue;
					
					potentialPlacementTileIndeces.push(tileIndex);
					
				} // end for (let j = 0; j < numTiles; j++)
			} // end for (let i = 0; i < numTiles; i++)

		} // end if (potentialPlacementTileIndeces.length == 0)

		// hopefully should never happen
		if (potentialPlacementTileIndeces.length == 0)
			console.log("DEBUG: hyperspace failed");

		if (potentialPlacementTileIndeces.length > 0)
		{ // now we can safely hyperspace player robot to a new random location
			randomlyChosenTileIndex = 
				potentialPlacementTileIndeces[Math.floor(Math.random() * potentialPlacementTileIndeces.length)];
			
			gameObjectIndex++;

			game_Objects[gameObjectIndex].tag = "ROBOT_MODEL_ID";
			game_Objects[gameObjectIndex].level = tiles[randomlyChosenTileIndex].level;
			game_Objects[gameObjectIndex].tileIndex = randomlyChosenTileIndex;

			vertexIndex = randomlyChosenTileIndex * 18;
			game_Objects[gameObjectIndex].position.set(landscape_vpa[vertexIndex + 0] + 5,
				landscape_vpa[vertexIndex + 1] + 0,
				landscape_vpa[vertexIndex + 2] + 5);
			game_Objects[gameObjectIndex].position.y += 4.6;

			game_Objects[gameObjectIndex].updateMatrixWorld(true);
		
			tiles[game_Objects[playerRobotIndex].tileIndex].occupied = 'robot';
			playerRobotIndex = gameObjectIndex; // record player's robot Object3D array index
			tiles[game_Objects[playerRobotIndex].tileIndex].occupied = 'playerRobot';
			tiles[game_Objects[playerRobotIndex].tileIndex].occupiedIndex = playerRobotIndex;

			cameraControlsObject.position.copy(game_Objects[playerRobotIndex].position);
			cameraControlsObject.position.y += 4;

			cameraControlsObject.rotation.set(0, 0, 0);
			cameraControlsPitchObject.rotation.set(0, 0, 0);
			cameraControlsYawObject.rotation.set(0, 0, 0);

			if (game_Objects[playerRobotIndex].position.z > 0)
			{
				if (game_Objects[playerRobotIndex].position.x > 0)
				{
					cameraControlsYawObject.rotation.y += Math.PI * 0.5;
				}	
				if (game_Objects[playerRobotIndex].position.x < 0)
				{
					cameraControlsYawObject.rotation.y -= Math.PI * 0.5;
				}
					
			}
			if (game_Objects[playerRobotIndex].position.z < 0)
			{
				cameraControlsYawObject.rotation.y = Math.PI;
				
				if (game_Objects[playerRobotIndex].position.x > 0)
				{
					cameraControlsYawObject.rotation.y -= Math.PI * 0.5;
				}
				if (game_Objects[playerRobotIndex].position.x < 0)
				{
					cameraControlsYawObject.rotation.y += Math.PI * 0.5;
				}	
			}

			playerUnitsOfEnergy -= 3; // hyperspace costs 3 energy units

			updateTopLevel_BVH();

		} // end if (potentialPlacementTileIndeces.length > 0)
	} // end if (keyPressed('KeyH') && canPressH)
	if (!keyPressed('KeyH') )
	{
		canPressH = true;
	}

	// handle player camera rotation

	// rotate player's robot to match mouse rotation
	game_Objects[playerRobotIndex].rotation.copy(cameraControlsYawObject.rotation);
	game_Objects[playerRobotIndex].rotateY(Math.PI);
	game_Objects[playerRobotIndex].updateMatrixWorld(true); // required for writing to uniforms below

	uObj3D_InvMatrices[playerRobotIndex].copy(game_Objects[playerRobotIndex].matrixWorld).invert();
	uObj3D_InvMatrices[playerRobotIndex].elements[15] = ROBOT_MODEL_ID;


	// raycast game objects
	raycaster.set(cameraControlsObject.position, cameraDirectionVector);
	viewRayTargetPosition.set(100000, 100000, 100000);

	testD = Infinity;
	closestT = Infinity;
	selectedObjectIndex = -10; // reset index
	selectionIsValid = false; // reset flag

	for (let i = 0; i <= gameObjectIndex; i++)
	{
		if (i == playerRobotIndex)
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
		// cameraInfoElement.innerHTML = "DEBUG object index:" + selectedObjectIndex + " | object tag:" + game_Objects[selectedObjectIndex].tag + 
		// 	" | level:" + game_Objects[selectedObjectIndex].level.toFixed(0) + " | tileIndex:" + game_Objects[selectedObjectIndex].tileIndex + "<br>";
		
		if (!doingDissolveEffect && !doingResolveEffect)
			viewRaySphereRadius = 2.0;

		viewRayTargetPosition.copy(closestHitPoint);
		focusDistance = closestT; 
	}

	if (selectedObjectIndex >= 0)
	{
		//testIndex = game_Objects[selectedObjectIndex].tileIndex;

		if (game_Objects[selectedObjectIndex].tag == 'ROBOT_MODEL_ID')
		{
			selectionIsValid = true; // can always select a robot, unless..

			// if our view to the robot's feet/tile is blocked, the selection is not valid
			
			playerTilePos.copy(game_Objects[selectedObjectIndex].position);
			playerTilePos.y -= 4.5;
			testVec.copy(playerTilePos);
			testVec.sub(cameraControlsObject.position).normalize();
			raycaster.set(cameraControlsObject.position, testVec);
			raycaster.ray.intersectBox(gameObject_boundingBoxes[selectedObjectIndex], hitPoint);
			testT = raycaster.ray.origin.distanceTo(hitPoint);

			// now raycast landscape terrain and see if our line of sight to the selected robot's tile is blocked
			intersectArray.length = 0;
			raycaster.intersectObject(planeMesh, false, intersectArray);
			if (intersectArray.length > 0 && intersectArray[0].distance < testT)
				selectionIsValid = false;
			
		}
		else if (game_Objects[selectedObjectIndex].tag == 'TREE_MODEL_ID')
		{
			selectionIsValid = false; // cannot select trees directly
		}
		else if (game_Objects[selectedObjectIndex].tag == 'BOULDER_MODEL_ID')
		{
			selectionIsValid = true; // can select a boulder except when it's below another item in a stack
			// check to see if any other item is above it in the same boulder stack
			for (let i = selectedObjectIndex + 1; i <= gameObjectIndex; i++)
			{ // if one of the higher boulders (game_Objects[i]) has the same tileIndex as the boulder we selected, the selection is not valid
				if (game_Objects[i].tileIndex == game_Objects[selectedObjectIndex].tileIndex)
				{
										// make sure we're not trying to select the boulder that we are standing on!
					if (game_Objects[i].tag == 'ROBOT_MODEL_ID' && game_Objects[i].tileIndex != game_Objects[playerRobotIndex].tileIndex)
					{
						selectedObjectIndex = i;
					}
					else if (game_Objects[i].tag == 'TREE_MODEL_ID')
					{
						selectedObjectIndex = i;
					}
					else
						selectionIsValid = false;

					break;
				}
			}
		}
		else if (!sentinelAbsorbed && game_Objects[selectedObjectIndex].tag == 'PEDESTAL_MODEL_ID')
		{
			// normally the high Sentinel pedestal model is not selectable, but if we are high enough, Sentinel on top is
			if (game_Objects[selectedObjectIndex].level <= game_Objects[playerRobotIndex].level + 5 &&
				closestHitPoint.y >= game_Objects[selectedObjectIndex].position.y + 4)
			{
				selectedObjectIndex = 1; // 1 = SENTINEL object index
				selectionIsValid = true;
			}
		}
		else if (sentinelAbsorbed && game_Objects[selectedObjectIndex].tag == 'PEDESTAL_MODEL_ID')
		{
			// normally the high Sentinel pedestal model is not selectable, but if we are high enough, Sentinel on top is
			if (game_Objects[selectedObjectIndex].level <= game_Objects[playerRobotIndex].level + 5 && 
				closestHitPoint.y >= game_Objects[selectedObjectIndex].position.y + 4)
			{
				selectionIsValid = true;
			}
		}
		// don't need to check SENTRY, SENTINEL, or MEANIE IDs because they are never directly selectable.
		// instead, the tile on which they rest must be visible and selected
		
	} // end if (selectedObjectIndex >= 0)

	if (!selectionIsValid)
		selectedObjectIndex = -10; // turns off highlighting and disallows object selection


	// now raycast landscape terrain
	intersectArray.length = 0;
	raycaster.set(cameraControlsObject.position, cameraDirectionVector);
	raycaster.intersectObject(planeMesh, false, intersectArray);
	selectedTileIndex = -10; // reset index
	raycastIndex = -10; // reset index
	if (intersectArray.length > 0 && intersectArray[0].distance < closestT)
	{
		if (!doingDissolveEffect && !doingResolveEffect)
			viewRaySphereRadius = 2.0;

		raycastIndex = Math.floor(intersectArray[0].face.a / 6);

		selectedObjectIndex = tiles[raycastIndex].occupiedIndex;

		if (sentinelAbsorbed && selectedObjectIndex >= 0)
		{
			if (game_Objects[selectedObjectIndex].tag != 'ROBOT_MODEL_ID' && game_Objects[selectedObjectIndex].tag != 'BOULDER_MODEL_ID')
				selectedObjectIndex = -10;
		}
		
		if (selectedObjectIndex >= 0)
		{
			for (let i = selectedObjectIndex + 1; i <= gameObjectIndex; i++)
			{
				if (game_Objects[i].tileIndex == game_Objects[selectedObjectIndex].tileIndex)
				{
					selectedObjectIndex = -10;
					break;
				}
			}
		}
		
		if (selectedObjectIndex == playerRobotIndex)
			selectedObjectIndex = -10;
		
		if (tiles[raycastIndex].code != 'connector' && tiles[raycastIndex].code != 'flipped' && raycastIndex != game_Objects[playerRobotIndex].tileIndex)
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
		
		// cameraInfoElement.innerHTML = "DEBUG tile index:" + raycastIndex + " | tile code:" + tiles[raycastIndex].code + " | level:" + 
		// 	tiles[raycastIndex].level.toFixed(0) + " | occupied:" + tiles[raycastIndex].occupied + " | occupiedIndex:" + tiles[raycastIndex].occupiedIndex + "<br>";
		
		viewRayTargetPosition.copy(intersectArray[0].point);
		viewRayTargetPosition.add(intersectArray[0].face.normal.multiplyScalar(2));
		focusDistance = intersectArray[0].distance;
	}

	pathTracingUniforms.uSelectedTileIndex.value = selectedTileIndex;
	pathTracingUniforms.uSelectedObjectIndex.value = selectedObjectIndex;

} // end function doGameLogic()



function onDocumentMouseDown(event)
{
	if (!inGame || playingTeleportAnimation || keyPressed('KeyR') || keyPressed('KeyE') || 
		keyPressed('KeyB') || keyPressed('KeyT') || keyPressed('Space') || keyPressed('Enter') )
		return;

	event.preventDefault();
	
	// Player has Absorbed an item

	// remove a gameObject from anywhere inside the array list. Starting at the selectObject index,
	// do a deep copy of each gameObject's higher neighbor element, essentially compacting the gameObjects array by 1 element
	if (!sentinelAbsorbed && selectedObjectIndex >= 0 && game_Objects[selectedObjectIndex].tag != 'PEDESTAL_MODEL_ID')
	{
		viewRaySphereRadius = 0.01;
		doingDissolveEffect = true;
		pathTracingUniforms.uDoingDissolveEffect.value = doingDissolveEffect;
	}

} // end function onDocumentMouseDown(event)



function doDissolveEffect()
{

	progressAcceleration += 1.5 * frameTime;
	dissolveEffectStrength += progressAcceleration * frameTime;
	//dissolveEffectStrength += 1 * frameTime;

	if (dissolveEffectStrength > 1)
	{
		progressAcceleration = 0;
		dissolveEffectStrength = 0;
		doingDissolveEffect = false;
		pathTracingUniforms.uDoingDissolveEffect.value = doingDissolveEffect;

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
		{
			playerUnitsOfEnergy += 4;
			sentinelAbsorbed = true;
		}

		testIndex = game_Objects[selectedObjectIndex].tileIndex;

		if (tiles[testIndex].occupiedIndex == selectedObjectIndex)
		{
			tiles[testIndex].occupied = '';
			tiles[testIndex].occupiedIndex = -10;
		}

		if (playerRobotIndex > selectedObjectIndex)
			playerRobotIndex -= 1;

		for (let i = 0; i < numTiles; i++)
		{
			for (let j = 0; j < numTiles; j++)
			{
				tileIndex = i * numTiles + j;
				if (tiles[tileIndex].occupiedIndex > selectedObjectIndex)
				{
					tiles[tileIndex].occupiedIndex -= 1;
					continue;
				}
			}
		}

		for (let i = selectedObjectIndex; i < gameObjectIndex; i++)
		{
			game_Objects[i].tag = game_Objects[i + 1].tag;
			game_Objects[i].level = game_Objects[i + 1].level;
			game_Objects[i].tileIndex = game_Objects[i + 1].tileIndex;
			game_Objects[i].position.copy(game_Objects[i + 1].position);
			game_Objects[i].rotation.copy(game_Objects[i + 1].rotation);
			game_Objects[i].updateMatrixWorld(true);

			uObj3D_InvMatrices[i].copy(uObj3D_InvMatrices[i + 1]);
		}

		gameObjectIndex -= 1; // now that the item has been removed, decrease gameObjectIndex by 1
		pathTracingUniforms.uSelectedObjectIndex.value = -10;
		updateTopLevel_BVH();

		return;

	} // end if (dissolveEffectStrength > 1)

} // end function doDissolveEffect()



function doResolveEffect()
{

	progressAcceleration += 1.5 * frameTime;
	dissolveEffectStrength -= progressAcceleration * frameTime;

	if (dissolveEffectStrength < 0)
	{
		progressAcceleration = 0;
		dissolveEffectStrength = 0;
		doingResolveEffect = false;
		pathTracingUniforms.uDoingDissolveEffect.value = doingResolveEffect;
		pathTracingUniforms.uResolvingObjectIndex.value = -10;
		return;
	} // end if (dissolveEffectStrength < 0)

} // end function doResolveEffect()



function doStartGameAnimation()
{

	progressAcceleration += 0.2 * frameTime;
	animationProgress += progressAcceleration * frameTime;

	if (animationProgress > 1)
	{
		animationProgress = 0;
		progressAcceleration = 0;
		playingStartGameAnimation = false;

		cameraControlsObject.position.copy(animationTargetPosition);
		cameraControlsObject.rotation.set(0, 0, 0);
		cameraControlsPitchObject.rotation.set(0, 0, 0);
		cameraControlsYawObject.rotation.set(0, 0, 0);
		worldCamera.rotation.set(0, 0, 0);
		
		if (animationTargetPosition.z > 0)
		{
			if (animationTargetPosition.x > 0)
			{
				cameraControlsYawObject.rotation.y += Math.PI * 0.5;
			}	
			if (animationTargetPosition.x < 0)
			{
				cameraControlsYawObject.rotation.y -= Math.PI * 0.5;
			}		
		}
		if (animationTargetPosition.z < 0)
		{
			cameraControlsYawObject.rotation.y = Math.PI;

			if (animationTargetPosition.x > 0)
			{
				cameraControlsYawObject.rotation.y -= Math.PI * 0.5;
			}	
			if (animationTargetPosition.x < 0)
			{
				cameraControlsYawObject.rotation.y += Math.PI * 0.5;
			}	
		}

		apertureSize = userCurrentAperture;

		viewRaySphereRadius = 2.0;

		return;
	}

	animationTargetVector.subVectors(animationTargetPosition, animationOldPosition);
	animationTargetVector.multiplyScalar(animationProgress);
	cameraControlsObject.position.copy(animationOldPosition);
	cameraControlsObject.position.add(animationTargetVector);

	cameraIsMoving = false;

	apertureSize = 0.3;

	viewRayTargetPosition.copy(animationTargetPosition);

	worldCamera.lookAt(animationTargetPosition);

} // end function doStartGameAnimation()


function doTeleportAnimation()
{
	// temporarily disable selected robot highlighting
	pathTracingUniforms.uSelectedObjectIndex.value = -10;
	
	progressAcceleration += 1 * frameTime;
	animationProgress += progressAcceleration * frameTime;

	if (animationProgress > 1)
	{
		animationProgress = 0;
		progressAcceleration = 0;
		playingTeleportAnimation = false;
		pathTracingUniforms.uPlayingTeleportAnimation.value = playingTeleportAnimation;

		cameraControlsObject.position.copy(animationTargetPosition);
		cameraControlsYawObject.rotation.y = animationOldRotationY;
		cameraControlsYawObject.rotateY(Math.PI);
		cameraControlsPitchObject.rotation.x = animationTargetRotationX;
		worldCamera.rotation.set(0, 0, 0);

		apertureSize = userCurrentAperture;

		viewRaySphereRadius = 2.0;
		
		return;
	}

	animationTargetVector.subVectors(animationTargetPosition, animationOldPosition);
	animationTargetVector.multiplyScalar(animationProgress);
	cameraControlsObject.position.copy(animationOldPosition);
	cameraControlsObject.position.add(animationTargetVector);

	cameraControlsYawObject.rotation.y = animationOldRotationY;
	cameraControlsPitchObject.rotation.x = animationOldRotationX;
	cameraIsMoving = false;

	apertureSize = 0.2;
	
	viewRayTargetPosition.copy(animationTargetPosition);
	//worldCamera.lookAt(animationTargetPosition); // a little too jarring when teleport starts

} // end function doTeleportAnimation()


function doLoseAnimation()
{

	animationProgress += 0.75 * frameTime;

	if (animationProgress > (Math.PI * 2))
	{
		animationProgress = 0;
		progressAcceleration = 0;
		playingLoseAnimation = false;

		cameraControlsObject.position.set(0, 140, 450);
		cameraControlsYawObject.rotation.set(0, 0, 0);
		cameraControlsPitchObject.rotation.set(-0.4, 0, 0);
		worldCamera.rotation.set(0, 0, 0);

		apertureSize = 0.0;

		useGenericInput = true;
		inGame = false;
		canDoResolveEffect = true;

		// clear all previous level raycasting data
		raycastIndex = -10;
		selectedTileIndex = -10;
		selectedObjectIndex = -10;
		pathTracingUniforms.uSelectedTileIndex.value = selectedTileIndex;
		pathTracingUniforms.uSelectedObjectIndex.value = selectedObjectIndex;
		selectionIsValid = false;

		buildNewLevel(false);

		return;
	}

	cameraControlsObject.position.x = animationTargetPosition.x + (Math.cos(animationProgress) * (animationProgress + 3) * 10);
	cameraControlsObject.position.y = animationTargetPosition.y + 20;
	cameraControlsObject.position.z = animationTargetPosition.z - (Math.sin(animationProgress) * (animationProgress + 3) * 10);

	cameraControlsYawObject.rotation.y = animationOldRotationY;
	cameraControlsPitchObject.rotation.x = animationOldRotationX;
	cameraIsMoving = true;

	apertureSize = 0.2;
	
	viewRayTargetPosition.copy(animationTargetPosition);
	worldCamera.lookAt(animationTargetPosition);
	
} // end function doLoseAnimation()


function doWinAnimation()
{

	progressAcceleration += 0.2 * frameTime;
	animationProgress += progressAcceleration * frameTime;

	if (animationProgress > 7)
	{
		animationProgress = 0;
		progressAcceleration = 0;
		playingWinAnimation = false;

		cameraControlsObject.position.set(0, 140, 450);
		cameraControlsYawObject.rotation.set(0, 0, 0);
		cameraControlsPitchObject.rotation.set(-0.4, 0, 0);
		worldCamera.rotation.set(0, 0, 0);

		apertureSize = 0.0;

		useGenericInput = true;
		inGame = false;
		canDoResolveEffect = true;

		// clear all previous level raycasting data
		raycastIndex = -10;
		selectedTileIndex = -10;
		selectedObjectIndex = -10;
		pathTracingUniforms.uSelectedTileIndex.value = selectedTileIndex;
		pathTracingUniforms.uSelectedObjectIndex.value = selectedObjectIndex;
		selectionIsValid = false;

		buildNewLevel(true);

		return;
	}

	cameraControlsObject.position.x = animationTargetPosition.x + 20;
	cameraControlsObject.position.y = animationTargetPosition.y + 40;
	cameraControlsObject.position.z = animationTargetPosition.z + 20;
	
	cameraControlsYawObject.rotation.y = animationOldRotationY;
	cameraControlsPitchObject.rotation.x = animationOldRotationX;
	cameraIsMoving = true;

	game_Objects[playerRobotIndex].rotation.y = progressAcceleration * 5;
	game_Objects[playerRobotIndex].position.y += animationProgress;
	game_Objects[playerRobotIndex].updateMatrixWorld(true); // required for writing to uniforms below

	uObj3D_InvMatrices[playerRobotIndex].copy(game_Objects[playerRobotIndex].matrixWorld).invert();
	uObj3D_InvMatrices[playerRobotIndex].elements[15] = ROBOT_MODEL_ID;

	apertureSize = 0.2;
	viewRayTargetPosition.copy(game_Objects[playerRobotIndex].position);
	worldCamera.lookAt(game_Objects[playerRobotIndex].position);

	// since the player's robot is not only rotating, but moving up outside of its original designated
	// BVH bounding box, we must rebuild the gameObjects topLevel BVH structure from scratch every frame!
	updateTopLevel_BVH();

} // end function doWinAnimation()
