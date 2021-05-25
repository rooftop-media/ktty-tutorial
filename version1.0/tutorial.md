# Tutorial for Ktty, version 1.0

<br/><br/><br/><br/><br/><br/><br/><br/>



##  Prerequisites

This tutorial requires that you've completed the [initial set up steps](https://github.com/rooftop-media/ktty-tutorial/blob/main/readme.md#initial-steps).

<br/><br/><br/><br/><br/><br/><br/><br/>



##  Table of Contents

Click a part title to jump down to it, in this file.

| Tutorial Parts              | Description  | Status |
| --------------------------- | ------------ | ------ |
| [Part A - Drawing the Buffer](https://github.com/rooftop-media/ktty-tutorial/blob/main/version1.0/tutorial.md#part-a) | Draw the buffer to the screen, map very basic keyboard controls. | Complete, tested. |
| [Part B - Drawing the Status Bar](https://github.com/rooftop-media/ktty-tutorial/blob/main/version1.0/tutorial.md#part-b) | Draw a status bar at the bottom of the screen, with file info. | Complete, tested. |
| [Part C - The Cursor & Feedback Bar](https://github.com/rooftop-media/ktty-tutorial/blob/main/version1.0/tutorial.md#part-c) | Map arrow keys, display feedback when they're pressed. | Complete, tested.  |
| [Part D - File Editing](https://github.com/rooftop-media/ktty-tutorial/blob/main/version1.0/tutorial.md#part-d) | Add and delete text from the text buffer accurately. | Complete, tested. |
| [Part E - Feedback Mode](https://github.com/rooftop-media/ktty-tutorial/blob/main/version1.0/tutorial.md#part-e) | For ex, prompt before quitting with a modified buffer. | In progress. |
| [Part F - Scroll & Resize](https://github.com/rooftop-media/ktty-tutorial/blob/main/version1.0/tutorial.md#part-f) | Handle text overflow, scroll, & resize. | Todo |
| [Part G - Undo & Redo](https://github.com/rooftop-media/ktty-tutorial/blob/main/version1.0/tutorial.md#part-g) | Adds history tracking, for undo & redo. | Todo |
| [Version 2.0.](https://github.com/rooftop-media/ktty-tutorial/blob/main/version1.0/tutorial.md#v2) | With v1.0 complete, you can move to v2.0. | Todo |

<br/><br/><br/><br/><br/><br/><br/><br/>





<h2 id="part-a" align="center">  Part A:  Drawing the Buffer </h2>

The steps in this part will culminate in us displaying the text file on the screen, along with controls to move and type.  

Along the way, we’ll break the code into 6 code sections with comments, and add code to 5 of 6 sections.  
<br/><br/><br/><br/>



<h3 id="a-1">  ☑️ Step 1:  Add a sample file </h3>

We’ll add a text file to the directory too, called `sample.txt`. 
It just needs a couple lines of any text. Here’s what I wrote:

```
Hello there, world!  Nice to see you!
This is some sample text in sample.txt. :)
Lorem ipsum, foo bar baz.
The quick brown fox jumped over the lazy dog.


Unique New York.
The sixth sheik's sixth sheep's sick. 
She sells seashells by the seashore. 
Cellar door.  White rabbit, white rabbit, white rabbit. 
```

Our goal will be to open & edit this file with ktty. 

<br/><br/><br/><br/>




<h3 id="a-2">  ☑️ Step 2. Outlining ktty.js  </h3>

Let’s go into ktty.js and add some comments to plan our architecture.  

Delete the 2nd line, which was  `console.log("Starting ktty!");`.  
We’ll outline 6 sections. Here’s what we’ll write:

```javascript
#!/usr/bin/env node

////  SECTION 1:  Imports.

////  SECTION 2:  App memory. 

////  SECTION 3:  Boot stuff.

////  SECTION 4:  Events.

////  SECTION 5:  Draw functions.

////  SECTION 6:  Algorithms.
```

We’ll reference these 6 sections throughout the rest of this version.

<br/><br/><br/><br/>



<h3 id="a-3"> ☑️ Step 3. Imports </h3>

We’ll import two standard libraries from NodeJS.  That’s all for the imports, for this version. 


```javascript
////  SECTION 1:  Imports.

//  Importing NodeJS libraries.
var process      = require("process");
var fs           = require("fs");
```

<br/><br/><br/><br/>




<h3 id="a-4"> ☑️ Step 4. App data </h3>

We’ll declare our variables in section 2.  For now, let’s keep it to two variables.  
*(Note that I name global variables starting with an underscore, like `_buffer`.  )*

We’ll save the contents to a variable called `_buffer`.  The buffer can be modified without modifying the file it’s pulled from.   
*(That’s why it’s called the buffer – it’s buffered, aka separate, from the final saved version!)*

We’ll also record the `_filename` being edited.

```javascript
////  SECTION 2:  APP MEMORY

//  Setting up app memory.
var _buffer            = "";      //  The text being edited. 
var _filename          = "";      //  Filename - including extension. 
```

<br/><br/><br/><br/>




<h3 id="a-5"> ☑️ Step 5. Outline boot() </h3>

Now, in section 3 of the code, we’ll outline the boot function.

Ultimately, we'll have *four function calls in boot()*:
 - Loading in a file’s content, by filename.
 - Then, get the window height & width.
 - Then, start capturing keyboard events.
 - Finally, draw the screen for the first time.

We'll leave `get_window_size()` commented out for now.

```javascript
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
```

<br/><br/><br/><br/>



<h3 id="a-6"> ☑️ Step 6. a_load_file_to_buffer() </h3>

This is a we called in the `boot()` function.  
We’ll implement it in section 6, with the algorithms.

```javascript
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
```
<br/><br/><br/><br/>



<h3 id="a-7"> ☑️ Step 7. Outline draw() </h3>


Now, in the code’s 5th section, we’ll outline the draw() function.
*This function will ultimately call 4 different other functions to draw the screen.*

For now, just call the first function `draw_buffer()`. Comment the rest.

```javascript
////  SECTION 5:  DRAW FUNCTIONS

//  The draw function -- called after any data change.
function draw() {
    draw_buffer();
    // draw_status_bar();
    // draw_feedback_bar();
    // position_cursor();
}
```
<br/><br/><br/><br/>




<h3 id="a-8"> ☑️ Step 8. draw_buffer() </h3>

Now let’s implement `draw_buffer()`, which we'll put right below our `draw()` function.

```javascript
////  SECTION 5:  DRAW FUNCTIONS 

function draw() {  ...  }

//  Drawing the buffer.
function draw_buffer() {
    console.clear();
    console.log(_buffer);
}

```
<br/><br/><br/><br/>




<h3 id="a-9"> ☑️ Step 9. map_events() </h3>

Back in the Events section of the code, add this to the end of the main function:

```javascript
////  SECTION 4:  EVENTS

//  Map keyboard input.
function map_events() {

	//  Map keyboard input 
	var stdin = process.stdin;
	stdin.setRawMode(true);
	stdin.resume();
	stdin.setEncoding("utf8");
	stdin.on("data", function(key) {
		//  Exit on ctrl-c
		if (key === "\u0003") {
			b_quit();
		}
		process.stdout.write(key);
	});

}
```

We’ll need to modify the keys so the behaviour is linked to the buffer.
For now, we’ll be able to move the cursor anywhere on the page.  


*Later, we'll need to modify the keys so the behaviour is linked to the buffer.
For now, we’ll be able to move the cursor anywhere on the page.*
<br/><br/><br/><br/>



<h3 id="a-10"> ☑️ Step 10. b_quit() </h3>

The quit function is important -- without it, we'll have a hard time quitting ktty.
For now, we'll keep the quitting process simple -- clear the screen, then exit.
We’ll implement it in section 6:

```javascript
////  SECTION 6:  Algorithms.

function a_load_file_to_buffer() {  ...  }

function b_quit() {
    console.clear();
    process.exit();
}

```
<br/><br/><br/><br/>



<h3 id="a-11"> ☑️ Step 11. ☞  Test the code!  </h3>

Running this code should open the file on the screen, let you move the cursor, and type.
If it throws an error, check for typos & missing code.

```shell
$ ktty sample.txt
```

If you didn't install the `ktty` command globally, you can run `node ./ktty.js sample.txt` instead.

When you're done testing, `ctrl-c` should quit the program.
<br/><br/><br/><br/>



<h3 id="a-11"> ☑️ Step 12. ❖ Part A review. </h3>

The complete code for Part A is available [here](https://github.com/rooftop-media/ktty-tutorial/blob/main/version1.0/part_A.js).

<br/><br/><br/><br/><br/><br/><br/><br/>



<h2 id="part-b" align="center">  Part B:  Drawing the Status Bar </h2>

In this step, we’ll draw the *status bar*, which will display below the text buffer.

The status bar will have the file name, cursor position, & modified status for the buffer above.
<br/><br/><br/><br/>



<h3 id="b-1"> ☑️ Step 1. Adding variables. </h3>
The status bar will describe some app new variables.  

Let’s declare them here:

```javascript
////  SECTION 2:  APP MEMORY

//  Setting up app memory.
var _buffer            = "";      //  The text being edited.
var _filename          = "";      //  Filename - including extension.
var _modified          = false;   //  Has the buffer been modified?
var _cursor_buffer_pos = 0;       //  The position of the cursor in the text.

var _window_h          = 0;       //  Window height (in text char's).
var _window_w          = 0;       //  Window width (in text char's).
```

<br/><br/><br/><br/>


<h3 id="b-2"> ☑️ Step 2. Edit boot() </h3>

It's time to edit `boot()`, to uncomment the `c_get_window_size()` function call.

```javascript
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
```

<br/><br/><br/><br/>



<h3 id="b-3"> ☑️ Step 3. c_get_window_size() </h3>

We'll get the window height and width with this algorithm.
*We’ll need the window height to accurately position the status bar. *

```javascript
////  SECTION 6:  Algorithms.

function a_load_file_to_buffer() { ... }   //  Algorithm A's code is here.
function b_quit() { ... }

//  Get the window size. 
function c_get_window_size() {
    _window_h = process.stdout.rows;
    _window_w = process.stdout.columns;
}
```
<br/><br/><br/><br/>



<h3 id="b-4"> ☑️ Step 4.  Editing draw() </h3>
We also need to uncomment the function call to `draw_status_bar()` ,
which is inside the `draw()` function.

```javascript
////  SECTION 5:  DRAW FUNCTIONS

//  The draw function -- called after any data change. 
function draw() {
    draw_buffer();
    draw_status_bar();
    // draw_feedback_bar(); 
    // position_cursor();
}
```
<br/><br/><br/><br/>



<h3 id="b-5"> ☑️ Step 5. draw_status_bar() </h3>

In this step, we’re going to draw the status bar at the bottom of the window.  
The status bar will be reverse-video, drawn 2 spaces from the BOTTOM of the screen.

The status bar will include:
 - the name of the file being edited,
 - the modified status, &
 - the cursor position line & row numbers.

We'll put it in section 5 of the code. Here it is:

```javascript

////  SECTION 5:  DRAW FUNCTIONS 

function draw() {  ...  }

function draw_buffer() { ... }

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
```

Notice that we used an algorithm `d_get_cursor_pos()`.  We'll define that next!
<br/><br/><br/><br/>



<h3 id="b-6"> ☑️ Step 6. d_get_cursor_pos() </h3>

In that last function, we called the algorithm `d_get_cursor_pos()` . 

The cursor is stored as a single integer, in the global variable _cursor_buffer_pos.
This variable is relative to the characters in _buffer’s string.

But that variable doesn’t take into account line breaks, 
& we want to display the line number & x coordinate.

```javascript
////  SECTION 6:  Algorithms. 

function a_load_file_to_buffer() { ... }
function b_quit() { ... }
function c_get_window_size() { ... }

function d_get_cursor_pos() {            //  Returns a 2 index array, [int line, int char]

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
```
<br/><br/><br/><br/>




<h3 id="b-7"> ☑️ Step 7.  ☞  Test the code! </h3>

At this point, the buffer & status bar should draw without error!

We can still move the cursor & type text to the screen, but the cursor is left 
at the end of the status bar.  We’ll fix that in the next step.

<br/><br/><br/><br/>


<h3 id="b-8"> ☑️ Step 8.  Editing draw() again </h3>

Let’s go back into our draw function and make sure we’re calling that position_cursor() function.

```javascript
////  SECTION 5:  DRAW FUNCTIONS 

//  The draw function -- called after any data change.
function draw() {
    draw_buffer();
    draw_status_bar();
    // draw_feedback_bar();
    position_cursor(); 
}
```
<br/><br/><br/><br/>




<h3 id="b-9"> ☑️ Step 9.  position_cursor() </h3>

This function will move the cursor to the correct part of the screen, using an ANSI code.

```javascript
////  SECTION 5:  DRAW FUNCTIONS

function draw() {  ...  }

function draw_buffer() {  ...  }

function draw_status_bar() {  ...  }

//  Move the cursor to its position in the buffer.   
function position_cursor() {
    var cursor_position = d_get_cursor_pos(); //  d_get_cursor_pos is an algorithm.
    process.stdout.write("\x1b[" + cursor_position[0] + ";" + cursor_position[1] + "f");
}
```
<br/><br/><br/><br/>




<h3 id="b-10"> ☑️ Step 10.  ☞  Test the code! </h3>

Run the code again -- the buffer & status bar should both draw, 
but now the cursor should reposition in the upper left corner of the screen afterwards.
<br/><br/><br/><br/>



<h3 id="b-11"> ☑️ Step 11.  ❖  Part B review. </h3>
The complete code for Part A is available [here](https://github.com/rooftop-media/ktty-tutorial/blob/main/version1.0/part_B.js) .


<br/><br/><br/><br/><br/><br/><br/><br/>



<h2 id="part-c" align="center">  Part C:  The Cursor & Feedback Bar </h2>

In these steps, we’ll be making the cursor properly move around the buffer text.

For example, if the cursor is at the end of a text line, and the RIGHT key is pressed,
the cursor should jump to the beginning of the next line.  
And typing should insert a character into the buffer, rather than replacing a character.

We’ll also log key events to the feedback bar, completing the Draw function.
<br/><br/><br/><br/>



<h3 id="c-1"> ☑️ Step 1.  Adding variables </h3>

For this section, we’ll add a single variable, named `_feedback_bar`.
It will store a string of text.

```javascript
////  SECTION 2:  APP MEMORY

//  Setting up app memory. 
var _buffer            = "";      //  The text being edited. 
var _filename          = "";      //  Filename - including extension.
var _modified          = false;   //  Has the buffer been modified?
var _cursor_buffer_pos = 0;       //  The position of the cursor in the text.

var _feedback_bar      = "";      //  The text to display in the feedback bar.

var _window_h          = 0;       //  Window height (in text char's). 
var _window_w          = 0;       //  Window width (in text char's).
```
<br/><br/><br/><br/>



<h3 id="c-2"> ☑️ Step 2.  Event Key Name Dictionary. </h3>

Keyboard events like "ENTER" or "CTRL-C" come through as confusing keycodes.  
In our events section, we'll make a dictionary to rename such codes...

```javascript
////  SECTION 4:  EVENTS 

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

function map_events() { ... }

```

<br/><br/><br/><br/>



<h3 id="c-3"> ☑️ Step 3.  The Event Map. </h3>

Events are described in a Javascript object, mapping event names to functions. 
For now, we'll leave a lot of the event function calls commented out.


```javascript
////  SECTION 4:  EVENTS 

var _event_names = { ... }

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
	// i_add_to_buffer(key);
    },
    "ENTER":  function() {
        // i_add_to_buffer("\n");
    },
    "BACKSPACE": function() {
        // j_delete_from_buffer();
    },

    "CTRL-S": function() {
        // k_save_buffer_to_file();
    },
    
    "CTRL-Z":  function() {
        // p_undo()
    },
    "CTRL-R": function() {
        // q_redo()
    },

};

function map_events() { ... }

```
<br/><br/><br/><br/>



<h3 id="c-4"> ☑️ Step 4.  Edit map_events() </h3>

We’ll also add to the `map_events()` function (which is called in boot(). )

Before, we were logging every keypress straight to stdout, indiscriminately. 
Now, we’ll capture the arrow key inputs & call functions to move only within the buffer.
*Notice that the functions we’re calling correspond to our event map/dictionary!*

```javascript
////  SECTION 4:  EVENTS 

var _event_names = { ... }
var _events      = { ... }

//  Map keyboard events.
function map_events() {
    var stdin = process.stdin;
    stdin.setRawMode( true );
    stdin.resume();
    stdin.setEncoding( 'utf8' );
    stdin.on( 'data', function( key ){

	var event_name = _event_names[key];        /**  Getting the event name from the keycode, like "CTRL-C" from "\u0003".  **/
	
	if (typeof event_name == "string" && typeof _events[event_name] == "function") {       /**  "CTRL-C", "ENTER", etc     **/
	    _events[event_name]();
        } else if (key.charCodeAt(0) > 31 && key.charCodeAt(0) < 127) {   /**  Most keys, like letters, call the "TEXT" event.  **/
	    _events["TEXT"](key);
	}

        draw();                                    /**  Redraw the whole screen on any keypress.                               **/

    });
}
```
<br/><br/><br/><br/>



<h3 id="c-5"> ☑️ Step 5.  e_move_cursor_left() </h3>

This is an algorithm we’ll use to move the cursor left on the buffer.

```javascript
function e_move_cursor_left() {

    _cursor_buffer_pos -= 1;
    if ( _cursor_buffer_pos < 0 ) {      /**   Don't let the cursor position be negative.         **/
        _cursor_buffer_pos++;
    } else {
        _feedback_bar = "Moved left.";
    }

}
```
<br/><br/><br/><br/>



<h3 id="c-6"> ☑️ Step 6.  f_move_cursor_right() </h3>

And we’ll need an algorithm to move right, too. 

```javascript
function f_move_cursor_right() {

    _cursor_buffer_pos += 1;

    var buff_limit = _buffer.length;     /**   Don't let the cursor position exceed the buffer.   **/
    if ( _cursor_buffer_pos > buff_limit ) {
        _cursor_buffer_pos--;
    } else {
        _feedback_bar = "Moved right.";
    }

}
```
<br/><br/><br/><br/>



<h3 id="c-7"> ☑️ Step 7.  ☞  Test the code! </h3>

Before we get to the UP/DOWN arrows, run the code to make sure you can navigate left & right.

When pressing RIGHT, the cursor should go to the end of the first line, then jump to the next,
and stop at the end of the file.

When pressing LEFT, the cursor should go to the beginning of the current line, then jump back,
and stop at the beginning of the file. 

<br/><br/><br/><br/>



<h3 id="c-8"> ☑️ Step 8.  g_move_cursor_up() </h3>

Moving the cursor up will be a bit more difficult.

```javascript
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
```
<br/><br/><br/><br/>



<h3 id="c-9"> ☑️ Step 9.  h_move_cursor_down() </h3>

Now let’s write an algorithm to move down a line. 

```javascript
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
```
<br/><br/><br/><br/>



<h3 id="c-10"> ☑️ Step 10.  ☞  Test the code! </h3>

The UP and DOWN arrow key events should now work! 
<br/><br/><br/><br/>



<h3 id="c-11"> ☑️ Step 11.  Edit draw() </h3>

Next we’ll uncomment the call to `draw_feedback_bar()` in the `draw()` function.
After we implement it, we’ll be done with the draw section for this version!

```javascript
////  SECTION 5:  DRAW FUNCTIONS 

//  The draw function -- called after any data change. 
function draw() {
    draw_buffer();
    draw_status_bar();
    draw_feedback_bar();
    position_cursor();
}
```
<br/><br/><br/><br/>



<h3 id="c-12"> ☑️ Step 12.  draw_feedback_bar() </h3>

This function will draw the feedback bar every time the screen is refreshed.
Basically, it displays info for the event that caused the last draw() call.

```javascript
////  SECTION 5:  Draw functions.

function draw() {  ...  }

function draw_buffer() {  ...  }

function draw_status_bar() {  ...  }

function position_cursor() {  ...  }

//  Drawing the feedback bar.
function draw_feedback_bar() {
    process.stdout.write("\x1b[2m");                           /**  Dim text.                         **/
    process.stdout.write("\x1b[" + (_window_h - 1) + ";0H");   /**  Moving to the bottom row.         **/
    process.stdout.write(_feedback_bar);
    _feedback_bar = "";
    process.stdout.write("\x1b[0m");                           /**  Back to undim text.               **/
}
```
<br/><br/><br/><br/>



<h3 id="c-13"> ☑️ Step 13.  ☞  Test the code! </h3>

Running the code now should draw the feedback bar every time we move the cursor. 
<br/><br/><br/><br/>



<h3 id="c-14"> ☑️ Step 14.  ❖  Part C review. </h3>

Our file is up to 331 lines! 

<br/><br/><br/><br/><br/><br/><br/><br/>



<h2 id="part-d" align="center">  Part D:  File Editing </h2>
In this section, we’ll add some more events we outlined, including typing characters, backspace, & enter.  
<br/><br/><br/><br/>



<h3 id="d-1">  ☑️ Step 1:  Edit map_events() </h3>
We’ll want to uncomment some functions in our event map, as we’re about to implement them.

```javascript
////  SECTION 4:  EVENTS 

var _event_names = { ... }

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

function map_events() { ... }
```
<br/><br/><br/><br/>



<h3 id="d-2">  ☑️ Step 2:  i_add_to_buffer( new_text ) </h3>
This algorithm will insert text into the buffer at the cursor’s position.

```javascript
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
```
<br/><br/><br/><br/>



<h3 id="d-3">  ☑️ Step 3:  ☞  Test the code! </h3>
Our `i_add_to_buffer( text )` function is used inserting text characters OR line breaks into the text buffer.  Try it out!

Note that “backspace” will throw an error now, since we uncommented the function, 
but haven’t yet implemented it. 

<br/><br/><br/><br/>



<h3 id="d-4">  ☑️ Step 4:  i_delete_from_buffer() </h3>
This function will implement the backspace.  *Thank goodness.*

```javascript
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
```
<br/><br/><br/><br/>




<h3 id="d-5">  ☑️ Step 5:  ☞ Test the code! </h3>
At this point, you should be able to type text, & then delete it!

Make sure that pressing “backspace” at the beginning of the file doesn’t cause any errors. 

<br/><br/><br/><br/>



<h3 id="d-6">  ☑️ Step 6:  k_save_buffer_to_file() </h3>
This algorithm will save the file, & update the `_modified` variable.

```javascript
function k_save_buffer_to_file() {
    fs.writeFileSync(_filename, _buffer, { encoding: 'utf8' } );
    _modified = false;
    _feedback_bar = "saved :)";
}
```

<br/><br/><br/><br/>



<h3 id="d-7">  ☑️ Step 7:  ☞ Test the code! </h3>

Try typing some text into the buffer, and deleting some text.  
Then, save with ctrl-s, and quit.  Then open the file back up -- your changes should be saved!

<br/><br/><br/><br/>



<h3 id="d-8">  ☑️ Step 8:  ❖ Part D review. </h3> 

In this part, we added some basic editing controls. 

<br/><br/><br/><br/><br/><br/><br/><br/>




<h2 id="part-e" align="center">  Part E:   Feedback Mode </h2>

KTTY will be able to run in different **modes**, which affect what the keyboard events do.   

Up until now, we've been building Buffer Editor Mode.  
In Buffer Editor Mode, keyboard input edits the contents of the `_buffer`.

In this section, we’ll be implementing Feedback Mode.   
In Feedback Mode, keyboard input types to the `_feedback_input`.

We’ll be using Feedback Mode in two ways, in this version:  
 - When opening with no filename or a non-existing filename, prompt the user appropriately.  
 - When quitting with a modified file, prompt the user to save. 


<br/><br/><br/><br/>


<h3 id="e-1">  ☑️ Step 1:  Adding variables </h3>
We're adding four variables, all related to the feedback bar's prompt function.  

At the top, we'll add a string `_mode`, which we'll use to store a string naming the current mode.

We'll also add a string, `_feedback_input`, which is where we'll store the feedback text.
We'll add a integer, `_feedback_cursor`, which tracks the cursor's position in the feedback input.
And we'll add a variable that will store a *function*, which we'll call `_feedback_event`.

```javascript
////  SECTION 2:  APP MEMORY

//  Setting up app memory. 
var _mode              = "BUFFER-EDITOR";  //  Options: "BUFFER-EDITOR", "FEEDBACK-PROMPT"

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
```
<br/><br/><br/><br/>



<h3 id="e-2">  ☑️ Step 2:  Change _events to _mode_events  </h3>

Up until now, we stored all the events in an event dictionary, called `_events`.  
*(We originally defined that variable in [part C, step 2](https://github.com/rooftop-media/ktty-tutorial/blob/main/version1.0/tutorial.md#c-2) if you're curious.)*

In Feedback Mode, we'll want to capture the *same* events, but react with *different* functions.  
To do this, we'll *add another layer* to our "event dictionary", and rename it to `_mode_events` like so:

```javascript
////  SECTION 4:  EVENTS 

var _event_names = { ... }

//  These functions fire in response to "events" like keyboard input. 
var _mode_events      = {

    "BUFFER-EDITOR": {
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
            // j_undo()                                                                                                                                
        },
        "CTRL-R": function() {
            // k_redo()                                                                                                                                
        },
    },

    "FEEDBACK-PROMPT": {
        "CTRL-C": function() {
            b_quit();
	},
	
        "TEXT":   function(key) {
            l_add_to_feedback_input(key);   //  Add text to the feedback input. 
        },
        "BACKSPACE": function() {
            m_delete_from_feedback_input();          //  Remove text from the feedback input. 
        },
	
	"LEFT":   function() {
            n_move_feedback_cursor_left();   //  Move the feedback cursor right one space.
        },
        "RIGHT":  function() {
            o_move_feedback_cursor_right();  //  Move the feedback cursor right one space.
        },
	
	"ENTER":  function() {
            _feedback_event(_feedback_input);    //  Running the feedback event. 
        },
    }
};

function map_events() { ... }
```
Our event dictionary now can have 2 different reactions to the same input, depending on the mode!

Note that for FEEDBACK mode, some events, like UP and DOWN, won't trigger any reaction at all.  
We'll just omit such names from our list.

<br/><br/><br/><br/>



<h3 id="e-3">  ☑️ Step 3:  Editing map_events() </h3>

We'll need to modify the `map_events()` function, to map key events to the event appropriate for the current mode.
When we originally wrote `map_events()` (back in [part c, step 3](https://github.com/rooftop-media/ktty-tutorial/blob/main/version1.0/tutorial.md#c-3)), we referenced the event dictionary, which was called `_events`.

That dictionary doesn't exist anymore, but we can get the equivilant dictionary with a single line.
Note that, since our new `event` variable is calculated locally, I've removed the `_` from its name.  
The `map_events()` code now looks like this, accounting for that name change:

```javascript
////  SECTION 4:  Events. 

var _event_names = { ... }
var _events      = { ... }

//  Map keyboard events.  
function map_events() {
    var stdin = process.stdin;
    stdin.setRawMode( true );
    stdin.resume();
    stdin.setEncoding( 'utf8' );
    stdin.on( 'data', function( key ){
    
  	var event_name = _event_names[key];        /**  Getting the event name from the keycode, like "CTRL-C" from "\u0003".  **/

	var events = _mode_events[ _mode ];        /**  Getting the proper event map for this mode.             **/

        if (typeof event_name == "string" && typeof events[event_name] == "function") {       /**  "CTRL-C", "ENTER", etc     **/
            events[event_name]();
        } else if (key.charCodeAt(0) > 31 && key.charCodeAt(0) < 127) {   /**  Most keys, like letters, call the "TEXT" event.  **/
            events["TEXT"](key);
        }

        draw();

    });
}
```
<br/><br/><br/><br/>



<h3 id="e-4">  ☑️ Step 4:  Editing draw_feedback_bar() </h3>

We'll also edit `draw_feedback_bar()` to draw the feedback bar text in a different color, in feedback mode.

```javascript
////  SECTION 5:  Draw functions. 

function draw() {  ...  }
function draw_buffer() {  ...  }
function draw_status_bar() {  ...  }
function position_cursor() {  ...  }

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
```

<br/><br/><br/><br/>



<h3 id="e-5">  ☑️ Step 5:  Edit a_load_file_to_buffer(filepath) </h3>

The first place we'll use Feedback Mode is in the algorithm to open files, `a_load_file_to_buffer()`.  

If ktty is opened with a blank `filepath`, ask the user if they want to create a file.

```javascript
////  SECTION 6:  Algorithms. 

//  Getting the file's contents, put it in the "buffer". 
function a_load_file_to_buffer() {
    _filename = process.argv[2];
    if ( _filename == undefined ) {
        _mode         = "FEEDBACK-PROMPT";
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
```
<br/><br/><br/><br/>




<h3 id="e-6">  ☑️ Step 6:  ☞ Test the code!  </h3>

We can now test the code!  This time, open ktty without a filepath for an argument:

```bash
$ ktty
```
Or, without the shortcut...
```bash
$ node ./ktty.js
```

Running this code should present the `Enter a file name to create a new file:` message in the feedback bar.  

At this point, typing will throw an error.  You can quit error-less by pressing `ctrl-c`.

<br/><br/><br/><br/>




<h3 id="e-7">  ☑️ Step 7:  Edit position_cursor() </h3>

While in feedback mode, we need to position the cursor differently.

```javascript
////  SECTION 5:  Draw functions.

function draw() {  ...  }
function draw_buffer() {  ...  }
function draw_status_bar() {  ...  }

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
```

<br/><br/><br/><br/>




<h3 id="e-8">  ☑️ Step 8:  ☞ Test the code!  </h3>

Let's run the code again to make sure the cursor gets positioned correctly.

<br/><br/><br/><br/>



<h3 id="e-9">  ☑️ Step 9:  l_add_to_feedback_input(new_text) </h3>

This algorithm will insert text into the `_feedback_input` string, at the position of the `_feedback_cursor`.

```javascript
function l_add_to_feedback_input(new_text) {
    var new_fb_input   = _feedback_input.slice(0, _feedback_cursor);
    new_fb_input      += new_text;
    new_fb_input      += _feedback_input.slice(_feedback_cursor, _feedback_input.length);
    _feedback_input = new_fb_input;
    _feedback_cursor++;
}
```
<br/><br/><br/><br/>



<h3 id="e-10">  ☑️ Step 10:  m_delete_from_feedback_input() </h3>

This algorithm will delete text from `_feedback_input`.

```javascript
function m_delete_from_feedback_input() {
    if ( _feedback_cursor == 0 ) {      /**   Don't let the cursor position be negative.    **/
        return;
    }

    var new_fb_input = _feedback_input.slice(0, _feedback_cursor - 1);
    new_fb_input    += _feedback_input.slice(_feedback_cursor, _feedback_input.length);
    _feedback_input  = new_fb_input;
    _feedback_cursor--;
}
```

<br/><br/><br/><br/>



<h3 id="e-11">  ☑️ Step 11:  ☞ Test the code!  </h3>

At this point, running the code with no argument should prompt the user for a filename.  
And this time, typing a filename should work!

Try creating a new file named `new_file.txt` this way.  Test the backspace, too.
Press enter to create the file.   

Then, type some contents to the file buffer, and save with `ctrl-s`. 
Then quit with `ctrl-c`.

In your command  line, run `ls` to see if your new file was created!

<br/><br/><br/><br/>




<h3 id="e-12">  ☑️ Step 12:  n_move_feedback_cursor_left() </h3>

A function to move the feedback input cursor left one, if possible. 

```javascript
function n_move_feedback_cursor_left() {
    _feedback_cursor--;
    if (_feedback_cursor < 0) {     //  Don't let the feedback cursor go past the beginning.
    	_feedback_cursor++;
    }
}
```
<br/><br/><br/><br/>



<h3 id="e-13">  ☑️ Step 13:  o_move_feedback_cursor_right() </h3>

This time we're going right, unless we're at the end of `_feedback_input`.

```javascript
function o_move_feedback_cursor_right() {
    _feedback_cursor++;
    if (_feedback_cursor > _feedback_input.length) {      // don't "surpass" the end of _feeback_input
        _feedback_cursor--;
    }
}
```
<br/><br/><br/><br/>



<h3 id="e-14">  ☑️ Step 14:  ☞ Test the code!  </h3>

Test the code again, without a filename.  
This time, when you enter a filename, you should be able to use the arrow keys to move the feedback cursor.  


<br/><br/><br/><br/>


<h3 id="e-15">  ☑️ Step 15:  Editing b_quit() </h3>

We'll also use the feedback bar when the user tries to quit a file with a modified buffer.  

```javascript
function b_quit() {

    if (_modified) {            /**  If the file has been modified, start the prompts!    **/
        _mode = "FEEDBACK-PROMPT";
	_feedback_bar = "Modified buffer exists! Want to save? (y/n) ";
	_feedback_event = function(response) {               /**  Prompt 1:  Save before exiting?   **/
	    if (response.toLowerCase() == "y") {
	    	l_save_buffer_to_file();
		m_quit();
	    } else if (response.toLowerCase() == "n") {
	        _feedback_bar = "Quit without saving? Your changes will be lost! (y/n) ";
		_feedback_event = function(response) {       /**  Prompt 2:  Quit without saving??   **/
		     if (response.toLowerCase() == "y") {
		         console.clear();
			 process.exit();
		     } else {
		         mode = "BUFFER-EDITOR";
			 _feedback_bar = "";
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
```

<br/><br/><br/><br/>


<h3 id="d-16">  ☑️ Step 16:  ☞ Test the code! </h3>

We can now test the QUIT function!  
Open ktty again, modify some file, and then press `ctrl-c` WITHOUT saving.  
The feedback prompt should pop up, saying, `Modified buffer exists! Want to save? (y/n)`

You'll need to test all 3 possible options in this menu:
 - `y` to save and quit.
 - `n`, then `y`, to quit without saving.
 - `n`, then `n`, to continue editing without saving.

<br/><br/><br/><br/>




<h3 id="e-17">  ☑️ Step 17:  ❖  Part E review. </h3>

At this point, we have our feedback prompt system working well!  
The app now prompts us for a filename when we open it without one,  
and prompts us to save when we quit without saving.

Nice!

<br/><br/><br/><br/><br/><br/><br/><br/>





<h2 id="part-f" align="center">  Part F:   Scroll & Resize </h2>

<br/><br/><br/><br/>


<h3 id="f-?">  ☑️ Step ?:  ❖  Part F review. </h3>

<br/><br/><br/><br/><br/><br/><br/><br/>



<h2 id="part-g" align="center">  Part G:   Undo & Redo </h2>

<br/><br/><br/><br/>


<h3 id="g-?">  ☑️ Step ?:  ❖  Part G review. </h3>

<br/><br/><br/><br/><br/><br/><br/><br/>













