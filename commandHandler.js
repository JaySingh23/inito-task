// commandHandler.js
class Commands {
  constructor(fileSystem) {
    this.fileSystem = fileSystem;
  }

  executeCommand(input) {
    const [command, ...args] = input.split(' ');
    return this.execute(command.toLowerCase(), ...args);
  }

  execute(command, ...args) {
    switch (command) {
      case 'mkdir':
        return this.fileSystem.mkdir(args[0]);
      case 'cd':
        return this.fileSystem.cd(args[0]);
      case 'ls':
        return this.fileSystem.ls(args[0]);
      case 'grep':
        return this.fileSystem.grep(args[0], args[1]);
      case 'cat':
        return this.fileSystem.cat(args[0]);
      case 'touch':
        return this.fileSystem.touch(args[0]);
      case 'echo':
        return this.fileSystem.echo(args.join(' '));
      case 'mv':
        return this.fileSystem.mv(args[0], args[1]);
      case 'cp':
        return this.fileSystem.cp(args[0], args[1]);
      case 'rm':
        return this.fileSystem.rm(args[0]);
      default:
        return 'Unknown command';
    }
  }
}

module.exports = Commands;

