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
    logo: "/exchanges/binance.svg",
    color: "yellow-200" 
  },
  { 
    id: "bybit", 
    name: "Bybit", 
    logo: "/exchanges/bybit.svg",
    color: "blue-200" 
  },
  { 
    id: "okx", 
    name: "OKX", 
    logo: "/exchanges/okx.svg",
    color: "green-200" 
  },
  { 
    id: "kucoin", 
    name: "KuCoin", 
    logo: "/exchanges/kucoin.svg",
    color: "green-200" 
  },
  { 
    id: "huobi", 
    name: "Huobi", 
    logo: "/exchanges/huobi.svg",
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
        <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-none shadow-xl">
          <DialogHeader className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-t-lg">
            <DialogTitle className="text-xl font-bold">
              {selectedExchange ? (
                <div className="flex items-center gap-3">
                  {getSelectedExchangeDetails()?.logo && (
                    <img 
                      src={getSelectedExchangeDetails()?.logo} 
                      className="h-8 w-8 bg-white p-1 rounded-full shadow-md" 
                      alt={getSelectedExchangeDetails()?.name} 
                    />
                  )}
                  {t("exchange.connectToExchange", { exchange: getSelectedExchangeDetails()?.name || "" })}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Sparkles className="h-7 w-7 text-yellow-300" />
                  {t("exchange.connectExchangeApi")}
                </div>
              )}
            </DialogTitle>
            <DialogDescription className="text-white/80 mt-2 text-base">
              {selectedExchange 
                ? t("exchange.connectApiDescription") 
                : t("exchange.selectExchangeDescription")}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            {!selectedExchange ? (
              <div className="grid grid-cols-2 gap-4 p-6">
                {SUPPORTED_EXCHANGES.map((exchange) => (
                  <Button
                    key={exchange.id}
                    variant="outline"
                    type="button"
                    className="h-28 flex flex-col items-center justify-center gap-3 hover:bg-accent transition-all duration-200 border-2 hover:border-primary/50 hover:shadow-md"
                    onClick={() => setSelectedExchange(exchange.id)}
                  >
                    {exchange.logo ? (
                      <img src={exchange.logo} className="h-12 w-12" alt={exchange.name} />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center">
                        <Key className="h-6 w-6" />
                      </div>
                    )}
                    <span className="font-medium text-lg">{exchange.name}</span>
                  </Button>
                ))}
              </div>
            ) : (
              <>
                <div className="p-6 space-y-5">
                  <Alert className="border-2 border-yellow-300 bg-yellow-50/70 dark:bg-yellow-900/10 shadow-sm">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    <AlertTitle className="text-yellow-800 font-medium text-base">{t("exchange.apiSecurityWarning")}</AlertTitle>
                    <AlertDescription className="text-yellow-700">
                      {t("exchange.apiSecurityDescription")}
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="apiKey" className="text-right font-medium">
                        {t("exchange.apiKey")}
                      </Label>
                      <Input
                        id="apiKey"
                        name="apiKey"
                        value={formData.apiKey}
                        onChange={handleInputChange}
                        className="col-span-3 h-11 px-4 font-mono text-sm"
                        placeholder="Введите ваш API ключ"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="apiSecret" className="text-right font-medium">
                        {t("exchange.apiSecret")}
                      </Label>
                      <Input
                        id="apiSecret"
                        name="apiSecret"
                        value={formData.apiSecret}
                        onChange={handleInputChange}
                        className="col-span-3 h-11 px-4 font-mono text-sm"
                        type="password"
                        placeholder="Введите ваш API секретный ключ"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right font-medium">
                        {t("exchange.description")}
                      </Label>
                      <Input
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="col-span-3 h-11"
                        placeholder="Описание (необязательно)"
                      />
                    </div>
                    
                    {selectedExchange === 'binance' && (
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="testnetMode" className="text-right font-medium">
                          {t("exchange.testnetMode")}
                        </Label>
                        <div className="col-span-3 flex items-center bg-blue-50 p-3 rounded-md border border-blue-100">
                          <input
                            id="testnetMode"
                            name="testnetMode"
                            type="checkbox"
                            checked={formData.testnetMode}
                            onChange={handleInputChange}
                            className="mr-3 h-4 w-4 rounded"
                          />
                          <Label htmlFor="testnetMode" className="text-sm text-blue-700">
                            {t("exchange.useTestnetDescription")}
                          </Label>
                        </div>
                      </div>
                    )}
                    
                    {selectedExchange === 'binance' && (
                      <div className="mt-4 bg-blue-50 p-4 rounded-md border border-blue-100">
                        <h4 className="text-sm font-medium text-blue-700 mb-2">Как получить API ключ Binance:</h4>
                        <ol className="list-decimal list-inside space-y-1 text-sm text-blue-700">
                          <li>Войдите в свой аккаунт Binance</li>
                          <li>Перейдите в раздел "API Management"</li>
                          <li>Создайте новый API ключ</li>
                          <li>Разрешите доступ к чтению и торговле</li>
                          <li>Скопируйте ключ и секрет</li>
                        </ol>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-5 border-t bg-gray-50 flex justify-between items-center">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={handleTestConnection}
                    disabled={isTesting || !formData.apiKey || !formData.apiSecret}
                    className="bg-white hover:bg-blue-50 text-blue-600 border-blue-200 font-medium"
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
                      className="mr-3"
                    >
                      {t("common.cancel")}
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isCreating || !formData.apiKey || !formData.apiSecret}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium"
                    >
                      {isCreating ? t("common.saving") : t("common.save")}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}