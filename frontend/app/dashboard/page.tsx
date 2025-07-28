'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/Dashboard';
import FileGrid from '@/components/FileGrid';
import FileHeader from '@/components/FileHeader';
import { mockFiles,mockFolders } from '@/lib/mockData';
import { IFileItem, IFolderItem } from '@/types/files';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

export default function DashboardPage() {
  const router = useRouter();
  const [files, setFiles] = useState<IFileItem[]>(mockFiles);
  const [folders, setFolders] = useState<IFolderItem[]>(mockFolders);
  const [currentPath, setCurrentPath] = useState<string[]>(['My Drive']);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const user = useSelector((state:RootState)=>state.auth.user)

  useEffect(() => {
    if (!user) {
      router.replace('/login'); 
      return;
    }
  }, [router]);

  const handleCreateFolder = (name: string) => {
    const newFolder: IFolderItem = {
      id: Date.now().toString(),
      name,
      createdAt: new Date(),
      itemCount: 0
    };
    setFolders(prev => [...prev, newFolder]);
  };

  const handleUploadFiles = (uploadedFiles: File[]) => {
    const newFiles: IFileItem[] = uploadedFiles.map(file => ({
      id: Date.now().toString() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      createdAt: new Date(),
      modifiedAt: new Date()
    }));
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleDeleteItems = (itemIds: string[]) => {
    setFiles(prev => prev.filter(file => !itemIds.includes(file.id)));
    setFolders(prev => prev.filter(folder => !itemIds.includes(folder.id)));
    setSelectedItems([]);
  };

  const handleRenameItem = (itemId: string, newName: string) => {
    setFiles(prev => prev.map(file => 
      file.id === itemId ? { ...file, name: newName } : file
    ));
    setFolders(prev => prev.map(folder => 
      folder.id === itemId ? { ...folder, name: newName } : folder
    ));
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFolders = folders.filter(folder =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout user={user}>
      <div className="flex-1 flex flex-col min-h-0">
        <FileHeader
          currentPath={currentPath}
          viewMode={viewMode}
          searchQuery={searchQuery}
          selectedItems={selectedItems}
          onViewModeChange={setViewMode}
          onSearchChange={setSearchQuery}
          onCreateFolder={handleCreateFolder}
          onUploadFiles={handleUploadFiles}
          onDeleteItems={handleDeleteItems}
        />
        
        <div className="flex-1 overflow-auto">
          <FileGrid
            files={filteredFiles}
            folders={filteredFolders}
            viewMode={viewMode}
            selectedItems={selectedItems}
            onSelectionChange={setSelectedItems}
            onRenameItem={handleRenameItem}
            onDeleteItems={handleDeleteItems}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}