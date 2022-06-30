# C++ Tutorial for Ktty, version 1.0

<br/><br/><br/><br/><br/><br/><br/><br/>



##  Prerequisites

This tutorial requires that you've completed the [initial set up steps](https://github.com/rooftop-media/ktty-tutorial/blob/main/cpp/setup.md).

<br/><br/><br/><br/><br/><br/><br/><br/>



##  Table of Contents

Click a part title to jump down to it, in this file.

| Tutorial Parts              | Status | # of Steps |
| --------------------------- | ------ | ---------- |
| [Part A - Drawing the Buffer](https://github.com/rooftop-media/ktty-tutorial/blob/main/cpp/version1.0/tutorial.md#part-a) | To do. | 12 |
| [Part B - Drawing the Status Bar](https://github.com/rooftop-media/ktty-tutorial/blob/main/cpp/version1.0/tutorial.md#part-b) | To do. | 11 |
| [Part C - Cursor & Feedback Bar](https://github.com/rooftop-media/ktty-tutorial/blob/main/cpp/version1.0/tutorial.md#part-c) | To do.  | 14 |
| [Part D - File Editing](https://github.com/rooftop-media/ktty-tutorial/blob/main/cpp/version1.0/tutorial.md#part-d) | To do. | 10 |
| [Part E - Object Oriented Refactor](https://github.com/rooftop-media/ktty-tutorial/blob/main/cpp/version1.0/tutorial.md#part-e) | To do. | 11 |
| [Part F - Feedback Mode](https://github.com/rooftop-media/ktty-tutorial/blob/main/cpp/version1.0/tutorial.md#part-f) | To do. | 13 |
| [Part G - Scroll & Resize](https://github.com/rooftop-media/ktty-tutorial/blob/main/cpp/version1.0/tutorial.md#part-g) | To do. | 17 |
| [Part H - Undo & Redo](https://github.com/rooftop-media/ktty-tutorial/blob/main/cpp/version1.0/tutorial.md#part-h) | To do. | 9 |
| [Version 2.0.](https://github.com/rooftop-media/ktty-tutorial/blob/main/cpp/version1.0/tutorial.md#v2) | Todo | ? |

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

```cpp
////  SECTION 1:  Imports.

////  SECTION 2:  App memory & function declarations.

////  SECTION 3:  Boot stuff.

////  SECTION 4:  Events.

////  SECTION 5:  Draw functions.

////  SECTION 6:  Algorithms.
```

We’ll reference these 6 sections throughout the rest of this version.

<br/><br/><br/><br/>



<h3 id="a-3"> ☑️ Step 3. Imports </h3>

We’ll import three standard libraries from c++.  That’s all for the imports, for this version. 
We'll also include the "std" namespace, which stands for "standard". 

```cpp
////  SECTION 1:  Imports.

#include <iostream>   //  For output to terminal
#include <cstring>    //  For using the "string" datatype
#include <fstream>    //  For reading from files
#include <curses.h>   //  For detecting keypress, on a Unix machine
using namespace std;
```

The final library we're including, `curses.h`, is not a standard library. 
We'll need to install it using this command, which I got from [here](https://stackoverflow.com/questions/8792317/where-is-the-conio-h-header-file-on-linux-why-cant-i-find-conio-h):

```bash
sudo apt-get install libncurses5-dev libncursesw5-dev
```

<br/><br/><br/><br/>



<h3 id="a-4">☑️ Step 4. App data </h3>

We’ll declare our variables in section 2. For now, we'll make two variables: (Note that I name global variables starting with an underscore, like \_buffer. )

We’ll save the text contents to a string called \_buffer. The buffer can be modified without modifying the file it’s pulled from.
(That’s why it’s called the buffer – it’s buffered, aka separate, from the final saved file!)

We’ll also record another string of text, the \_filename being edited.

```cpp
////  SECTION 2:  App memory & function declarations

//  Setting up app memory.
string _buffer            = "";      //  The text being edited. 
string _filename          = "";      //  Filename - including extension. 
```

<br/><br/><br/><br/>



<h3 id="a-5">☑️ Step 5. Outline boot()</h3>

Now, in section 3 of the code, we’ll outline the boot function.

Ultimately, we'll have four function calls in boot():

 - Loading in a file’s content, by filename.
 - Then, get the window height & width.
 - Then, start capturing keyboard events.
 - Finally, draw the screen for the first time.

We'll leave get_window_size() commented out for now, and use it in Part B.

```cpp
////  SECTION 3:  Boot stuff.

int main() {
  
  /**  Load a file to the buffer.       **/
  a_load_file_to_buffer();

  /**  Load window height & width.      **/
  // c_get_window_size();

  /**  Map the event listeners.         **/
  map_events();

  /**  Update the screen.               **/
  draw();
    
  return 0;
} 
```

<br/><br/><br/><br/>



<h3 id="a-6">☑️ Step 6. a_load_file_to_buffer()</h3>

This is an algorithm we called in the boot() function.
We’ll implement it in section 6, with the algorithms.


```cpp
////  SECTION 6:  Algorithms.

//  Getting the file's contents, put it in the "buffer".
void a_load_file_to_buffer(string filename_to_load) {
    _filename = filename_to_load; 
    if ( _filename == "" ) {
        _buffer = "";
    } else {
        ofstream fileToRead;
        fileToRead.open (_filename);
        if (fileToRead.is_open()) {
            while ( getline (fileToRead, line) ) {
                _buffer += line;
                _buffer += "\n";
            }
            fileToRead.close();
        } else {
            _buffer = "Unable to open a file at '" + _filename;
        }
    }
}
```

<br/><br/><br/><br/>



<h3 id="a-7">☑️ Step 7. Outline draw()</h3>

Now, in the code’s 5th section, we’ll outline the draw() function. This function will ultimately call 4 different other functions to draw the screen.

For now, just call the first function draw_buffer(). Comment the rest.

```cpp
////  SECTION 5:  DRAW FUNCTIONS

//  The draw function -- called after any data change.
void draw() {
    draw_buffer();
    // draw_status_bar();
    // draw_feedback_bar();
    // position_cursor();
}
```

<br/><br/><br/><br/>



<h3 id="a-8">☑️ Step 8. draw_buffer()</h3>

Now let’s implement draw_buffer(), which we'll put right below our draw() function.

```cpp
////  SECTION 5:  DRAW FUNCTIONS 

function draw() {  ...  }

//  Drawing the buffer.
void draw_buffer() {
    cout << "\x1B[2J\x1B[H";  //  Clear the screen
    cout << _buffer;
}
```

<br/><br/><br/><br/>



<h3 id="a-9">☑️ Step 9. map_events()</h3>

Back in the Events section of the code, add this to the end of the main function:

```cpp
////  SECTION 4:  EVENTS

//  Map keyboard input.
int map_events() {

    //  Set up ncurses
    initscr();
    cbreak();

	//  Map keyboard input 
    char key_press;
    int ascii_value;
    while (1) {
        key_press = getch();
        ascii_value = key_press;
        if (ascii_value == 27) // For ESC
            break;
    }

    endwin();
    return 0;

}
```

We’ll need to modify the keys so the behaviour is linked to the buffer. For now, we’ll be able to move the cursor anywhere on the page.

Later, we'll need to modify the keys so the behaviour is linked to the buffer. For now, we’ll be able to move the cursor anywhere on the page.

<br/><br/><br/><br/>



<h3 id="a-10">☑️ Step 10. b_quit()</h3>

The quit function is important -- without it, we'll have a hard time quitting ktty. 
For now, we'll keep the quitting process simple -- clear the screen, then exit. We’ll implement it in section 6:

```cpp
////  SECTION 6:  Algorithms.

function a_load_file_to_buffer() {  ...  }

function b_quit() {
    console.clear();
    process.exit();
}
```

<br/><br/><br/><br/>



<h3 id="a-11">☑️ Step 11. ☞ Test the code!</h3>

Running this code should open the file on the screen, let you move the cursor, and type. If it throws an error, check for typos & missing code.

```bash
$ ktty sample.txt
```

If you didn't install the ktty command globally, you can run node ./ktty.js sample.txt instead.

When you're done testing, ctrl-c should quit the program. 

<br/><br/><br/><br/>



<h3 id="a-12">☑️ Step 12. ❖ Part A review.</h3>

The complete code for Part A is available [here]().

<br/><br/><br/><br/>







