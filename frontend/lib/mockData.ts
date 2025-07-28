import { IFileItem, IFolderItem } from '@/types/files';

export const mockFiles: IFileItem[] = [
  {
    id: '1',
    name: 'Project Proposal.pdf',
    size: 2547892,
    type: 'application/pdf',
    createdAt: new Date('2024-01-15'),
    modifiedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Budget Spreadsheet.xlsx',
    size: 45678,
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    createdAt: new Date('2024-01-14'),
    modifiedAt: new Date('2024-01-16'),
  },
  {
    id: '3',
    name: 'Team Photo.jpg',
    size: 1234567,
    type: 'image/jpeg',
    createdAt: new Date('2024-01-13'),
    modifiedAt: new Date('2024-01-13'),
  },
  {
    id: '4',
    name: 'Meeting Notes.docx',
    size: 98765,
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    createdAt: new Date('2024-01-12'),
    modifiedAt: new Date('2024-01-17'),
  },
  {
    id: '5',
    name: 'Presentation.pptx',
    size: 5432109,
    type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    createdAt: new Date('2024-01-11'),
    modifiedAt: new Date('2024-01-18'),
  },
  {
    id: '6',
    name: 'Data Analysis.csv',
    size: 876543,
    type: 'text/csv',
    createdAt: new Date('2024-01-10'),
    modifiedAt: new Date('2024-01-10'),
  },
];

export const mockFolders: IFolderItem[] = [
  {
    id: 'f1',
    name: 'Work Documents',
    createdAt: new Date('2024-01-01'),
    itemCount: 15,
  },
  {
    id: 'f2',
    name: 'Personal Files',
    createdAt: new Date('2024-01-02'),
    itemCount: 8,
  },
  {
    id: 'f3',
    name: 'Photos',
    createdAt: new Date('2024-01-03'),
    itemCount: 47,
  },
  {
    id: 'f4',
    name: 'Archive',
    createdAt: new Date('2024-01-04'),
    itemCount: 23,
  },
];