export interface IFileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  createdAt: Date;
  modifiedAt: Date;
  starred?: boolean;
  shared?: boolean;
}

export interface IFolderItem {
  id: string;
  name: string;
  createdAt: Date;
  itemCount: number;
  starred?: boolean;
  shared?: boolean;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
}

export interface LoginData{
    email:string,
    password:string
}