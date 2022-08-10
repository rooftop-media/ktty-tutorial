#!/usr/bin/env node
;

////  SECTION 1:  Imports.

//  Importing NodeJS libraries. 
var process      = require('process');
var fs           = require('fs');



////  SECTION 2:  App memory. 

//  Setting up app memory.
var _buffer            = '';      //  The text being edited. 
var _filename          = '';      //  Filename - including extension. 



////  SECTION 3:  Boot stuff.

//  The boot sequence.
function boot() {

    /**  Load a file to the buffer.       **/
    a_load_file_to_buffer();

    /**  Load window height & width.      **/
    // c_get_window_size();

    /**  Map the event listeners.         **/
    map_events();

    /**  Update the screen.               **/
    draw();

}
boot();  //  Boot it!! 



////  SECTION 4:  Events.

//  Map keyboard input.
function map_events() {

    //  Map keyboard input 
    var stdin = process.stdin;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    stdin.on('data', function(key) {
	    //  Exit on ctrl-c
	    if (key === '\u0003') {
		b_quit();
	    }
	    process.stdout.write(key);
	});

}



////  SECTION 5:  Draw functions.

//  The draw function -- called after any data change.
function draw() {
    draw_buffer();
    // draw_status_bar();
    // draw_feedback_bar();
    // position_cursor();
}

//  Drawing the buffer.  
function draw_buffer() {
    console.clear();
    console.log(_buffer);
}



////  SECTION 6:  Algorithms.

function a_load_file_to_buffer() {       /**  Get the file's contents, put it in the "buffer".    **/
    _filename = process.argv[2]; 
    if ( _filename == undefined ) {
        _buffer = "";
    } else {
        try {
            _buffer = fs.readFileSync( _filename, {encoding: 'utf8'} );
        } catch (err) {
            _buffer = "Unable to find a file at '" + _filename + "'";
        }
    }
}

function b_quit() {                      /**  Quit out of kTTY.   **/
    console.clear();
    process.exit();
}
