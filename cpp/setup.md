#  C++ kTTY tutorial set up

If you want to build kTTY using C++, start here.

<br/><br/><br/><br/>



##  Initial Steps

☑️ **Step 1**: Find a text terminal app.   

Ktty is a program for text terminal.  You can write it in any text terminal emulator that supports NodeJS. For Mac, I recommend Terminal.app.  For Windows, I recommend Powershell.exe.  

Open your text terminal app.

<br/><br/><br/><br/>


☑️ **Step 2**: Set up a directory.  

With your text terminal app open, create a new folder, and navigate into it. 

```shell
$ mkdir ktty    # Make the ktty folder.
$ cd ktty       # Go into the ktty folder.
```

We can check that we’re in our new directory 
by running the print working directory command. 

```shell
$ pwd           # Print Working Directory – expected output below.
/user/ktty/     
```


<br/><br/><br/><br/>


☑️ **Step 3**: Create & edit ktty.cpp with a code editor of choice.

With some code editor, like [emacs](https://www.gnu.org/software/emacs/) or [Visual Studio Code](https://code.visualstudio.com/), create a new file in your /ktty/ called `ktty.cpp`.
We'll add two lines to our file:

```js
#include <iostream>
cout << “Starting ktty!”;
```

The first line imports the standard "input/output stream" tools for C++.

The second line will log a message to the terminal console.
*This is just to let us know that the script runs successfully – we’ll remove this line later.*

<br/><br/><br/><br/>



☑️ **Step 4**: Install a C++ compiler

To run your C++ code, you'll need to install a C++ compiler. 

If you're using Mac OS or Linux, you probably already have a C++ compiler installed. 
Two C++ compiler commands are `clang` or `g++`.  

If your terminal has either of those commands, you're all set. 

If you're using a Windows machine, your command line app will be Powershell, 
which unfortunately does not have a C++ compiler. 

For windows users, I recommend [installing Ubuntu for Windows](https://ubuntu.com/tutorials/install-ubuntu-on-wsl2-on-windows-10#3-download-ubuntu). 

With the Ubuntu terminal, run `sudo apt install clang` to install a c++ compiler. 


<br/><br/><br/><br/>



☑️ **Step 5**: ☞ Compile and test!



<br/><br/><br/><br/>



☑️ **Step 6**: Install `ktty` as a global PATH command.


This step isn't *strictly* required, for the tutorial, as you can run the ktty file with Clang.  

<br/><br/><br/><br/>




☑️ **Step 7**: The rest of the tutorials.

From here, you're ready to start coding [version 1.0](https://github.com/rooftop-media/ktty-tutorial/blob/main/cpp/version1.0/tutorial.md)!
