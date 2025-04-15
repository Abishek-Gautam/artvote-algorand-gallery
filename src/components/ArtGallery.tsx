
import React, { useState } from 'react';
import { useArt } from '@/contexts/ArtContext';
import ArtCard from './ArtCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';

const ArtGallery: React.FC = () => {
  const { artworks, loading, voteForArtwork } = useArt();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'votes'>('newest');
  
  // Filter artworks based on search term
  const filteredArtworks = artworks.filter(art => 
    art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    art.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
    art.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Sort artworks based on sort option
  const sortedArtworks = [...filteredArtworks].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      return b.votes - a.votes;
    }
  });
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Toggle sort option
  const toggleSortOption = () => {
    setSortBy(sortBy === 'newest' ? 'votes' : 'newest');
  };

  return (
    <div className="w-full">
      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search artworks or artists..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={toggleSortOption}
          className="flex items-center gap-2"
        >
          <ArrowUpDown className="h-4 w-4" />
          Sort by: {sortBy === 'newest' ? 'Newest' : 'Most Votes'}
        </Button>
      </div>
      
      {/* Gallery grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="aspect-[3/2] w-full rounded-md" />
              <Skeleton className="h-8 w-4/5" />
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-14 w-full" />
              <div className="flex justify-between">
                <Skeleton className="h-8 w-1/4" />
                <Skeleton className="h-8 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : sortedArtworks.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg text-muted-foreground">No artworks found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedArtworks.map(artwork => (
            <ArtCard 
              key={artwork.id} 
              artwork={artwork} 
              onVote={voteForArtwork} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ArtGallery;
