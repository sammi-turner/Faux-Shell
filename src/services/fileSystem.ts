import { FileSystemNode } from '../types';

const FS_KEY = 'terminal_fs';

export class FileSystemService {
  private fs: FileSystemNode;
  private currentPath: string[] = [];
  private readonly HOME_DIR = 'home';

  constructor() {
    const savedFs = localStorage.getItem(FS_KEY);
    if (savedFs) {
      this.fs = JSON.parse(savedFs);
      // Ensure home directory exists when loading from localStorage
      if (!this.fs.children?.some(node => node.name === this.HOME_DIR)) {
        this.fs.children = this.fs.children || [];
        this.fs.children.push({
          name: this.HOME_DIR,
          type: 'directory',
          children: [],
          createdAt: Date.now(),
          modifiedAt: Date.now()
        });
        this.saveFS();
      }
    } else {
      this.fs = this.createInitialFileSystem();
      this.saveFS();
    }
    // Start in home directory by default
    this.currentPath = [this.HOME_DIR];
  }

  private createInitialFileSystem(): FileSystemNode {
    return {
      name: 'root',
      type: 'directory',
      children: [
        {
          name: this.HOME_DIR,
          type: 'directory',
          children: [],
          createdAt: Date.now(),
          modifiedAt: Date.now()
        }
      ],
      createdAt: Date.now(),
      modifiedAt: Date.now()
    };
  }

  protected saveFS(): void {
    localStorage.setItem(FS_KEY, JSON.stringify(this.fs));
  }

  public getCurrentDirectory(): FileSystemNode {
    let current = this.fs;
    for (const dir of this.currentPath) {
      const next = current.children?.find(node => node.name === dir && node.type === 'directory');
      if (!next) {
        throw new Error(`Directory not found: ${dir}`);
      }
      current = next;
      if (!current.children) {
        current.children = [];
      }
    }
    return current;
  }

  private resolvePath(path: string): string[] {
    // Special case for going up one directory
    if (path === '..') {
      if (this.currentPath.length === 0) return []; // At root already
      const newPath = [...this.currentPath];
      newPath.pop();
      return newPath;
    }

    // Handle tilde notation
    if (path.startsWith('~')) {
      path = path.replace('~', `/${this.HOME_DIR}`);
    }

    if (path === '/') return [];
    if (path === '~') return [this.HOME_DIR];
    if (path === '.') return [...this.currentPath];

    // Handle absolute paths
    if (path.startsWith('/')) {
      return path.split('/').filter(p => p);
    }

    // Handle relative paths
    const parts = path.split('/').filter(p => p);
    const resolvedPath = [...this.currentPath];

    for (const part of parts) {
      if (part === '..') {
        if (resolvedPath.length > 0) {
          resolvedPath.pop();
        }
      } else if (part !== '.') {
        resolvedPath.push(part);
      }
    }

    return resolvedPath;
  }

  public getCurrentPath(): string {
    if (this.currentPath.length === 0) return '/';
    if (this.currentPath[0] === this.HOME_DIR && this.currentPath.length === 1) return '~';
    if (this.currentPath[0] === this.HOME_DIR) {
      return '~/' + this.currentPath.slice(1).join('/');
    }
    return '/' + this.currentPath.join('/');
  }

  public changeDirectory(path: string): void {
    try {
      const resolvedPath = this.resolvePath(path);
      
      // Special case for root directory
      if (resolvedPath.length === 0) {
        this.currentPath = [];
        return;
      }

      // Verify the path exists before changing
      let current = this.fs;
      for (const dir of resolvedPath) {
        const next = current.children?.find(node => node.name === dir && node.type === 'directory');
        if (!next) throw new Error(`No such directory: ${path}`);
        current = next;
      }
      
      this.currentPath = resolvedPath;
    } catch (error) {
      throw new Error(`cd: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public createDirectory(name: string): void {
    const current = this.getCurrentDirectory();
    
    if (current.children?.some(node => node.name === name)) {
      throw new Error(`Directory already exists: ${name}`);
    }

    const newDir: FileSystemNode = {
      name,
      type: 'directory',
      children: [],
      createdAt: Date.now(),
      modifiedAt: Date.now()
    };

    current.children?.push(newDir);
    this.saveFS();
  }

  public createFile(name: string, content: string = ''): void {
    const current = this.getCurrentDirectory();
    
    if (current.children?.some(node => node.name === name)) {
      throw new Error(`File already exists: ${name}`);
    }

    const newFile: FileSystemNode = {
      name,
      type: 'file',
      content,
      createdAt: Date.now(),
      modifiedAt: Date.now()
    };

    current.children?.push(newFile);
    this.saveFS();
  }

  public removeNode(name: string, recursive: boolean = false): void {
    const current = this.getCurrentDirectory();
    const nodeIndex = current.children?.findIndex(node => node.name === name);

    if (nodeIndex === undefined || nodeIndex === -1) {
      throw new Error(`No such file or directory: ${name}`);
    }

    const node = current.children![nodeIndex];
    
    if (node.type === 'directory' && node.children?.length && !recursive) {
      throw new Error(`Directory not empty: ${name}`);
    }

    current.children?.splice(nodeIndex, 1);
    this.saveFS();
  }
}