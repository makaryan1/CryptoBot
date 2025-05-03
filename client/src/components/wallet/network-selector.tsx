import { useState } from "react";
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from "@/components/ui/command";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getSupportedNetworksForToken, getNetworkById, type Network } from "@shared/tokens";
import { T } from "@/lib/i18n";

interface NetworkSelectorProps {
  tokenId: string;
  value?: string;
  onChange: (value: string) => void;
  className?: string;
}

export function NetworkSelector({
  tokenId,
  value,
  onChange,
  className,
}: NetworkSelectorProps) {
  const [open, setOpen] = useState(false);
  
  const networks = getSupportedNetworksForToken(tokenId);
  const selectedNetwork = value ? getNetworkById(value) : undefined;
  
  if (networks.length === 0) {
    return null;
  }
  
  if (networks.length === 1) {
    return (
      <div className={cn("flex items-center", className)}>
        <span className="text-sm text-muted-foreground mr-2">
          <T keyName="wallet.network" />:
        </span>
        <Badge variant="outline">
          {networks[0].name}
        </Badge>
      </div>
    );
  }
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              <T keyName="wallet.network" />:
            </span>
            {selectedNetwork ? (
              <span>{selectedNetwork.name}</span>
            ) : (
              <span className="text-muted-foreground"><T keyName="wallet.selectNetwork" /></span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-full min-w-[240px]">
        <Command>
          <CommandList>
            <CommandEmpty><T keyName="wallet.noNetworksFound" /></CommandEmpty>
            <CommandGroup>
              {networks.map((network) => (
                <CommandItem
                  key={network.id}
                  value={network.id}
                  onSelect={() => {
                    onChange(network.id);
                    setOpen(false);
                  }}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <span>{network.name}</span>
                      {network.isTestnet && (
                        <Badge variant="outline" className="text-xs font-normal">
                          <T keyName="wallet.testnet" />
                        </Badge>
                      )}
                    </div>
                    {network.id === value && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}