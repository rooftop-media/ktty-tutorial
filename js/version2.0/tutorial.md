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
    }
}
function MenuBar_draw() {
    if (Keyboard.focus_item !== this) {
        process.stdout.write("\x1b[2m");                           /**  Dim text.                         **/
    }
    process.stdout.write("\x1b[7m");                               /**  Reverse video.                    **/

    process.stdout.write("\x1b[1;0H");                             /**  Moving to the top row.         **/
    var menuBarText = " ktty   ";
    var menuOpts = Object.keys(MenuBar.options);
    for (var i = 0; i < menuOpts.length; i++) {
        menuBarText += menuOpts[i] + "   ";
    }
    process.stdout.write(menuBarText)
    for (var i = menuBarText.length; i < Window.width; i++) {
        process.stdout.write(" ");
    }

    process.stdout.write("\x1b[0m");                               /**  Back to undim text.               **/
}
function MenuBar_focus() {

}
function MenuBar_get_cursor_coords() {

}
function MenuBar_move_cursor_left() {

}
function MenuBar_move_cursor_right() {

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



<br/><br/><br/><br/>



<h3 id="a-?"> ☑️ Step ?. ❖ Part A review. </h3>

The complete code for Part A is available [here](https://github.com/rooftop-media/ktty-tutorial/blob/main/version2.0/part_A.js).

<br/><br/><br/><br/><br/><br/><br/><br/>




<h2 id="part-b" align="center">  Part B:    </h2>

<br/><br/><br/><br/>



<h3 id="b-?">  ☑️ Step ?:  ❖  Part B review. </h3>

<br/><br/><br/><br/><br/><br/><br/><br/>













