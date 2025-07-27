export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  createdAt: Date;
  modifiedAt: Date;
  starred?: boolean;
  shared?: boolean;
}

export interface FolderItem {
  id: string;
  name: string;
  createdAt: Date;
  itemCount: number;
  starred?: boolean;
  shared?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
}