import React, { useState } from 'react';
import { useArt } from '@/contexts/ArtContext';
import { useWallet } from '@/contexts/WalletContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, ImageIcon } from 'lucide-react';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';

const SubmitArtForm: React.FC = () => {
  const { submitArtwork } = useArt();
  const { isConnected, address } = useWallet();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      
      const simulatedRemoteUrl = 'https://images.pexels.com/photos/' + Math.floor(1000000 + Math.random() * 9000000) + '/pexels-photo.jpeg';
      setFormData(prev => ({ ...prev, imageUrl: simulatedRemoteUrl }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast.error('Please connect your wallet to submit artwork');
      return;
    }
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.imageUrl) {
      toast.error('Please complete all fields and upload an image');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await submitArtwork({
        title: formData.title,
        artist: address ? `Artist ${address.substring(0, 4)}` : 'Anonymous',
        artistAddress: address || 'UNKNOWN',
        imageUrl: imagePreview || formData.imageUrl,
        description: formData.description,
      });
      
      navigate('/gallery');
    } catch (error) {
      console.error('Error submitting artwork:', error);
      toast.error('Failed to submit artwork. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-10">
        <div className="mb-6">
          <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Connect your wallet to submit artwork</h2>
        <p className="text-muted-foreground mb-6">
          You need to connect to your Algorand wallet to submit artwork to the platform.
        </p>
        <Button 
          onClick={() => toast.error('Please use the connect button in the navigation bar')} 
          className="bg-artvote-blue text-white"
        >
          Connect Wallet
        </Button>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Artwork Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter the title of your artwork"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your artwork (technique, inspiration, story, etc.)"
              rows={4}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image">Upload Image</Label>
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
              {imagePreview ? (
                <div className="relative w-full">
                  <img
                    src={imagePreview}
                    alt="Artwork preview"
                    className="max-h-64 mx-auto rounded-md"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="mt-4"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData(prev => ({ ...prev, imageUrl: '' }));
                    }}
                  >
                    Change Image
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center">
                  <Upload className="h-12 w-12 text-gray-400 mb-3" />
                  <p className="text-sm text-gray-600 mb-2">
                    Drag and drop an image, or click to select
                  </p>
                  <p className="text-xs text-gray-400 mb-4">
                    Supports JPG, PNG, GIF (max 10MB)
                  </p>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Label htmlFor="image" className="cursor-pointer">
                    <Button type="button" variant="outline" size="sm">
                      Browse Files
                    </Button>
                  </Label>
                </div>
              )}
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-artvote-blue text-white" 
            disabled={isSubmitting || !formData.imageUrl}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Artwork'}
          </Button>
          
          <p className="text-xs text-muted-foreground text-center">
            By submitting artwork, you confirm that you own the rights to this image and agree to the platform's terms.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default SubmitArtForm;
