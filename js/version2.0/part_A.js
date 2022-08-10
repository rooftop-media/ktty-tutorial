#!/usr/bin/env node
;

////  SECTION 1:  Imports

//  Importing NodeJS libraries.                                                                                                                        
var process      = require("process");
var fs           = require("fs");



////  SECTION 2:  Objects


var Buffer = {
    text:         "",
    filename:     "",
    modified:     false,
    cursor_pos:   0,
    scroll_pos:   0,
    actions_history:      [],
    undo_count:   0,

    focus:             Buffer_focus,
    load_file:         Buffer_load_file,
    get_cursor_coords: Buffer_get_cursor_coords,
    draw:              Buffer_draw,

    events:            {
        "CTRL-C":     function() {  Window.quit()  },

        "LEFT":       Buffer_move_cursor_left,
        "RIGHT":      Buffer_move_cursor_right,
        "UP":         Buffer_move_cursor_up,
        "DOWN":       Buffer_move_cursor_down,

        "TEXT":       function(key) {  Buffer_add_to_text(key, true);   },
        "ENTER":      function()    {  Buffer_add_to_text("\n", true);  },
        "BACKSPACE":  function()    {  Buffer_delete_from_text(true)    },

        "CTRL-S":     Buffer_save_to_file,

        "CTRL-Z":     Buffer_undo,                                                                                                                           
        "CTRL-Y":     Buffer_redo, 

        "ESC":        function()     {  MenuBar.focus();  },
    }
  
};
function Buffer_focus() {
    Keyboard.focus_item = this;
    FeedbackBar.text    = "";
    FeedbackBar.input   = "";
}
function Buffer_load_file() {
    this.filename = process.argv[2];
    if ( this.filename == undefined ) {
        FeedbackBar.focus();
        FeedbackBar.text = "No file name given!  Enter a new filename:";
        FeedbackBar.confirm_event = function(new_filename) {
            Buffer.filename = new_filename;
            Buffer.focus();
            FeedbackBar.text = "";
	    }
    } else {
        try {
            this.text = fs.readFileSync( this.filename, {encoding: 'utf8'} );
	          this.text = this.text.replace(/\r\n/g, '\n');
            this.text = this.text.replace(/\r/g, '');
        } catch (err) {
                FeedbackBar.focus();
                FeedbackBar.text    = "Unable to find a file at '" + this.filepath + "'.  Enter a new filename:";
                FeedbackBar.input   = this.filename;
                FeedbackBar.confirm_event = function(new_filename) {
                Buffer.filename = new_filename;
                Buffer.focus();
		        FeedbackBar.text = "";
            }
        }
    }
}
function Buffer_get_cursor_coords() {            /**  Returns a 2 index array, [int line, int char]           **/

    var cursor_coords = [2,1];                      //  line, char coord of cursor
    for (var i = 0; i < this.cursor_pos; i++) {  //  Loop through the buffer to count \n's  

        var current = this.text[i];
        if (current == "\n" || cursor_coords[1] >= Window.width - 1) {
            cursor_coords[0]++;        /**  Advance a line.        **/
	          cursor_coords[1] = 1;      /**  Reset character pos.   **/
	      } else {
            cursor_coords[1]++;        /**  Advance a character.   **/
        }
    }
    
    cursor_coords[0] -= Buffer.scroll_pos;
    if (cursor_coords[0] <= 1) {
        Buffer.scroll_pos--;
	    return Buffer.get_cursor_coords();
    } else if (cursor_coords[0] > Window.height - 3) {
        Buffer.scroll_pos++;
	    return Buffer.get_cursor_coords();
    } else {
    	return cursor_coords;
    }
    
}
function Buffer_draw() {

    console.clear();
    process.stdout.write("\x1b[2;0H");   /**  Moving down one line to account for the menu bar.  **/
    var buff_lines = this.text.split("\n");
    var overflow   = 0;

    for (var i = 0; i < buff_lines.length; i++) {
        var line = buff_lines[i];
        var overflow_lines = [];
        while (line.length > Window.width) {                          /**  This WHILE loop breaks down any lines that overflow Window.width.   **/     
            overflow++;
            var line_part = line.slice(0, Window.width - 1);
            overflow_lines.push(line_part);
            line = line.slice(Window.width - 1, line.length);
        }
	
        if (
            i >= this.scroll_pos - overflow &&               /* Start drawing at the line at scroll_pos - overflow */
            i < (Window.height + this.scroll_pos - overflow - 4) /* Stop drawing at the window height plus this offset. */
           ) {  
            for (var j = 0; j < overflow_lines.length; j++) {
                console.log(overflow_lines[j] + "\x1b[2m\\\x1b[0m");   /**  Dim, add "\", undim   **/
            }
            console.log(line);
        }
    }
}

