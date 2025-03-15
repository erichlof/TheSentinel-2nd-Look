# TheSentinel-2nd-Look (W.I.P.)
A fully path traced remake of Geoff Crammond's iconic 1986 game, The Sentinel - runs in your Desktop/Mobile browser! <br>
Click to Play --> https://erichlof.github.io/TheSentinel-2nd-Look/TheSentinel_2nd_Look.html 
<br> <br>

<h3> March 14, 2025 NOTE: Workaround for Black Screen Bug (Mobile devices only) in latest Chromium Browsers (mobile Chrome, Edge, Brave, Opera) </h3>

* In latest Chrome 134.0 (and all Chromium-based browsers), there is a major bug that occurs on touch devices (happens on my Android phone - iPhone and iPad not tested yet)
* At demo startup, when you touch your screen for the first time, the entire screen suddenly turns black. There is no recovering - the webpage must be reloaded to see anything again.
* THE WORKAROUND: After starting up the demo, do a 'pinch' gesture with 2 fingers.  You can tell if you did it because the camera (FOV) will zoom in or out.
* Once you have done this simple 2-finger pinch gesture, you can interact with the demo as normal - the screen will not turn black on you for the duration of the webpage.
* I have no idea why this is happening.  I hooked my phone up to my PC's Chrome dev tools, and there are no warnings or errors in my phone's browser console output when the black screen occurs.
* I don't know why a 2-finger pinch gesture gets around this issue and prevents the black screen from occuring.
* I have done my own debug output on the demo webpage (inside an HTML element), and from what I can see, all the recorded touch events (like touchstart, touchmove, etc.) and camera variables appear valid and are working like they always do.
* The WebGL context isn't being lost and the webpage is not crashing, because the demo keeps running and the cameraInfo element (that is in the lower left-hand corner) on all demos, still outputs correct data - it's like the app is still running, taking user input, and doing path tracing calculations, but all that is displayed to the user is a black screen.
* I may open up a new issue on the Chromium bug tracker, but I can't even tell what error is occuring.  Plus my use case (path tracing fullscreen quad shader on top of three.js) is pretty rare, so I don't know how fast the Chromium team would get around to it, if at all.
* In my experience, these bugs have a way of working themselves out when the next update of Chromium comes out (which shouldn't be too long from now).  I love targeting the web platform because it is the only platform where you can truly "write the code once, run everywhere" - but one of the downsides of coding for this platform are the occasional bugs that are introduced into the browser itself, even though nothing has changed in your own code.  Hopefully this will be resolved soon, either by a targeted bug fix, or by happy accident with the next release of Chromium.  <br> <br>
<h4>Desktop Controls (update 7/30/22: Mobile GUI/Controls coming soon, now that Mobile rendering is working!)</h4>

* Click anywhere to capture mouse
* move Mouse to free-look
* Right/Left Arrows to open/close camera aperture (depth of field effect)
* WASD,QZ to fly camera in Landscape selection mode (disabled when entering your Robot in game mode)
* Press SPACEBAR to generate a new random landscape (cycles through 4 color themes)
* Press E to enter the player's starting Robot (this is where you start each game level)
* With a checkerboard tile (or boulder) selected, Press R to create another Robot
* With that new robot selected (or its checkerboard tile selected), Press E to Enter that other robot
* With a checkerboard tile (or another boulder) selected, Press B to create a Boulder (a base on which more Boulders or another Robot can be stacked)
* With a checkerboard tile (or boulder) selected, Press T to create a Tree (a technique to partially hide your player Robot from the Sentinel's gaze!)
* MouseClick to absorb an item.  Note: game rules state that you must be able to see the checkerboard tile on which the item sits (will not work if the item is too high).  Does not apply to Boulder bases or player Robots - they can be clicked/absorbed from anywhere on the level.
* Press H to Hyperspace to a new random tile location, at or below current player height - Warning: Hyperspacing costs 3 energy units!
* If player energy drops below 0, the level is lost and the player restarts the same type of level
* To Win a level, Press H to Hyperspace while standing on top of the Sentinel's pedestal (after you absorb her and place your robot where she was!)

<br><br>

<h2>TODO</h2>

* Make the Sentinel Game! lol - now that the rendering is mostly worked out, add the actual gameplay and game logic.
* Upon seeing an object with more energy than a natural tree, make Head Sentinel and her lower Sentries dissolve and break down the object.
* Add simple GUI showing player assets as well as player visibility to The Sentinel and lower Sentries.
* Add the classic original sound effects and short recurring melodic theme.
* Now that Mobile rendering is working, add mobile GUI/buttons and increase mobile performance (framerate)

<h2>ABOUT</h2>

* Following my Path Traced Pong [game](https://github.com/erichlof/PathTracedPong), this is the third in a series of real-time fully path traced games for all devices with a browser. The technology behind this game is a combination of my three.js path tracing [project](https://github.com/erichlof/THREE.js-PathTracing-Renderer) and the WebAudio API for sound effects.  The goal of this game project and others like it is to enable path traced real-time games in the browser for all players, regardless of their system specs or GPU power. <br>

<br>
    This is a remake of the iconic classic 1986 game, The Sentinel https://en.wikipedia.org/wiki/The_Sentinel_(video_game) by Geoff Crammond (Amiga screenshots) http://www.grospixels.com/site/sentinel.php .  Originally for the BBC Micro, it was soon ported to different systems of the day, including the Commodore 64, which I owned.  I'll always remember - I was 13 years old, strolling through the mall with my parents (yeah I wasn't so cool), when I saw The Sentinel game for the first time - a demo running on a Commodore 64 monitor in Babbage's (an old computer software retailer) store front display to all mall pedestrians.  I stopped in my tracks.  This was the first true 3D filled polygon game running on the Commodore 64! (albeit with a really low framerate, understandably!).  I immediately walked in the software store and bought it that day - I still remember how the big black Sentinel game box looked and felt. <br>
<br>
    Later when I got home and for many months afterward, I not only enjoyed endless hours playing it, but it actually had an effect on me that no other game has since.  It showed me what a computer game is capable of: not just a toy to dump quarters into at the mall arcade, but an entire world (well, landscape) that pulls you in, surrounds you completely, and makes you feel that you are really there.  I don't know how the creator/programmer, Geoff Crammond, came up with this amazing idea, nor do I even know how he got 3D filled polygon graphics to run at all on such underpowered systems, but what I do know is that this game and its gameplay is like no other.  Its sterile, haunting atmosphere sticks with you (or at least it did back when I was a teen).  It rises above how society regarded computer games to the level of true art.  Geoff Crammond was able not only to convey his other-worldy vision on 1986 hardware, but in my humble opinion he created a truly unique real-time masterpiece that needs to be documented and cherished. <br>
<br>
    My remake of the game, which I call The Sentinel: 2nd Look, hopefully brings the classic into modern times so that a wider audience can enjoy it at 30-60fps on any desktop/laptop with a browser.  What better way to bring together my favorite game of all time and my favorite graphic technique (path tracing!) into one project!  Now I know that there are a few modern fan remakes out there already, but I wanted to do something slightly different with my version and add my path tracing touch to it.  Since I can't wade through Geoff Crammond's original assembly source code, I had to reverse-engineer the game's landscape generation process.  This alone took months because it's not too obvious how he coded it and I went down a couple of wrong/dead-end paths on my journey to faithfully recreate the look and feel of his cool landscapes.  Graphics-wise, I added  a day cycle/sun light source to the environment, added full path tracing to cast pixel-perfect shadows on the terrain, self-shadowing of game objects, and providing true ray-traced reflections in the white/black connector panels of the landscape.  It's really rewarding to fly high and low and explore the environment, watching the setting sun cast eerie shadows on the landscape and game objects.  I hope you enjoy my homage to this iconic game, and I hope it gives you that magical sense of immersion like I had when I was 13 at my Commodore 64!  :)    
<br>

