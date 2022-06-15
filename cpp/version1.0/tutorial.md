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