//  Buffer event functions:
function Buffer_move_cursor_left() {
    Buffer.cursor_pos -= 1;
    if ( Buffer.cursor_pos < 0 ) {         /**   Don't let the cursor position be negative.         **/
        Buffer.cursor_pos++;
    } else {
        FeedbackBar.text = "Moved left.";
    }
}
function Buffer_move_cursor_right() {
    Buffer.cursor_pos += 1;
    var buff_limit = Buffer.text.length;   /**   Don't let the cursor position exceed the buffer.   **/
    if ( Buffer.cursor_pos > buff_limit ) {
        Buffer.cursor_pos--;
    } else {
        FeedbackBar.text = "Moved right.";
    }
}
function Buffer_move_cursor_up() {
    var current_x_pos = 1;               /**   To find the xpos of the cursor on the current line.   **/
    var prev_line_length = -1;           /**   To find the length of the *prev* line, to jump back.  **/
    for (var i = 0; i < Buffer.cursor_pos; i++ ) {
        if (Buffer.text[i] == "\n") {
            prev_line_length = current_x_pos;
            current_x_pos = 1;
        } else {
            current_x_pos++;
        }
    }
    if (prev_line_length == -1) {                  /**   If there is no previous line...              */
        Buffer.cursor_pos = 0;
    }
    else if (prev_line_length > current_x_pos) {   /**   If we're going up **into** a line...        **/
        Buffer.cursor_pos -= prev_line_length;
    }
    else if (prev_line_length <= current_x_pos) {  /**   If we're going up **above** a line...       **/
        Buffer.cursor_pos -= current_x_pos;
    }

    FeedbackBar.text = "Moved up.";
}
function Buffer_move_cursor_down() {
    var current_x_pos = 1;
    var current_line_length = 0;
    var found_line_start = false;            /**    We'll use this flag to find the NEXT line start.   **/
    var next_line_length = 0;

    for (var i = 0; i < Buffer.text.length; i++ ) {

        if ( i < Buffer.cursor_pos ) {      /**    1. Get current_x_pos           **/
            if (Buffer.text[i] == "\n") {
                current_x_pos = 1;
            } else {
                current_x_pos++;
            }

        } else if ( !found_line_start ) {    /**    2. Get current_line_length     **/
            if (Buffer.text[i] == "\n") {
                current_line_length += current_x_pos;
                found_line_start = true;
            }
            else {
                current_line_length++;
            }

        } else if ( found_line_start ) {     /**    3. Get next_line_length        **/
            if (Buffer.text[i] == "\n") {
                break;   // Exit for loop early                                                                                                        
            } else {
                next_line_length++;
            }
        } //  End of "if" statements
    } //  End of "for" loop
    
    if (!found_line_start) {                          /**   If there is no next line...                    */
        Buffer.cursor_pos += current_line_length;
    } 
    else if (next_line_length >= current_x_pos) {     /**   If we're going down **into** a line...        **/
	Buffer.cursor_pos += current_line_length;
    }
    else if (next_line_length < current_x_pos) {      /**   If we're going down **above** a line...                **/
        Buffer.cursor_pos += current_line_length;
        Buffer.cursor_pos -= current_x_pos;           /**   This should get us to the start of the next line...    **/
        Buffer.cursor_pos += next_line_length + 1;    /**   ...and then we jump to the end.                        **/
    }

    var buff_limit = Buffer.text.length;              /**   Don't let the cursor position exceed the buffer.       **/
    if ( Buffer.cursor_pos > buff_limit ) {
        Buffer.cursor_pos--;
    } else {
        FeedbackBar.text = "Moved down.";
    }
}
function Buffer_add_to_text(new_text, record) {
    if (Buffer.undo_count > 0 && record) {            /**   Reset undo count if we're recording */
        var last_undoable = Buffer.actions_history.length - Buffer.undo_count;
        Buffer.actions_history = Buffer.actions_history.slice(0, last_undoable);
        Buffer.undo_count = 0;
    }
    var new_buffer = Buffer.text.slice(0, Buffer.cursor_pos);
    new_buffer    += new_text;
    new_buffer    += Buffer.text.slice(Buffer.cursor_pos, Buffer.text.length);
    Buffer.text    = new_buffer;
    Buffer.cursor_pos++;
    FeedbackBar.text = "Typed '" + new_text + "'";
    if (!Buffer.modified) {
        Buffer.modified = true;
    }
    if (record) {
        Buffer.actions_history.push("add:" + new_text + "," + Buffer.cursor_pos);
    }

}
function Buffer_delete_from_text(record) {
    if ( Buffer.cursor_position == 0 ) {      /**   Don't let the cursor position be negative.    **/
        return;
    }
    if (Buffer.undo_count > 0 && record) {    /**   Reset undo count if we're recording */
        var last_undoable = Buffer.actions_history.length - Buffer.undo_count;
        Buffer.actions_history = Buffer.actions_history.slice(0, last_undoable);
        Buffer.undo_count = 0;
    }
    if (record) {
        var text = Buffer.text[Buffer.cursor_pos - 1];
        Buffer.actions_history.push("delete:" + text + "," + Buffer.cursor_pos);
    }
    var new_buffer = Buffer.text.slice(0, Buffer.cursor_pos - 1);
    new_buffer    += Buffer.text.slice(Buffer.cursor_pos, Buffer.text.length);
    Buffer.text = new_buffer;
    Buffer.cursor_pos--;
    FeedbackBar.text = "Text deleted.";
    if (!Buffer.modified && Buffer.cursor_pos != 0) {
        Buffer.modified = true;
    }
    
}
function Buffer_save_to_file() {
    fs.writeFileSync(Buffer.filename, Buffer.text, { encoding: 'utf8' } );
    Buffer.modified = false;
    FeedbackBar.text = "saved :)";
}
function Buffer_undo() {
    var last_action_index = Buffer.actions_history.length - Buffer.undo_count - 1;
    if (last_action_index < 0) {
        return;
    }
    var last_action = Buffer.actions_history[last_action_index];
    last_action = last_action.split(":");
    var action_type = last_action[0];
    var action_data = last_action[1].split(",");
    var text = action_data[0];
    var cursor_position = Number(action_data[1]);
    
    if (action_type == "add") {
        Buffer.cursor_pos = cursor_position;
        Buffer_delete_from_text(false);
        Window.draw();
        Buffer.undo_count++;
    } else if (action_type == "delete") {
        Buffer.cursor_pos = cursor_position - 1;
        Buffer_add_to_text(text, false);
        Window.draw();
        Buffer.undo_count++;
    }
    FeedbackBar.text = "Undo!";
}

