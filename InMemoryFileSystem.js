// Importing required modules
const fs = require('fs');
const readlineSync = require('readline-sync');
const Commands = require('./commandHandler');

// Class representing an in-memory file system
class InMemoryFileSystem {
  // Constructor initializing the file system and commands
  constructor() {
    this.currentDirectory = '/';
    this.fileSystem = {
      '/': {},
    };
    this.commands = new Commands(this);
  }

  // Method to start the in-memory file system
  run() {
    console.log('In-Memory FileSystem. Type "exit" to quit.');
    while (true) {
      const input = this.prompt(this.currentDirectory);
      if (input.trim().toLowerCase() === 'exit') {
        this.handleExit();
        break;
      }
      this.commands.executeCommand(input);
    }
  }

  // Method to handle the exit command
  handleExit() {
    const saveState = readlineSync.keyInYNStrict('Do you want to save the current state?');
    if (saveState) {
      const savePath = readlineSync.question('Enter the path to save the state: ');
      this.saveStateToFile(savePath);
    }
  }

  // Method to execute a command
  executeCommand(input) {
    this.commands.executeCommand(input);
  }

  // Method to prompt the user for input
  prompt(currentDirectory) {
    return readlineSync.question(`${currentDirectory}> `);
  }

  // Method to get the absolute path from a relative path
  getAbsolutePath(relativePath) {
    if (relativePath.startsWith('/')) {
      return relativePath;
    } else {
      return `${this.currentDirectory}/${relativePath}`;
    }
  }

  // Method to create a directory
  mkdir(directoryName) {
    const path = this.getAbsolutePath(directoryName);
    if (!this.fileSystem[path]) {
      this.fileSystem[path] = {};
      console.log(`Directory ${path} created.`);
    } else {
      console.log(`Directory ${path} already exists.`);
    }
  }

  // Method to change the current directory
  cd(path) {
    if (path === '..') {
      this.currentDirectory = this.currentDirectory === '/' ? '/' : this.currentDirectory.split('/').slice(0, -1).join('/');
    } else if (path === '/') {
      this.currentDirectory = '/';
    } else {
      const absolutePath = this.getAbsolutePath(path);
      if (this.fileSystem[absolutePath] && typeof this.fileSystem[absolutePath] === 'object') {
        this.currentDirectory = absolutePath;
      } else {
        console.log(`Directory ${path} not found.`);
      }
    }
  }

  // Method to list the contents of a directory
  ls(path) {
    const targetPath = path ? this.getAbsolutePath(path) : this.currentDirectory;

    if (this.fileSystem[targetPath] && typeof this.fileSystem[targetPath] === 'object') {
      const content = Object.keys(this.fileSystem);
      if (content.length > 0) {
        console.log(content);
      } else {
        console.log(`Directory ${targetPath} is empty.`);
      }
    } else {
      console.log(`Directory ${targetPath} not found.`);
    }
  }

  // Method to search for a pattern in a file
  grep(pattern, fileName) {
    const filePath = this.getAbsolutePath(fileName);
    if (this.fileSystem[filePath] && this.fileSystem[filePath].content) {
      const content = this.fileSystem[filePath].content;
      const lines = content.split('\n');
      const matchingLines = lines.filter(line => line.includes(pattern));
      console.log(matchingLines.join('\n'));
    } else {
      console.log(`File ${fileName} not found.`);
    }
  }

  // Method to display the content of a file
  cat(fileName) {
    const filePath = this.getAbsolutePath(fileName);

    if (this.fileSystem[filePath] && this.fileSystem[filePath].content !== undefined) {
      console.log(this.fileSystem[filePath].content);
    } else {
      console.log(`File ${fileName} not found.`);
    }
  }

  // Method to create or update a file with empty content
  touch(fileName) {
    const filePath = this.getAbsolutePath(fileName);
    const directoryPath = filePath.substring(0, filePath.lastIndexOf('/'));

    if (!this.fileSystem[directoryPath]) {
      console.log(`Directory ${directoryPath} not found.`);
      return;
    }

    if (!this.fileSystem[filePath]) {
      this.fileSystem[filePath] = { content: '' };
      console.log(`File ${fileName} created.`);
    } else {
      console.log(`File ${fileName} already exists.`);
    }
  }

  // Method to append content to a file
  echo(input) {
    const startIdx = input.indexOf("'") + 1;
    const endIdx = input.lastIndexOf("'");
    
    if (startIdx === -1 || endIdx === -1) {
      console.log('Invalid echo command syntax.');
      return;
    }

    const content = input.substring(startIdx, endIdx);
    const fileName = input.split('>')[1].trim();

    const filePath = this.getAbsolutePath(fileName);

    if (filePath === null) {
      console.log('Invalid file path.');
      return;
    }

    const directoryPath = filePath.substring(0, filePath.lastIndexOf('/'));

    if (!this.fileSystem[directoryPath]) {
      console.log(`Directory ${directoryPath} not found.`);
      return;
    }

    if (!this.fileSystem[filePath]) {
      this.fileSystem[filePath] = { content: '' };
      console.log(`File ${fileName} created.`);
    }

    this.fileSystem[filePath].content = content;
    console.log(`Text written to ${fileName}.`);
  }

  // Method to move a file or directory
  mv(source, destination) {
    const sourcePath = this.getAbsolutePath(source);
    const destinationPath = this.getAbsolutePath(destination);

    if (this.fileSystem[sourcePath] !== undefined) {
      this.fileSystem[destinationPath] = this.fileSystem[sourcePath];
      delete this.fileSystem[sourcePath];
      console.log(`Moved ${source} to ${destination}.`);
    } else {
      console.log(`Source ${source} not found.`);
    }
  }

  // Method to copy a file or directory
  cp(source, destination) {
    const sourcePath = this.getAbsolutePath(source);
    const destinationPath = this.getAbsolutePath(destination);

    if (this.fileSystem[sourcePath] !== undefined) {
      this.fileSystem[destinationPath] = JSON.parse(JSON.stringify(this.fileSystem[sourcePath]));
      console.log(`Copied ${source} to ${destination}.`);
    } else {
      console.log(`Source ${source} not found.`);
    }
  }

  // Method to remove a file or directory
  rm(path) {
    const targetPath = this.getAbsolutePath(path);

    if (this.fileSystem[targetPath] !== undefined) {
      delete this.fileSystem[targetPath];
      console.log(`Removed ${path}.`);
    } else {
      console.log(`${path} not found.`);
    }
  }

  // Method to save the current file system state to a file
  saveStateToFile(filePath) {
    const state = JSON.stringify({
      currentDirectory: this.currentDirectory,
      fileSystem: this.fileSystem,
    });

    fs.writeFileSync(filePath, state);
    console.log('File system state saved successfully.');
  } 
}

// Exporting the InMemoryFileSystem class
module.exports = InMemoryFileSystem;
