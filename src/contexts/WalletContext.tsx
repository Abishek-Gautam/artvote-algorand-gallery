
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from "sonner";
import { PeraWalletConnect } from "@perawallet/connect";

// Initialize the Pera Wallet connector
const peraWallet = new PeraWalletConnect({
  chainId: 416002, // Algorand TestNet chain ID
});

// Define types
type WalletContextType = {
  isConnected: boolean;
  address: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  peraWallet: PeraWalletConnect;
};

// Create context with default values
const WalletContext = createContext<WalletContextType>({
  isConnected: false,
  address: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  peraWallet: peraWallet,
});

export const useWallet = () => useContext(WalletContext);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<string[]>([]);

  // Handle wallet connection changes
  const handleAccountsChanged = (newAccounts: string[]) => {
    // When disconnected, newAccounts is an empty array
    if (newAccounts.length === 0) {
      setIsConnected(false);
      setAddress(null);
      localStorage.removeItem('algorandAddress');
    } else {
      const mainAccount = newAccounts[0];
      setAccounts(newAccounts);
      setAddress(mainAccount);
      setIsConnected(true);
      localStorage.setItem('algorandAddress', mainAccount);
    }
  };

  // Set up listeners for wallet account changes and disconnections
  useEffect(() => {
    // Set up reconnection if previously connected
    const reconnectWallet = async () => {
      const savedAddress = localStorage.getItem('algorandAddress');
      
      if (savedAddress) {
        try {
          // Attempt to reconnect with saved accounts
          const reconnectAccounts = [savedAddress];
          
          // Check if the wallet is still connected
          const isReconnected = await peraWallet.reconnectSession();
          
          if (isReconnected) {
            handleAccountsChanged(reconnectAccounts);
            toast.success("Wallet reconnected successfully");
          } else {
            // Clear saved connection if reconnection failed
            localStorage.removeItem('algorandAddress');
          }
        } catch (error) {
          console.error("Error reconnecting wallet:", error);
          localStorage.removeItem('algorandAddress');
        }
      }
    };
    
    reconnectWallet();

    // Set up event listeners for Pera Wallet connection/disconnection
    peraWallet.connector?.on("disconnect", () => {
      handleAccountsChanged([]);
      toast.info("Wallet disconnected");
    });

    peraWallet.connector?.on("session_update", ({ accounts }) => {
      handleAccountsChanged(accounts);
    });

    return () => {
      // Clean up event listeners when component unmounts
      peraWallet.disconnect();
    };
  }, []);

  // Connect wallet function
  const connectWallet = async () => {
    try {
      toast.info("Please scan QR code with your Pera Wallet app");
      
      const newAccounts = await peraWallet.connect();
      handleAccountsChanged(newAccounts);
      
      toast.success("Pera Wallet connected successfully!");
    } catch (error: any) {
      // Handle user rejection case separately
      if (error?.data?.type === "CONNECT_MODAL_CLOSED") {
        toast.error("Connection cancelled by user");
      } else {
        console.error("Error connecting wallet:", error);
        toast.error("Failed to connect wallet. Please try again.");
      }
    }
  };

  // Disconnect wallet function
  const disconnectWallet = () => {
    peraWallet.disconnect();
    setAddress(null);
    setAccounts([]);
    setIsConnected(false);
    localStorage.removeItem('algorandAddress');
    toast.info('Pera Wallet disconnected');
  };

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        address,
        connectWallet,
        disconnectWallet,
        peraWallet
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
