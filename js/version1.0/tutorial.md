# NodeJS Tutorial for Ktty, version 1.0

<br/><br/><br/><br/><br/><br/><br/><br/>



##  Prerequisites

This tutorial requires that you've completed the [initial set up steps](https://github.com/rooftop-media/ktty-tutorial/blob/main/js/setup.md).

<br/><br/><br/><br/><br/><br/><br/><br/>



##  Table of Contents

Click a part title to jump down to it, in this file.

| Tutorial Parts              | Est. Time | # of Steps |
| --------------------------- | ------ | ---------- |
| [Part A - Drawing the Buffer](https://github.com/rooftop-media/ktty-tutorial/blob/main/js/version1.0/tutorial.md#part-a) | 12 min. | 12 |
| [Part B - Drawing the Status Bar](https://github.com/rooftop-media/ktty-tutorial/blob/main/js/version1.0/tutorial.md#part-b) | 14 min. | 11 |
| [Part C - Cursor & Feedback Bar](https://github.com/rooftop-media/ktty-tutorial/blob/main/js/version1.0/tutorial.md#part-c) | 24 min.  | 14 |
| [Part D - File Editing](https://github.com/rooftop-media/ktty-tutorial/blob/main/js/version1.0/tutorial.md#part-d) | 11 min. | 10 |
| [Part E - Object Oriented Refactor](https://github.com/rooftop-media/ktty-tutorial/blob/main/js/version1.0/tutorial.md#part-e) | 32 min. | 11 |
| [Part F - Feedback Mode](https://github.com/rooftop-media/ktty-tutorial/blob/main/js/version1.0/tutorial.md#part-f) | 30 min. | 13 |
| [Part G - Scroll & Resize](https://github.com/rooftop-media/ktty-tutorial/blob/main/js/version1.0/tutorial.md#part-g) | 24 min. | 17 |
| [Part H - Undo & Redo](https://github.com/rooftop-media/ktty-tutorial/blob/main/js/version1.0/tutorial.md#part-h) | 20 min. | 9 |
| [Version 2.0.](https://github.com/rooftop-media/ktty-tutorial/blob/main/js/version1.0/tutorial.md#v2) | Todo | ? |

<br/><br/><br/><br/><br/><br/><br/><br/>





<h2 id="part-a" align="center">  Part A:  Drawing the Buffer </h2>

The steps in this part will culminate in us displaying the text file on the screen, along with controls to move and type.  

Along the way, we’ll break the code into 6 code sections with comments, and add some code to each section.  

*Estimated time: 12 minutes*

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




<h3 id="a-2">  ☑️ Step 2. Outlining <code>ktty.js</code>  </h3>

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

We’ll declare our variables in section 2.  For now, we'll make two variables:
*(Note that I name global variables starting with an underscore, like `_buffer`.  )*

We’ll save the contents to a variable called `_buffer`.  The buffer can be modified without modifying the file it’s pulled from.   
*(That’s why it’s called the buffer – it’s buffered, aka separate, from the final saved file!)*

We’ll also record another string of text, the `_filename` being edited.

```javascript
////  SECTION 2:  APP MEMORY

//  Setting up app memory.
var _buffer            = "";      //  The text being edited. 
var _filename          = "";      //  Filename - including extension. 
```

<br/><br/><br/><br/>




<h3 id="a-5"> ☑️ Step 5. Outline <code>boot()</code> </h3>

Now, in section 3 of the code, we’ll outline the boot function.

Ultimately, we'll have *four function calls in boot()*:
 - Loading in a file’s content, by filename.
 - Then, get the window height & width.
 - Then, start capturing keyboard events.
 - Finally, draw the screen for the first time.

We'll leave `get_window_size()` commented out for now, and use it in Part B. 

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



<h3 id="a-6"> ☑️ Step 6. <code>a_load_file_to_buffer()</code> </h3>

This is an algorithm we called in the `boot()` function.  
We’ll implement it in section 6 of our code, with the algorithms.

```javascript
////  SECTION 6:  Algorithms.

//  Get the file's contents, put it in the "buffer".
function a_load_file_to_buffer() {
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
```
<br/><br/><br/><br/>



<h3 id="a-7"> ☑️ Step 7. Outline <code>draw()</code> </h3>


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




<h3 id="a-8"> ☑️ Step 8. <code>draw_buffer()</code> </h3>

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




<h3 id="a-9"> ☑️ Step 9. <code>map_events()</code> </h3>

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


*Later, we'll need to modify the keys so the behaviour is linked to the buffer.*
<br/><br/><br/><br/>



<h3 id="a-10"> ☑️ Step 10. <code>b_quit()</code> </h3>

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

The complete code for Part A is available [here](https://github.com/rooftop-media/ktty-tutorial/blob/main/js/version1.0/part_A.js).

<br/><br/><br/><br/><br/><br/><br/><br/>



<h2 id="part-b" align="center">  Part B:  Drawing the Status Bar </h2>

In this step, we’ll draw the *status bar*, which will display below the text buffer.

The status bar will have the file name, cursor position, & modified status for the buffer above.

*Estimated time: 14 minutes*
<br/><br/><br/><br/>



<h3 id="b-1"> ☑️ Step 1. Adding variables. </h3>
First, we'll need to add some new variables, including a `_modified` boolean, 
the `_cursor_buffer_pos`, and the window height and width. 

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


<h3 id="b-2"> ☑️ Step 2. Edit <code>boot()</code> </h3>

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



<h3 id="b-3"> ☑️ Step 3. <code>c_get_window_size()</code> </h3>

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



<h3 id="b-4"> ☑️ Step 4.  Editing <code>draw()</code> </h3>
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



<h3 id="b-5"> ☑️ Step 5. <code>draw_status_bar()</code> </h3>

In this step, we’re going to draw the status bar at the bottom of the window.  
The status bar will be displayed in "reverse-video", meaning the text's colors will be inverted. 
The status bar will also be drawn 2 spaces from the BOTTOM of the screen.

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



<h3 id="b-6"> ☑️ Step 6. <code>d_get_cursor_pos()</code> </h3>

In that last function, we called the algorithm `d_get_cursor_pos()` . 

The cursor is stored as a single integer, in the global variable `_cursor_buffer_pos`.
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


<h3 id="b-8"> ☑️ Step 8.  Editing <code>draw()</code> again </h3>

Let’s go back into our draw function and make sure we’re calling that `position_cursor()` function.

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




<h3 id="b-9"> ☑️ Step 9.  <code>position_cursor()</code> </h3>

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

In this part, we drew the status bar below the buffer!  We'll implement features to our status bar as we go on. 

The complete code for Part B is available [here](https://github.com/rooftop-media/ktty-tutorial/blob/main/js/version1.0/part_B.js) .

<br/><br/><br/><br/><br/><br/><br/><br/>




<h2 id="part-c" align="center">  Part C:  The Cursor & Feedback Bar </h2>

In these steps, we’ll be making the cursor properly move around the buffer text.

For example, if the cursor is at the end of a text line, and the RIGHT key is pressed,
the cursor should jump to the beginning of the next line.  
And typing should insert a character into the buffer, rather than replacing a character.

We’ll also log key events to the *feedback bar* in this part. 

*Estimated time: 24 minutes*

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
  "\u0008": "BACKSPACE",        /**     For powershell.   **/
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
    "CTRL-C":     b_quit,

    "LEFT":       e_move_cursor_left,
    "RIGHT":      f_move_cursor_right,
    "UP":         g_move_cursor_up,
    "DOWN":       h_move_cursor_down,

    // "TEXT":       function(key) {  i_add_to_buffer(key);   },
    // "ENTER":      function()    {  i_add_to_buffer("\n");  },
    // "BACKSPACE":  j_delete_from_buffer,  

    // "CTRL-S":     k_save_buffer_to_file, 

    // "CTRL-Z":     p_undo, 
    // "CTRL-R":     q_redo,   
};

function map_events() { ... }

```
<br/><br/><br/><br/>



<h3 id="c-4"> ☑️ Step 4.  Edit <code>map_events()</code> </h3>

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



<h3 id="c-5"> ☑️ Step 5.  <code>e_move_cursor_left()</code> </h3>

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



<h3 id="c-6"> ☑️ Step 6.  <code>f_move_cursor_right()</code> </h3>

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

(The code will throw an error unless you comment out the lines that reference `g_move_cursor_up` and `h_move_cursor_down`, or add empty functions with those names.  We'll implement them next.)

When pressing RIGHT, the cursor should go to the end of the first line, then jump to the next,
and stop at the end of the file.

When pressing LEFT, the cursor should go to the beginning of the current line, then jump back,
and stop at the beginning of the file. 

<br/><br/><br/><br/>



<h3 id="c-8"> ☑️ Step 8.  <code>g_move_cursor_up()</code> </h3>

Moving the cursor UP/DOWN is less intuitive than moving LEFT/RIGHT.  

To move UP, we need to do the following:
 1. Get the `current_x_position` of the cursor, on the current line.
 2. Get the length of the PREVIOUS line. 
 3. Branch depending on if the `current_x_position` exceeds the `prev_line_length`.
 4. &nbsp; IF the current position is greater, move to the end of the previous line.
 5. &nbsp; IF the previous line is greater, move to the current x pos, but up one line.
    
Here's the code:

```javascript
function g_move_cursor_up() {

    var current_x_pos = 1;               /**   To find the xpos of the cursor on the current line.   **/
    var prev_line_length = -1;           /**   To find the length of the *prev* line, to jump back.  **/
    for (var i = 0; i < _cursor_buffer_pos; i++ ) {
        if (_buffer[i] == "\n") {
            prev_line_length = current_x_pos;
            current_x_pos = 1;
        } else {
            current_x_pos++;
        }
    }

    if (prev_line_length == -1) {                  /**   If there is no previous line...              */
        _cursor_buffer_pos = 0;
    }
    else if (prev_line_length > current_x_pos) {   /**   If we're going up **into** a line...        **/
        _cursor_buffer_pos -= prev_line_length;
    }
    else if (prev_line_length <= current_x_pos) {  /**   If we're going up **above** a line...       **/
        _cursor_buffer_pos -= current_x_pos;
    }

    _feedback_bar = "Moved up.";

}
```
<br/><br/><br/><br/>



<h3 id="c-9"> ☑️ Step 9.  <code>h_move_cursor_down()</code> </h3>

Now let’s write an algorithm to move DOWN into a line. 

To move DOWN, we'll need to do the following: 
 1. Get the `current_x_position` of this line.
 2. Get the `current_line_length`, to move forward correctly.
 3. Get the `next_line_length`.
 4. Branch depending on if the `current_x_position` exceeds the `next_line_length`.
 5. &nbsp; IF `found_line_start` is false, go to the end of the current line.
 6. &nbsp; IF `current_x_position` is bigger, go to the END of the next line.
 7. &nbsp; IF `next_line_length` is bigger, go to the current X position on that line. 

```javascript
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
    
    if (!found_line_start) {                         /**   If there is no next line...                    */
        _cursor_buffer_pos += current_line_length;
    } 
    else if (next_line_length >= current_x_pos) {  /**   If we're going down **into** a line...        **/
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
```
<br/><br/><br/><br/>



<h3 id="c-10"> ☑️ Step 10.  ☞  Test the code! </h3>

The UP and DOWN arrow key events should now work! 
<br/><br/><br/><br/>



<h3 id="c-11"> ☑️ Step 11.  Edit <code>draw()</code> </h3>

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



<h3 id="c-12"> ☑️ Step 12.  <code>draw_feedback_bar()</code> </h3>

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

<br/><br/>

The complete code for part C is available [here](https://github.com/rooftop-media/ktty-tutorial/blob/main/js/version1.0/part_C.js).

<br/><br/><br/><br/><br/><br/><br/><br/>



<h2 id="part-d" align="center">  Part D:  File Editing </h2>
In this section, we’ll add some more events we outlined, including typing characters, backspace, & enter.  

*Estimated time: 11 minutes*
<br/><br/><br/><br/>



<h3 id="d-1">  ☑️ Step 1.  Edit <code>map_events()</code> </h3>
We’ll want to uncomment some functions in our event map, as we’re about to implement them.

```javascript
////  SECTION 4:  EVENTS 

var _event_names = { ... }

//  These functions fire in response to "events" like keyboard input. 
var _events      = {
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
};

function map_events() { ... }
```
<br/><br/><br/><br/>



<h3 id="d-2">  ☑️ Step 2.  <code>i_add_to_buffer( new_text )</code> </h3>
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



<h3 id="d-3">  ☑️ Step 3.  ☞  Test the code! </h3>

Our `i_add_to_buffer( text )` function is used inserting text characters OR line breaks into the text buffer.  Try it out!

Note that “backspace” will throw an error now, since we uncommented the function, 
but haven’t yet implemented it. 

<br/><br/><br/><br/>


<h3 id="d-4">  ☑️ Step 4.  Edit <code>a_load_file_to_buffer()</code> to fix a Windows bug. </h3>

Up until this point, our program should work fine on both Windows and Mac/Unix machines. 
Now, however, running the code on a Windows machine reveals a bug.  

On a Windows terminal, like Powershell, open a text file with Ktty and navigate to the 
last character of a line, before the cursor jumps to the next line, and type. 

You'll likely find that text is strangely inserted into the *beginning* of that line, 
while the cursor moves right as though typing a space at the *end* of the line.

This bug is happening because Windows represents "newlines" in files 
[differently](https://en.wikipedia.org/wiki/Newline#Issues_with_different_newline_formats) than 
Mac/Unix machines.  On a Mac, new lines are represented with the newline character, 
which can be written as "\n".  On Windows, new lines are represented with "\r\n", where 
"\r" tells the machine to "return carriage", like you would on an old typewriter, or TeleType.

Here's a quick fix involving the JS string .replace function and Regex:

```javascript
function a_load_file_to_buffer() {       /**  Getting the file's contents, put it in the "buffer".    **/
    _filename = process.argv[2]; 
    if ( _filename == undefined ) {
        _buffer = "";
    } else {
        try {
            _buffer = fs.readFileSync( _filename, {encoding: 'utf8'} );
            _buffer = _buffer.replace(/\r\n/g, '\n');
        } catch (err) {
            _buffer = "Unable to find a file at '" + _filepath + "'";
        }
    }
}
```


<br/><br/><br/><br/>


<h3 id="d-5">  ☑️ Step 5.  ☞  Test the code! </h3>

On a Windows machine, move the cursor to the end of a line, and try typing. 
The letters should now appear properly at the end of the line. 

<br/><br/><br/><br/>



<h3 id="d-6">  ☑️ Step 6.  <code>j_delete_from_buffer()</code> </h3>
This function will implement the backspace.  

*Thank goodness for the ability to backspace.*

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




<h3 id="d-7">  ☑️ Step 7.  ☞ Test the code! </h3>
At this point, you should be able to type text, & then delete it!

Make sure that pressing “backspace” at the beginning of the file doesn’t cause any errors. 

<br/><br/><br/><br/>



<h3 id="d-8">  ☑️ Step 8.  <code>k_save_buffer_to_file()</code> </h3>
This algorithm will save the file, & update the `_modified` variable.

```javascript
function k_save_buffer_to_file() {
    fs.writeFileSync(_filename, _buffer, { encoding: 'utf8' } );
    _modified = false;
    _feedback_bar = "saved :)";
}
```

<br/><br/><br/><br/>



<h3 id="d-9">  ☑️ Step 9.  ☞ Test the code! </h3>

Try typing some text into the buffer, and deleting some text.  
Then, save with ctrl-s, and quit.  Then open the file back up -- your changes should be saved!

<br/><br/><br/><br/>







<h3 id="d-10">  ☑️ Step 10.  ❖ Part D review. </h3> 

In this part, we added some basic editing controls. 

The complete code for Part D is available [here](https://github.com/rooftop-media/ktty-tutorial/blob/main/js/version1.0/part_D.js).


<br/><br/><br/><br/><br/><br/><br/><br/>



<h2 id="part-e" align="center">  Part E:   Object Oriented Refactor </h2>

*Estimated time: 32 minutes*

Before we implement a feedback prompt system, we're going to do a *refactor*, 
from *functional* programming into *object oriented* programming. 

This refactoring will be a bit tedious.  You may find yourself asking, 
"Why are we doing this? This seems like *more* work."

It *is* more work, you're right.  It will be even more work to think about.
But as our program grows in complexity, you'll be glad we took the time to 
separate the features into distinct parts, with clear connections.

**=== Here's what we'll keep:**

We'll still use the same essential *event loop* model.  
In an event loop, the program listens for events, and reacts to those events with functions.

We're also redrawing the screen after each event, based on the relevant data.

This is considered Model-View-Controller architecture, or MVC architecture:
 - Our Events are the "Controller"
 - The functions that events trigger affect global data, which is the "Model"
 - The data is used to draw the screen, which is the "View"

**=== Here's what we'll change:**

The big thing we need to do is sort our data & algorithms by object,  
instead of having two big separate piles.  

Our MVC architecture will still be there, but different elements will 
implement the different features in different ways. 

There won't be a single "draw" function, for example, but  
the objects for the Buffer, StatusBar, & FeedbackBar will all have a `draw()` method. 

<!--The key to refactoring is having a well understood plan.  
Here's a diagram of how our new code will look:
![Part E refactor plan](https://github.com/rooftop-media/ktty-tutorial/blob/main/js/version1.0/tutorial_assets/partE_summary.png?raw=true)-->

<br/><br/><br/><br/>



<h3 id="e-1">  ☑️ Step 1.  Outlining the file again </h3>

We'll be keeping almost all the same code, just restructuring it.  

It will be easier to start a brand-new file for our OO refactor,  
which we can outline to look like this:

```javascript
#!/usr/bin/env node
;

////  SECTION 1:  Imports
//  Importing NodeJS libraries. 
var process      = require("process");
var fs           = require("fs");

////  SECTION 2:  Objects

////  SECTION 3:  Boot stuff. 

```
<br/><br/><br/><br/>



<h3 id="e-2">  ☑️ Step 2.   Editing <code>boot()</code> </h3> 

We'll edit the boot function to use our new object-oriented syntax!

```javascript
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
```

<br/><br/><br/><br/>



<h3 id="e-3">  ☑️ Step 3.  Add the <code>Buffer</code>. </h3> 

We'll now make the Buffer object.

The data `Buffer.text` takes the place of `_buffer`.

The function for `Buffer.load_file()` is from `a_load_file_to_buffer`.  
The function for `Buffer.get_cursor_coords()` is from `d_get_cursor_pos`.  
The function for `Buffer.draw()` is from `draw_buffer()`.  
The function for `Buffer.position_cursor()` is from `position_cursor()`.    

```javascript
////  SECTION 2:  Objects

var Buffer = {
  text:        "",
  filename:    "",
  modified:    false,
  cursor_pos:  0,
  
  load_file:         Buffer_load_file,
  get_cursor_coords: Buffer_get_cursor_coords,
  draw:              Buffer_draw,
  position_cursor:   Buffer_position_cursor
  
};

function Buffer_load_file() {
    this.filename = process.argv[2];
    if ( this.filename == undefined ) {
        this.text = "";
    } else {
        try {
            this.text = fs.readFileSync( this.filename, {encoding: 'utf8'} );
	    this.text = this.text.replace(/\r\n/g, '\n');
        } catch (err) {
            this.text = "Unable to find a file at '" + this.filepath + "'";
        }
    }
}
function Buffer_get_cursor_coords() {
    var cursor_coords = [1,1];
    for (var i = 0; i < this.cursor_pos; i++) {  //  Loop through the buffer to count \n's 
        var current = this.text[i];
        if (current == "\n") {
            cursor_coords[0]++;        /**  Advance a line.        **/
            cursor_coords[1] = 1;      /**  Reset character pos.   **/
        } else {
            cursor_coords[1]++;        /**  Advance a character.   **/
        }
    }
    return cursor_coords;
}
function Buffer_draw() {
    console.clear();
    console.log(this.text);
}
function Buffer_position_cursor() {
    var cursor_position = this.get_cursor_coords();
    process.stdout.write("\x1b[" + cursor_position[0] + ";" + cursor_position[1] + "f");
}

```
<br/><br/><br/><br/>



<h3 id="e-4">  ☑️ Step 4.  Add the <code>StatusBar</code>. </h3> 

```javascript
////  SECTION 2:  Objects

var Buffer = { ... };
//  Buffer methods defined here.

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
    status_bar_text += "  cursor on line " + cursor_position[0];
    status_bar_text += ", row " + cursor_position[1];

    while (status_bar_text.length < Window.width) {                   /**  Padding it with whitespace.       **/
        status_bar_text += " ";
    }

    process.stdout.write(status_bar_text);                            /**  Output the status bar string.     **/
    process.stdout.write("\x1b[0m");                                  /**  No more reverse video.            **/
}
```
<br/><br/><br/><br/>



<h3 id="e-5">  ☑️ Step 5.  Add the <code>FeedbackBar</code>. </h3> 

We'll make an object for the Feedback Bar. 

Snag `FeedbackBar.draw()` from `draw_feedback_bar()` in the previous version.

```javascript
////  SECTION 2:  Objects

var Buffer = { ... };
var StatusBar = { ... };

var FeedbackBar = { 
  text:    "",
  
  draw:    FeedbackBar_draw,
};

function FeedbackBar_draw() {
    process.stdout.write("\x1b[2m");                               /**  Dim text.                         **/
    process.stdout.write("\x1b[" + (Window.height - 1) + ";0H");   /**  Moving to the bottom row.         **/
    process.stdout.write(this.text);
    _feedback_bar = "";
    process.stdout.write("\x1b[0m");                               /**  Back to undim text.               **/
}

```
<br/><br/><br/><br/>




<h3 id="e-6">  ☑️ Step 6.  Add the <code>Window</code>. </h3> 

We'll have an object to represent the Window, too. 
This is kind of a special object, that "aggregates" the other objects for drawing & such. 

```javascript
////  SECTION 2:  Objects

var Buffer = { ... };
var StatusBar = { ... };
var FeedbackBar = { ... };

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
    Buffer.draw();
    StatusBar.draw();
    FeedbackBar.draw();
    
    Buffer.position_cursor();
}
function Window_quit() {
    console.clear();
    process.exit();
}
```
<br/><br/><br/><br/>


<h3 id="e-7">  ☑️ Step 7.  Add the <code>Keyboard</code>. </h3> 

```javascript
////  SECTION 2:  Objects

var Buffer = { ... };
var StatusBar = { ... };
var FeedbackBar = { ... };
var Window = { ... };

var Keyboard = {
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

            var event_name = _this.event_names[key];         /**  Getting the event name from the keycode, like "CTRL-C" from "\u0003".  **/

            if (typeof event_name == "string" && typeof Buffer.events[event_name] == "function") {       /**  "CTRL-C", "ENTER", etc     **/
                Buffer.events[event_name]();
            } else if (key.charCodeAt(0) > 31 && key.charCodeAt(0) < 127) {        /**  Most keys, like letters, call the "TEXT" event.  **/
                Buffer.events["TEXT"](key);
            }
            Window.draw();                                   /**  Redraw the whole screen on any keypress.                               **/
        };

        stdin.on("data", key_reaction);
}

```
<br/><br/><br/><br/>



<h3 id="e-8">  ☑️ Step 8.  ☞ Test your code! </h3> 

At this point, opening ktty with a filename should display that file!

Pressing any keys will throw an error, because we haven't added events to the Buffer.
We'll do that next!

<br/><br/><br/><br/>



<h3 id="e-9">  ☑️ Step 9.  Adding movement to <code>Buffer.events</code>  </h3> 

We'll take the events that were previously stored in `_events` and add them to `Buffer.events`.

The function `Buffer_move_cursor_left` comes from our `e_move_cursor_left`.
The function `Buffer_move_cursor_right` comes from our `f_move_cursor_right`.
The function `Buffer_move_cursor_up` comes from our `g_move_cursor_up`.
The function `Buffer_move_cursor_down` comes from our `h_move_cursor_down`.

Note that, because these events are in `Buffer.events` and not `Buffer` directly,  
we can't use `this` to access Buffer's data directly. 


```javascript
////  SECTION 2:  Objects

var Buffer = {
  text:        "",
  filename:    "",
  modified:    false,
  cursor_pos:  0,
  
  load_file:         Buffer_load_file,
  get_cursor_coords: Buffer_get_cursor_coords,
  draw:              Buffer_draw,
  position_cursor:   Buffer_position_cursor,
  
  events:            {
    "CTRL-C":     function() {  Window.quit()  },

    "LEFT":       Buffer_move_cursor_left,
    "RIGHT":      Buffer_move_cursor_right,
    "UP":         Buffer_move_cursor_up,
    "DOWN":       Buffer_move_cursor_down,

    // "TEXT":       function(key) {  Buffer_add_to_text(key);   },
    // "ENTER":      function()    {  Buffer_add_to_text("\n");  },
    // "BACKSPACE":  Buffer_delete_from_text,

    // "CTRL-S":     Buffer_save_to_file,

    // "CTRL-Z":     p_undo,                                                                                                                           
    // "CTRL-R":     q_redo, 
  }
  
};

function Buffer_load_file() { ... }
function Buffer_get_cursor_coords() { ... }
function Buffer_draw() { ... }
function Buffer_position_cursor() { ... }

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

```

<br/><br/><br/><br/>



<h3 id="e-9">  ☑️ Step 9.  ☞ Test your code! </h3> 

Test the code now, to see if your arrow keys properly move the cursor around the buffer.

Pressing `ctrl-c` should quit with no error.  Any other key should throw an error (for now!).

<br/><br/><br/><br/>




<h3 id="e-10">  ☑️ Step 10.  Adding editing to <code>Buffer.events</code> </h3> 

Let's uncomment & implement the edit controls for the Buffer.

The function `Buffer_add_to_text(new_text)` comes from our `i_add_to_buffer(new_text)`.
The function `Buffer_delete_from_text()` comes from our `j_delete_from_buffer()`.
The function `Buffer_save_to_file()` comes from our `k_save_buffer_to_file()`.


```javascript
////  SECTION 2:  Objects

var Buffer = {
  text:        "",
  filename:    "",
  modified:    false,
  cursor_pos:  0,
  
  load_file:         Buffer_load_file,
  get_cursor_coords: Buffer_get_cursor_coords,
  draw:              Buffer_draw,
  position_cursor:   Buffer_position_cursor,
  
  events:            {
    "CTRL-C":     function() {  Window.quit()  },

    "LEFT":       Buffer_move_cursor_left,
    "RIGHT":      Buffer_move_cursor_right,
    "UP":         Buffer_move_cursor_up,
    "DOWN":       Buffer_move_cursor_down,

    "TEXT":       function(key) {  Buffer_add_to_text(key);   },
    "ENTER":      function()    {  Buffer_add_to_text("\n");  },
    "BACKSPACE":  Buffer_delete_from_text,

    "CTRL-S":     Buffer_save_to_file,

    // "CTRL-Z":     p_undo,                                                                                                                           
    // "CTRL-R":     q_redo, 
  }
  
};

function Buffer_load_file() { ... }
function Buffer_get_cursor_coords() { ... }
function Buffer_draw() { ... }
function Buffer_position_cursor() { ... }

//  Buffer event functions:
function Buffer_move_cursor_left() { ... }
function Buffer_move_cursor_right() { ... }
function Buffer_move_cursor_up() { ... }
function Buffer_move_cursor_down() { ... }

function Buffer_add_to_text(new_text) {
    var new_buffer = Buffer.text.slice(0, Buffer.cursor_pos);
    new_buffer    += new_text;
    new_buffer    += Buffer.text.slice(Buffer.cursor_pos, Buffer.text.length);
    Buffer.text    = new_buffer;
    Buffer.cursor_pos++;
    FeedbackBar.text = "Typed '" + new_text + "'";
    if (!Buffer.modified) {
        Buffer.modified = true;
    }
}
function Buffer_delete_from_text() {
    if ( Buffer.cursor_pos == 0 ) {      /**   Don't let the cursor position be negative.    **/
        return;
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
```

<br/><br/><br/><br/>



<h3 id="e-10">  ☑️ Step 10.  ☞ Test your code! </h3> 

Test the code now, to see if you can edit the buffer.   
Pressing `ctrl-s` should save your changes to the file.

<br/><br/><br/><br/>



<h3 id="e-11">  ☑️ Step 11.  ❖ Part E review. </h3> 

In this section, we reorganized our code to be Object Oriented!  
Our code will be much easier to navigate from here on out.  

The complete code for Part E is available [here](https://github.com/rooftop-media/ktty-tutorial/blob/main/js/version1.0/part_E.js).

Next up, we'll add a feedback prompt mode!

<br/><br/><br/><br/><br/><br/><br/><br/>



<h2 id="part-f" align="center">  Part F:   Feedback Prompt </h2>

*Estimated time: 30 minutes*

Up until now, keyboard input edits the contents of `Buffer.text`.

In this section, we’ll be implementing a keyboard "focus" system,  
which will switch between focus on either the Buffer or the FeedbackBar.  
Later, we'll add other focusable options!

When focused on the FeedbackBar, keyboard input types to the `FeedbackBar.input`.

We’ll switch to FeedbackBar focus in *two situations*:
 - When opening with no filename or a non-existing filename, prompt the user appropriately.  
 - When quitting with a modified file, prompt the user to save. 

<br/><br/><br/><br/>



<h3 id="f-1">  ☑️ Step 1.  Editing <code>Keyboard</code> </h3>

The first thing we'll do is add to the `Keyboard` object, to implement the focus system.

We'll do two things:
 - Add a data field, `Keyboard.focus_item`, which will "point" to the object we're focused on.
 - Edit `Keyboard.map_events()` to switch the mapping to `Keyboard.focus_item.events`.

```javascript
//  The keyboard.                                                                                                                                      
var Keyboard = {
    focus_item:  Buffer,

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

        var event_name = _this.event_names[key];         /**  Getting the event name from the keycode, like "CTRL-C" from "\u0003".  **/

        if (typeof event_name == "string" && typeof _this.focus_item.events[event_name] == "function") {       /**  "CTRL-C", "ENTER", etc     **/
            _this.focus_item.events[event_name]();
        } else if (key.charCodeAt(0) > 31 && key.charCodeAt(0) < 127) {        /**  Most keys, like letters, call the "TEXT" event.  **/
            _this.focus_item.events["TEXT"](key);
        }
        Window.draw();                                   /**  Redraw the whole screen on any keypress.                               **/
    };

    stdin.on("data", key_reaction);
}
```
<br/><br/><br/><br/>



<h3 id="f-2">  ☑️ Step 2.  ☞ Test your code!   </h3>

Run the code to make sure we can still move & edit the buffer, with this new system. 

<br/><br/><br/><br/>



<h3 id="f-3">  ☑️ Step 3.  Editing <code>FeedbackBar</code> </h3>

In Feedback Mode, the Feedback Bar will use some extra data fields & methods.

New data fields include:
 - `FeedbackBar.input`, which is where users can type responses.
 - `FeedbackBar.cursor_pos`, which allows the user to move back & forth within their answer.
 - `FeedbackBar.confirm_event`, which stores a function to call when the user hits ENTER.

New methods include:
 - `FeedbackBar.focus()` will let us switch into FeedbackBar focus.
 - Then we'll edit `FeedbackBar.draw()` to include user's input.
 - When focused on  the FeedbackBar, `FeedbackBar.position_cursor()` will position the cursor relative to the input. 

We'll also have some event methods, including:
 - `FeedbackBar.events.TEXT(key)` which will add to `FeedbackBar.input`.
 - `FeedbackBar.events.BACKSPACE()` which will delete from `FeedbackBar.input`.
 - `FeedbackBar.events.ENTER()` which will call `FeedbackBar.confirm_event()` with the input.


```javascript
//  Feedback object & functions                                                                                                                        
var FeedbackBar = {
    text:            "",
    input:           "",
    cursor_pos:      0,
    confirm_event:   function(response) {},

    draw:            FeedbackBar_draw,
    focus:           FeedbackBar_focus,
    position_cursor: FeedbackBar_position_cursor,
    
    events:            {
        "CTRL-C":     function() {  Window.quit()  },

        // "LEFT":       FeedbackBar_move_cursor_left,
        // "RIGHT":      FeedbackBar_move_cursor_right,

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
function FeedbackBar_position_cursor() {
    var cursor_x = this.text.length + this.cursor_pos + 2;
    process.stdout.write("\x1b[" + (Window.height - 1) + ";" + cursor_x + "H");
}
// FeedbackBar event functions...
function FeedbackBar_add_to_text(key) {
    var _this = FeedbackBar;
    var new_input = _this.input.slice(0, _this.cursor_pos);
    new_input    += key;
    new_input    += _this.input.slice(_this.cursor_pos, _this.input.length);
    _this.input    = new_input;
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
```

<br/><br/><br/><br/>



<h3 id="f-4">  ☑️ Step 4.  Editing <code>Buffer</code> </h3>

We'll add one function to Buffer: `Buffer.focus()`.
It'll be implemented in `Buffer_focus()`, of course.

```javascript
var Buffer = {
    text:        "",
    filename:    "",
    modified:    false,
    cursor_pos:  0,

    focus:             Buffer_focus,
    load_file:         Buffer_load_file,
    get_cursor_coords: Buffer_get_cursor_coords,
    draw:              Buffer_draw,
    position_cursor:   Buffer_position_cursor,

    events:            {
        "CTRL-C":     function() {  Window.quit()  },

        "LEFT":       Buffer_move_cursor_left,
        "RIGHT":      Buffer_move_cursor_right,
        "UP":         Buffer_move_cursor_up,
        "DOWN":       Buffer_move_cursor_down,

        "TEXT":       function(key) {  Buffer_add_to_text(key);   },
        "ENTER":      function()    {  Buffer_add_to_text("\n");  },
        "BACKSPACE":  Buffer_delete_from_text,

        "CTRL-S":     Buffer_save_to_file,

        // "CTRL-Z":     p_undo,                                                                                                                      \
                                                                                                                                                       
        // "CTRL-R":     q_redo,                                                                                                                       
    }

};
function Buffer_focus() {
    Keyboard.focus_item = this;
}
```

<br/><br/><br/><br/>



<h3 id="f-5">  ☑️ Step 5.  Editing <code>Buffer.load_file</code> </h3>

This is the first of 2 places we'll use FeedbackBar focus, in this version.

When the user opens Ktty with no file name, we need to prompt the user.

```javascript
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
```
<br/><br/><br/><br/>



<h3 id="f-6">  ☑️ Step 6.  ☞ Test your code!   </h3>

Try opening Ktty without a filename.  You should see our first message!  
Typing should let you add text to the filename.  
Pressing ENTER should start you off editing that file, with Buffer focus.

Now try opening Ktty with an *invalid* filename.  You should see the second message!

<br/><br/><br/><br/>



<h3 id="f-7">  ☑️ Step 7.  Edit <code>window.draw()</code>   </h3>

We need to add one line to make position the cursor.

```javascript
function Window_draw() {
    Buffer.draw();
    StatusBar.draw();
    FeedbackBar.draw();
    Keyboard.focus_item.position_cursor();
}
```

<br/><br/><br/><br/>



<h3 id="f-8">  ☑️ Step 8.  ☞ Test your code!   </h3>

Run ktty again with no file path.  This time, the cursor should appear where you're typing.  

<br/><br/><br/><br/>



<h3 id="f-9">  ☑️ Step 9.  Edit <code>FeedbackBar.events</code> to add cursor movement  </h3>

We need to add two more events to the FeedbackBar:
 - `FeedbackBar.events.LEFT`, and 
 - `FeedbackBar.events.RIGHT`.
Uncomment them in `FeedbackBar.events`, and implement them below.

```javascript
//  Feedback object & functions                                                                                                                        
var FeedbackBar = {
    text:            "",
    input:           "",
    cursor_pos:      0,
    confirm_event:   function(response) {},

    draw:            FeedbackBar_draw,
    focus:           FeedbackBar_focus,
    position_cursor: FeedbackBar_position_cursor,
    
    events:            {
        "CTRL-C":     function() {  Window.quit()  },

        "LEFT":       FeedbackBar_move_cursor_left,
        "RIGHT":      FeedbackBar_move_cursor_right,

        "TEXT":       function(key) {  FeedbackBar_add_to_text(key);   },
	"BACKSPACE":  FeedbackBar_delete_from_text,
        "ENTER":      function()    {  FeedbackBar.confirm_event(FeedbackBar.input);  },
    }
};
function FeedbackBar_focus() { ... }
function FeedbackBar_draw() { ... }
function FeedbackBar_position_cursor() { ... }
// FeedbackBar event functions...
function FeedbackBar_add_to_text(key) { ... }
function FeedbackBar_delete_from_text() { ... }
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

```

<br/><br/><br/><br/>



<h3 id="f-10">  ☑️ Step 10.  ☞ Test your code!   </h3>

Run ktty again, with an invalid file path.  

When in feedback mode, try moving the cursor left and right inside the feedback bar input.  
You should be able to edit your feedback input this way, now!  

<br/><br/><br/><br/>



<h3 id="f-11">  ☑️ Step 11.  Edit <code>Window.quit</code>  </h3>

We can now use our FeedbackBar to prompt users for yes or no input when closing an unsaved file.

```javascript
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
		FeedbackBar.cursor_pos = 0;
	    }
	    
	}
    }
}
```

<br/><br/><br/><br/>



<h3 id="f-12">  ☑️ Step 12.  ☞ Test your code!   </h3>

Test the code by opening a file with ktty, editing it, and then quitting without saving.

There are 3 total options we need to test:
 - Save & quit by typing `y` to the first question. 
 - Quit WITHOUT saving by typing `n` to the first question and `y` to the second. 
 - Don't quit, by typing `n` to the first question and `n` to the second.

Finally, we need to make sure both questions can handle invalid input appropriately. 

<br/><br/><br/><br/>



<h3 id="f-13">  ☑️ Step 13.  ❖  Part F review. </h3>

At this point, we have our feedback prompt system working well!  
The app now prompts us for a filename when we open it without one,  
and prompts us to save when we quit without saving.

The complete code for Part F is available [here](https://github.com/rooftop-media/ktty-tutorial/blob/main/js/version1.0/part_F.js).

Nice!

<br/><br/><br/><br/><br/><br/><br/><br/>











<h2 id="part-g" align="center">  Part G:   Scroll & resize </h2>

In this section, we'll make edits to display the `_buffer` even if it's bigger than our screen.

Features in this section include:
 - Make a text line wrap if it exceeds the window _length_. 
 - Indicate wrapped lines with a backslash "\\".
 - Make files scrollable if text lines exceed window _height_, both up and down.
 - Update file wrap on window resize.

We need to react differently to edits to the buffer, vs. edits to the cursor's buffer position:
 - Buffer edits react in re-wrapping the buffer's text. (Resize does this too)
 - Cursor movement reacts in a scroll check. 

*Estimated time: 24 minutes*

<br/><br/><br/><br/>



<h3 id="g-1">  ☑️ Step 1.  Adding long.txt </h3>

We're gonna need another sample text file, with a line that exceeds the _width_ of the window, in one place,
and we're going to need to add enough lines that it exceeds the _height_ of the window.  

You can find the long sample file I used [here](https://github.com/rooftop-media/ktty-tutorial/blob/main/js/version1.0/long.txt).

<br/><br/><br/><br/>



<h3 id="g-2">  ☑️ Step 2.  Editing <code>Buffer</code> </h3>

For this section, the Buffer needs a new data field: an integer at `Buffer.scroll_pos`. 

We also need to edit the `Buffer_draw()` to draw line by line, for these reasons:
 - We DON'T want to draw lines before the value of `Buffer.scroll_pos`.  If `Buffer.scroll_pos == 2`, we should START at the 3rd line. 
 - Lines that overflow the `Window.width` should be _wrapped_.  As we do this, keep track of the amount of extra `overflow` lines.
 - Stop drawing if the line number gets to `Window.height + Buffer.scroll_pos - overflow`.  

The code below has the added `scroll_pos` field, and the updated `Buffer_draw()` method.

```javascript
var Buffer = {
    text:         "",
    filename:     "",
    modified:     false,
    cursor_pos:   0,
    scroll_pos:   0,

    focus:             Buffer_focus,
    load_file:         Buffer_load_file,
    get_cursor_coords: Buffer_get_cursor_coords,
    draw:              Buffer_draw,
    position_cursor:   Buffer_position_cursor,

    events:            {
        "CTRL-C":     function() {  Window.quit()  },

        "LEFT":       Buffer_move_cursor_left,
        "RIGHT":      Buffer_move_cursor_right,
        "UP":         Buffer_move_cursor_up,
        "DOWN":       Buffer_move_cursor_down,

        "TEXT":       function(key) {  Buffer_add_to_text(key);   },
        "ENTER":      function()    {  Buffer_add_to_text("\n");  },
        "BACKSPACE":  Buffer_delete_from_text,

        "CTRL-S":     Buffer_save_to_file,

        // "CTRL-Z":     p_undo, 
        // "CTRL-R":     q_redo,    
    }

};
function Buffer_focus()               { ... }
function Buffer_load_file()           { ... }
function Buffer_get_cursor_coords()   { ... }
function Buffer_draw() {

    console.clear();
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
            i < (Window.height + this.scroll_pos - overflow - 3) /* Stop drawing at the window height plus this offset. */
           ) {  
            for (var j = 0; j < overflow_lines.length; j++) {
                console.log(overflow_lines[j] + "\x1b[2m\\\x1b[0m");   /**  Dim, add "\", undim   **/
            }
            console.log(line);
        }
    }
}
function Buffer_position_cursor()     { ... }
function Buffer_move_cursor_left()    { ... }
function Buffer_move_cursor_right()   { ... }
function Buffer_move_cursor_up()      { ... }
function Buffer_move_cursor_down()    { ... }
function Buffer_add_to_text(new_text) { ... }
function Buffer_delete_from_text()    { ... }
function Buffer_save_to_file()        { ... }
```

<br/><br/><br/><br/>



<h3 id="g-3">  ☑️ Step 3.  ☞ Test the code! </h3>

Test the code by using ktty to open long.txt.  

Make sure that:
 - When the file opens, the very first line is visible. 
 - The lines that overflow wrap, with a dim "\" indicating a wrapping line.
 - The lines DON'T draw below the buffer area. 
 
While testing, we can also notice the bug we'll need to fix next:
 - Put your cursor on the FIRST LINE of an OVERFLOWING LINE.  
 - Type, and notice that the text enters correctly. 
 - Press DOWN.  The cursor jumps to the SECOND PART of the SAME OVERFLOWING LINE.
 - Type, and notice that the EDIT is displaced on the NEXT LINE.

We'll fix this by making the cursor jump to the NEXT line, rather than the second part of the overflowing line.
 
<br/><br/><br/><br/>




<h3 id="g-4">  ☑️ Step 4.  Editing <code>Buffer.get_cursor_coords()</code>. </h3>

The error described in the previous test can be fixed in `Buffer_get_cursor_coords()`.  

We need to tweak the inside of that IF statement to account for lines longer than `Window.width - 1`.

```javascript
function Buffer_get_cursor_coords() {            /**  Returns a 2 index array, [int line, int char]           **/

    var cursor_coords = [1,1];                   //  line, char coord of cursor
    for (var i = 0; i < this.cursor_pos; i++) {  //  Loop through the buffer to count \n's  

        var current = this.text[i];
        if (current == "\n" || cursor_coords[1] >= Window.width - 1) {
            cursor_coords[0]++;        /**  Advance a line.        **/
	    cursor_coords[1] = 1;      /**  Reset character pos.   **/
	} else {
            cursor_coords[1]++;        /**  Advance a character.   **/
        }
    }
    return cursor_coords;

}
```

<br/><br/><br/><br/>



<h3 id="g-5">  ☑️ Step 5.  ☞ Test the code! </h3>

Open the same long.txt.  
Move down past the overflow line by pressing DOWN, and make sure editing is still synced with the cursor.  
Move back ONTO an overflowing line by pressing LEFT, and make sure the cursor jumps to the END of the overflow line.  

If it all works, we've handled the overflow wrap!  Let's move on to vertical scrolling!

<br/><br/><br/><br/>



<h3 id="g-6">  ☑️ Step 6.  Editing <code>Buffer.get_cursor_coords()</code>.</h3>

The next step is to make the page scroll down when the cursor reaches the end of the screen,
or up when the cursor reaches the top of the page.

The `Buffer_get_cursor_coords` algorithm is used to position the cursor on the buffer.  
We can to edit it again to account for the scroll offset.

We can account for the scroll offset by subtracting `Buffer.scroll_pos` from `cursor_coords[1]`.

The resulting line position may be negative, OR above the window height.  
We'll check for those cases using an IF statement, and change `Buffer.scroll_pos` if needed. 
This function returns an array, so once we change `Buffer.scroll_pos`, 
we can return the new calculation with `return Buffer.get_cursor_coords();`, using recursion!

```javascript
function Buffer_get_cursor_coords() {            /**  Returns a 2 index array, [int line, int char]           **/

    var cursor_coords = [1,1];                      //  line, char coord of cursor
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
```

<br/><br/><br/><br/>



<h3 id="g-7">  ☑️ Step 7.  ☞ Test the code!  </h3>

Press down until the cursor gets to the end of the file.  

You'll notice there's a bug -- the text doesn't scroll down until
the down key is pressed _twice_ after reaching the end of the file. 

This is because, right now, the `Buffer.get_cursor_coords()` function 
is called *after* the screen has been drawn, in `Window.draw()`, in `Keyboard.focus_item.position_cursor()`.

We'll need to refactor our code slightly to make this work. 

<br/><br/><br/><br/>



<h3 id="g-8">  ☑️ Step 8. Edit <code>Window_draw()</code>  </h3>

To fix the bug, we'll edit `Window_draw()` to first calculate the 
cursor position and scroll update, and *then* redraw the screen, and position the cursor. 

```javascript
function Window_draw() {
    Keyboard.cursor_coords = Keyboard.focus_item.get_cursor_coords();

    Buffer.draw();
    StatusBar.draw();
    FeedbackBar.draw();
    
    Keyboard.position_cursor();
}
```


<br/><br/><br/><br/>



<h3 id="g-9">  ☑️ Step 9. Edit the <code>Keyboard</code> object </h3>

We're now storing our cursor coordinates in the Keyboard object's data. 

We're also adding a method to Keyboard, `position_cursor()`, which will 
move the cursor to the cursor's stored coordinates. 

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
    },
  
    position_cursor: function() {
        process.stdout.write("\x1b[" + this.cursor_coords[0] + ";" + this.cursor_coords[1] + "f");
    },
    map_events: Keyboard_map_events
  
};
```

<br/><br/><br/><br/>



<h3 id="g-10">  ☑️ Step 10. Delete <code>Buffer_position_cursor</code> </h3>

We can just delete this function completely.  

We replaced its functionality with `Keyboard.position_cursor`, and 
we already have `Buffer.get_cursor_coords`, so we're all set. 

Here's what our Buffer object looks like now.  Remember to delete the `Buffer_position_cursor`
function implementation as well. 

```javascript
var Buffer = {
    text:         "",
    filename:     "",
    modified:     "",
    cursor_pos:   0,
    scroll_pos:   0,

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

        "TEXT":       function(key) {  Buffer_add_to_text(key);   },
        "ENTER":      function()    {  Buffer_add_to_text("\n");  },
        "BACKSPACE":  Buffer_delete_from_text,

        "CTRL-S":     Buffer_save_to_file,

        // "CTRL-Z":     p_undo,                                                                                                                           
        // "CTRL-R":     q_redo, 
    }
  
};
```

<br/><br/><br/><br/>


<h3 id="g-11">  ☑️ Step 11. Rename <code>FeedbackBar_position_cursor</code> to <code>FeedbackBar_get_cursor_coords</code> </h3>

Finally, we need to rename `FeedbackBar_position_cursor` to `FeedbackBar_get_cursor_coords`.
We also need to edit it slightly. 

```javascript
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
function FeedbackBar_focus() { /*...*/ }
function FeedbackBar_draw() { /*...*/ }
function FeedbackBar_get_cursor_coords() {
    var cursor_x = this.text.length + this.cursor_pos + 2;
    var cursor_y = Window.height - 1;
    return [cursor_y, cursor_x];
}

```

<br/><br/><br/><br/>



<h3 id="g-12">  ☑️ Step 12.  ☞ Test the code!  </h3>

Okay! At this point, that bug should be fixed. 

Try moving the cursor to the end of the page, and see if the page scrolls down. 

<br/><br/><br/><br/>




<h3 id="g-13">  ☑️ Step 13.  Edit <code>StatusBar_draw</code>  </h3>

We can add a single line to `StatusBar_draw` to output the current page scroll. 
We'll also change the "cursor on line" output to account for the scroll. 

```javascript
//  Drawing the file's status bar -- filename, modified status, and cursor position.                                                                   
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
```

<br/><br/><br/><br/>



<h3 id="g-14">  ☑️ Step 14.  ☞ Test the code!  </h3>

The feedback bar should now display the scroll and line position.

<br/><br/><br/><br/>



<h3 id="g-15">  ☑️ Step 15.  Edit <code>Keyboard_map_events</code>  </h3>

Finally, we'll make sure the window gets refreshed properly when it's resized. 

```javascript
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
```

<br/><br/><br/><br/>



<h3 id="g-16">  ☑️ Step 16.  ☞ Test the code!  </h3>

Open up a text file with overflow text, and resize the window.  
Everything should continue to look nice!

<br/><br/><br/><br/>



<h3 id="g-17">  ☑️ Step 17.  ❖  Part G review. </h3>

In this section, we added handling for text lines that overflow the window width, 
scrolling for files that exceed window height, and proper resizing. 

The complete code for Part G is available [here](https://github.com/rooftop-media/ktty-tutorial/blob/main/js/version1.0/part_G.js).

<br/><br/><br/><br/><br/><br/><br/><br/>



<h2 id="part-h" align="center">  Part H:   Undo & Redo </h2>

In this section, we'll add two new events to Buffer Mode:
 - `ctrl-z` will undo the previous action
 - `ctrl-y` will *redo* the previous action that was undone. 

To implement this, we'll need to store the user's actions in a list. 
We'll also need to mark which action came last, especially if some have been "undone". 

Finally, we'll need a mechanism to actually undo and redo these actions. 

*Estimated time: 20 minutes*

<br/><br/><br/><br/>



<h3 id="h-1">  ☑️ Step 1.  Edit the <code>Keyboard</code> object </h3>

First, we'll need to add the appropriate keycodes for detecting `ctrl-z` and `ctrl-y`. 

Here's our updated `Keyboard` object:

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
    },
  
    position_cursor: function() {
        process.stdout.write("\x1b[" + this.cursor_coords[0] + ";" + this.cursor_coords[1] + "f");
    },
    map_events: Keyboard_map_events
  
};
```

<br/><br/><br/><br/>



<h3 id="h-2">  ☑️ Step 2.  Edit the <code>Buffer</code> object </h3>

Next, we'll need to update the Buffer object. 

We'll add an array to track the user's `actions_history`, and an integer to track the user's `undo_count`. 

In the events, we'll change the `"TEXT"`, `"ENTER"`, and `"BACKSPACE"` events to use 
a true or false argument, which will indicate whether we're recording those actions as undoable history.  
We'll also add events to react to CTRL-Z and CTRL-Y.

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
    }
  
};
```

<br/><br/><br/><br/>



<h3 id="h-3">  ☑️ Step 3.  Edit <code>Buffer_add_to_text</code> </h3>

Next, we'll need to update the `Buffer_add_to_text` function. 

We'll use the "record" argument, a boolean, to indicate if we're adding to undoable history.

If `undo_count` is above zero, we'll reset it here.

We'll add a single line at the bottom, adding the action to our `action_history`. 

```javascript
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
```

<br/><br/><br/><br/>



<h3 id="h-4">  ☑️ Step 4.  Edit <code>Buffer_delete_from_text</code> </h3>

We also need to edit the `Buffer_delete_from_text` function.  

Again, we'll add a `record` boolean to indicate if this is a recorded action. 

We'll reset the `undo_count` if we're recording.  And we'll record the delete action too. 


```javascript
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
```

<br/><br/><br/><br/>



<h3 id="h-5">  ☑️ Step 5.  Add <code>Buffer_undo</code> </h3>

We're now ready to add the `Buffer_undo` function.  Nice!

In this function, we'll read the most recent record in our "action history".  
We'll use that record to undo a text deletion or addition.

```javascript
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
```

<br/><br/><br/><br/>



<h3 id="h-6">  ☑️ Step 6.  ☞ Test the code!  </h3>

Running the program now, you'll get an error about `Buffer_redo` not being implemented yet, fix that
by adding an empty function with that name.

You should now be able to undo actions!

Move anywhere in a document, type a bit, and delete a bit. 
Then, press ctrl-z to undo those actions.  Ctrl-z should stop working once everything's undone.

Try typing and pressing ctrl-z again, somewhere else, to make it works the same a second time.

<br/><br/><br/><br/>



<h3 id="h-7">  ☑️ Step 7.  Add <code>Buffer_redo</code> </h3>

The redo function works any time `undo_count` is above 0.

If the last action to be undone was typing text, we'll retype that text. 
If the last action to be undone was deleting text, we'll re-delete that text. 

```javascript
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
        FeedbackBar.text = "Redo!";
    } else if (action_type == "delete") {
        Buffer.cursor_pos = cursor_position;
        Buffer_delete_from_text(false);
        Window.draw();
        Buffer.undo_count--;
        FeedbackBar.text = "Redo!";
    }
}
```

</h3>

<br/><br/><br/><br/>



<h3 id="h-8">  ☑️ Step 8.  ☞ Test the code!  </h3>

Running the program now, you'll still be able to undo with `ctrl-z`. 
Now, you'll also be able to redo with `ctrl-y` as well.

If you press undo a few times, and then newly type or delete text, you should not be able to undo anymore.

<br/><br/><br/><br/>




<h3 id="h-9">  ☑️ Step 9:  ❖  Part H review. </h3>

In this section, we added two new key commands, to undo actions, and to redo actions.

The complete code for Part H is available [here](https://github.com/rooftop-media/ktty-tutorial/blob/main/js/version1.0/part_H.js).

<br/><br/><br/><br/><br/><br/><br/><br/>













