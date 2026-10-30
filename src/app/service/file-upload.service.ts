import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'environments/environment';

/** Record returned by the external file server after upload */
export interface UploadedFile {
  name?: string;
  filename?: string;
  path: string;        // public url for display/download
  delete_path: string; // relative path used for deleteFile
  size: number;
  mimetype?: string;
}

/**
 * Shape persisted in DB for every file reference
 * (request/result `files`, `result.file`, analysisForm images, equipment, electrical masters):
 *   { filename: "VHX-5000.jpg", path: "https://file_serve.../VHX-5000.jpg", delete_path: "/AN-General/.../VHX-5000.jpg" }
 */
export interface StoredFile {
  filename: string;
  path: string;
  delete_path: string;
  size?: string | number;
  _id?: string;
}

/** @deprecated use StoredFile */
export type ReportFile = StoredFile;

/** Anything deleteFile() can resolve: stored record, raw url/path string, or explicit path_file */
export type DeletableFile = StoredFile | string | { path_file: string };

export const FILE_FOLDER = {
  requester: `${environment.namespace}/Requester/`,
  engFiles: `${environment.namespace}/ENG/Files/`,
  engReport: `${environment.namespace}/ENG/Report/`,
} as const;

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private readonly urlUpload: string = environment.fileServer;
  private readonly urlDelete: string = environment.fileServerDelete;

  constructor(private http: HttpClient) { }

  // ---------------------------------------------------------------- upload

  /**
   * Raw upload. formData must contain:
   *  - path: sub-folder on server (e.g. FILE_FOLDER.engFiles)
   *  - file: one or more File entries
   */
  upload(formData: FormData): Observable<UploadedFile[]> {
    return this.http.post<UploadedFile | UploadedFile[]>(this.urlUpload, formData).pipe(
      map((res) => (Array.isArray(res) ? res : [res]))
    );
  }

  /** Upload one file into `folder`, optionally renamed. Resolves to the single uploaded record. */
  uploadOne(folder: string, file: File, fileName?: string): Promise<UploadedFile> {
    const formData = new FormData();
    formData.append('path', folder);
    formData.append('file', file, fileName ?? file.name);
    return this.upload(formData).toPromise().then((list) => list[0]);
  }

  /** Upload many files into `folder` sequentially (keeps server-side ordering predictable). */
  async uploadMany(folder: string, files: File[], rename?: (file: File, index: number) => string): Promise<UploadedFile[]> {
    const result: UploadedFile[] = [];
    for (let i = 0; i < files.length; i++) {
      const name = rename ? rename(files[i], i) : files[i].name;
      result.push(await this.uploadOne(folder, files[i], name));
    }
    return result;
  }

  uploadRequesterFile(file: File, fileName?: string) {
    return this.uploadOne(FILE_FOLDER.requester, file, fileName);
  }

  uploadEngFile(file: File, fileName?: string) {
    return this.uploadOne(FILE_FOLDER.engFiles, file, fileName);
  }

  uploadEngReport(file: File, fileName?: string) {
    return this.uploadOne(FILE_FOLDER.engReport, file, fileName);
  }

  /** Build the record persisted in DB from an upload result (see StoredFile). */
  toStoredFile(uploaded: UploadedFile, file?: File, name?: string): StoredFile {
    const size = file?.size ?? uploaded.size;
    return {
      filename: name ?? uploaded.filename ?? uploaded.name ?? file?.name ?? this.getFileName(uploaded.path),
      path: uploaded.path,
      delete_path: uploaded.delete_path || this.deletePathFromUrl(uploaded.path),
      ...(size != null ? { size } : {}),
    };
  }

  /** Same shape as toStoredFile, used for `result.file` (the single engineer report). */
  toReportFile(uploaded: UploadedFile, file?: File): StoredFile {
    return this.toStoredFile(uploaded, file);
  }

  /** "https://file_serve.../analysis-report/ENG/A.png" → "/analysis-report/ENG/A.png" */
  deletePathFromUrl(url: string): string {
    return '/' + this.pathFromUrl(url);
  }

  // ---------------------------------------------------------------- delete

  /** Delete by resolving `path_file` from any supported input (new/legacy record, url, or explicit path_file). */
  deleteFile(input: DeletableFile): Observable<any> {
    return this.http.post(this.urlDelete, { path_file: this.resolveDeletePath(input) });
  }

  /** Delete many; failures are collected instead of aborting the batch. */
  async deleteFiles(inputs: DeletableFile[]): Promise<{ ok: DeletableFile[]; failed: { file: DeletableFile; error: any }[] }> {
    const ok: DeletableFile[] = [];
    const failed: { file: DeletableFile; error: any }[] = [];
    for (const input of inputs) {
      try {
        await this.deleteFile(input).toPromise();
        ok.push(input);
      } catch (error) {
        failed.push({ file: input, error });
      }
    }
    return { ok, failed };
  }

  /**
   * Resolve the server-relative path used by the delete API.
   *  - new record   → delete_path as-is
   *  - explicit     → path_file as-is
   *  - legacy/url   → pathname of `path` with origin + query string stripped, then
   *                   prefixed with the namespace (legacy storage was copied under it)
   *                   e.g. "http://host:4501/ENG/Files/A.pdf?123" → "analysis-report/ENG/Files/A.pdf"
   */
  resolveDeletePath(input: DeletableFile): string {
    if (typeof input === 'string') {
      return this.withNamespace(this.pathFromUrl(input));
    }
    if ('path_file' in input && input.path_file) {
      return input.path_file;
    }
    if ('delete_path' in input && input.delete_path) {
      return input.delete_path;
    }
    if ('path' in input && input.path) {
      return this.withNamespace(this.pathFromUrl(input.path));
    }
    throw new Error('Cannot resolve delete path from file record');
  }

  /** Display name of a stored file/url (replaces the brittle `split('/')[5]` pattern). */
  getFileName(input: StoredFile | string | null | undefined): string {
    if (!input) return '';
    if (typeof input !== 'string' && input.filename) return input.filename;
    const url = typeof input === 'string' ? input : input.path;
    const last = this.pathFromUrl(url).split('/').pop() ?? '';
    return decodeURIComponent(last);
  }

  private pathFromUrl(url: string): string {
    let path = url.trim();
    try {
      path = new URL(url).pathname;
    } catch {
      // relative path or bare filename — fall through and normalize manually
    }
    return decodeURIComponent(path.split('?')[0].split('#')[0]).replace(/^\/+/, '');
  }

  private withNamespace(relPath: string): string {
    const prefix = `${environment.namespace}/`;
    return relPath.startsWith(prefix) ? relPath : prefix + relPath;
  }
}
