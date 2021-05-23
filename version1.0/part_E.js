#!/usr/bin/env node
;

////  SECTION 1:  Imports.

//  Importing NodeJS libraries. 
var process      = require("process");
var fs           = require("fs");



////  SECTION 2:  App memory. 

//  Setting up app memory.
var _mode              = "BUFFER-EDITOR";  //  Options: "BUFFER-EDITOR", "FEEDBACK"

var _buffer            = "";      //  The text being edited.
var _filename          = "";      //  Filename - including extension.
var _modified          = false;   //  Has the buffer been modified?
var _cursor_buffer_pos = 0;       //  The position of the cursor in the text.

var _feedback_bar      = "";      //  The text to display in the feedback bar.

var _feedback_input    = "";      //  What has the user typed? 
var _feedback_cursor   = 0;       //  Where is the feedback input cursor? 
var _feedback_event    = function (response) {}; 

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

	    var events = _mode_events[ _mode ];

            if ( key === '\u0003' || key === '\u0018' ) {        //  ctrl-c and ctrl-q 
                events["QUIT"]();
            }
            else if ( key === '\u0013' ) {       // ctrl-s  
                events["SAVE"]();
            }
            else if ( key === '\u001b[A' ) {     //  up 
                events["UP"]();
            }
            else if ( key === '\u001b[B' ) {     //  down
                events["DOWN"]();
            }
            else if ( key === '\u001b[C' ) {     //  right 
                events["RIGHT"]();
            }
            else if ( key === '\u001b[D' ) {     //  left
                events["LEFT"]();
            }
            else if ( key === '\u000D' ) {     //  enter 
                events["ENTER"]();
            }
            else if ( key === '\u0008' || key === "\u007f" ) {     //  delete 
                events["BACKSPACE"]();
            }

            else {
                events["TEXT"](key);
            }

            draw();

        });
}

//  These functions fire in response to "events" like keyboard input. 
var _mode_events      = {
    
    "BUFFER-EDITOR": {
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
	    h_add_to_buffer(key);
	},
	"ENTER":  function() {
	    h_add_to_buffer("\n");
	},
	"BACKSPACE": function() {
	    i_delete_from_buffer();
	},
	
	"UNDO":  function() {
	    // j_undo()
	},
	"REDO": function() {
	    // k_redo()
	},
	
	"SAVE": function() {
	    l_save_buffer_to_file();
	},
	
	"QUIT": function() {
	    // m_quit();
	    console.clear();
	    process.exit();
	},
    },

    "FEEDBACK": {
        "TEXT":   function(key) {
            o_add_to_feedback_input(key);   //  Add text to the feedback input. 
        },
        "BACKSPACE": function() {
            p_delete_from_feedback_input();          //  Remove text from the feedback input. 
        },

	"UP":     function() {  },
	"DOWN":   function() {	},
	"LEFT":   function() {
            q_move_feedback_cursor_left();   //  Move the feedback cursor right one space.
        },
        "RIGHT":  function() {
            r_move_feedback_cursor_right();  //  Move the feedback cursor right one space.
        },
	
	"ENTER":  function() {
            _feedback_event(_feedback_input);    //  Running the feedback event. 
        },
	
	"QUIT": function() {
            // m_quit();                                                                                                                               
            console.clear();
            process.exit();
	}
    }
}
    
    

////  SECTION 5:  Draw functions.

//  The draw function -- called after any data change.
function draw() {
    draw_buffer();
    draw_status_bar();
    draw_feedback_bar();
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
    if (_mode == "BUFFER-EDITOR") {
        var cursor_position = c_get_cursor_pos(); //  c_get_cursor_pos is an algorithm.
        process.stdout.write("\x1b[" + cursor_position[0] + ";" + cursor_position[1] + "f");
    } else if (_mode == "FEEDBACK") {
        var x_pos = _feedback_bar.length + 2 + _feedback_cursor;
        process.stdout.write("\x1b[" + (_window_h - 1) + ";" + x_pos + "f");
    }
}

//  Drawing the feedback bar.
function draw_feedback_bar() {
    if (_mode == "FEEDBACK") {                                 /**  If we're in feedback mode, draw it cyan.     **/
        process.stdout.write("\x1b[36m"); 
    } else {                                                   /**  If it's buffer mode feedback, dim.           **/
        process.stdout.write("\x1b[2m"); 
    }
    
    process.stdout.write("\x1b[" + (_window_h - 1) + ";0H");   /**  Moving to the bottom row.                    **/
    process.stdout.write(_feedback_bar);                       /**  Write the text.                              **/
    process.stdout.write("\x1b[0m");                           /**  Back to undim text.                          **/
        
    if (_mode == "FEEDBACK") {                                 /**  If we're in feedback mode, write the input too.   **/
        process.stdout.write(" " + _feedback_input); 
    } else {
        _feedback_bar = "";
    }
}





////  SECTION 6:  Algorithms.

