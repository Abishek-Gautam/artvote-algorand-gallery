
import React from 'react';
import SubmitArtForm from '@/components/SubmitArtForm';

const SubmitPage: React.FC = () => {
  return (
    <div className="w-full py-8">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Submit Artwork</h1>
          <p className="max-w-[700px] text-muted-foreground">
            Share your digital art with the community and participate in our decentralized voting system
          </p>
        </div>
        
        <SubmitArtForm />
      </div>
    </div>
  );
};

export default SubmitPage;
