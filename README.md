## Introduction
This is a game imitating the music game Cytus and can be played either with keyboard or on touch screen. Colored disks will appear on the canvas, along with a line moving vertically back and forth. As the line crosses a disk, the player needs to press the key corresponding to the color of the disk: red (left) --> A, green (left) --> S, blue (left) --> D, white (left) --> F, white (right) --> J, blue (right) --> K, green (right) --> L, red (right) --> colon; press Y to show the indications for which key to press. If the player is using a touch screen, then he just needs to tap in the area where the disk appears. The numbers above the game canvas represent the current max combo, the combo and the score, respectively.

There is an editing area below the progress bar, which shows a list. In each sublist of this list, the first number represents the time (in seconds) when the line is leaving the disk, and the second number is the x-coordinate (taken from 1 to 8) of the disk. As the progress bar is being dragged, the data corresponding to the disks that touch the line will be highlighted. The data can be modified to increase or decrease the number of disks, or to change the positions and the order of the disks.

Shortcuts:<br/>
P: pause, N: restart, Y: show/hide keyboard indications, ctrl + enter: updata the data (effective for the editing area)<br/>
A, S, D, F, J, K, L, colon: tap disks with different colors

## How to use it

1. Download the repository;
2. Modify quickstroke.html to load the audio files from a web server, i.e. put the audio files which are under the resources folder into a web server and then change the line 102<br/>
`audio.loadSound('resources/Faded.mp3');`<br/>
to<br/>
`audio.loadSound('<new url of the audio file>');`
3. Open quickstroke.html in a web browser.

No music will be played if step 2 is skipped.