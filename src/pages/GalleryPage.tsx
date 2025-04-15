
import React from 'react';
import ArtGallery from '@/components/ArtGallery';

const GalleryPage: React.FC = () => {
  return (
    <div className="w-full py-8">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Art Gallery</h1>
          <p className="max-w-[700px] text-muted-foreground">
            Discover and vote for your favorite artworks on the Algorand blockchain
          </p>
        </div>
        
        <ArtGallery />
      </div>
    </div>
  );
};

export default GalleryPage;
