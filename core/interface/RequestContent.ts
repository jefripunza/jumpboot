interface MoveOption {
  fileName?: string;
  backDate?: boolean;
  // convert?: number;
}

export interface RequestFilesContent {
  fieldName: string;
  originalFilename: string;
  path: string;
  headers: object;
  size: number;
  name: string;
  type: string;
  mv: (to: string, option?: MoveOption) => Promise<string>;
}

export interface RequestFiles {
  [key: string]: RequestFilesContent;
}
