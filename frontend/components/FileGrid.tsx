'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { IFileItem, IFolderItem } from '@/types/files';
import { getFileIcon } from '@/lib/fileUtils';
import {
  MoreVertical,
  Download,
  Share2,
  Trash2,
  Edit3,
  Copy,
  Folder,
  Star,
  Info
} from 'lucide-react';
import { formatFileSize, formatDate } from '@/lib/formatter';

interface FileGridProps {
  files: IFileItem[];
  folders: IFolderItem[];
  viewMode: 'grid' | 'list';
  selectedItems: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  onRenameItem: (itemId: string, newName: string) => void;
  onDeleteItems: (itemIds: string[]) => void;
}

export default function FileGrid({
  files,
  folders,
  viewMode,
  selectedItems,
  onSelectionChange,
  onRenameItem,
  onDeleteItems
}: FileGridProps) {
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [renameItemId, setRenameItemId] = useState('');
  const [renameName, setRenameName] = useState('');

  const handleItemClick = (itemId: string, event: React.MouseEvent) => {
    if (event.ctrlKey || event.metaKey) {
      // Multi-select
      const newSelection = selectedItems.includes(itemId)
        ? selectedItems.filter(id => id !== itemId)
        : [...selectedItems, itemId];
      onSelectionChange(newSelection);
    } else {
      // Single select
      onSelectionChange([itemId]);
    }
  };

  const handleRename = (itemId: string, currentName: string) => {
    setRenameItemId(itemId);
    setRenameName(currentName);
    setShowRenameDialog(true);
  };

  const handleRenameSubmit = () => {
    if (renameName.trim() && renameItemId) {
      onRenameItem(renameItemId, renameName.trim());
      toast.success('Item renamed successfully');
      setShowRenameDialog(false);
      setRenameItemId('');
      setRenameName('');
    }
  };

  const ItemContextMenu = ({ itemId, itemName, isFolder }: { itemId: string; itemName: string; isFolder: boolean }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {!isFolder && (
          <DropdownMenuItem>
            <Download className="w-4 h-4 mr-2" />
            Download
          </DropdownMenuItem>
        )}
        <DropdownMenuItem>
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Star className="w-4 h-4 mr-2" />
          Add to starred
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleRename(itemId, itemName)}>
          <Edit3 className="w-4 h-4 mr-2" />
          Rename
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Copy className="w-4 h-4 mr-2" />
          Make a copy
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Info className="w-4 h-4 mr-2" />
          Details
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onDeleteItems([itemId])}
          className="text-red-600"
          onSelect={() => toast.success('Item moved to trash')}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Move to trash
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  if (viewMode === 'list') {
    return (
      <>
        <div className="px-6 py-4">
          {/* Table header */}
          <div className="grid grid-cols-12 gap-4 px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
            <div className="col-span-6">Name</div>
            <div className="col-span-2">Owner</div>
            <div className="col-span-2">Last modified</div>
            <div className="col-span-1">Size</div>
            <div className="col-span-1"></div>
          </div>

          {/* Folders */}
          {folders.map((folder) => (
            <div
              key={folder.id}
              className={`
                grid grid-cols-12 gap-4 px-3 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors
                ${selectedItems.includes(folder.id) ? 'bg-blue-50 border-blue-200' : ''}
              `}
              onClick={(e) => handleItemClick(folder.id, e)}
            >
              <div className="col-span-6 flex items-center">
                <Folder className="w-5 h-5 text-blue-500 mr-3" />
                <span className="text-sm font-medium text-gray-900 truncate">
                  {folder.name}
                </span>
              </div>
              <div className="col-span-2 flex items-center">
                <span className="text-sm text-gray-600">me</span>
              </div>
              <div className="col-span-2 flex items-center">
                <span className="text-sm text-gray-600">
                  {formatDate(folder.createdAt)}
                </span>
              </div>
              <div className="col-span-1 flex items-center">
                <span className="text-sm text-gray-600">—</span>
              </div>
              <div className="col-span-1 flex items-center justify-end">
                <ItemContextMenu itemId={folder.id} itemName={folder.name} isFolder={true} />
              </div>
            </div>
          ))}

          {/* Files */}
          {files.map((file) => {
            const FileIcon = getFileIcon(file.type);
            return (
              <div
                key={file.id}
                className={`
                  grid grid-cols-12 gap-4 px-3 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors
                  ${selectedItems.includes(file.id) ? 'bg-blue-50 border-blue-200' : ''}
                `}
                onClick={(e) => handleItemClick(file.id, e)}
              >
                <div className="col-span-6 flex items-center">
                  <FileIcon className="w-5 h-5 text-gray-500 mr-3" />
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </span>
                </div>
                <div className="col-span-2 flex items-center">
                  <span className="text-sm text-gray-600">me</span>
                </div>
                <div className="col-span-2 flex items-center">
                  <span className="text-sm text-gray-600">
                    {formatDate(file.modifiedAt)}
                  </span>
                </div>
                <div className="col-span-1 flex items-center">
                  <span className="text-sm text-gray-600">
                    {formatFileSize(file.size)}
                  </span>
                </div>
                <div className="col-span-1 flex items-center justify-end">
                  <ItemContextMenu itemId={file.id} itemName={file.name} isFolder={false} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Rename dialog */}
        <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rename</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="renameName">Name</Label>
                <Input
                  id="renameName"
                  value={renameName}
                  onChange={(e) => setRenameName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowRenameDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleRenameSubmit}>
                  Rename
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <div className="p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {/* Folders */}
          {folders.map((folder) => (
            <Card
              key={folder.id}
              className={`
                p-4 cursor-pointer hover:shadow-md transition-all duration-200 group
                ${selectedItems.includes(folder.id) ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'}
              `}
              onClick={(e) => handleItemClick(folder.id, e)}
            >
              <div className="flex flex-col items-center text-center space-y-2">
                <Folder className="w-12 h-12 text-blue-500" />
                <div className="w-full">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {folder.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {folder.itemCount} items
                  </p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <ItemContextMenu itemId={folder.id} itemName={folder.name} isFolder={true} />
                </div>
              </div>
            </Card>
          ))}

          {/* Files */}
          {files.map((file) => {
            const FileIcon = getFileIcon(file.type);
            return (
              <Card
                key={file.id}
                className={`
                  p-4 cursor-pointer hover:shadow-md transition-all duration-200 group
                  ${selectedItems.includes(file.id) ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'}
                `}
                onClick={(e) => handleItemClick(file.id, e)}
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <FileIcon className="w-12 h-12 text-gray-500" />
                  <div className="w-full">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ItemContextMenu itemId={file.id} itemName={file.name} isFolder={false} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {folders.length === 0 && files.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Folder className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-lg font-medium text-gray-900 mb-2">No files or folders</p>
            <p className="text-gray-600">Upload files or create folders to get started</p>
          </div>
        )}
      </div>

      {/* Rename dialog */}
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="renameName">Name</Label>
              <Input
                id="renameName"
                value={renameName}
                onChange={(e) => setRenameName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowRenameDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleRenameSubmit}>
                Rename
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}