import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { useI18n } from "./use-i18n";

export interface ExchangeApiKey {
  id?: number;
  exchange: string;
  apiKey: string;
  apiSecret?: string;
  description?: string;
  testnetMode?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  permissions?: string[];
}

export function useExchangeApi() {
  const { t } = useI18n();

  // Получение списка API ключей пользователя
  const { 
    data: apiKeys, 
    isLoading: isLoadingApiKeys,
    error: apiKeysError 
  } = useQuery({
    queryKey: ["/api/exchange/api-keys"],
    queryFn: async () => {
      try {
        const response = await apiRequest("GET", "/api/exchange/api-keys");
        return await response.json() as ExchangeApiKey[];
      } catch (error) {
        console.error("Error fetching API keys:", error);
        return [] as ExchangeApiKey[];
      }
    }
  });

  // Мутация для создания нового API ключа
  const createApiKeyMutation = useMutation({
    mutationFn: async (data: ExchangeApiKey) => {
      const response = await apiRequest("POST", "/api/exchange/api-keys", data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/exchange/api-keys"] });
      toast({
        title: t("exchange.apiConnected"),
        description: t("exchange.apiConnectionSuccess"),
      });
    },
    onError: (error: Error) => {
      toast({
        title: t("exchange.apiConnectionFailed"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Мутация для удаления API ключа
  const deleteApiKeyMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/exchange/api-keys/${id}`);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/exchange/api-keys"] });
      toast({
        title: t("exchange.apiRemoved"),
        description: t("exchange.apiRemovedSuccess"),
      });
    },
    onError: (error: Error) => {
      toast({
        title: t("exchange.apiRemovalFailed"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Мутация для тестирования API ключа
  const testApiKeyMutation = useMutation({
    mutationFn: async (data: ExchangeApiKey) => {
      const response = await apiRequest("POST", "/api/exchange/test-api-key", data);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: t("exchange.apiTestSuccess"),
        description: t("exchange.apiTestSuccessDescription"),
      });
    },
    onError: (error: Error) => {
      toast({
        title: t("exchange.apiTestFailed"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    apiKeys: apiKeys || [],
    isLoadingApiKeys,
    apiKeysError,
    createApiKey: createApiKeyMutation.mutate,
    deleteApiKey: deleteApiKeyMutation.mutate,
    testApiKey: testApiKeyMutation.mutate,
    isCreating: createApiKeyMutation.isPending,
    isDeleting: deleteApiKeyMutation.isPending,
    isTesting: testApiKeyMutation.isPending,
  };
}