import file from 'fs';
import { FileNotExistError } from '../errors/fileNotExistError';

export interface IFileManager {
  fileExists(path: string): boolean;
  readFile(path: string): any;
  createFile(path: string, content: string): void;
  appendFile(path: string, content: string): void;
  deleteFile(path: string): void;
} 

class FileManager implements IFileManager {
  private readonly encoding: BufferEncoding = 'utf8'

  private getPath(path: string): string {
    const pathArray = path.split('/');
    const lastPath = pathArray[pathArray.length - 1];
    return lastPath;
  }

  fileExists(path: string): boolean {
    return file.existsSync(path);
  }

  readFile(path: string) : any {
    if (!this.fileExists(path))
      file.readFile(path, { encoding: this.encoding }, (err, data) => {
        if (err)
          throw new Error(err.message);
        return data;
      })
    else
      throw new FileNotExistError(this.getPath(path));
  }

  createFile(path: string, content: string)  {
    if (!this.fileExists(path))
      file.writeFile(path, content, { encoding: this.encoding }, (err) => {
        if (err) throw new Error(err.message);
        console.log('📰 File written successfully')
      });
    else
      this.appendFile(path, content);
  }

  appendFile(path: string, content: string) {
    if (this.fileExists(path))
      file.appendFile(path, content, { encoding: this.encoding }, (err) => {
        if (err)
          throw new Error(err.message);
        console.log('📰 File appended successfully');
      });
    else
      throw new FileNotExistError(this.getPath(path));
  }

  deleteFile(path: string) {
    if (this.fileExists(path))
      file.unlink(path, (err) => {
        if (err)
          throw new Error(err.message);
        console.log('📰 File deleted successfully');
      })
    else
      throw new FileNotExistError(this.getPath(path));
  }

}

export default new FileManager();