function Buffer_redo() {
    if (Buffer.undo_count <= 0) {
        return;
    }
    var action_to_redo_index = Buffer.actions_history.length - Buffer.undo_count;
    var action_to_redo = Buffer.actions_history[action_to_redo_index];
    action_to_redo = action_to_redo.split(":");
    var action_type = action_to_redo[0];
    var action_data = action_to_redo[1].split(",");
    var text = action_data[0];
    var cursor_position = Number(action_data[1]);
    
    if (action_type == "add") {
        Buffer.cursor_pos = cursor_position - 1;
        Buffer_add_to_text(text, false);
        Window.draw();
        Buffer.undo_count--;
    } else if (action_type == "delete") {
        Buffer.cursor_pos = cursor_position;
        Buffer_delete_from_text(false);
        Window.draw();
        Buffer.undo_count--;
    }
    FeedbackBar.text = "Redo!";
}

//  The status bar
var StatusBar = { 
    draw:   StatusBar_draw,
};
function StatusBar_draw() {
    process.stdout.write("\x1b[" + (Window.height - 2) + ";0H");   /**  Moving to the 2nd to bottom row.  **/
    process.stdout.write("\x1b[7m");                               /**  Reverse video.                    **/

    var status_bar_text = "  " + Buffer.filename;                  /**  Add the filename                  **/
    if (Buffer.modified) {                                         /**  Add the [modified] indicator.     **/
        status_bar_text += "     [modified]";
    } else {
        status_bar_text += "               ";
    }

    var cursor_position = Buffer.get_cursor_coords(); 
    status_bar_text += "  cursor on line " + (cursor_position[0] + Buffer.scroll_pos);
    status_bar_text += ", row " + cursor_position[1];

    status_bar_text += "   Scroll: " + Buffer.scroll_pos;

    while (status_bar_text.length < Window.width) {                   /**  Padding it with whitespace.       **/
        status_bar_text += " ";
    }

    process.stdout.write(status_bar_text);                            /**  Output the status bar string.     **/
    process.stdout.write("\x1b[0m");                                  /**  No more reverse video.            **/
}

