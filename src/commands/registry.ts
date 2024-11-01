import { Command } from './types';
import { ls } from './ls';
import { clear } from './clear';
import { pwd } from './pwd';
import { cd } from './cd';
import { mkdir } from './mkdir';
import { help } from './help';
import { touch } from './touch';
import { rm } from './rm';
import { cat } from './cat';
import { echo } from './echo';
import { mv } from './mv';

class CommandRegistry {
  private commands: Map<string, Command>;

  constructor() {
    this.commands = new Map();
    this.registerDefaultCommands();
  }

  private registerDefaultCommands(): void {
    [ls, clear, pwd, cd, mkdir, help, touch, rm, cat, echo, mv].forEach(command => {
      this.registerCommand(command);
    });
  }

  public registerCommand(command: Command): void {
    this.commands.set(command.name, command);
  }

  public getCommand(name: string): Command | undefined {
    return this.commands.get(name);
  }

  public getAllCommands(): Command[] {
    return Array.from(this.commands.values());
  }

  public hasCommand(name: string): boolean {
    return this.commands.has(name);
  }
}

export const commandRegistry = new CommandRegistry();