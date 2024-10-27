import { Command, CommandResult } from './types';
import { FileSystemService } from '../services/fileSystem';

export const mkdir: Command = {
  name: 'mkdir',
  description: 'Create a new directory',
  usage: 'mkdir <directory_name>',
  execute: (args: string[], fs: FileSystemService): CommandResult => {
    if (args.length === 0) {
      return {
        success: false,
        output: 'mkdir: missing operand'
      };
    }

    try {
      fs.createDirectory(args[0]);
      return {
        success: true,
        output: ''
      };
    } catch (error) {
      return {
        success: false,
        output: `mkdir: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
};