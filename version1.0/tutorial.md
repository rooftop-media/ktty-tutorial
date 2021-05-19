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
| [Part C - The Cursor & Feedback Bar](https://github.com/rooftop-media/ktty-tutorial/blob/main/version1.0/tutorial.md#part-c) | Map arrow keys, display feedback when they're pressed. | In progress. |
| [Part D - File Editing](https://github.com/rooftop-media/ktty-tutorial/blob/main/version1.0/tutorial.md#part-d) | Add and delete text from the text buffer accurately. | Todo |
| [Part E - Save, Quit, & Prompt](https://github.com/rooftop-media/ktty-tutorial/blob/main/version1.0/tutorial.md#part-e) | Save on ctrl-s, add a "save modified?" prompt. | Todo |
| [Part F - Scroll & Resize](https://github.com/rooftop-media/ktty-tutorial/blob/main/version1.0/tutorial.md#part-f) | Handle text overflow, scroll, & resize. | Todo |
| [Part G - Undo & Redo](https://github.com/rooftop-media/ktty-tutorial/blob/main/version1.0/tutorial.md#part-g) | Adds history tracking, for undo & redo. | Todo |
| [Version 2.0.](https://github.com/rooftop-media/ktty-tutorial/blob/main/version1.0/tutorial.md#part-g) | With v1.0 complete, you can move to v2.0. | Todo |

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
    // b_get_window_size();

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
			console.clear();
			process.exit();
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



<h3 id="a-10"> ☑️ Step 10. ☞  Test the code!  </h3>

Running this code should open the file on the screen, let you move the cursor, and type.
If it throws an error, check for typos & missing code.

```shell
$ ktty sample.txt
```

If you didn't install the `ktty` command globally, you can run `node ./ktty.js sample.txt` instead.

When you're done testing, `ctrl-c` should quit the program.
<br/><br/><br/><br/>



<h3 id="a-11"> ☑️ Step 11. ❖ Part A review. </h3>

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

It's time to edit `boot()`, to uncomment the `b_get_window_size()` function call.

```javascript
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
```

<br/><br/><br/><br/>



<h3 id="b-3"> ☑️ Step 3. b_get_window_size() </h3>

We'll get the window height and width with this algorithm.
*We’ll need the window height to accurately position the status bar. *

```javascript
////  SECTION 6:  Algorithms.

function a_load_file_to_buffer() { ... }   //  Algorithm A's code is here.

//  Get the window size. 
function b_get_window_size() {
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

    var cursor_position = c_get_cursor_pos();                  /**  Using our algorithm a_get_cursor_pos!   **/
    status_bar_text += "  cursor on line " + cursor_position[0];
    status_bar_text += ", row " + cursor_position[1];

    while (status_bar_text.length < _window_w) {               /**  Padding it with whitespace.       **/
        status_bar_text += " ";
    }

    process.stdout.write(status_bar_text);                     /**  Output the status bar string.     **/
    process.stdout.write("\x1b[0m");                           /**  No more reverse video.            **/
}
```

Notice that we used an algorithm `c_get_cursor_pos()`.  We'll define that next!
<br/><br/><br/><br/>



<h3 id="b-6"> ☑️ Step 6. c_get_cursor_pos() </h3>

In that last function, we called the algorithm `c_get_cursor_pos()` . 

The cursor is stored as a single integer, in the global variable _cursor_buffer_pos.
This variable is relative to the characters in _buffer’s string.

But that variable doesn’t take into account line breaks, 
& we want to display the line number & x coordinate.

```javascript
////  SECTION 6:  Algorithms. 

function a_load_file_to_buffer() { ... }
function b_get_window_size() { ... }

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
    var cursor_position = c_get_cursor_pos(); //  c_get_cursor_pos is an algorithm.
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



<h3 id="c-2"> ☑️ Step 2.  Outline the event map. </h3>

Events are described in a Javascript object, mapping event names to functions. 
For now, we'll leave a lot of the event function calls commented out.


```javascript
////  SECTION 4:  EVENTS 

//  Map keyboard events.
function map_events() { ... }

//  These functions fire in response to "events" like keyboard input. 
var _events      = {

    "LEFT":   function() {
        b_move_cursor_left();
    },
    "RIGHT":  function() {
        c_move_cursor_right();
    },

    "UP":     function() {
        d_move_cursor_up();
    },
    "DOWN":   function() {
        e_move_cursor_down();
    },

    "TEXT":   function(key) {
	 // f_add_to_buffer(key);
    },
    "ENTER":  function() {
        // f_add_to_buffer("\n");
    },
    "BACKSPACE": function() {
        // g_delete_from_buffer();
    },

    "SAVE": function() {
        // i_save_buffer_to_file();
    },

    "QUIT": function() {
        // j_quit();
	console.clear();
        process.exit();
    },

}
```
<br/><br/><br/><br/>



<h3 id="c-3"> ☑️ Step 3.  Edit map_events() </h3>

We’ll also add to the `map_events()` function (which is called in boot(). )

Before, we were logging every keypress straight to stdout, indiscriminately. 
Now, we’ll capture the arrow key inputs & call functions to move only within the buffer.
*Notice that the functions we’re calling correspond to our event map/dictionary!*

```javascript
////  SECTION 4:  EVENTS 

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
```
<br/><br/><br/><br/>



<h3 id="c-4"> ☑️ Step 4.  d_move_cursor_left() </h3>

This is an algorithm we’ll use to move the cursor left on the buffer.

```javascript
function d_move_cursor_left() {

    _cursor_buffer_pos -= 1;
    if ( _cursor_buffer_pos < 0 ) {      /**   Don't let the cursor position be negative.         **/
        _cursor_buffer_pos++;
    } else {
        _feedback_bar = "Moved left.";
    }

}
```
<br/><br/><br/><br/>



<h3 id="c-5"> ☑️ Step 5.  e_move_cursor_right() </h3>

And we’ll need an algorithm to move right, too. 

```javascript
function e_move_cursor_right() {

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



<h3 id="c-6"> ☑️ Step 6.  ☞  Test the code! </h3>

Before we get to the UP/DOWN arrows, run the code to make sure you can navigate left & right.

When pressing RIGHT, the cursor should go to the end of the first line, then jump to the next,
and stop at the end of the file.

When pressing LEFT, the cursor should go to the beginning of the current line, then jump back,
and stop at the beginning of the file. 

<br/><br/><br/><br/>



<h3 id="c-7"> ☑️ Step 7.  f_move_cursor_up() </h3>

Moving the cursor up will be a bit more difficult.

```javascript
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
```
<br/><br/><br/><br/>



<h3 id="c-8"> ☑️ Step 8.  g_move_cursor_down() </h3>

Now let’s write an algorithm to move down a line. 

```javascript
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
```
<br/><br/><br/><br/>



<h3 id="c-9"> ☑️ Step 9.  ☞  Test the code! </h3>

The UP and DOWN arrow key events should now work! 
<br/><br/><br/><br/>



<h3 id="c-10"> ☑️ Step 10.  Edit draw() </h3>

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



<h3 id="c-11"> ☑️ Step 11.  draw_feedback_bar() </h3>

This function will draw the feedback bar every time the screen is refreshed.
Basically, it displays info for the event that caused the last draw() call.

```javascript
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



<h3 id="c-12"> ☑️ Step 12.  ☞  Test the code! </h3>

Running the code now should draw the feedback bar every time we move the cursor. 
<br/><br/><br/><br/>



<h3 id="c-13"> ☑️ Step 13.  ❖  Part C review. </h3>

Our file is up to 331 lines! 

<br/><br/><br/><br/><br/><br/><br/><br/>



<h2 id="part-d" align="center">  Part D:  File Editing </h2>










