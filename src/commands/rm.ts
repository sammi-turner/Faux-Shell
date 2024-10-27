import { Command, CommandResult } from './types';
import { FileSystemService } from '../services/fileSystem';

export const rm: Command = {
  name: 'rm',
  description: 'Remove files or directories',
  usage: 'rm [-r] <file/directory>',
  execute: (args: string[], fs: FileSystemService): CommandResult => {
    if (args.length === 0) {
      return {
        success: false,
        output: 'rm: missing operand'
      };
    }

    try {
      const firstArg = args[0];
      let recursive = false;
      let target: string;

      if (firstArg === '-r' || firstArg === '-rf') {
        if (args.length < 2) {
          return {
            success: false,
            output: 'rm: missing operand after \'-r\''
          };
        }
        recursive = true;
        target = args[1];
      } else {
        target = firstArg;
      }

      fs.removeNode(target, recursive);
      return {
        success: true,
        output: ''
      };
    } catch (error) {
      return {
        success: false,
        output: `rm: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
};