import { Command, CommandResult } from './types';
import { FileSystemService } from '../services/fileSystem';

export const pwd: Command = {
  name: 'pwd',
  description: 'Print working directory',
  usage: 'pwd',
  execute: (_args: string[], fs: FileSystemService): CommandResult => {
    try {
      return {
        success: true,
        output: fs.getCurrentPath()
      };
    } catch (error) {
      return {
        success: false,
        output: `pwd: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
};