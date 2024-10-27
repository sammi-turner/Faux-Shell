import { Command, CommandResult } from './types';
import { commandRegistry } from './registry';

export const help: Command = {
  name: 'help',
  description: 'Display help information',
  usage: 'help [command]',
  execute: (args: string[]): CommandResult => {
    if (args.length === 0) {
      const commands = commandRegistry.getAllCommands();
      const output = commands
        .map(cmd => `${cmd.name.padEnd(12)} ${cmd.description}`)
        .join('\n');
      
      return {
        success: true,
        output: 'Available commands:\n\n' + output
      };
    }

    const command = commandRegistry.getCommand(args[0]);
    if (!command) {
      return {
        success: false,
        output: `No help topics match '${args[0]}'`
      };
    }

    return {
      success: true,
      output: `
Name: ${command.name}
Description: ${command.description}
Usage: ${command.usage}`
    };
  }
};