//  The feedback bar
var FeedbackBar = {
    text:            "",
    input:           "",
    cursor_pos:      0,
    confirm_event:   function(response) {},

    draw:            FeedbackBar_draw,
    focus:           FeedbackBar_focus,
    get_cursor_coords: FeedbackBar_get_cursor_coords,
    
    events:            {
        "CTRL-C":     function() {  Window.quit()  },

        "LEFT":       FeedbackBar_move_cursor_left,
        "RIGHT":      FeedbackBar_move_cursor_right,

        "TEXT":       function(key) {  FeedbackBar_add_to_text(key);   },
	      "BACKSPACE":  FeedbackBar_delete_from_text,
        "ENTER":      function()    {  FeedbackBar.confirm_event(FeedbackBar.input);  },
    }
};
function FeedbackBar_focus() {
    Keyboard.focus_item  = this;
    this.cursor_pos      = 0;
    this.input           = "";
}
function FeedbackBar_draw() {
    if (Keyboard.focus_item === this) {
        process.stdout.write("\x1b[36m");                          /**  Cyan text.                        **/
    } else {
        process.stdout.write("\x1b[2m");                           /**  Dim text.                         **/
    }
    process.stdout.write("\x1b[" + (Window.height - 1) + ";0H");   /**  Moving to the bottom row.         **/
    process.stdout.write(this.text + " ");
    if (Keyboard.focus_item === this) {
        process.stdout.write("\x1b[0m");
        console.log(this.input);
    }
    _feedback_bar = "";
    process.stdout.write("\x1b[0m");                               /**  Back to undim text.               **/
}
function FeedbackBar_get_cursor_coords() {
    var cursor_x = this.text.length + this.cursor_pos + 2;
    var cursor_y = Window.height - 1;
    return [cursor_y, cursor_x];
}
// FeedbackBar event functions...
function FeedbackBar_add_to_text(key) {
    var _this = FeedbackBar;
    var new_input = _this.input.slice(0, _this.cursor_pos);
    new_input    += key;
    new_input    += _this.input.slice(_this.cursor_pos, _this.input.length);
    _this.input   = new_input;
    _this.cursor_pos++;
}
function FeedbackBar_delete_from_text() {
    var _this = FeedbackBar;
    if ( _this.cursor_pos == 0 ) {      /**   Don't let the cursor position be negative.    **/
        return;
    }
    var new_input  = _this.input.slice(0, _this.cursor_pos - 1);
    new_input     += _this.input.slice(_this.cursor_pos, _this.input.length);
    _this.input    = new_input;
    _this.cursor_pos--;
}
function FeedbackBar_move_cursor_left() {
    var _this = FeedbackBar;
    _this.cursor_pos -= 1;
    if ( _this.cursor_pos < 0 ) {                  /**   Don't let the cursor position be negative.         **/
        _this.cursor_pos++;
    } else {
        _this.draw();
	      _this.position_cursor();
    }
}
function FeedbackBar_move_cursor_right() {
    var _this = FeedbackBar;
    _this.cursor_pos += 1;
    if ( _this.cursor_pos > _this.input.length ) {  /**   Don't let the cursor position exceed the buffer.   **/
        _this.cursor_pos--;
    } else {
        _this.draw();
	      _this.position_cursor();
    }
}

