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
    c_get_window_size();

    /**  Map the event listeners.         **/
    map_events();

    /**  Update the screen.               **/
    draw();

}
boot();  //  Boot it!! 



////  SECTION 4:  Events.

//  A dictionary naming some special keys.
var _event_names = {            /**     L: Keycodes represented as strings, escaped with "\u".   R: Event names!   **/
    "\u001b[A": "UP",
    "\u001b[B": "DOWN",
    "\u001b[C": "RIGHT",
    "\u001b[D": "LEFT",
    "\u007f": "BACKSPACE",
    "\u000D": "ENTER",
    "\u0003": "CTRL-C",
    "\u0013": "CTRL-S",
};

//  These functions fire in response to "events" like keyboard input. 
var _events      = {
    "CTRL-C": function() {
	b_quit();
    },
    
    "LEFT":   function() {
	e_move_cursor_left();
    },
    "RIGHT":  function() {
	f_move_cursor_right();
    },
    "UP":     function() {
	g_move_cursor_up();
    },
    "DOWN":   function() {
	h_move_cursor_down();
    },
    
    "TEXT":   function(key) {
	i_add_to_buffer(key);
    },
    "ENTER":  function() {
	i_add_to_buffer("\n");
    },
    "BACKSPACE": function() {
	j_delete_from_buffer();
    },
    
    "CTRL-S": function() {
	k_save_buffer_to_file();
    },
    
    "CTRL-Z":  function() {
	// p_undo()
    },
    "CTRL-R": function() {
	// q_redo()
    },
    
};

//  Map keyboard input.
function map_events() {

    //  Map keyboard input 
    var stdin = process.stdin;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");
    stdin.on("data", function(key) {

	var event_name = _event_names[key];        /**  Getting the event name from the keycode, like "CTRL-C" from "\u0003".  **/
	
	if (typeof event_name == "string" && typeof _events[event_name] == "function") {       /**  "CTRL-C", "ENTER", etc     **/
	    _events[event_name]();
        } else if (key.charCodeAt(0) > 31 && key.charCodeAt(0) < 127) {   /**  Most keys, like letters, call the "TEXT" event.  **/
	    _events["TEXT"](key);
	}
	
	draw();                                    /**  Redraw the whole screen on any keypress.                               **/
    });

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

    var cursor_position = d_get_cursor_pos();                  /**  Using our algorithm d_get_cursor_pos!   **/
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
    var cursor_position = d_get_cursor_pos(); //  d_get_cursor_pos is an algorithm.
    process.stdout.write("\x1b[" + cursor_position[0] + ";" + cursor_position[1] + "f");
}

//  Drawing the feedback bar.
function draw_feedback_bar() {
    process.stdout.write("\x1b[2m");                           /**  Dim text.                         **/
    process.stdout.write("\x1b[" + (_window_h - 1) + ";0H");   /**  Moving to the bottom row.         **/
    process.stdout.write(_feedback_bar);
    _feedback_bar = "";
    process.stdout.write("\x1b[0m");                           /**  Back to undim text.               **/
}



////  SECTION 6:  Algorithms.

function a_load_file_to_buffer() {       /**  Getting the file's contents, put it in the "buffer".    **/
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

function b_quit() {                      /**  Quit out of kTTY.                 **/
    console.clear();
    process.exit();
}

function c_get_window_size() {           /**  Get the window size.              **/
    _window_h = process.stdout.rows;
    _window_w = process.stdout.columns;
}

function d_get_cursor_pos() {            /**  Returns a 2 index array, [int line, int char]           **/

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

function e_move_cursor_left() {

    _cursor_buffer_pos -= 1;
    if ( _cursor_buffer_pos < 0 ) {      /**   Don't let the cursor position be negative.         **/
        _cursor_buffer_pos++;
    } else {
        _feedback_bar = "Moved left.";
    }

}

function f_move_cursor_right() {

    _cursor_buffer_pos += 1;

    var buff_limit = _buffer.length;     /**   Don't let the cursor position exceed the buffer.   **/
    if ( _cursor_buffer_pos > buff_limit ) {
        _cursor_buffer_pos--;
    } else {
        _feedback_bar = "Moved right.";
    }

}

function g_move_cursor_up() {

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

function h_move_cursor_down() {

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

function i_add_to_buffer(new_text) {
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

function j_delete_from_buffer() {

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

function k_save_buffer_to_file() {
    fs.writeFileSync(_filename, _buffer, { encoding: 'utf8' } );
    _modified = false;
    _feedback_bar = "saved :)";
}