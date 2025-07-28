'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import {
  Upload,
  Home,
  Users,
  Star,
  Trash2,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Cloud,
  Clock,
  Share2
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '@/redux/userSlice';
import storage from 'redux-persist/lib/storage';
import { persistor } from '@/redux/store';
import { logoutUser } from '@/lib/api/auth';



interface DashboardLayoutProps {
  children: React.ReactNode;
  user: any;
}

export default function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch()

  const handleLogout = async() => {
    dispatch(logout());
    await persistor.flush(); //ensure persisted state is updated
    storage.removeItem('persist:auth');//clear persisted redux state
    await logoutUser()
    router.push('/login');
  };

  const sidebarItems = [
    { icon: Home, label: 'My Drive', active: true },
    { icon: Users, label: 'Shared with me', active: false },
    { icon: Clock, label: 'Recent', active: false },
    { icon: Star, label: 'Starred', active: false },
    { icon: Trash2, label: 'Trash', active: false },
  ];

  const storageUsed = 45; // GB
  const storageTotal = 100; // GB
  const storagePercentage = (storageUsed / storageTotal) * 100;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        transition-transform duration-200 ease-in-out flex flex-col
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Upload className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">CloudDrive</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* New button */}
        <div className="p-4">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            <Upload className="w-4 h-4 mr-2" />
            New
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              className={`
                w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                ${item.active 
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Storage indicator */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center mb-2">
            <Cloud className="w-4 h-4 text-gray-500 mr-2" />
            <span className="text-sm text-gray-600">Storage</span>
          </div>
          <Progress value={storagePercentage} className="mb-2" />
          <p className="text-xs text-gray-500">
            {storageUsed} GB of {storageTotal} GB used
          </p>
          <Button variant="outline" size="sm" className="w-full mt-2">
            Buy storage
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden mr-2"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">My Drive</h1>
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm">
              <HelpCircle className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="w-5 h-5" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" alt={user.name} />
                    <AvatarFallback className="bg-blue-600 text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.name}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Help
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        {children}
      </div>
    </div>
  );
}