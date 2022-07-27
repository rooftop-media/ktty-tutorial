# Tutorial for Ktty, version 2.0

<br/><br/><br/><br/><br/><br/><br/><br/>



##  Prerequisites

This tutorial requires that you've completed the [version 1.0 tutorial](https://github.com/rooftop-media/ktty-tutorial/blob/main/version1.0/tutorial.md).

<br/><br/><br/><br/><br/><br/><br/><br/>



##  Table of Contents

Click a part title to jump down to it, in this file.

| Tutorial Parts              | Description  | Status | # of Steps |
| --------------------------- | ------------ | ------ | ---------- |
| [Part A - Adding the Menu Bar](https://github.com/rooftop-media/ktty-tutorial/blob/main/version2.0/tutorial.md#part-a) | Draw the Manu Bar at the top of the screen. | Todo | ? |
| Part B - Save As... |   | Todo | ? |
| Part C - Find and Replace |   | Todo | ? |
| Part D - Selecting Text |   | Todo | ? |
| Part E - Copy, Cut and Paste |   | Todo | ? |
| Part F - Context Menu |  | Todo | ? |
| Part G - Multiple Cursors |  | Todo | ? | 

<br/><br/><br/><br/><br/><br/><br/><br/>





<h2 id="part-a" align="center">  Part A:  Drawing the Menu Bar </h2>

In this section, we'll add a new object to our object-oriented plan -- the MenuBar.
The user will be able to press the ESC key to enter Menu Bar mode, and select a menu bar option.

<br/><br/><br/><br/>



<h3 id="a-1">  ☑️ Step 1: Add the <code>MenuBar</code> object  </h3>

We'll add a new object called the `MenuBar` right after the end of the `FeedbackBar` functions. 

```javascript
//  The menu bar. 
var MenuBar = {
    cursor_x:      0,
    cursor_y:      0,
    confirm_event:   function() {},

    options: {
        "file": {
            "save": function() {},
            "save as...": function() {},
            "quit": function() {},
        },
        "edit": {
            "copy": function() {},
            "cut": function() {},
            "paste": function() {},
            "undo": function() {},
            "redo": function() {},
            "find": function() {},
            "replace": function() {},
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
        if (Keyboard.focus_item == this && i == MenuBar.cursor_x) {
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

    process.stdout.write("\x1b[0m");                               /**  Back to undim text.               **/
}
function MenuBar_focus() {
    Keyboard.focus_item = this;
    FeedbackBar.text = "Focusing on the menu bar";
}
function MenuBar_get_cursor_coords() {
    return [0,0];
}
function MenuBar_move_cursor_left() {
    if (MenuBar.cursor_x > 0) {
        MenuBar.cursor_x--;
    }
}
function MenuBar_move_cursor_right() {
    var options = Object.keys(MenuBar.options);
    if (MenuBar.cursor_x < options.length) {
        MenuBar.cursor_x++;
    }
}
```

<br/><br/><br/><br/>




<h3 id="a-2">  ☑️ Step 2. Edit <code>Window.draw</code>  </h3>

Now we need to call the MenuBar.draw method in Window_draw:

```javascript
function Window_draw() {
    Keyboard.cursor_coords = Keyboard.focus_item.get_cursor_coords();

    Buffer.draw();
    StatusBar.draw();
    FeedbackBar.draw();
    MenuBar.draw();
    
    Keyboard.position_cursor();
}
```

<br/><br/><br/><br/>



<h3 id="a-3"> ☑️ Step 3. ☞ Test the code!  </h3>

Test the code now to see the menu bar drawn nicely at the top of the screen!
Unfortunately, it's also blocking the first line of our file.  We'll fix that in the next step. 

<br/><br/><br/><br/>



<h3 id="a-4"> ☑️ Step 4. Editing <code>Buffer</code>  </h3>

We'll change the Buffer object in three places: 
 - We'll update the Buffer's `draw` function, to account for the menu bar. This includes:
   - Drawing the buffer text one line lower.
   - Stopping the overflow text one line higher.
 - We'll update the `get_cursor_coords` function, including:
   - Starting the cursor at [2,1] instead of [1,1]
   - Scrolling up when the cursor is equal to 1, instead of 0
 - We'll add the `ESC` key event, to shift the focus to the MenuBar.

```javascript
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

/**  Other buffer functions  **/

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
    if (cursor_coords[0] <= 0) {
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
```


<br/><br/><br/><br/>



<h3 id="a-5"> ☑️ Step 5. Editing <code>Keyboard</code>  </h3>

We'll also need to update the Keyboard object's "event names" to include the `ESC` key. 

```javascript
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
```

<br/><br/><br/><br/>




<h3 id="a-?"> ☑️ Step ?. ❖ Part A review. </h3>

The complete code for Part A is available [here](https://github.com/rooftop-media/ktty-tutorial/blob/main/version2.0/part_A.js).

<br/><br/><br/><br/><br/><br/><br/><br/>




<h2 id="part-b" align="center">  Part B:    </h2>

<br/><br/><br/><br/>



<h3 id="b-?">  ☑️ Step ?:  ❖  Part B review. </h3>

<br/><br/><br/><br/><br/><br/><br/><br/>













