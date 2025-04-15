
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Vote, Wallet, ImageIcon, Award } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { useArt } from '@/contexts/ArtContext';
import ArtCard from '@/components/ArtCard';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isConnected, connectWallet } = useWallet();
  const { artworks, voteForArtwork } = useArt();
  
  // Get top 3 artworks by votes
  const topArtworks = [...artworks].sort((a, b) => b.votes - a.votes).slice(0, 3);
  
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-40">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="bg-artvote-blue/10 p-3 rounded-full inline-block">
              <Vote className="h-10 w-10 text-artvote-blue" />
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">Decentralized Art Voting Platform</h1>
            <p className="max-w-[700px] text-lg text-muted-foreground md:text-xl">
              Submit, discover, and vote on digital art using the Algorand blockchain
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button 
                onClick={() => navigate('/gallery')} 
                className="bg-artvote-blue text-white"
              >
                Explore Gallery
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              {!isConnected && (
                <Button 
                  onClick={connectWallet} 
                  variant="outline" 
                  className="border-artvote-blue text-artvote-blue"
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  Connect Wallet
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="w-full py-12 md:py-24 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter">How It Works</h2>
            <p className="max-w-[700px] text-muted-foreground">
              ArtVote uses blockchain technology to ensure transparent and secure voting
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-artvote-blue/10 p-4 rounded-full mb-4">
                <Wallet className="h-6 w-6 text-artvote-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect Wallet</h3>
              <p className="text-muted-foreground">
                Link your Algorand wallet to get started with our platform
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-artvote-green/10 p-4 rounded-full mb-4">
                <ImageIcon className="h-6 w-6 text-artvote-green" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Submit Art</h3>
              <p className="text-muted-foreground">
                Upload your digital artwork to be featured in our gallery
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-artvote-red/10 p-4 rounded-full mb-4">
                <Award className="h-6 w-6 text-artvote-red" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Vote & Win</h3>
              <p className="text-muted-foreground">
                Vote for your favorite pieces and earn recognition for your art
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Artworks */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter">Top Artworks</h2>
            <p className="max-w-[700px] text-muted-foreground">
              Discover the most popular artworks voted by the community
            </p>
          </div>
          
          {topArtworks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topArtworks.map(artwork => (
                <ArtCard 
                  key={artwork.id} 
                  artwork={artwork} 
                  onVote={voteForArtwork} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading featured artworks...</p>
            </div>
          )}
          
          <div className="flex justify-center mt-10">
            <Button 
              onClick={() => navigate('/gallery')} 
              variant="outline" 
              className="border-artvote-blue text-artvote-blue"
            >
              View All Artworks
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 bg-artvote-blue">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter text-white">Ready to share your art?</h2>
            <p className="max-w-[700px] text-blue-100 md:text-xl">
              Join our community of artists and collectors on the Algorand blockchain
            </p>
            <Button 
              onClick={() => navigate('/submit')} 
              variant="secondary" 
              className="mt-4 bg-white text-artvote-blue hover:bg-white/90"
            >
              Submit Your Artwork
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