//  Getting the file's contents, put it in the "buffer".
function a_load_file_to_buffer() {
    _filename = process.argv[2]; 
    if ( _filename == undefined ) {
	_mode         = "FEEDBACK";
        _feedback_bar = "Enter a file name to create a new file: ";
	_feedback_event = function(response) {
	    _filename = response;
	    _mode     = "BUFFER-EDITOR";
	    _feedback_bar = "";
	}
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

function f_move_cursor_up() {

    var current_x_pos = 1;               /**   To find the xpos of the cursor on the current line.   **/
    var prev_line_length = 0;            /**   To find the length of the *prev* line, to jump back.  **/
    for (var i = 0; i < _cursor_buffer_pos; i++ ) {
        if (_buffer[i] == "\n") {
            prev_line_length = current_x_pos;
            current_x_pos = 1;
        } else {
            current_x_pos++;
        }
    }

    if (prev_line_length > current_x_pos) {        /**   If we're going up **into** a line...        **/
        _cursor_buffer_pos -= prev_line_length;
    }
    else if (prev_line_length <= current_x_pos) {  /**   If we're going up **above** a line...       **/
        _cursor_buffer_pos -= current_x_pos;
    }

    _feedback_bar = "Moved up.";

}

function g_move_cursor_down() {

    var current_x_pos = 1;               /**   To find the xpos of the cursor on the current line.     **/
    var current_line_length = 0;         /**   To find the length of *this* line.                      **/
    var next_line_length = 0;            /**   To find the length of the *next* line, to jump forward. **/
    for (var i = 0; i < _cursor_buffer_pos; i++ ) {
        if (_buffer[i] == "\n") {
            current_x_pos = 1;
        } else {
            current_x_pos++;
        }
    }

    var j = _cursor_buffer_pos;          /**  Using a while loop to iterate further, to find the *next* line length.  **/
    var found_line_start = false;
    current_line_length = current_x_pos;
    while (j < _buffer.length) {
        if (!found_line_start && _buffer[j] == "\n") {
            found_line_start = true;
        }
        else if (!found_line_start && _buffer[j] != "\n") {
            current_line_length++;
        }
        else if (found_line_start && _buffer[j] != "\n") {
            next_line_length++;
        }
        else if (found_line_start && _buffer[j] == "\n") {
            break;
        }
        j++;
    }

    if (next_line_length > current_x_pos) {          /**   If we're going down **into** a line...        **/
        _cursor_buffer_pos += current_line_length;
    }
    else if (next_line_length <= current_x_pos) {    /**   If we're going down **above** a line...       **/
        _cursor_buffer_pos += current_line_length;
        _cursor_buffer_pos -= current_x_pos;         /**     This should get us to the start of the next line...  **/
        _cursor_buffer_pos += next_line_length + 1;  /**     ...and then we jump to the end.    **/
    }

    var buff_limit = _buffer.length;     /**   Don't let the cursor position exceed the buffer.   **/
    if ( _cursor_buffer_pos > buff_limit ) {
        _cursor_buffer_pos--;
    } else {
        _feedback_bar = "Moved down.";
    }

}

function h_add_to_buffer(new_text) {
    var new_buffer = _buffer.slice(0, _cursor_buffer_pos);
    new_buffer    += new_text;
    new_buffer    += _buffer.slice(_cursor_buffer_pos, _buffer.length);
    _buffer = new_buffer;
    _cursor_buffer_pos++;
    _feedback_bar = "Typed '" + new_text + "'";
    if (!_modified) {
        _modified = true;
    }
}

function i_delete_from_buffer() {

    if ( _cursor_buffer_pos == 0 ) {      /**   Don't let the cursor position be negative.    **/
        return;
    }

    var new_buffer = _buffer.slice(0, _cursor_buffer_pos - 1);
    new_buffer    += _buffer.slice(_cursor_buffer_pos, _buffer.length);
    _buffer = new_buffer;
    _cursor_buffer_pos--;
    _feedback_bar = "Text deleted.";
    if (!_modified && _cursor_buffer_pos != 0) {
        _modified = true;
    }
}

function l_save_buffer_to_file() {
    fs.writeFileSync(_filename, _buffer, { encoding: 'utf8' } );
    _modified = false;
    _feedback_bar = "saved :)";
}

function o_add_to_feedback_input(new_text) {
    var new_fb_input   = _feedback_input.slice(0, _feedback_cursor);
    new_fb_input      += new_text;
    new_fb_input      += _feedback_input.slice(_feedback_cursor, _feedback_input.length);
    _feedback_input = new_fb_input;
    _feedback_cursor++;
}

function p_delete_from_feedback_input() {
    if ( _feedback_cursor == 0 ) {      /**   Don't let the cursor position be negative.    **/
        return;
    }

    var new_fb_input = _feedback_input.slice(0, _feedback_cursor - 1);
    new_fb_input    += _feedback_input.slice(_feedback_cursor, _feedback_input.length);
    _feedback_input  = new_fb_input;
    _feedback_cursor--;
}

function q_move_feedback_cursor_left() {
    _feedback_cursor--;
    if (_feedback_cursor < 0) {     //  Don't let the feedback cursor go past the beginning.
	_feedback_cursor++;
    }
}

function r_move_feedback_cursor_right() {
    _feedback_cursor++;
    if (_feedback_cursor > _feedback_input.length) {      // don't "surpass" the end of _feeback_input
        _feedback_cursor--;
    }
}