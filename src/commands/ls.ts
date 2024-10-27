import { Command, CommandResult } from './types';
import { FileSystemService } from '../services/fileSystem';

export const ls: Command = {
  name: 'ls',
  description: 'List directory contents',
  usage: 'ls [directory]',
  execute: (_args: string[], fs: FileSystemService): CommandResult => {
    try {
      const contents = fs.getCurrentDirectory().children
        ?.map(node => `${node.name}${node.type === 'directory' ? '/' : ''}`)
        .join('\n');
      
      return {
        success: true,
        output: contents || 'Directory is empty'
      };
    } catch (error) {
      return {
        success: false,
        output: `ls: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
};