
import React from 'react';
import { Link } from 'react-router-dom';
import { Vote, Github, Twitter, ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
            <div className="flex items-center space-x-2">
              <Vote className="h-5 w-5 text-artvote-blue" />
              <span className="font-semibold text-lg">ArtVote</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Decentralized Art Voting Platform
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
            <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              <Link to="/" className="text-sm text-muted-foreground hover:text-artvote-blue">
                Home
              </Link>
              <Link to="/gallery" className="text-sm text-muted-foreground hover:text-artvote-blue">
                Gallery
              </Link>
              <Link to="/submit" className="text-sm text-muted-foreground hover:text-artvote-blue">
                Submit Art
              </Link>
              <a 
                href="https://github.com/VJLIVE/Voting-DApp" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-artvote-blue flex items-center"
              >
                GitHub <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </nav>
            
            <div className="flex items-center space-x-4">
              <a 
                href="https://github.com/VJLIVE/Voting-DApp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-artvote-blue"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="#"
                className="text-muted-foreground hover:text-artvote-blue"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-200 pt-4">
          <p className="text-xs text-center text-muted-foreground">
            &copy; {new Date().getFullYear()} ArtVote. Built with the Algorand blockchain. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
