import { Command, CommandResult } from './types';

export const clear: Command = {
  name: 'clear',
  description: 'Clear the terminal screen',
  usage: 'clear',
  execute: (): CommandResult => {
    return {
      success: true,
      output: 'CLEAR_TERMINAL' // We'll use this special string as a signal
    };
  }
};