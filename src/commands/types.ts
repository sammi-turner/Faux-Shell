import { FileSystemService } from "../services/fileSystem";

export interface CommandResult {
    success: boolean;
    output: string;
  }
  
  export interface Command {
    name: string;
    description: string;
    usage: string;
    execute: (args: string[], fs: FileSystemService) => CommandResult;
  }