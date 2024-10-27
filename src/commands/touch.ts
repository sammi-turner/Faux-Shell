import { Command, CommandResult } from './types';
import { FileSystemService } from '../services/fileSystem';

export const touch: Command = {
  name: 'touch',
  description: 'Create an empty file',
  usage: 'touch <filename>',
  execute: (args: string[], fs: FileSystemService): CommandResult => {
    if (args.length === 0) {
      return {
        success: false,
        output: 'touch: missing file operand'
      };
    }

    try {
      fs.createFile(args[0]);
      return {
        success: true,
        output: ''
      };
    } catch (error) {
      return {
        success: false,
        output: `touch: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
};