import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "./use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Wallet, Transaction } from "@shared/schema";

export function useWallet() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedCurrency, setSelectedCurrency] = useState("");
  
  // Fetch all wallets
  const { data: wallets, isLoading: walletsLoading } = useQuery<Wallet[]>({
    queryKey: ["/api/wallets"],
    enabled: !!user,
  });
  
  // Fetch recent transactions
  const { data: transactions, isLoading: transactionsLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
    enabled: !!user,
  });
  
  // Fetch deposit address for selected currency
  const { data: depositAddressData, isLoading: addressLoading } = useQuery<{ address: string }>({
    queryKey: ["/api/wallets/address", selectedCurrency],
    enabled: !!selectedCurrency,
  });
  
  // Generate deposit address
  const generateDepositAddressMutation = useMutation({
    mutationFn: async (currency: string) => {
      const res = await apiRequest("POST", "/api/wallets/generate-address", { currency });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/wallets/address", selectedCurrency], data);
      toast({
        title: "Address generated",
        description: `Deposit address for ${selectedCurrency} has been generated.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to generate address",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Withdraw funds
  const withdrawFundsMutation = useMutation({
    mutationFn: async ({ 
      currency, 
      amount, 
      address 
    }: { 
      currency: string; 
      amount: number; 
      address: string; 
    }) => {
      const res = await apiRequest("POST", "/api/wallets/withdraw", {
        currency,
        amount,
        address
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wallets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      toast({
        title: "Withdrawal requested",
        description: "Your withdrawal request has been submitted and is being processed.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Withdrawal failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Calculate total balance
  const calculateTotalBalance = (): number => {
    if (!wallets) return 0;
    return wallets.reduce((total, wallet) => total + wallet.balance, 0);
  };
  
  // Calculate total profit based on transactions
  const calculateTotalProfit = (): number => {
    if (!transactions) return 0;
    
    const profits = transactions.filter(tx => 
      tx.type === 'bot_profit' || tx.type === 'referral'
    );
    
    return profits.reduce((total, tx) => total + tx.amount, 0);
  };
  
  // Calculate percent change
  const calculatePercentChange = (): number => {
    const totalBalance = calculateTotalBalance();
    const totalProfit = calculateTotalProfit();
    
    if (totalBalance <= 0 || totalProfit <= 0) return 0;
    
    return (totalProfit / (totalBalance - totalProfit)) * 100;
  };
  
  // List of supported cryptocurrencies
  const supportedCurrencies = [
    "USDT (TRC20)",
    "USDT (BEP20)",
    "USDT (ERC20)",
    "BTC",
    "ETH",
    "TRX",
    "SOL",
    "APT",
    "BNB",
    "ADA",
    "XRP"
  ];
  
  // Generate a deposit address for a currency
  const generateDepositAddress = (currency: string) => {
    setSelectedCurrency(currency);
    generateDepositAddressMutation.mutate(currency);
  };
  
  return {
    wallets,
    transactions: transactions || [],
    supportedCurrencies,
    totalBalance: calculateTotalBalance(),
    totalProfit: calculateTotalProfit(),
    percentChange: calculatePercentChange(),
    depositAddress: depositAddressData?.address || "",
    generateDepositAddress,
    withdraw: withdrawFundsMutation.mutate,
    isLoading: walletsLoading || transactionsLoading || addressLoading || 
               generateDepositAddressMutation.isPending || withdrawFundsMutation.isPending
  };
}
