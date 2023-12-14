# In-Memory FileSystem


### Overview

This system doesn't have the functionality of loading the state after it has been saved. It can only save it in a json file. When you exit the file system it asks whether you want to save it or not. 

## Features

- **mkdir:** Create directories
- **cd:** Change current directory
- **ls:** List contents of the directory
- **grep:** Search for a pattern in a file. ex - ```grep 'hello' file.txt```
- **cat:** Display the contents of a file
- **touch:** Create or update a file
- **echo:** Write text to a file. ex - ```echo 'hello world' > file.txt```
- **mv:** Move or rename a file or directory. ex - ```mv dir1/file.txt .```
- **cp:** Copy a file or directory. ex - ```cp dir1/file.txt .```
- **rm:** Remove a file or directory
- **Save State:** Save the current state of the file system. Save it in ```./saved_state.json``` when it asks for where you want to save it.

## Design Improvements

- **Modular Structure:** The code is organized into separate modules to enhance maintainability and readability.
- **Command Handling:** Implemented a command handler to manage and execute various commands.
- **Error Handling:** There are error messages for better user feedback.

## How to Run

### Prerequisites

- Node.js installed
- npm (Node Package Manager) installed

### Installation

Clone the repository and change the directory:

```bash
git clone https://github.com/JaySingh23/inito-task.git
cd inito-task

```
To run the script:
```bash
npm test
```
After this you can run all the different commands.
