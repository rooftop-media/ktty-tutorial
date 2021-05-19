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
var _modified          = false;   //  Has the buffer been modified?
var _cursor_buffer_pos = 0;       //  The position of the cursor in the text.

var _feedback_bar      = "";      //  The text to display in the feedback bar.

var _window_h          = 0;       //  Window height (in text char's).
var _window_w          = 0;       //  Window width (in text char's).


////  SECTION 3:  Boot stuff.

//  The boot sequence.
function boot() {

    /**  Load a file to the buffer.       **/
    a_load_file_to_buffer();

    /**  Load window height & width.      **/
    b_get_window_size();

    /**  Map the event listeners.         **/
    map_events();

    /**  Update the screen.               **/
    draw();

}
boot();  //  Boot it!! 



////  SECTION 4:  Events.

//  Map keyboard events.
function map_events() {
    var stdin = process.stdin;
    stdin.setRawMode( true );
    stdin.resume();
    stdin.setEncoding( 'utf8' );
    stdin.on( 'data', function( key ){

            if ( key === '\u0003' || key === '\u0018' ) {        //  ctrl-c and ctrl-q 
                _events["QUIT"]();
            }
            else if ( key === '\u0013' ) {       // ctrl-s  
                _events["SAVE"]();
            }
            else if ( key === '\u001b[A' ) {     //  up 
                _events["UP"]();
            }
            else if ( key === '\u001b[B' ) {     //  down
                _events["DOWN"]();
            }
            else if ( key === '\u001b[C' ) {     //  right 
                _events["RIGHT"]();
            }
            else if ( key === '\u001b[D' ) {     //  left
                _events["LEFT"]();
            }
            else if ( key === '\u000D' ) {     //  enter 
                _events["ENTER"]();
            }
            else if ( key === '\u0008' || key === "\u007f" ) {     //  delete 
                _events["BACKSPACE"]();
            }

            else {
                _events["TEXT"](key);
            }

            draw();

        });
}

//  These functions fire in response to "events" like keyboard input. 
var _events      = {

    "LEFT":   function() {
        d_move_cursor_left();
    },
    "RIGHT":  function() {
        e_move_cursor_right();
    },

    "UP":     function() {
        f_move_cursor_up();
    },
    "DOWN":   function() {
        g_move_cursor_down();
    },

    "TEXT":   function(key) {
	// h_add_to_buffer(key);
    },
    "ENTER":  function() {
        // h_add_to_buffer("\n");
    },
    "BACKSPACE": function() {
        // i_delete_from_buffer();
    },

    "SAVE": function() {
        // l_save_buffer_to_file();
    },

    "QUIT": function() {
        // m_quit();
	console.clear();
        process.exit();
    },

}



////  SECTION 5:  Draw functions.

//  The draw function -- called after any data change.
function draw() {
    draw_buffer();
    draw_status_bar();
    // draw_feedback_bar();
    position_cursor();
}

//  Drawing the buffer.  
function draw_buffer() {
    console.clear();
    console.log(_buffer);
}

//  Drawing the file's status bar -- filename, modified status, and cursor position. 
function draw_status_bar() {

    process.stdout.write("\x1b[" + (_window_h - 2) + ";0H");   /**  Moving to the 2nd to bottom row.  **/
    process.stdout.write("\x1b[7m");                           /**  Reverse video.                    **/

    var status_bar_text = "  " + _filename;                    /**  Add the filename                  **/
    if (_modified) {                                           /**  Add the [modified] indicator.     **/
        status_bar_text += "     [modified]";
    } else {
        status_bar_text += "               ";
    }

    var cursor_position = c_get_cursor_pos();                  /**  Using our algorithm a_get_cursor_pos!   **/
    status_bar_text += "  cursor on line " + cursor_position[0];
    status_bar_text += ", row " + cursor_position[1];

    while (status_bar_text.length < _window_w) {               /**  Padding it with whitespace.       **/
        status_bar_text += " ";
    }

    process.stdout.write(status_bar_text);                     /**  Output the status bar string.     **/
    process.stdout.write("\x1b[0m");                           /**  No more reverse video.            **/
}

//  Move the cursor to its position in the buffer.   
function position_cursor() {
    var cursor_position = c_get_cursor_pos(); //  c_get_cursor_pos is an algorithm.
    process.stdout.write("\x1b[" + cursor_position[0] + ";" + cursor_position[1] + "f");
}



////  SECTION 6:  Algorithms.

//  Getting the file's contents, put it in the "buffer".
function a_load_file_to_buffer() {
    _filename = process.argv[2]; 
    if ( _filename == undefined ) {
        _buffer = "";
    } else {
        try {
            _buffer = fs.readFileSync( _filename, {encoding: 'utf8'} );
        } catch (err) {
            _buffer = "Unable to find a file at '" + _filepath + "'";
        }
    }
}

//  Get the window size. 
function b_get_window_size() {
    _window_h = process.stdout.rows;
    _window_w = process.stdout.columns;
}

function c_get_cursor_pos() {            //  Returns a 2 index array, [int line, int char]

    var cursor_position = [1,1];
    for (var i = 0; i < _cursor_buffer_pos; i++) {  //  Loop through the buffer to count \n's

	var current = _buffer[i];
        if (current == "\n") {
            cursor_position[0]++;        /**  Advance a line.        **/
            cursor_position[1] = 1;      /**  Reset character pos.   **/
        } else {
            cursor_position[1]++;        /**  Advance a character.   **/
        }
    }
    return cursor_position;

}

function d_move_cursor_left() {

    _cursor_buffer_pos -= 1;
    if ( _cursor_buffer_pos < 0 ) {      /**   Don't let the cursor position be negative.         **/
        _cursor_buffer_pos++;
    } else {
        _feedback_bar = "Moved left.";
    }

}

function e_move_cursor_right() {

    _cursor_buffer_pos += 1;

    var buff_limit = _buffer.length;     /**   Don't let the cursor position exceed the buffer.   **/
    if ( _cursor_buffer_pos > buff_limit ) {
        _cursor_buffer_pos--;
    } else {
        _feedback_bar = "Moved right.";
    }

}