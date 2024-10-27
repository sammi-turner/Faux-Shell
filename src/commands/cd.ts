import { Command, CommandResult } from './types';
import { FileSystemService } from '../services/fileSystem';

export const cd: Command = {
  name: 'cd',
  description: 'Change directory',
  usage: 'cd <directory>',
  execute: (args: string[], fs: FileSystemService): CommandResult => {
    const path = args[0] || '/';
    
    try {
      fs.changeDirectory(path);
      return {
        success: true,
        output: ''
      };
    } catch (error) {
      return {
        success: false,
        output: `cd: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
};