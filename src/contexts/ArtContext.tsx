import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from "sonner";
import { useWallet } from './WalletContext';
import algosdk from 'algosdk';

// Define types for our art pieces
export type ArtPiece = {
  id: string;
  title: string;
  artist: string;
  artistAddress: string;
  imageUrl: string;
  description: string;
  votes: number;
  hasVoted: string[]; // Array of addresses that have voted for this piece
  createdAt: Date;
};

type ArtContextType = {
  artworks: ArtPiece[];
  loading: boolean;
  error: string | null;
  voteForArtwork: (artId: string) => Promise<void>;
  submitArtwork: (artwork: Omit<ArtPiece, 'id' | 'votes' | 'hasVoted' | 'createdAt'>) => Promise<void>;
};

// Create context with default values
const ArtContext = createContext<ArtContextType>({
  artworks: [],
  loading: false,
  error: null,
  voteForArtwork: async () => {},
  submitArtwork: async () => {},
});

export const useArt = () => useContext(ArtContext);

// Sample artwork data
const SAMPLE_ARTWORKS: ArtPiece[] = [
  {
    id: '1',
    title: 'Digital Dreamscape',
    artist: 'CryptoArtist',
    artistAddress: 'ALGO123456789',
    imageUrl: 'https://images.pexels.com/photos/3109807/pexels-photo-3109807.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    description: 'A vibrant digital landscape exploring the intersection of technology and nature.',
    votes: 24,
    hasVoted: [],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    title: 'Abstract Harmony',
    artist: 'BlockchainPainter',
    artistAddress: 'ALGO987654321',
    imageUrl: 'https://images.pexels.com/photos/2693212/pexels-photo-2693212.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    description: 'An abstract composition exploring the harmony of colors and shapes.',
    votes: 17,
    hasVoted: [],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: '3',
    title: 'Futuristic City',
    artist: 'AlgoArtist',
    artistAddress: 'ALGOXYZ123ABC',
    imageUrl: 'https://images.pexels.com/photos/3052361/pexels-photo-3052361.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    description: 'A glimpse into a future city powered by blockchain technology.',
    votes: 31,
    hasVoted: [],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: '4',
    title: 'Nature Reimagined',
    artist: 'DigitalBrush',
    artistAddress: 'ALGOABC456XYZ',
    imageUrl: 'https://images.pexels.com/photos/2832382/pexels-photo-2832382.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    description: 'A digital reinterpretation of natural landscapes.',
    votes: 12,
    hasVoted: [],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: '5',
    title: 'Blockchain Dreams',
    artist: 'CryptoVisionarist',
    artistAddress: 'ALGO45678901X',
    imageUrl: 'https://images.pexels.com/photos/1181354/pexels-photo-1181354.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    description: 'An exploration of how blockchain technology shapes our digital dreams and aspirations.',
    votes: 29,
    hasVoted: [],
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
  },
  {
    id: '6',
    title: 'Algorithmic Beauty',
    artist: 'AlgoGenius',
    artistAddress: 'ALGOGENI12345',
    imageUrl: 'https://images.pexels.com/photos/2437299/pexels-photo-2437299.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    description: 'Mathematical equations transformed into stunning visual representations through code.',
    votes: 35,
    hasVoted: [],
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
  },
  {
    id: '7',
    title: 'Digital Identity',
    artist: 'NFTCreator',
    artistAddress: 'ALGONFT7890XY',
    imageUrl: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    description: 'A commentary on how digital identities are formed and represented in the NFT space.',
    votes: 23,
    hasVoted: [],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
  {
    id: '8',
    title: 'Metaverse Portal',
    artist: 'VirtualArchitect',
    artistAddress: 'ALGOVRCH78901',
    imageUrl: 'https://images.pexels.com/photos/4144099/pexels-photo-4144099.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    description: 'A conceptual gateway that represents the entrance to a blockchain-powered metaverse.',
    votes: 19,
    hasVoted: [],
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
  },
  {
    id: '9',
    title: 'Decentralized Landscape',
    artist: 'BlockArtisan',
    artistAddress: 'ALGOBLOCK4567',
    imageUrl: 'https://images.pexels.com/photos/409701/pexels-photo-409701.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    description: 'A visual representation of a decentralized ecosystem, where communities govern together.',
    votes: 27,
    hasVoted: [],
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
  },
  {
    id: '10',
    title: 'Crypto Revolution',
    artist: 'TokenVisionary',
    artistAddress: 'ALGOTOKEN123',
    imageUrl: 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    description: 'An artistic interpretation of how cryptocurrency is revolutionizing the financial landscape.',
    votes: 41,
    hasVoted: [],
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
  }
];

// Initialize Algorand client (for TestNet)
const algodClient = new algosdk.Algodv2(
  "", // API Key is empty for PureStake
  "https://testnet-api.algonode.cloud", 
  ""
);

export const ArtProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [artworks, setArtworks] = useState<ArtPiece[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { address, isConnected, peraWallet } = useWallet();

  // Load artwork data on mount
  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        setLoading(true);
        
        // In a production environment, we would fetch from Algorand blockchain or IPFS
        // For this demonstration, we're using sample data with voting status
        
        // Simulate checking if the current user has voted on any pieces
        const artworksWithVoteStatus = SAMPLE_ARTWORKS.map(artwork => {
          // For demonstration, randomly determine if user has voted
          const hasVoted = address ? Math.random() > 0.7 : false;
          return {
            ...artwork,
            hasVoted: hasVoted && address ? [...artwork.hasVoted, address] : artwork.hasVoted
          };
        });
        
        setArtworks(artworksWithVoteStatus);
      } catch (err) {
        console.error('Error fetching artworks:', err);
        setError('Failed to load artworks. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, [address]);

  // Vote for an artwork - send an Algorand transaction
  const voteForArtwork = async (artId: string) => {
    if (!isConnected) {
      toast.error('Please connect your Pera Wallet to vote');
      return;
    }

    if (!address) {
      toast.error('No wallet address available');
      return;
    }

    try {
      // Check if user already voted for this artwork
      const artwork = artworks.find(art => art.id === artId);
      if (artwork && address && artwork.hasVoted.includes(address)) {
        toast.error('You have already voted for this artwork');
        return;
      }

      toast.info('Preparing Algorand transaction...');
      
      // In a production environment, this would be a real Algorand transaction
      // For demonstration, we'll simulate the transaction process
      
      // 1. Get suggested transaction parameters
      const suggestedParams = await algodClient.getTransactionParams().do();
      
      // 2. Create a payment transaction (this would actually be an application call in production)
      // This is just for demonstration - in a real app this would call a smart contract
      const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: address,
        to: address, // Self-transaction for demo purposes
        amount: 0,    // 0 Algo transfer
        note: new Uint8Array(Buffer.from(`Vote for Art ID: ${artId}`)),
        suggestedParams,
      });
      
      // 3. Get the transaction signed via Pera Wallet
      const singleTxnGroups = [{ txn }];
      const signedTxn = await peraWallet.signTransaction([singleTxnGroups]);
      
      // In production, we would send this transaction to the network:
      // await algodClient.sendRawTransaction(signedTxn).do();
      // await algosdk.waitForConfirmation(algodClient, txId, 4);
      
      // For demonstration, we'll update the UI immediately
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update local state with the new vote
      setArtworks(prevArtworks =>
        prevArtworks.map(art => {
          if (art.id === artId) {
            return {
              ...art,
              votes: art.votes + 1,
              hasVoted: address ? [...art.hasVoted, address] : art.hasVoted
            };
          }
          return art;
        })
      );
      
      toast.success('Vote submitted successfully via Algorand!');
    } catch (error: any) {
      // Handle user rejection case separately
      if (error?.data?.type === "SIGN_TRANSACTION_CANCELED") {
        toast.error("Transaction signing was cancelled");
      } else {
        console.error('Error voting for artwork:', error);
        toast.error('Transaction failed. Please try again.');
      }
    }
  };

  // Submit a new artwork - send an Algorand transaction with metadata
  const submitArtwork = async (artwork: Omit<ArtPiece, 'id' | 'votes' | 'hasVoted' | 'createdAt'>) => {
    if (!isConnected) {
      toast.error('Please connect your Pera Wallet to submit artwork');
      return;
    }

    if (!address) {
      toast.error('No wallet address available');
      return;
    }

    try {
      toast.info('Preparing to submit artwork via Algorand...');
      
      // In a production environment, this would store the image on IPFS and metadata on Algorand
      
      // 1. Get suggested transaction parameters
      const suggestedParams = await algodClient.getTransactionParams().do();
      
      // 2. Create a note with the artwork details (in production, this would be an IPFS hash)
      const artworkData = {
        title: artwork.title,
        description: artwork.description,
        imageUrl: artwork.imageUrl
      };
      const note = new Uint8Array(Buffer.from(JSON.stringify(artworkData)));
      
      // 3. Create a payment transaction (this would be different in production)
      const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: address,
        to: address, // Self-transaction for demo purposes
        amount: 0,    // 0 Algo transfer
        note: note,
        suggestedParams,
      });
      
      // 4. Get the transaction signed via Pera Wallet
      const singleTxnGroups = [{ txn }];
      const signedTxn = await peraWallet.signTransaction([singleTxnGroups]);
      
      // In production, we would send this transaction to the network:
      // await algodClient.sendRawTransaction(signedTxn).do();
      // await algosdk.waitForConfirmation(algodClient, txId, 4);
      
      // For demonstration, we'll update the UI immediately
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create new artwork with proper structure
      const newArtwork: ArtPiece = {
        ...artwork,
        id: Date.now().toString(), // In production this would be a blockchain identifier
        votes: 0,
        hasVoted: [],
        createdAt: new Date()
      };
      
      // Update local state
      setArtworks(prevArtworks => [newArtwork, ...prevArtworks]);
      
      toast.success('Artwork submitted successfully via Algorand!');
    } catch (error: any) {
      // Handle user rejection case separately
      if (error?.data?.type === "SIGN_TRANSACTION_CANCELED") {
        toast.error("Transaction signing was cancelled");
      } else {
        console.error('Error submitting artwork:', error);
        toast.error('Transaction failed. Please try again.');
      }
    }
  };

  return (
    <ArtContext.Provider
      value={{
        artworks,
        loading,
        error,
        voteForArtwork,
        submitArtwork
      }}
    >
      {children}
    </ArtContext.Provider>
  );
};
