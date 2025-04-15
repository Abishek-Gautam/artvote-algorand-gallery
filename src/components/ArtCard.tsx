
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ThumbsUp, Eye, Calendar } from 'lucide-react';
import { ArtPiece } from '@/contexts/ArtContext';
import { useWallet } from '@/contexts/WalletContext';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

interface ArtCardProps {
  artwork: ArtPiece;
  onVote: (id: string) => Promise<void>;
}

const ArtCard: React.FC<ArtCardProps> = ({ artwork, onVote }) => {
  const { isConnected, address } = useWallet();
  
  // Check if current user has voted
  const hasVoted = address && artwork.hasVoted.includes(address);
  
  // Format the date
  const formattedDate = format(new Date(artwork.createdAt), 'MMM d, yyyy');
  
  // Format the artist address
  const shortenedAddress = `${artwork.artistAddress.slice(0, 4)}...${artwork.artistAddress.slice(-4)}`;

  return (
    <Card className="overflow-hidden card-hover">
      <div className="aspect-[3/2] overflow-hidden bg-gray-100">
        <img 
          src={artwork.imageUrl} 
          alt={artwork.title} 
          className="w-full h-full object-cover object-center transition-transform hover:scale-105 duration-300"
        />
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{artwork.title}</CardTitle>
        </div>
        <CardDescription className="flex items-center justify-between">
          <span>{artwork.artist}</span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" /> {formattedDate}
          </span>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{artwork.description}</p>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-0 border-t">
        <div className="flex items-center space-x-1 text-sm">
          <ThumbsUp className="h-4 w-4 text-artvote-red" />
          <span>{artwork.votes} votes</span>
        </div>
        
        <Button 
          onClick={() => onVote(artwork.id)} 
          variant={hasVoted ? "secondary" : "default"} 
          size="sm" 
          className={hasVoted ? "bg-artvote-green text-white" : "bg-artvote-blue text-white"}
          disabled={hasVoted}
        >
          {hasVoted ? 'Voted' : 'Vote'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ArtCard;
