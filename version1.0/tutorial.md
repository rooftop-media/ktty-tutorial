# Tutorial for Ktty, version 1.0

<br/><br/><br/><br/><br/><br/><br/><br/>



##  Prerequisites

This tutorial requires that you've completed the [initial set up steps](https://github.com/rooftop-media/ktty-tutorial/blob/main/readme.md#initial-steps).

<br/><br/><br/><br/><br/><br/><br/><br/>



##  Table of Contents

Click a part title to jump down to it, in this file.

| Tutorial Parts              | Status | # of Steps |
| --------------------------- | ------ | ---------- |
| [Part A - Drawing the Buffer](https://github.com/rooftop-media/ktty-tutorial/blob/main/version1.0/tutorial.md#part-a) | Complete, tested. | 12 |
| [Part B - Drawing the Status Bar](https://github.com/rooftop-media/ktty-tutorial/blob/main/version1.0/tutorial.md#part-b) | Complete, tested. | 11 |
| [Part C - Cursor & Feedback Bar](https://github.com/rooftop-media/ktty-tutorial/blob/main/version1.0/tutorial.md#part-c) | Complete, tested.  | 14 |
| [Part D - File Editing](https://github.com/rooftop-media/ktty-tutorial/blob/main/version1.0/tutorial.md#part-d) | Complete, tested. | 8 |
| [Part E - Object Oriented Refactor](https://github.com/rooftop-media/ktty-tutorial/blob/main/version1.0/tutorial.md#part-e) | Complete, tested. | 19 |
| [Part F - Feedback Mode](https://github.com/rooftop-media/ktty-tutorial/blob/main/version1.0/tutorial.md#part-f) | In progress | 9 |
| [Part G - Scroll & Resize](https://github.com/rooftop-media/ktty-tutorial/blob/main/version1.0/tutorial.md#part-g) | In progress | 9 |
| [Part H - Undo & Redo](https://github.com/rooftop-media/ktty-tutorial/blob/main/version1.0/tutorial.md#part-h) | Todo | ? |
| [Version 2.0.](https://github.com/rooftop-media/ktty-tutorial/blob/main/version1.0/tutorial.md#v2) | Todo | ? |

<br/><br/><br/><br/><br/><br/><br/><br/>





<h2 id="part-a" align="center">  Part A:  Drawing the Buffer </h2>

The steps in this part will culminate in us displaying the text file on the screen, along with controls to move and type.  

Along the way, we’ll break the code into 6 code sections with comments, and add some code to each section.  
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


*Later, we'll need to modify the keys so the behaviour is linked to the buffer.
For now, we’ll be able to move the cursor anywhere on the page.*
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



<h3 id="b-6"> ☑️ Step 6. <code>d_get_cursor_pos()</code> </h3>

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


<h3 id="b-8"> ☑️ Step 8.  Editing <code>draw()</code> again </h3>

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

The complete code for Part B is available [here](https://github.com/rooftop-media/ktty-tutorial/blob/main/version1.0/part_B.js) .

<br/><br/><br/><br/><br/><br/><br/><br/>




<h2 id="part-c" align="center">  Part C:  The Cursor & Feedback Bar </h2>

In these steps, we’ll be making the cursor properly move around the buffer text.

For example, if the cursor is at the end of a text line, and the RIGHT key is pressed,
the cursor should jump to the beginning of the next line.  
And typing should insert a character into the buffer, rather than replacing a character.

We’ll also log key events to the *feedback bar* in this part. 
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



<h3 id="c-9"> ☑️ Step 9.  <code>h_move_cursor_down()</code> </h3>

Now let’s write an algorithm to move DOWN into a line. 

To move DOWN, we'll need to do the following: 
 1. Get the `current_x_position` of this line.
 2. Get the `current_line_length`, to move forward correctly.
 3. Get the `next_line_length`.
 4. Branch depending on if the `current_x_position` exceeds the `next_line_length`.
 5. &nbsp; IF `current_x_position` is bigger, go to the END of the next line.
 6. &nbsp; IF `next_line_length` is bigger, go to the current X position on that line. 

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

<br/><br/><br/><br/><br/><br/><br/><br/>



<h2 id="part-d" align="center">  Part D:  File Editing </h2>
In this section, we’ll add some more events we outlined, including typing characters, backspace, & enter.  
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



<h3 id="d-4">  ☑️ Step 4.  <code>j_delete_from_buffer()</code> </h3>
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




<h3 id="d-5">  ☑️ Step 5.  ☞ Test the code! </h3>
At this point, you should be able to type text, & then delete it!

Make sure that pressing “backspace” at the beginning of the file doesn’t cause any errors. 

<br/><br/><br/><br/>



<h3 id="d-6">  ☑️ Step 6.  <code>k_save_buffer_to_file()</code> </h3>
This algorithm will save the file, & update the `_modified` variable.

```javascript
function k_save_buffer_to_file() {
    fs.writeFileSync(_filename, _buffer, { encoding: 'utf8' } );
    _modified = false;
    _feedback_bar = "saved :)";
}
```

<br/><br/><br/><br/>



<h3 id="d-7">  ☑️ Step 7.  ☞ Test the code! </h3>

Try typing some text into the buffer, and deleting some text.  
Then, save with ctrl-s, and quit.  Then open the file back up -- your changes should be saved!

<br/><br/><br/><br/>



<h3 id="d-8">  ☑️ Step 8.  ❖ Part D review. </h3> 

In this part, we added some basic editing controls. 

<br/><br/><br/><br/><br/><br/><br/><br/>



<h2 id="part-e" align="center">  Part E:   Object Oriented Refactor </h2>

Before we implement a feedback prompt system, we're going to do a *refactor*, 
from *functional* programming into *object oriented* programming. 

This refactoring will be a bit tedious.  You may find yourself asking, 
"Why are we doing this? This seems like *more* work."

It *is* more work, you're right.  It will be even more work to think about.
But in return for that investment, we'll have a clear, interconnected web  
of discrete, well-understood parts. 

=== Here's what we'll keep:

We'll still use the same essential *event loop* model.  
In an event loop, the program listens for events, and reacts to those events with functions.

We're also redrawing the screen after each event, based on the relevant data.

This is considered Model-View-Controller architecture, or MVC architecture:
 - Our Events are the "Controller"
 - The functions that events trigger affect global data, which is the "Model"
 - The data is used to draw the screen, which is the "View"

=== Here's what we'll change:

The big thing we need to do is sort our data & algorithms by object,  
instead of having two big separate piles.  

Our MVC architecture will still be there, but different elements will 
implement the different features in different ways. 

There won't be a single "draw" function, for example, but  
the objects for the Buffer, StatusBar, & FeedbackBar will all have a `draw()` method. 

The key to refactoring is having a well understood plan.  
I have a nice OO data diagram, which I'll upload here soon. 

<br/><br/><br/><br/>



<h3 id="e-1">  ☑️ Step 1.  Editing <code>boot()</code> </h3>

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



<h3 id="e-2">  ☑️ Step 2.  Rename Section 2 </h3> 

Section 2 will *no longer* be our app data!  It's now our *objects!*

You can delete all our variables, too.  We'll replace them in our objects. 

```javascript
//  SECTION 2:  Objects
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
//  SECTION 2:  Objects

var Buffer = {
  text:        "",
  filename:    "",
  modified:    "",
  cursor_pos:  0,
  scroll:      0,
  
  load_file:   function() {
    this.filename = process.argv[2];
    if ( this.filename == undefined ) {
        this.text = "";
    } else {
        try {
            this.text = fs.readFileSync( this.filename, {encoding: 'utf8'} );
        } catch (err) {
            this.text = "Unable to find a file at '" + this.filepath + "'";
        }
    }
  },
  
  get_cursor_coords: function() {
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
    return cursor_position;
  },
  
  draw:    function() {
    console.clear();
    console.log(this.text);
  },
  
  position_cursor() {
    var cursor_position = d_get_cursor_pos();                                                                     
    process.stdout.write("\x1b[" + cursor_position[0] + ";" + cursor_position[1] + "f");
  }
  
}
```
<br/><br/><br/><br/>



<h3 id="e-4">  ☑️ Step 4.  Add the <code>StatusBar</code>. </h3> 

```javascript
//  SECTION 2:  Objects

var Buffer = { ... }
var StatusBar = { 
  draw:   function() {
    process.stdout.write("\x1b[" + (Window.height - 2) + ";0H");   /**  Moving to the 2nd to bottom row.  **/
    process.stdout.write("\x1b[7m");                               /**  Reverse video.                    **/

    var status_bar_text = "  " + Window.filename;                  /**  Add the filename                  **/
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

    process.stdout.write(status_bar_text);                         /**  Output the status bar string.     **/
    process.stdout.write("\x1b[0m");                               /**  No more reverse video.            **/
  }
}
```
<br/><br/><br/><br/>



<h3 id="e-5">  ☑️ Step 5.  Add the <code>FeedbackBar</code>. </h3> 

We'll make an object for the Feedback Bar. 

Snag `FeedbackBar.draw()` from `draw_feedback_bar()` in the previous version.

```javascript
//  SECTION 2:  Objects

var Buffer = { ... }
var StatusBar = { ... }
var FeedbackBar = { 
  text:    "",
  
  draw:    function() {
    process.stdout.write("\x1b[2m");                               /**  Dim text.                         **/
    process.stdout.write("\x1b[" + (Window.height - 1) + ";0H");   /**  Moving to the bottom row.         **/
    process.stdout.write(this.text);
    _feedback_bar = "";
    process.stdout.write("\x1b[0m");                               /**  Back to undim text.               **/
  }
}


```
<br/><br/><br/><br/>




<h3 id="e-6">  ☑️ Step 6.  Add the <code>Window</code>. </h3> 

We'll have an object to represent the Window, too. 
This is kind of a special object, that "aggregates" the other objects for drawing & such. 

```javascript
//  SECTION 2:  Objects

var Buffer = { ... }
var StatusBar = { ... }
var FeedbackBar = { ... }

var Window {
  height:    100,
  width:     100,
  
  get_size:  function() {
    _window_h = process.stdout.rows;
    _window_w = process.stdout.columns;
  },
  
  draw:      function() {
    Buffer.draw();
    StatusBar.draw();
    FeedbackBar.draw();
  }
}
```
<br/><br/><br/><br/>


<h3 id="e-5">  ☑️ Step 7.  Add the <code>Keyboard</code>. </h3> 

```javascript
//  SECTION 2:  Objects

var Buffer = { ... }
var StatusBar = { ... }
var FeedbackBar = { ... }
var Window { ... }


```
<br/><br/><br/><br/>



<h3 id="e-?">  ☑️ Step 8.  ❖ Part E review. </h3> 

In this part, we added some basic editing controls. 

<br/><br/><br/><br/><br/><br/><br/><br/>



<h2 id="part-f" align="center">  Part F:   Feedback Prompt </h2>

KTTY will be able to run in different **modes**, which affect what the keyboard events do.   

Up until now, we've been building Buffer Editor Mode.  
In Buffer Editor Mode, keyboard input edits the contents of the `_buffer`.

In this section, we’ll be implementing Feedback Mode.   
In Feedback Mode, keyboard input types to the `_feedback_input`.

We’ll be using Feedback Mode in two ways, in this version:  
 - When opening with no filename or a non-existing filename, prompt the user appropriately.  
 - When quitting with a modified file, prompt the user to save. 


<br/><br/><br/><br/>








<h3 id="e-19">  ☑️ Step 19.  ❖  Part F review. </h3>

At this point, we have our feedback prompt system working well!  
The app now prompts us for a filename when we open it without one,  
and prompts us to save when we quit without saving.

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
 - Buffer edits react in re-wrapping the buffer's text.
 - Cursor movement reacts in a scroll check. 

<br/><br/><br/><br/>



<h3 id="g-1">  ☑️ Step 1.  Adding variables. </h3>

For this section we need two more variable:
 - an integer named `_scroll`.
 - a string named `_wrapped_buffer`.

```javascript
////  SECTION 2:  APP MEMORY

//  Setting up app memory. 
var _mode              = "BUFFER-EDITOR";  //  Options: "BUFFER-EDITOR", "FEEDBACK-PROMPT"

var _buffer            = "";      //  The text being edited. 
var _filename          = "";      //  Filename - including extension.
var _modified          = false;   //  Has the buffer been modified?
var _cursor_buffer_pos = 0;       //  The position of the cursor in the text.
var _scroll            = 0;
var _wrapped_buffer    = "";

var _feedback_bar      = "";      //  The text to display in the feedback bar.

var _feedback_input    = "";      //  What has the user typed? 
var _feedback_cursor   = 0;       //  Where is the feedback input cursor? 
var _feedback_event    = function (response) {}; 

var _window_h          = 0;       //  Window height (in text char's). 
var _window_w          = 0;       //  Window width (in text char's).
```

<br/><br/><br/><br/>



<h3 id="g-2">  ☑️ Step 2.  Adding long.txt </h3>

We're gonna need another sample text file, with a line that exceeds the _width_ of the window, in one place,
and we're going to need to add enough lines that it exceeds the _height_ of the window.  

You can find the long sample file I used [here](https://github.com/rooftop-media/ktty-tutorial/blob/main/version1.0/long.txt).

<br/><br/><br/><br/>



<h3 id="g-3">  ☑️ Step 3.  <code>q_wrap_buffer()</code>. </h3>

This function will make a version of `_buffer` with text lines that will fit in the screen's width.  

```javascript
function q_wrap_buffer() {
    
}
```
<br/><br/><br/><br/>



<h3 id="g-4">  ☑️ Step 4.  Editing <code>draw_buffer()</code>. </h3>

We need to edit `draw_buffer()` to draw line by line, for these reasons:
 - We DON'T want to draw lines before the value of `_scroll`.  If `_scroll == 2`, we should START at the 3rd line. 
 - Lines that overflow the `_screen_w` should be _wrapped_.  As we do this, keep track of the "true line count" (which is the `\n` marked line count + extra `overflow` lines.)
 - Stop drawing if the "true line count" gets to `screen_h + _scroll`. 

```javascript
//  Drawing the buffer. 
function draw_buffer() {

    console.clear();
    var buff_lines = _buffer.split("\n");
    var overflow   = 1;

    for (var i = 0; i < buff_lines.length; i++) {
        var line = buff_lines[i];
	
        if (i >= _scroll && i < (_window_h + _scroll - overflow) ) {   /**  This IF statement ensures we draw the correct amount of lines!   **/
	
            while (line.length > _window_w) {                          /**  This WHILE loop breaks down any lines that overflow _window_w.   **/     
                overflow++;
                var line_part = line.slice(0, _window_w - 1);
                console.log(line_part + "\x1b[2m\\\x1b[0m");           /**  Dim, add "\", undim   **/
                line = line.slice(_window_w - 1, line.length);
            }
            console.log(line);
        }
    }
}
```

<br/><br/><br/><br/>



<h3 id="f-4">  ☑️ Step 4.  ☞ Test the code! </h3>

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




<h3 id="f-5">  ☑️ Step 5.  Editing <code>d_get_cursor_pos()</code>. </h3>

The error described in the previous test can be fixed in `d_get_cursor_pos()`.  

We need to tweak the inside of that IF statement to account for lines longer than `_window_w - 1`.

```javascript
function d_get_cursor_pos() {            /**  Returns a 2 index array, [int line, int char]           **/

    var cursor_position = [1,1];                    //  line, char coord of cursor
    for (var i = 0; i < _cursor_buffer_pos; i++) {  //  Loop through the buffer to count \n's  

        var current = _buffer[i];
        if (current == "\n" || cursor_position[1] >= _window_w - 1) {
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



<h3 id="f-6">  ☑️ Step 6.  ☞ Test the code! </h3>

Open the same long.txt.  
Move down past the overflow line by pressing DOWN, and make sure editing is still synced with the cursor.  
Move back ONTO an overflowing line by pressing LEFT, and make sure the cursor jumps to the END of the overflow line.  

If it all works, we've handled the overflow wrap!  Let's move on to vertical scrolling!

<br/><br/><br/><br/>



<h3 id="f-7">  ☑️ Step 7.  Editing <code>d_get_cursor_pos()</code> again.</h3>

The `d_get_cursor_pos` algorithm is used to position the cursor on the buffer.  
We need to edit it again to account for the scroll -- adding `position[0] -= _scroll;` will work.   

The resulting line position may be negative, OR above the window height.  
We'll check for those cases using an IF statement, and change `_scroll` if needed. 
This function returns an array, so once we change `_scroll`, we can return the new calculation with `return d_get_cursor_pos();`!

```javascript
function d_get_cursor_pos() {            /**  Returns a 2 index array, [int line, int char]           **/

    var cursor_position = [1,1];                    //  line, char coord of cursor
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
    } else if (cursor_position[0] > _window_h - 3) {
        _scroll++;
	return d_get_cursor_pos();
    } else {
    	return cursor_position;
    }
    
}
```

<br/><br/><br/><br/>



<h3 id="f-8">  ☑️ Step 8.  ☞ Test the code!  </h3>

Using the cursor, navigate to the end of the file.  The text should scroll down!  
Type to make sure the cursor stays in sync. 

Then, move back up to test scrolling up!

<br/><br/><br/><br/>





<h3 id="f-9">  ☑️ Step 9.  Edit <code>draw_status_bar</code>  </h3>

We can add a single line to `draw_status_bar` to output the current page scroll. 

```javascript
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

    status_bar_text += "   Scroll: " + _scroll;

    while (status_bar_text.length < _window_w) {               /**  Padding it with whitespace.       **/
        status_bar_text += " ";
    }

    process.stdout.write(status_bar_text);                     /**  Output the status bar string.     **/
    process.stdout.write("\x1b[0m");                           /**  No more reverse video.            **/
}
```



<h3 id="g-11">  ☑️ Step 10.  ❖  Part G review. </h3>

<br/><br/><br/><br/><br/><br/><br/><br/>



<h2 id="part-h" align="center">  Part H:   Undo & Redo </h2>

<br/><br/><br/><br/>



<h3 id="h-?">  ☑️ Step ?:  ❖  Part H review. </h3>

<br/><br/><br/><br/><br/><br/><br/><br/>













