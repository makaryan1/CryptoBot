import { useState } from "react";
import { useI18n } from "@/hooks/use-i18n";
import { toast } from "@/hooks/use-toast";
import { useExchangeApi, ExchangeApiKey } from "@/hooks/use-exchange-api";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Key, AlertCircle, CheckCircle, RefreshCw, Trash2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

const SUPPORTED_EXCHANGES = [
  { 
    id: "binance", 
    name: "Binance", 
    logo: "https://cryptologos.cc/logos/binance-coin-bnb-logo.svg?v=026",
    color: "yellow-200" 
  },
  { 
    id: "bybit", 
    name: "Bybit", 
    logo: "",
    color: "blue-200" 
  },
  { 
    id: "okx", 
    name: "OKX", 
    logo: "",
    color: "green-200" 
  },
  { 
    id: "kucoin", 
    name: "KuCoin", 
    logo: "https://cryptologos.cc/logos/kucoin-kcs-logo.svg?v=026",
    color: "green-200" 
  },
  { 
    id: "huobi", 
    name: "Huobi", 
    logo: "https://cryptologos.cc/logos/huobi-token-ht-logo.svg?v=026",
    color: "teal-200" 
  }
];

interface ApiConnectorProps {
  className?: string;
}

export default function ApiConnector({ className = "" }: ApiConnectorProps) {
  const { t } = useI18n();
  const [selectedExchange, setSelectedExchange] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<{
    apiKey: string;
    apiSecret: string;
    description: string;
    testnetMode: boolean;
  }>({
    apiKey: "",
    apiSecret: "",
    description: "",
    testnetMode: false,
  });
  
  // Используем хук для получения API ключей и методов для работы с ними
  const { 
    apiKeys, 
    isLoadingApiKeys,
    createApiKey,
    deleteApiKey,
    testApiKey,
    isCreating,
    isDeleting,
    isTesting
  } = useExchangeApi();

  const resetForm = () => {
    setFormData({
      apiKey: "",
      apiSecret: "",
      description: "",
      testnetMode: false,
    });
    setSelectedExchange("");
  };

  const handleExchangeSelect = (exchange: string) => {
    setSelectedExchange(exchange);
    setIsDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExchange || !formData.apiKey || !formData.apiSecret) {
      toast({
        title: t("common.error"),
        description: t("exchange.missingRequiredFields"),
        variant: "destructive",
      });
      return;
    }

    createApiKey({
      exchange: selectedExchange,
      apiKey: formData.apiKey,
      apiSecret: formData.apiSecret,
      description: formData.description,
      testnetMode: formData.testnetMode,
    });
    
    setIsDialogOpen(false);
    resetForm();
  };

  const handleTestConnection = () => {
    if (!selectedExchange || !formData.apiKey || !formData.apiSecret) {
      toast({
        title: t("common.error"),
        description: t("exchange.missingRequiredFields"),
        variant: "destructive",
      });
      return;
    }

    testApiKey({
      exchange: selectedExchange,
      apiKey: formData.apiKey,
      apiSecret: formData.apiSecret,
      testnetMode: formData.testnetMode,
    });
  };
  
  const handleDeleteApiKey = (id: number) => {
    if (window.confirm(t("exchange.confirmApiKeyDelete"))) {
      deleteApiKey(id);
    }
  };

  const getConnectedStatus = () => {
    const connected = apiKeys.length;
    const total = SUPPORTED_EXCHANGES.length;
    return `${connected}/${total}`;
  };

  const getSelectedExchangeDetails = () => {
    return SUPPORTED_EXCHANGES.find(exchange => exchange.id === selectedExchange);
  };

  return (
    <>
      <Card className={`mb-6 border-2 border-dashed border-yellow-300 bg-yellow-50 dark:bg-yellow-900/10 ${className}`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-md flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            {t("dashboard.connectExchange")}
            {apiKeys.length > 0 && (
              <span className="text-xs bg-green-100 text-green-800 py-0.5 px-2 rounded-full ml-2">
                {getConnectedStatus()}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">{t("dashboard.connectExchangeDescription")}</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {SUPPORTED_EXCHANGES.map((exchange) => {
              const isConnected = apiKeys.some(api => api.exchange === exchange.id);
              return (
                <Button
                  key={exchange.id}
                  variant="outline"
                  size="sm"
                  className={`gap-1 border ${isConnected ? 'border-green-300 bg-green-50' : ''}`}
                  onClick={() => handleExchangeSelect(exchange.id)}
                >
                  {exchange.logo && (
                    <img src={exchange.logo} className="h-4 w-4" alt={exchange.name} />
                  )}
                  {exchange.name}
                  {isConnected && <CheckCircle className="h-3 w-3 text-green-500 ml-1" />}
                </Button>
              );
            })}
          </div>
          
          {/* API ключи пользователя */}
          {apiKeys.length > 0 && (
            <div className="space-y-3 mt-4 mb-4">
              <h4 className="text-sm font-medium">{t("exchange.yourApiKeys")}</h4>
              {apiKeys.map((apiKey) => {
                const exchange = SUPPORTED_EXCHANGES.find(e => e.id === apiKey.exchange);
                return (
                  <div key={apiKey.id} className="flex items-center justify-between p-2 bg-card rounded-md border">
                    <div className="flex items-center gap-2">
                      {exchange?.logo ? (
                        <img src={exchange.logo} className="h-5 w-5" alt={exchange.name} />
                      ) : (
                        <Key className="h-5 w-5 text-muted-foreground" />
                      )}
                      <div>
                        <p className="text-sm font-medium">{exchange?.name || apiKey.exchange}</p>
                        <p className="text-xs text-muted-foreground">{apiKey.apiKey}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {apiKey.testnetMode && (
                        <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                          Testnet
                        </Badge>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteApiKey(apiKey.id!)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          <Button 
            className="w-full bg-yellow-500 hover:bg-yellow-600"
            onClick={() => setIsDialogOpen(true)}
          >
            {apiKeys.length > 0 ? t("exchange.addApiKey") : t("dashboard.connectApi")}
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedExchange ? (
                <div className="flex items-center gap-2">
                  {getSelectedExchangeDetails()?.logo && (
                    <img 
                      src={getSelectedExchangeDetails()?.logo} 
                      className="h-5 w-5" 
                      alt={getSelectedExchangeDetails()?.name} 
                    />
                  )}
                  {t("exchange.connectToExchange", { exchange: getSelectedExchangeDetails()?.name || "" })}
                </div>
              ) : t("exchange.connectExchangeApi")}
            </DialogTitle>
            <DialogDescription>
              {t("exchange.connectApiDescription")}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            {!selectedExchange ? (
              <div className="grid grid-cols-2 gap-3 py-4">
                {SUPPORTED_EXCHANGES.map((exchange) => (
                  <Button
                    key={exchange.id}
                    variant="outline"
                    type="button"
                    className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-accent"
                    onClick={() => setSelectedExchange(exchange.id)}
                  >
                    {exchange.logo ? (
                      <img src={exchange.logo} className="h-8 w-8" alt={exchange.name} />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center">
                        <Key className="h-4 w-4" />
                      </div>
                    )}
                    <span>{exchange.name}</span>
                  </Button>
                ))}
              </div>
            ) : (
              <>
                <div className="grid gap-4 py-4">
                  <Alert className="mb-2 border-yellow-300 bg-yellow-50 text-yellow-800">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>{t("exchange.apiSecurityWarning")}</AlertTitle>
                    <AlertDescription>
                      {t("exchange.apiSecurityDescription")}
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="apiKey" className="text-right">
                      {t("exchange.apiKey")}
                    </Label>
                    <Input
                      id="apiKey"
                      name="apiKey"
                      value={formData.apiKey}
                      onChange={handleInputChange}
                      className="col-span-3"
                      placeholder="Enter your API key"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="apiSecret" className="text-right">
                      {t("exchange.apiSecret")}
                    </Label>
                    <Input
                      id="apiSecret"
                      name="apiSecret"
                      value={formData.apiSecret}
                      onChange={handleInputChange}
                      className="col-span-3"
                      type="password"
                      placeholder="Enter your API secret"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      {t("exchange.description")}
                    </Label>
                    <Input
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="col-span-3"
                      placeholder="Optional description"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="testnetMode" className="text-right">
                      {t("exchange.testnetMode")}
                    </Label>
                    <div className="col-span-3 flex items-center">
                      <input
                        id="testnetMode"
                        name="testnetMode"
                        type="checkbox"
                        checked={formData.testnetMode}
                        onChange={handleInputChange}
                        className="mr-2 h-4 w-4 rounded border-gray-300"
                      />
                      <Label htmlFor="testnetMode" className="text-sm text-muted-foreground">
                        {t("exchange.useTestnetDescription")}
                      </Label>
                    </div>
                  </div>
                </div>

                <DialogFooter className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={handleTestConnection}
                    disabled={isTesting || !formData.apiKey || !formData.apiSecret}
                  >
                    {isTesting ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        {t("exchange.testing")}
                      </>
                    ) : (
                      t("exchange.testConnection")
                    )}
                  </Button>
                  <div>
                    <Button 
                      type="button" 
                      variant="secondary" 
                      onClick={() => { resetForm(); setIsDialogOpen(false); }}
                      className="mr-2"
                    >
                      {t("common.cancel")}
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isCreating || !formData.apiKey || !formData.apiSecret}
                    >
                      {isCreating ? t("common.saving") : t("common.save")}
                    </Button>
                  </div>
                </DialogFooter>
              </>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}