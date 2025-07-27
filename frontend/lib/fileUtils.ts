import { FileText, Image, Video, Music, Archive, Code, File as DefaultFileIcon, FileSpreadsheet, FileImage, FileVideo, FileAudio, FileCode, FileArchive } from 'lucide-react';

export function getFileIcon(mimeType: string) {
  if (mimeType.startsWith('image/')) {
    return FileImage;
  } else if (mimeType.startsWith('video/')) {
    return FileVideo;
  } else if (mimeType.startsWith('audio/')) {
    return FileAudio;
  } else if (mimeType === 'application/pdf') {
    return DefaultFileIcon;
  } else if (
    mimeType.includes('spreadsheet') ||
    mimeType.includes('excel') ||
    mimeType === 'text/csv'
  ) {
    return FileSpreadsheet;
  } else if (
    mimeType.includes('document') ||
    mimeType.includes('word') ||
    mimeType === 'text/plain'
  ) {
    return FileText;
  } else if (
    mimeType.includes('code') ||
    mimeType === 'application/json' ||
    mimeType === 'text/javascript' ||
    mimeType === 'text/html' ||
    mimeType === 'text/css'
  ) {
    return FileCode;
  } else if (
    mimeType.includes('zip') ||
    mimeType.includes('archive') ||
    mimeType.includes('compressed')
  ) {
    return FileArchive;
  } else {
    return DefaultFileIcon;
  }
}

export function getFileCategory(mimeType: string): string {
  if (mimeType.startsWith('image/')) return 'Images';
  if (mimeType.startsWith('video/')) return 'Videos';
  if (mimeType.startsWith('audio/')) return 'Audio';
  if (mimeType === 'application/pdf') return 'PDFs';
  if (mimeType.includes('document') || mimeType.includes('word')) return 'Documents';
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'Spreadsheets';
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'Presentations';
  return 'Other';
}