import { Command, CommandResult } from './types';
import { FileSystemService } from '../services/fileSystem';

export const mv: Command = {
  name: 'mv',
  description: 'Move (rename) files',
  usage: 'mv <source> <destination>',
  execute: (args: string[], fs: FileSystemService): CommandResult => {
    if (args.length !== 2) {
      return {
        success: false,
        output: 'mv: missing operand'
      };
    }

    try {
      const [source, dest] = args;
      fs.renameNode(source, dest);
      return {
        success: true,
        output: ''
      };
    } catch (error) {
      return {
        success: false,
        output: `mv: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
};