//  The menu bar. 
var MenuBar = {
    cursor_x:      0,
    cursor_y:      0,
    confirm_event:   function() {},

    options: {
        "file": {
            "save       ctrl-s": function() { Buffer_save_to_file(); },
            "save as... ": function() {},
            "quit       ctrl-c": function() { Window_quit(); },
        },
        "edit": {
            "copy": function() {},
            "cut        ctrl-x": function() {},
            "paste      ctrl-v": function() {},
            "undo       ctrl-z": function() { Buffer_undo(); },
            "redo       ctrl-y": function() { Buffer_redo(); },
            "find       ctrl-f": function() {},
            "replace    ctrl-r": function() {},
        },
        "view": {
            "file type >": {
                ".html": function() {},
                ".js": function() {},
                ".css": function() {},
                ".cpp": function() {},
            },
        }
    },

    draw:            MenuBar_draw,
    focus:           MenuBar_focus,
    get_cursor_coords: MenuBar_get_cursor_coords,
    
    events:            {
        "CTRL-C":     function() {  Window.quit()  },

        "LEFT":       MenuBar_move_cursor_left,
        "RIGHT":      MenuBar_move_cursor_right,
        "UP":         MenuBar_move_cursor_up,
        "DOWN":       MenuBar_move_cursor_down,

        "ENTER":      function()    {  MenuBar.confirm_event();  },
        "ESC":        function()    {  Buffer.focus();  },
    }
}
function MenuBar_draw() {
    
    process.stdout.write("\x1b[47m");                              /**  White background.                    **/
    process.stdout.write("\x1b[30m");                              /**  Black text.                    **/

    process.stdout.write("\x1b[1;0H");                             /**  Moving to the top row.         **/
    var menuBarText = " ktty   ";
    var menuOpts = Object.keys(MenuBar.options);
    for (var i = 0; i < menuOpts.length; i++) {
        if (
            Keyboard.focus_item == this && 
            i == MenuBar.cursor_x &&
            MenuBar.cursor_y == 0
           ) {
            menuBarText += "\x1b[44m\x1b[37m"; 
            menuBarText += menuOpts[i] + "   ";
            menuBarText += "\x1b[47m\x1b[30m"; 
        } else {
            menuBarText += menuOpts[i] + "   ";
        }
    }
    process.stdout.write(menuBarText)
    for (var i = menuBarText.length; i < Window.width; i++) {
        process.stdout.write(" ");
    }

    if (Keyboard.focus_item != MenuBar) {
        process.stdout.write("\x1b[0m"); 
        return;
    }

    //  Drawing the current dropdown menu
    var row_num = 9;
    for (var x = 0; x < MenuBar.cursor_x; x++) {
        row_num += menuOpts[x].length + 3
    }
    var subMenu = MenuBar.options[menuOpts[MenuBar.cursor_x]];
    var subMenuOpts = Object.keys(subMenu);
    for (var i = 0; i < subMenuOpts.length; i++) {
        process.stdout.write("\x1b[" + (i+2) + ";" + row_num + "H");
        if (MenuBar.cursor_y - 1 == i) {
            process.stdout.write("\x1b[44m\x1b[37m");
            process.stdout.write(subMenuOpts[i]);
        } else {
            process.stdout.write(subMenuOpts[i]);
        }
        
        for (var y = subMenuOpts[i].length; y < 20; y++) {
            process.stdout.write(" ");
        }
        if (MenuBar.cursor_y - 1 == i) {
            process.stdout.write("\x1b[47m\x1b[30m");
        }
    }

    process.stdout.write("\x1b[0m");                               /**  Back to undim text.               **/
}
function MenuBar_focus() {
    Keyboard.focus_item = this;
    MenuBar.cursor_x = 0;
    MenuBar.cursor_y = 0;
    FeedbackBar.text = "Focusing on the menu bar";
}
function MenuBar_get_cursor_coords() {
    var options = Object.keys(MenuBar.options);
    var row_num = 9;
    for (var x = 0; x < MenuBar.cursor_x; x++) {
        row_num += options[x].length + 3
    }
    return [MenuBar.cursor_y+1,row_num];
}
function MenuBar_move_cursor_left() {
    if (MenuBar.cursor_x > 0) {
        MenuBar.cursor_x--;
        MenuBar.cursor_y = 0;
    }
}
function MenuBar_move_cursor_right() {
    var options = Object.keys(MenuBar.options);
    if (MenuBar.cursor_x < options.length - 1) {
        MenuBar.cursor_x++;
        MenuBar.cursor_y = 0;
    }
}
function MenuBar_move_cursor_up() {
    if (MenuBar.cursor_y > 0) {
        MenuBar.cursor_y--;
    }
    if (MenuBar.cursor_y > 0) {
        var options = Object.keys(MenuBar.options);
        var subMenu = MenuBar.options[options[MenuBar.cursor_x]];
        var subMenuOpts = Object.keys(subMenu);
        MenuBar.confirm_event = subMenu[subMenuOpts[MenuBar.cursor_y-1]];
    } else {
        MenuBar.confirmEvent = function() {};
    }
}
function MenuBar_move_cursor_down() {
    var options = Object.keys(MenuBar.options);
    var subMenu = MenuBar.options[options[MenuBar.cursor_x]];
    var subMenuOpts = Object.keys(subMenu);
    if (MenuBar.cursor_y < subMenuOpts.length) {
        MenuBar.cursor_y++;
    }
    if (MenuBar.cursor_y > 0) {
        MenuBar.confirm_event = subMenu[subMenuOpts[MenuBar.cursor_y-1]];
    } else {
        MenuBar.confirmEvent = function() {};
    }
}

