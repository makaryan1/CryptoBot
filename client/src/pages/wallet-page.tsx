import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { useWallet } from "@/hooks/use-wallet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuickDeposit from "@/components/dashboard/quick-deposit";
import RecentTransactions from "@/components/dashboard/recent-transactions";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { TokenSelector } from "@/components/wallet/token-selector";
import { NetworkSelector } from "@/components/wallet/network-selector";
import { getTokenById } from "@shared/tokens";
import { T } from "@/lib/i18n";

const withdrawalSchema = z.object({
  currency: z.string().min(1, { message: "Please select a currency" }),
  amount: z.number().positive({ message: "Amount must be positive" }),
  address: z.string().min(1, { message: "Please enter a withdrawal address" }),
});

type WithdrawalFormValues = z.infer<typeof withdrawalSchema>;

export default function WalletPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { wallets, withdraw, supportedCurrencies, isLoading } = useWallet();
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [selectedTokenId, setSelectedTokenId] = useState("");
  const [selectedNetworkId, setSelectedNetworkId] = useState("");
  
  const form = useForm<WithdrawalFormValues>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: {
      currency: "",
      amount: 0,
      address: "",
    },
  });
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  // Обновить currency в форме при изменении выбора токена и сети
  useEffect(() => {
    if (selectedTokenId && selectedNetworkId) {
      const token = getTokenById(selectedTokenId);
      if (token) {
        // Установить currency в формате "SYMBOL (NETWORK)"
        form.setValue("currency", `${token.symbol} (${selectedNetworkId.toUpperCase()})`);
      }
    }
  }, [selectedTokenId, selectedNetworkId, form]);
  
  const onSubmit = (data: WithdrawalFormValues) => {
    if (!selectedTokenId || !selectedNetworkId) {
      return;
    }
    
    withdraw({
      currency: data.currency,
      amount: data.amount,
      address: data.address,
      network: selectedNetworkId,
      tokenId: selectedTokenId
    });
    setIsWithdrawOpen(false);
    form.reset();
    setSelectedTokenId("");
    setSelectedNetworkId("");
  };
  
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        <Header 
          toggleSidebar={toggleSidebar} 
          title="Wallet" 
          subtitle="Manage your crypto assets" 
        />
        
        <div className="mb-6">
          <Tabs defaultValue="wallet" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="wallet">My Wallets</TabsTrigger>
              <TabsTrigger value="deposit">Deposit</TabsTrigger>
              <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
              <TabsTrigger value="history">Transaction History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="wallet">
              <Card>
                <CardHeader>
                  <CardTitle>Your Crypto Wallets</CardTitle>
                  <CardDescription>View and manage your cryptocurrency balances</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                  ) : wallets && wallets.length > 0 ? (
                    <div className="space-y-4">
                      {wallets.map((wallet) => (
                        <div key={wallet.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-md ${
                              wallet.currency === 'BTC' 
                                ? 'bg-orange-100 text-orange-600' 
                                : wallet.currency === 'ETH' 
                                  ? 'bg-purple-100 text-purple-600' 
                                  : 'bg-blue-100 text-blue-600'
                            } flex items-center justify-center mr-3`}>
                              <i className={
                                wallet.currency === 'BTC' 
                                  ? 'ri-bitcoin-line' 
                                  : wallet.currency === 'ETH' 
                                    ? 'ri-ethereum-line' 
                                    : 'ri-coin-line'
                              }></i>
                            </div>
                            <div>
                              <h3 className="font-medium">{wallet.currency}</h3>
                              <p className="text-sm text-neutral-400">
                                {wallet.address ? `${wallet.address.substring(0, 8)}...${wallet.address.substring(wallet.address.length - 8)}` : 'No address generated'}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{(wallet.balance || 0).toFixed(
                              wallet.currency === 'BTC' || wallet.currency === 'ETH' ? 8 : 2
                            )}</p>
                            <p className="text-sm text-neutral-400">
                              ≈ ${((wallet.balance || 0) * (
                                wallet.currency === 'BTC' ? 45000 : 
                                wallet.currency === 'ETH' ? 3000 : 1
                              )).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-primary mb-3">
                        <i className="ri-wallet-3-line text-xl"></i>
                      </div>
                      <h3 className="text-lg font-medium mb-2">No Wallets Found</h3>
                      <p className="text-neutral-400 mb-4">Make a deposit to create your first wallet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="deposit">
              <QuickDeposit />
            </TabsContent>
            
            <TabsContent value="withdraw">
              <Card>
                <CardHeader>
                  <CardTitle>Withdraw Funds</CardTitle>
                  <CardDescription>
                    Withdraw your cryptocurrencies to external wallets. 
                    Please note that a fee of 20% applies to all withdrawals.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="currency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel><T keyName="wallet.selectToken" /></FormLabel>
                            <FormControl>
                              <div className="space-y-4">
                                <TokenSelector
                                  value={selectedTokenId}
                                  onChange={setSelectedTokenId}
                                  popularOnly={false}
                                />
                                
                                {selectedTokenId && (
                                  <div className="mt-3">
                                    <Label className="mb-2 block"><T keyName="wallet.selectNetwork" /></Label>
                                    <NetworkSelector
                                      tokenId={selectedTokenId}
                                      value={selectedNetworkId}
                                      onChange={setSelectedNetworkId}
                                    />
                                  </div>
                                )}
                                
                                {/* Скрытое поле для хранения полного значения валюты */}
                                <input 
                                  type="hidden" 
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="0.00" 
                                {...field}
                                onChange={e => field.onChange(parseFloat(e.target.value))}
                              />
                            </FormControl>
                            <FormDescription>
                              Fee: 20% ({field.value > 0 ? (field.value * 0.2).toFixed(2) : '0.00'})
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Destination Address</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter withdrawal address" {...field} />
                            </FormControl>
                            <FormDescription>
                              Please double-check the address before confirming
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" className="w-full">
                        Withdraw Funds
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="history">
              <RecentTransactions />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
