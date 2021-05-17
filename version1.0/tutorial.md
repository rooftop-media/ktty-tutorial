# Tutorial for Ktty, version 1.0

<br/><br/><br/><br/><br/><br/><br/><br/>



##  Prerequisites

This tutorial requires that you've completed the [initial set up steps](https://github.com/rooftop-media/ktty-tutorial/blob/main/readme.md#initial-steps).

<br/><br/><br/><br/><br/><br/><br/><br/>



##  Part A:  Drawing the Buffer

The steps in this part will culminate in us displaying the text file on the screen, along with controls to move and type.  

Along the way, we’ll break the code into 6 code sections with comments, and add code to 5 of 6 sections.  



<br/><br/><br/><br/>

###  ☑️ Step 1:  Add a sample file

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




###  ☑️ Step 2. 		Outlining ktty.js

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



###  ☑️ Step 3. 		Imports

We’ll import two standard libraries from NodeJS.  That’s all for the imports, for this version. 


```javascript
////  SECTION 1:  Imports.

//  Importing NodeJS libraries.
var process      = require("process");
var fs           = require("fs");
```

<br/><br/><br/><br/>




###  ☑️ Step 4. 		App data

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




###  ☑️ Step 5. 		Outline boot()

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



###  ☑️ Step 6. 		a_load_file_to_buffer()

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



###  ☑️ Step 7. 		Outline draw()


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




###  ☑️ Step 8. 		draw_buffer()

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




###  ☑️ Step 9. 		map_events()

Back in the Events section of the code, add this to the end of the main function:

```javascript
////  SECTION 3:  EVENTS

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



###  ☑️ Step 10. 		☞  Test the code!  

Running this code should open the file on the screen, let you move the cursor, and type.
If it throws an error, check for typos & missing code.

```shell
$ ktty sample.txt
```

If you didn't install the `ktty` command globally, you can run `node ./ktty.js sample.txt` instead.

When you're done testing, `ctrl-c` should quit the program.
<br/><br/><br/><br/>



###  ☑️ Step 11. 		❖ Part A review.

The finished code for this section is available here...


