//  The window.
var Window = {
    height:    100,
    width:     100,
  
    get_size:  Window_get_size,
    draw:      Window_draw,
    quit:      Window_quit
};
function Window_get_size() {
    this.height = process.stdout.rows;
    this.width  = process.stdout.columns;
}
function Window_draw() {
    Keyboard.cursor_coords = Keyboard.focus_item.get_cursor_coords();

    Buffer.draw();
    StatusBar.draw();
    FeedbackBar.draw();
    MenuBar.draw();
    
    Keyboard.position_cursor();
}
function Window_quit() {
    if (!Buffer.modified) {
	      console.clear();
	      process.exit();
    } else {
        FeedbackBar.focus();
        FeedbackBar.text = "Modified buffer exists!! Save before quitting? (y/n)";
        FeedbackBar.confirm_event = function(response) {
            if (response.toLowerCase() == "y") {
                Buffer.events["CTRL-S"]();
                console.clear();
                process.exit();
            } else if (response.toLowerCase() == "n") {
                FeedbackBar.focus();
                FeedbackBar.text = "Quit without saving? Changes will be lost! (y/n)";
                FeedbackBar.confirm_event = function(response) {
                    if (response.toLowerCase() == "y") {
                        console.clear();
                        process.exit();
                    } else {
                        FeedbackBar.text = "";
                        Buffer.focus();
                    }
                }
            } else {
                FeedbackBar.text = "Modified buffer exists!! Save before quitting? (Respond with 'y' or 'n')";
                FeedbackBar.input = "";
            }	    
        }
    }
}

//  The keyboard.
var Keyboard = {
    focus_item:    Buffer,
    cursor_coords: [0, 0],        /*  Cursor position coordinates: line, char */

    event_names: {
        "\u001b[A": "UP",
        "\u001b[B": "DOWN",
        "\u001b[C": "RIGHT",
        "\u001b[D": "LEFT",
        "\u007f":   "BACKSPACE",
        "\u0008":   "BACKSPACE",  /*  for powershell  */
        "\u000D":   "ENTER",
        "\u0003":   "CTRL-C",
        "\u0013":   "CTRL-S",
        "\u001a":   "CTRL-Z",
        "\u0019":   "CTRL-Y",
        "\u001b":   "ESC",
    },
  
    position_cursor: function() {
        process.stdout.write("\x1b[" + this.cursor_coords[0] + ";" + this.cursor_coords[1] + "f");
    },
    map_events: Keyboard_map_events
  
};
function Keyboard_map_events() {
    //  Map keyboard input                                                                                                                         
    var stdin = process.stdin;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");

    var _this = this;
    var key_reaction = function(key) {

	      var event_name = _this.event_names[key];             /**  Getting the event name from the keycode, like "CTRL-C" from "\u0003".  **/

        if (typeof event_name == "string" && typeof _this.focus_item.events[event_name] == "function") {   /**  "CTRL-C", "ENTER", etc   **/
            _this.focus_item.events[event_name]();
        } else if (key.charCodeAt(0) > 31 && key.charCodeAt(0) < 127) {            /**  Most keys, like letters, call the "TEXT" event.  **/
            _this.focus_item.events["TEXT"](key);
        }
	      Window.draw();                                       /**  Redraw the whole screen on any keypress.                               **/
    };

    stdin.on("data", key_reaction);

    process.stdout.on('resize', () => {
        Window.get_size();
        Window.draw();
    });
}


////  SECTION 3:  Boot stuff. 

//  The boot sequence.
function boot() {

    /**  Load a file to the buffer.       **/
    Buffer.load_file();

    /**  Load window height & width.      **/
    Window.get_size();

    /**  Map the event listeners.         **/
    Keyboard.map_events();

    /**  Update the screen.               **/
    Window.draw();

}
boot();  //  Boot it!! 
