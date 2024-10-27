import { FileSystemNode } from '../types';

const FS_KEY = 'terminal_fs';

export class FileSystemService {
  private fs: FileSystemNode;

  constructor() {
    const savedFs = localStorage.getItem(FS_KEY);
    if (savedFs) {
      this.fs = JSON.parse(savedFs);
    } else {
      this.fs = this.createInitialFileSystem();
      this.saveFS();
    }
  }

  private createInitialFileSystem(): FileSystemNode {
    return {
      name: 'root',
      type: 'directory',
      children: [],
      createdAt: Date.now(),
      modifiedAt: Date.now()
    };
  }

  private saveFS(): void {
    localStorage.setItem(FS_KEY, JSON.stringify(this.fs));
  }

  public getCurrentDirectory(): FileSystemNode {
    return this.fs;
  }

  public createFile(name: string, content: string = ''): void {
    const newFile: FileSystemNode = {
      name,
      type: 'file',
      content,
      createdAt: Date.now(),
      modifiedAt: Date.now()
    };

    this.fs.children?.push(newFile);
    this.saveFS();
  }

  public createDirectory(name: string): void {
    const newDir: FileSystemNode = {
      name,
      type: 'directory',
      children: [],
      createdAt: Date.now(),
      modifiedAt: Date.now()
    };

    this.fs.children?.push(newDir);
    this.saveFS();
  }
}