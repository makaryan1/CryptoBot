import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TokenSelector } from "@/components/wallet/token-selector";
import { NetworkSelector } from "@/components/wallet/network-selector";
import { QRCodeAddress } from "@/components/wallet/qr-code-address";
import { getTokenById, getNetworkById } from "@shared/tokens";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { T } from "@/lib/i18n";
import { Wallet } from "@shared/schema";

export default function QuickDeposit() {
  const [selectedTokenId, setSelectedTokenId] = useState("usdt");
  const [selectedNetworkId, setSelectedNetworkId] = useState("tron");
  const { toast } = useToast();

  // Получение данных о кошельках пользователя
  const { data: wallets = [], isLoading: isLoadingWallets } = useQuery<Wallet[]>({
    queryKey: ["/api/wallets"],
  });
  
  // Мутация для создания адреса депозита, если его нет
  const createDepositAddressMutation = useMutation({
    mutationFn: async ({ currency, network }: { currency: string, network: string }) => {
      const res = await apiRequest("POST", "/api/wallets/generate-address", { currency, network });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wallets"] });
      toast({
        title: "Address generated",
        description: "Your deposit address has been generated",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Получение выбранного токена и сети
  const selectedToken = getTokenById(selectedTokenId);
  const selectedNetwork = getNetworkById(selectedNetworkId);
  
  // Найти кошелек для выбранной валюты
  const findWallet = () => {
    if (!wallets || !Array.isArray(wallets) || !wallets.length || !selectedToken) return null;
    return wallets.find((wallet) => wallet.currency === selectedToken.symbol);
  };
  
  const currentWallet = findWallet();
  
  // Получение адреса для депозита при изменении выбранной валюты или сети
  useEffect(() => {
    // Проверяем, есть ли уже кошелек для этой валюты
    const wallet = findWallet();
    
    // Если кошелька нет, или нет адреса - создаем новый адрес
    if (selectedToken && selectedNetwork && (!wallet || !wallet.address)) {
      createDepositAddressMutation.mutate({
        currency: selectedToken.symbol,
        network: selectedNetwork.id
      });
    }
  }, [selectedTokenId, selectedNetworkId]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle><T keyName="wallet.depositFunds" /></CardTitle>
        <CardDescription><T keyName="wallet.depositDescription" /></CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block"><T keyName="wallet.selectAsset" /></Label>
              <TokenSelector
                value={selectedTokenId}
                onChange={setSelectedTokenId}
                popularOnly={true}
              />
            </div>
            
            {selectedToken && (
              <div>
                <Label className="mb-2 block"><T keyName="wallet.selectNetwork" /></Label>
                <NetworkSelector
                  tokenId={selectedTokenId}
                  value={selectedNetworkId}
                  onChange={setSelectedNetworkId}
                />
              </div>
            )}
          </div>
          
          {selectedToken && selectedNetwork && (
            <>
              {createDepositAddressMutation.isPending ? (
                <div className="flex justify-center items-center py-8">
                  <div className="w-8 h-8 border-4 border-t-blue-500 border-b-blue-500 rounded-full animate-spin"></div>
                  <span className="ml-2"><T keyName="wallet.generatingAddress" /></span>
                </div>
              ) : currentWallet && currentWallet.address ? (
                <QRCodeAddress
                  token={selectedToken}
                  network={selectedNetwork}
                  address={currentWallet.address}
                  walletId={currentWallet.id}
                />
              ) : (
                <div className="text-center py-4">
                  <p className="text-neutral-500 mb-4"><T keyName="wallet.noAddressYet" /></p>
                  <Button onClick={() => createDepositAddressMutation.mutate({
                    currency: selectedToken.symbol,
                    network: selectedNetwork.id
                  })}>
                    <T keyName="wallet.generateAddress" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}