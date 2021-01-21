# TheSentinel-2nd-Look (W.I.P.)
A fully path traced remake of Geoff Crammond's iconic 1986 game, The Sentinel - runs in your Desktop browser! <br>
Click to Play --> https://erichlof.github.io/TheSentinel-2nd-Look/TheSentinel_2nd_Look.html 
<br>
<h4>Desktop Controls</h4>

* Click anywhere to capture mouse
* move Mouse to free-look
* WASD,QZ to fly camera (current debug mode, will be disabled when gameplay added)
* Press SPACEBAR to generate a new random landscape (cycles through 4 color themes)
* Press R to randomly re-position game objects (will be disabled when gameplay added)
* Right/Left Arrows to open/close camera aperture (depth of field effect)
* Up/Down Arrows to increase/decrease Focus Distance (location in the scene of sharp focus)
<br><br>

<h2>TODO</h2>

* Make the Sentinel Game! lol - now that the rendering is mostly worked out, add the actual gameplay and game logic
* Add special effects such as the cool pixel dissolve when an item/player is absorbed
* Add simple GUI showing player assets as well as player visibility to The Sentinel and lower Sentries
* Add the classic original sound effects and short recurring melodic theme
* Unfortunately because it uses many BVHs, this game currently runs on Desktop only - Mobile is, as always, a W.I.P.

<h2>ABOUT</h2>

* Following my Path Traced Pong [game](https://github.com/erichlof/PathTracedPong), this is the third in a series of real-time fully path traced games for all devices with a browser. The technology behind this game is a combination of my three.js path tracing [project](https://github.com/erichlof/THREE.js-PathTracing-Renderer) and the WebAudio API for sound effects.  The goal of this game project and others like it is to enable path traced real-time games in the browser for all players, regardless of their system specs or GPU power. <br>

* This is a remake of the iconic classic 1986 game, [The Sentinel](https://en.wikipedia.org/wiki/The_Sentinel_(video_game)) by Geoff Crammond.  Originally for the BBC Micro, it was soon ported to different systems of the day, including the Commodore 64, which I owned.  I'll always remember - I was 13 years old, strolling through the mall with my parents (yeah I wasn't so cool), when I saw The Sentinel game for the first time - a demo running on a Commodore 64 monitor in Babbage's (an old computer software retailer) store front display to all mall pedestrians.  I stopped in my tracks.  This was the first true 3D filled polygon game running on the Commodore 64! (albeit with a really low framerate, understandably!).  I immediately walked in the software store and bought it that day - I still remember how the big black Sentinel game box look and felt. 
<br>
  Later when I got home and for many months afterward, I not only enjoyed endless hours playing it, but it actually had an effect on me that no other game has since.  It showed me what a computer game is capable of: not just a toy to dump quarters into at the mall arcade, but an entire world (well, landscape) that pulls you in, surrounds you completely, and makes you feel that you are really there.  I don't know how the creator/programmer, Geoff Crammond, came up with this amazing idea, nor do I even know how he got 3D filled polygon graphics to run at all on such underpowered systems, but what I do know is that this game and its gameplay is like no other.  Its sterile, haunting atmosphere sticks with you (or at least it did back when I was a teen).  It rises above how society regarded computer games to the level of true art.  Geoff Crammond was able not only to convey his other-worldy vision on 1986 hardware, but in my humble opinion he created a truly unique real-time masterpiece that needs to be documented and cherished. 
<br>
  My remake of the game, which I call The Sentinel: 2nd Look, hopefully brings the classic into modern times so that a wider audience can enjoy it at 30-60fps on any desktop/laptop with a browser.  What better way to bring together my favorite game of all time and my favorite graphic technique (path tracing!) into one project!  Now I know that there are a few modern fan remakes out there already, but I wanted to do something slightly different with my version and add my path tracing touch to it.  Since I can't wade through Geoff Crammond's original assembly source code, I had to reverse-engineer the game's landscape generation process.  This alone took months because it's not too obvious how he coded it and I went down a couple of wrong/dead-end paths on my journey to faithfully recreate the look and feel of his cool landscapes.  Graphics-wise, I added  a day cycle/sun light source to the environment, added full path tracing to cast pixel-perfect shadows on the landscape, self-shadowing of game objects, and providing true ray-traced reflections in the white/black connector panels of the landscape.  It's really rewarding to fly high and low and explore the landscape, watching the setting sun cast eerie shadows on the landscape and game objects.  I hope you enjoy my remake of this iconic game, and I hope it gives you that magical sense of immersion like I had when I was 13 at my Commodore 64!  :)    
<br>

