
import React from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Wallet, PlusCircle, Vote, Home, ImageIcon } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const Navbar: React.FC = () => {
  const { isConnected, address, connectWallet, disconnectWallet } = useWallet();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  
  const formatAddress = (address: string) => {
    return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
  };

  const navItems = [
    { name: 'Home', path: '/', icon: <Home className="h-5 w-5" /> },
    { name: 'Gallery', path: '/gallery', icon: <ImageIcon className="h-5 w-5" /> },
    { name: 'Submit Art', path: '/submit', icon: <PlusCircle className="h-5 w-5" /> },
  ];

  const activeClass = "text-artvote-blue font-medium";
  const inactiveClass = "text-artvote-text/80 hover:text-artvote-blue";

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-gray-200 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <Vote className="h-6 w-6 text-artvote-blue" />
          <span className="font-semibold text-xl">ArtVote</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link 
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-1 ${location.pathname === item.path ? activeClass : inactiveClass}`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
        
        {/* Wallet Connection */}
        <div className="hidden md:flex items-center space-x-4">
          {isConnected ? (
            <div className="flex items-center space-x-2">
              <span className="bg-artvote-green/10 text-artvote-green px-3 py-1 rounded-full text-sm font-medium flex items-center">
                <span className="w-2 h-2 bg-artvote-green rounded-full mr-2"></span>
                {address && formatAddress(address)}
              </span>
              <Button 
                variant="outline"
                size="sm"
                onClick={disconnectWallet}
                className="border-artvote-blue text-artvote-blue hover:bg-artvote-blue/5"
              >
                Disconnect Wallet
              </Button>
            </div>
          ) : (
            <Button 
              onClick={connectWallet} 
              className="bg-artvote-blue hover:bg-artvote-blue/90 text-white flex items-center"
            >
              <Wallet className="h-4 w-4 mr-2" />
              Connect Pera Wallet
            </Button>
          )}
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center space-x-2">
          {isConnected && (
            <span className="bg-artvote-green/10 text-artvote-green px-2 py-1 rounded-full text-xs font-medium">
              {address && formatAddress(address)}
            </span>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>
                  <div className="flex items-center space-x-2">
                    <Vote className="h-5 w-5 text-artvote-blue" />
                    <span>ArtVote</span>
                  </div>
                </SheetTitle>
                <SheetDescription>
                  Decentralized art voting platform
                </SheetDescription>
              </SheetHeader>
              <div className="py-8 flex flex-col space-y-4">
                {navItems.map((item) => (
                  <Link 
                    key={item.name}
                    to={item.path}
                    className={`flex items-center space-x-3 p-2 rounded-md ${location.pathname === item.path ? "bg-artvote-blue/10 text-artvote-blue font-medium" : ""}`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ))}
                
                <div className="pt-4 border-t">
                  {isConnected ? (
                    <Button 
                      onClick={disconnectWallet} 
                      variant="outline" 
                      className="w-full border-artvote-blue text-artvote-blue"
                    >
                      <Wallet className="h-4 w-4 mr-2" />
                      Disconnect Wallet
                    </Button>
                  ) : (
                    <Button 
                      onClick={connectWallet} 
                      className="w-full bg-artvote-blue hover:bg-artvote-blue/90 text-white"
                    >
                      <Wallet className="h-4 w-4 mr-2" />
                      Connect Pera Wallet
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
