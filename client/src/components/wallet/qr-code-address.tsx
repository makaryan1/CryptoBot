import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle2, ExternalLink } from "lucide-react";
import { type Token, type Network } from "@shared/tokens";
import { QRCodeSVG } from "qrcode.react";
import { T } from "@/lib/i18n";

interface QRCodeAddressProps {
  token: Token;
  network: Network;
  address: string;
  walletId: number;
}

export function QRCodeAddress({ token, network, address, walletId }: QRCodeAddressProps) {
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = () => {
    if (address) {
      navigator.clipboard.writeText(address).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };
  
  // Получаем URL обозревателя блокчейна для отображения адреса
  const getExplorerUrl = () => {
    if (!address || !network.explorerUrl) return '';
    
    // Формат URL зависит от блокчейна
    if (network.id === 'bitcoin') {
      return `${network.explorerUrl}/address/${address}`;
    } else if (network.id === 'tron') {
      return `${network.explorerUrl}/#/address/${address}`;
    } else if (network.id === 'solana') {
      return `${network.explorerUrl}/address/${address}`;
    } else if (network.id === 'aptos') {
      return `${network.explorerUrl}/account/${address}`;
    } else if (network.id === 'ton') {
      return `${network.explorerUrl}/address/${address}`;
    } else {
      // Ethereum, BSC и другие EVM-совместимые
      return `${network.explorerUrl}/address/${address}`;
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6 flex flex-col items-center">
        <div className="flex items-center mb-4 gap-2">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-muted">
            <img
              src={token.logoUrl}
              alt={token.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiByeD0iMTIiIGZpbGw9IiNEMUQ1REIiLz4KPHBhdGggZD0iTTguNSA4LjVDOC41IDcuNjcxNTcgOS4xNzE1NyA3IDEwIDdIMTRDMTQuODI4NCA3IDE1LjUgNy42NzE1NyAxNS41IDguNVYxNS41QzE1LjUgMTYuMzI4NCAxNC44Mjg0IDE3IDE0IDE3SDEwQzkuMTcxNTcgMTcgOC41IDE2LjMyODQgOC41IDE1LjVWOC41WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+';
              }}
            />
          </div>
          <div>
            <div className="font-medium">{token.symbol}</div>
            <div className="text-sm text-muted-foreground">{network.name}</div>
          </div>
        </div>
        
        <div className="bg-neutral-50 p-4 rounded-lg mb-4 w-auto">
          {address ? (
            <QRCodeSVG 
              value={address}
              size={192}
              level="L"
              className="w-48 h-48"
              bgColor="#fafafa"
              fgColor="#000000"
            />
          ) : (
            <div className="w-48 h-48 flex items-center justify-center bg-neutral-100 rounded">
              <div className="text-neutral-400 text-sm"><T keyName="wallet.generatingQrCode" /></div>
            </div>
          )}
        </div>
        
        <div className="bg-neutral-50 p-3 rounded-lg mb-4 w-full">
          <div className="text-xs text-center font-medium mb-1 text-neutral-500">
            <T keyName="wallet.depositAddress" />
          </div>
          <div className="text-sm text-center break-all">
            {address || <span className="text-neutral-400">...</span>}
          </div>
        </div>
        
        <div className="flex gap-2 w-full">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={copyToClipboard}
            disabled={!address}
          >
            {copied ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                <T keyName="wallet.copied" />
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                <T keyName="wallet.copy" />
              </>
            )}
          </Button>
          
          {network.explorerUrl && (
            <Button
              variant="outline"
              onClick={() => window.open(getExplorerUrl(), '_blank')}
              disabled={!address}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              <T keyName="wallet.explorer" />
            </Button>
          )}
        </div>
        
        <div className="text-xs text-center text-muted-foreground mt-4 max-w-md">
          <T keyName="wallet.warning" values={{ token: token.symbol, network: network.name }} />
        </div>
      </CardContent>
    </Card>
  );
}