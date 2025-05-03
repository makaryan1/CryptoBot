import { useState } from "react";
import { useWallet } from "@/hooks/use-wallet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function QuickDeposit() {
  const { supportedCurrencies, generateDepositAddress, depositAddress, isLoading } = useWallet();
  const [selectedCurrency, setSelectedCurrency] = useState("USDT (TRC20)");
  const { toast } = useToast();
  
  const handleCurrencyChange = (value: string) => {
    setSelectedCurrency(value);
    generateDepositAddress(value);
  };
  
  const copyToClipboard = () => {
    if (depositAddress) {
      navigator.clipboard.writeText(depositAddress);
      toast({
        title: "Address copied",
        description: "Deposit address copied to clipboard",
      });
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
      <div className="p-4 border-b border-neutral-200">
        <h2 className="font-bold">Quick Deposit</h2>
      </div>
      <div className="p-4">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Select Cryptocurrency</label>
          <div className="relative">
            <Select onValueChange={handleCurrencyChange} defaultValue={selectedCurrency}>
              <SelectTrigger className="w-full p-2.5 border border-neutral-200 rounded-md">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {supportedCurrencies.map((currency) => (
                  <SelectItem key={currency} value={currency}>
                    {currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Your Deposit Address</label>
          <div className="flex">
            <div className="flex-grow relative">
              <Input
                type="text"
                value={depositAddress || ""}
                readOnly
                className="crypto-address w-full p-2.5 border border-neutral-200 rounded-l-md bg-gray-50 text-neutral-400"
              />
            </div>
            <Button
              className="flex items-center justify-center p-2.5 bg-primary text-white rounded-r-md"
              onClick={copyToClipboard}
              disabled={!depositAddress}
            >
              <i className="ri-file-copy-line"></i>
            </Button>
          </div>
          <p className="text-xs text-neutral-400 mt-1">Send only {selectedCurrency} to this address</p>
        </div>
        
        <div className="flex items-center justify-center p-6">
          <div className="w-32 h-32 bg-white border border-neutral-200 rounded-md flex items-center justify-center">
            {depositAddress ? (
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${depositAddress}`}
                alt="QR Code"
                className="w-28 h-28"
              />
            ) : (
              <div className="text-neutral-400 text-sm">Select currency</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
