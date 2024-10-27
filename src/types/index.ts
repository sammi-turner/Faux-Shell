export interface FileSystem {
    name: string;
    type: 'file' | 'directory';
    content?: string;
    children?: FileSystemNode[];
    createdAt: number;
    modifiedAt: number;
  }
  
  export type FileSystemNode = FileSystem;
  
  export interface Command {
    name: string;
    description: string;
    execute: (args: string[]) => string;
  }
  
  export interface TerminalHistory {
    command: string;
    output: string;
    timestamp: number;
  }