import { Command, CommandResult } from './types';
import { FileSystemService } from '../services/fileSystem';

export const cat: Command = {
  name: 'cat',
  description: 'Display file contents',
  usage: 'cat <filename>',
  execute: (args: string[], fs: FileSystemService): CommandResult => {
    if (args.length === 0) {
      return {
        success: false,
        output: 'cat: missing operand'
      };
    }

    try {
      const currentDir = fs.getCurrentDirectory();
      const file = currentDir.children?.find(node => 
        node.name === args[0] && node.type === 'file'
      );

      if (!file) {
        return {
          success: false,
          output: `cat: ${args[0]}: No such file`
        };
      }

      return {
        success: true,
        output: file.content || ''
      };
    } catch (error) {
      return {
        success: false,
        output: `cat: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
};