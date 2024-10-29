import { Command, CommandResult } from './types';
import { FileSystemService } from '../services/fileSystem';

export const echo: Command = {
  name: 'echo',
  description: 'Display a line of text or write to file',
  usage: 'echo <text> [> filename or >> filename]',
  execute: (args: string[], fs: FileSystemService): CommandResult => {
    if (args.length === 0) {
      return {
        success: true,
        output: ''
      };
    }

    try {
      // Check if output is being redirected to a file
      const appendIndex = args.indexOf('>>');
      const overwriteIndex = args.indexOf('>');
      
      // If no redirection, just echo the text
      if (appendIndex === -1 && overwriteIndex === -1) {
        return {
          success: true,
          output: args.join(' ')
        };
      }

      // Determine if we're appending or overwriting
      const isAppending = appendIndex !== -1;
      const redirectIndex = isAppending ? appendIndex : overwriteIndex;
      
      // Get the text and filename
      const text = args.slice(0, redirectIndex).join(' ');
      const filename = args[redirectIndex + 1];

      if (!filename) {
        return {
          success: false,
          output: `echo: no filename specified after ${isAppending ? '>>' : '>'}`
        };
      }

      if (isAppending) {
        fs.appendToFile(filename, text);
      } else {
        fs.writeFile(filename, text);
      }

      return {
        success: true,
        output: ''
      };
    } catch (error) {
      return {
        success: false,
        output: `echo: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
};