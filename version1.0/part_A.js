#!/usr/bin/env node
;
////  SECTION 1:  Imports.

//  Importing NodeJS libraries. 
var process      = require("process");
var fs           = require("fs");


////  SECTION 2:  App memory. 

//  Setting up app memory.
var _buffer            = "";      //  The text being edited. 
var _filename          = "";      //  Filename - including extension. 


////  SECTION 3:  Boot stuff.

//  The boot sequence.
function boot() {

    /**  Load a file to the buffer.       **/
    a_load_file_to_buffer();

    /**  Load window height & width.      **/
    // b_get_window_size();

    /**  Map the event listeners.         **/
    map_events();

    /**  Update the screen.               **/
    draw();

}
boot();  //  Boot it!! 


////  SECTION 4:  Events.

////  SECTION 5:  Draw functions.

////  SECTION 6:  Algorithms.