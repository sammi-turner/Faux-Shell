import { Command, CommandResult } from './types';
import { FileSystemService } from '../services/fileSystem';

export const rm: Command = {
  name: 'rm',
  description: 'Remove files or directories',
  usage: 'rm [-r] file1 [file2 ...]',
  execute: (args: string[], fs: FileSystemService): CommandResult => {
    if (args.length === 0) {
      return {
        success: false,
        output: 'rm: missing operand'
      };
    }

    try {
      let recursive = false;
      let fileArgs = args;

      // Check for -r flag
      if (args[0] === '-r') {
        recursive = true;
        fileArgs = args.slice(1);
      }

      if (fileArgs.length === 0) {
        return {
          success: false,
          output: 'rm: missing operand'
        };
      }

      const errors: string[] = [];
      // Process each file argument
      fileArgs.forEach(filename => {
        try {
          fs.removeNode(filename, recursive);
        } catch (error) {
          errors.push(`rm: cannot remove '${filename}': ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      });

      return {
        success: errors.length === 0,
        output: errors.join('\n')
      };
    } catch (error) {
      return {
        success: false,
        output: `rm: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
};