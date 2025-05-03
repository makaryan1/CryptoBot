import { useState, useEffect } from "react";
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
import { getFilteredTokens, type Token } from "@shared/tokens";
import { T } from "@/lib/i18n";

interface TokenSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  popularOnly?: boolean;
  networkId?: string;
}

export function TokenSelector({
  value,
  onChange,
  className,
  popularOnly = true,
  networkId,
}: TokenSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [tokens, setTokens] = useState<Token[]>([]);
  
  useEffect(() => {
    const filtered = getFilteredTokens({
      networkId,
      popularOnly,
      search
    });
    setTokens(filtered);
  }, [search, networkId, popularOnly]);
  
  const selectedToken = tokens.find(token => token.id === value);
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {selectedToken ? (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full overflow-hidden bg-muted">
                <img
                  src={selectedToken.logoUrl}
                  alt={selectedToken.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiByeD0iMTIiIGZpbGw9IiNEMUQ1REIiLz4KPHBhdGggZD0iTTguNSA4LjVDOC41IDcuNjcxNTcgOS4xNzE1NyA3IDEwIDdIMTRDMTQuODI4NCA3IDE1LjUgNy42NzE1NyAxNS41IDguNVYxNS41QzE1LjUgMTYuMzI4NCAxNC44Mjg0IDE3IDE0IDE3SDEwQzkuMTcxNTcgMTcgOC41IDE2LjMyODQgOC41IDE1LjVWOC41WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+';
                  }}
                />
              </div>
              <span>{selectedToken.symbol}</span>
              <Badge variant="outline" className="ml-1 text-xs font-normal">
                {selectedToken.name}
              </Badge>
            </div>
          ) : (
            <span><T keyName="wallet.selectToken" /></span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-full min-w-[240px]">
        <Command>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput 
              placeholder={`${tokens.length} tokens`} 
              onValueChange={setSearch}
              className="flex-1" 
            />
          </div>
          <CommandList>
            <CommandEmpty><T keyName="wallet.noTokensFound" /></CommandEmpty>
            <CommandGroup>
              {tokens.map((token) => (
                <CommandItem
                  key={token.id}
                  value={token.id}
                  onSelect={() => {
                    onChange(token.id);
                    setOpen(false);
                  }}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={token.logoUrl}
                      alt={token.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiByeD0iMTIiIGZpbGw9IiNEMUQ1REIiLz4KPHBhdGggZD0iTTguNSA4LjVDOC41IDcuNjcxNTcgOS4xNzE1NyA3IDEwIDdIMTRDMTQuODI4NCA3IDE1LjUgNy42NzE1NyAxNS41IDguNVYxNS41QzE1LjUgMTYuMzI4NCAxNC44Mjg0IDE3IDE0IDE3SDEwQzkuMTcxNTcgMTcgOC41IDE2LjMyODQgOC41IDE1LjVWOC41WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+';
                      }}
                    />
                  </div>
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center justify-between">
                      <span>{token.symbol}</span>
                      {token.id === value && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {token.name}
                    </span>
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