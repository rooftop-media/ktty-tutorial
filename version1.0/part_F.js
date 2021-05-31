#!/usr/bin/env node
;

////  SECTION 1:  Imports.

//  Importing NodeJS libraries. 
var process      = require("process");
var fs           = require("fs");



////  SECTION 2:  App memory. 

//  Setting up app memory.
var _mode              = "BUFFER-EDITOR";  //  Options: "BUFFER-EDITOR", "FEEDBACK-PROMPT"

var _buffer            = "";      //  The text being edited. 
var _filename          = "";      //  Filename - including extension. 
var _modified          = false;   //  Has the buffer been modified?
var _cursor_buffer_pos = 0;       //  The position of the cursor in the text.
var _scroll            = 0;

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
var _mode_events      = {
    "BUFFER-EDITOR": {
	"CTRL-C":     b_quit,

	"LEFT":       e_move_cursor_left,
	"RIGHT":      f_move_cursor_right,
	"UP":         g_move_cursor_up,
	"DOWN":       h_move_cursor_down,

	"TEXT":       function(key) {  i_add_to_buffer(key);   },
	"ENTER":      function()    {  i_add_to_buffer("\n");  }, 
	"BACKSPACE":  j_delete_from_buffer,

	"CTRL-S":     k_save_buffer_to_file,

	// "CTRL-Z":     p_undo,
	// "CTRL-R":     q_redo,
    },

    "FEEDBACK-PROMPT": {
	"CTRL-C":     b_quit,
	
        "TEXT":       function(key) {  m_add_to_feedback_input(key);   },
        "BACKSPACE":  function()    {  n_delete_from_feedback_input(); },
	
	"LEFT":       function()     { o_move_feedback_cursor_left();  },
        "RIGHT":      function()     { p_move_feedback_cursor_right(); },
	
	"ENTER":      function() {  _feedback_event(_feedback_input);  },
    }
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

	var events = _mode_events[ _mode ];        /**  Getting the proper event map for this mode.             **/

	if (typeof event_name == "string" && typeof events[event_name] == "function") {       /**  "CTRL-C", "ENTER", etc     **/
	    events[event_name]();
        } else if (key.charCodeAt(0) > 31 && key.charCodeAt(0) < 127) {   /**  Most keys, like letters, call the "TEXT" event.  **/
	    events["TEXT"](key);
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
    var buff_lines = _buffer.split("\n");
    var overflow   = 0;

    for (var i = 0; i < buff_lines.length; i++) {
        var line = buff_lines[i];
	var in_frame = ( i >= _scroll && i < (_window_h + _scroll - overflow - 2) );
	    
	while (line.length > _window_w) {                          /**  This WHILE loop breaks down any lines that overflow _window_w.   **/     
	    overflow++;
	    var line_part = line.slice(0, _window_w - 1);
	    if (in_frame) {
		console.log(line_part + "\x1b[2m\\\x1b[0m");           /**  Dim, add "\", undim   **/
	    }
	    line = line.slice(_window_w - 1, line.length);
	}
	if (in_frame) {
	    console.log(line);
	}
    }

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
    if (_mode == "BUFFER-EDITOR") {
        var cursor_position = d_get_cursor_pos();      //  d_get_cursor_pos is an algorithm.  
        process.stdout.write("\x1b[" + cursor_position[0] + ";" + cursor_position[1] + "f");
    } else if (_mode == "FEEDBACK-PROMPT") {
        var x_pos = _feedback_bar.length + 1 + _feedback_cursor;
        process.stdout.write("\x1b[" + (_window_h - 1) + ";" + x_pos + "f");
    }
}

//  Drawing the feedback bar.
function draw_feedback_bar() {
    if (_mode == "FEEDBACK-PROMPT") {                          /**  If we're in feedback mode, draw it cyan.     **/
        process.stdout.write("\x1b[36m"); 
    } else {                                                   /**  If it's buffer mode feedback, dim.           **/
        process.stdout.write("\x1b[2m"); 
    }
    
    process.stdout.write("\x1b[" + (_window_h - 1) + ";0H");   /**  Moving to the bottom row.                    **/
    process.stdout.write(_feedback_bar);                       /**  Write the text.                              **/
    process.stdout.write("\x1b[0m");                           /**  Back to undim text.                          **/
        
    if (_mode == "FEEDBACK-PROMPT") {                          /**  If we're in feedback mode, write the input too.   **/
        process.stdout.write(_feedback_input); 
    } else {
        _feedback_bar = "";
    }
}



////  SECTION 6:  Algorithms.

function a_load_file_to_buffer() {       /**  Getting the file's contents, put it in the "buffer".    **/
    _filename = process.argv[2];
    if ( _filename == undefined ) {
        l_feedback_prompt("Enter a file name to create a new file: ");
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

function b_quit() {                      /**  Quit out of kTTY.                 **/
    if (_modified) {            /**  If the file has been modified, start the prompts!    **/
        l_feedback_prompt( "Modified buffer exists! Want to save? (y/n)" );
        _feedback_event = function(response) {               /**  Prompt 1:  Save before exiting?   **/
            if (response.toLowerCase() == "y") {
                k_save_buffer_to_file();
                b_quit();
            } else if (response.toLowerCase() == "n") {
                l_feedback_prompt("Quit without saving? Your changes will be lost! (y/n) ");
                draw();
                _feedback_event = function(response) {       /**  Prompt 2:  Quit without saving??   **/
                    if (response.toLowerCase() == "y") {
                        console.clear();
                        process.exit();
                    } else {
                        _feedback_input = "";
                        _mode = "BUFFER-EDITOR";
                        _feedback_bar = "";
                        draw();
                    }
                }
            } else {
                _feedback_input = "";
                _feedback_bar = "Modified buffer exists! Want to save? (Type 'y' or 'n') ";
            }
        }
    } else {                 /**  If the file HASN'T been modified, since the last save just quit!     **/
        console.clear();
        process.exit();
    }
}

function c_get_window_size() {           /**  Get the window size.              **/
    _window_h = process.stdout.rows;
    _window_w = process.stdout.columns;
}

function d_get_cursor_pos() {            /**  Returns a 2 index array, [int line, int char]           **/

    var cursor_position = [1,1];
    for (var i = 0; i < _cursor_buffer_pos; i++) {  //  Loop through the buffer to count \n's

	var current = _buffer[i];
        if (current == "\n" || cursor_position[1] >= _window_w - 1) {
            cursor_position[0]++;        /**  Advance a line.        **/
            cursor_position[1] = 1;      /**  Reset character pos.   **/
        } else {
            cursor_position[1]++;        /**  Advance a character.   **/
        }
    }

    cursor_position[0] -= _scroll;
    if (cursor_position[0] == 0) {
        _scroll--;
	return d_get_cursor_pos();
    } else if (cursor_position[0] > _window_h - 2) {
        _scroll++;
	return d_get_cursor_pos();
    } else {
	return cursor_position;
    }

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

    var current_x_pos = 1;    
    var current_line_length = 0;  
    var found_line_start = false;            /**    We'll use this flag to find the NEXT line start.   **/
    var next_line_length = 0;            
    
    for (var i = 0; i < _buffer.length; i++ ) {
    
	if ( i < _cursor_buffer_pos ) {      /**    1. Get current_x_pos           **/
            if (_buffer[i] == "\n") {
                current_x_pos = 1;
            } else {
                current_x_pos++;
            }
	        
	} else if ( !found_line_start ) {    /**    2. Get current_line_length     **/
	    if (_buffer[i] == "\n") {
		current_line_length += current_x_pos;
		found_line_start = true;
	    }
	    else {
		current_line_length++;
	    }
	        
	} else if ( found_line_start ) {     /**    3. Get next_line_length        **/
	    if (_buffer[i] == "\n") {
		break;   // Exit for loop early 
	    } else {
		next_line_length++;
	    }
	}
    }
    
    if (next_line_length >= current_x_pos) {          /**   If we're going down **into** a line...        **/
        _cursor_buffer_pos += current_line_length;
    }
    else if (next_line_length < current_x_pos) {    /**   If we're going down **above** a line...       **/
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

function l_feedback_prompt(prompt_text) {
    _mode = "FEEDBACK-PROMPT";
    _feedback_cursor = 0;
    _feedback_input = "";
    _feedback_bar = prompt_text;
}

function m_add_to_feedback_input(new_text) {
    var new_fb_input   = _feedback_input.slice(0, _feedback_cursor);
    new_fb_input      += new_text;
    new_fb_input      += _feedback_input.slice(_feedback_cursor, _feedback_input.length);
    _feedback_input = new_fb_input;
    _feedback_cursor++;
}

function n_delete_from_feedback_input() {
    if ( _feedback_cursor == 0 ) {      /**   Don't let the cursor position be negative.    **/
        return;
    }

    var new_fb_input = _feedback_input.slice(0, _feedback_cursor - 1);
    new_fb_input    += _feedback_input.slice(_feedback_cursor, _feedback_input.length);
    _feedback_input  = new_fb_input;
    _feedback_cursor--;
}

function o_move_feedback_cursor_left() {
    _feedback_cursor--;
    if (_feedback_cursor < 0) {     //  Don't let the feedback cursor go past the beginning.
	_feedback_cursor++;
    }
}

function p_move_feedback_cursor_right() {
    _feedback_cursor++;
    if (_feedback_cursor > _feedback_input.length) {      // don't "surpass" the end of _feeback_input
        _feedback_cursor--;
    }
}