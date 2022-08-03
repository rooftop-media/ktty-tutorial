#  NodeJS kTTY tutorial set up

If you want to build kTTY using nodeJS, start here.

This code follows a NodeJS [style guide](https://github.com/felixge/node-style-guide) created by Felix Geisendörfer.

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


☑️ **Step 3**: Create & edit ktty.js with a code editor of choice.

With some code editor, like [emacs](https://www.gnu.org/software/emacs/) or [Visual Studio Code](https://code.visualstudio.com/), create a new file in your /ktty/ called `ktty.js`.
We'll add two lines to our file:

```js
#!/usr/bin/env node
console.log(“Starting ktty!”);
```

The first line will be used when we install this file as a global binary, in the next step.
*It’s telling our computer to interpret this as a Node file, and where to find Node’s source code.*

The second line will log a message to the terminal console.
*This is just to let us know that the script runs successfully – we’ll remove this line later.*

<br/><br/><br/><br/>



☑️ **Step 4**: ☞ Test the code!

Back in our text terminal, we can test run our `ktty.js` file with NodeJS like so:

```shell
$ node ./ktty.js   #  If you’re in the right folder, this should run it!
Starting ktty!
```

If you get an error on this step, make sure have [NodeJS](https://nodejs.org/en/) installed.  
Also, make sure you're in the /ktty/ folder.


<br/><br/><br/><br/>



☑️ **Step 5**: Init an npm package.

In this step, use [npm init](https://docs.npmjs.com/cli/v7/commands/npm-init) to create a `package.json` file in your /ktty/ directory.

```shell
$ npm init		# This will start a series of prompts, ending in a new file, package.json
```

Running npm init will start a series of prompts.  Fill it out appropriately, or just mash enter to use the defaults.

In the end, you should have a new file called `package.json` in your folder.  

```shell
$ ls		# List our new file to make sure it’s there :)
package.json 	ktty.js
```

<br/><br/><br/><br/>



☑️ **Step 6**: Install `ktty` as a global PATH command.

npm's package system comes with a system for installing new global commands.  Read about it [here](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#bin).

Open up `package.json`, and add the following:

```javascript
{
  "bin": {
    "ktty": "./ktty.js"
  }
}
```

This step isn't *strictly* required, for the tutorial, as you can run the ktty file with Node.  

<br/><br/><br/><br/>




☑️ **Step 7**: The rest of the tutorials.

From here, you're ready to start coding [version 1.0](https://github.com/rooftop-media/ktty-tutorial/blob/main/js/version1.0/tutorial.md)!
