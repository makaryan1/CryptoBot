import { Link } from "wouter";
import { useWallet } from "@/hooks/use-wallet";
import { useI18n } from "@/hooks/use-i18n";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function RecentTransactions() {
  const { t } = useI18n();
  const { transactions, isLoading } = useWallet();
  const { toast } = useToast();
  
  const copyToClipboard = (hash: string) => {
    navigator.clipboard.writeText(hash);
    toast({
      title: "Transaction ID copied",
      description: "Transaction ID copied to clipboard",
    });
  };
  
  const openExplorer = (hash: string, currency: string) => {
    let explorerUrl = '';
    
    if (currency.includes('USDT')) {
      if (currency.includes('TRC20')) {
        explorerUrl = `https://tronscan.org/#/transaction/${hash}`;
      } else if (currency.includes('BEP20')) {
        explorerUrl = `https://bscscan.com/tx/${hash}`;
      } else {
        explorerUrl = `https://etherscan.io/tx/${hash}`;
      }
    } else if (currency === 'BTC') {
      explorerUrl = `https://www.blockchain.com/explorer/transactions/btc/${hash}`;
    } else if (currency === 'ETH') {
      explorerUrl = `https://etherscan.io/tx/${hash}`;
    }
    
    if (explorerUrl) {
      window.open(explorerUrl, '_blank');
    }
  };
  
  const truncateHash = (hash: string) => {
    if (!hash) return '';
    return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
  };
  
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">{t('wallet.transactionHistory')}</h2>
        <Link href="/transactions" className="text-primary text-sm font-medium flex items-center hover:underline">
          {t('common.viewAll')}
          <i className="ri-arrow-right-line ml-1 text-xs"></i>
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
        {isLoading ? (
          <div className="p-4">
            <Skeleton className="h-12 w-full mb-2" />
            <Skeleton className="h-16 w-full mb-2" />
            <Skeleton className="h-16 w-full mb-2" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8">
            <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-primary mb-3">
              <i className="ri-exchange-funds-line text-xl"></i>
            </div>
            <h3 className="text-lg font-medium mb-2">No Transactions Yet</h3>
            <p className="text-neutral-400 mb-4">Your transaction history will appear here</p>
            <Button className="mx-auto">
              <i className="ri-wallet-3-line mr-2"></i>
              Make a Deposit
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-3 px-4 font-medium text-neutral-400">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-neutral-400">Asset</th>
                  <th className="text-left py-3 px-4 font-medium text-neutral-400">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-neutral-400">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-neutral-400">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-neutral-400">Transaction ID</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-t border-neutral-200">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full ${
                          transaction.type === 'deposit' 
                            ? 'bg-green-100 text-secondary' 
                            : transaction.type === 'withdrawal' 
                              ? 'bg-red-100 text-error' 
                              : transaction.type === 'bot_profit'
                                ? 'bg-blue-100 text-primary'
                                : 'bg-yellow-100 text-yellow-600'
                        } flex items-center justify-center mr-2`}>
                          <i className={
                            transaction.type === 'deposit' 
                              ? 'ri-arrow-down-line' 
                              : transaction.type === 'withdrawal' 
                                ? 'ri-arrow-up-line' 
                                : transaction.type === 'bot_profit'
                                  ? 'ri-swap-line'
                                  : 'ri-user-received-line'
                          }></i>
                        </div>
                        <span>{
                          transaction.type === 'deposit' 
                            ? 'Deposit' 
                            : transaction.type === 'withdrawal' 
                              ? 'Withdrawal' 
                              : transaction.type === 'bot_profit'
                                ? 'Bot Profit'
                                : 'Referral'
                        }</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-5 h-5 mr-2">
                          <i className={
                            transaction.currency === 'BTC' 
                              ? 'ri-bit-coin-line text-orange-500' 
                              : transaction.currency === 'ETH' 
                                ? 'ri-ethereum-line text-purple-500' 
                                : 'ri-coin-line text-yellow-500'
                          }></i>
                        </div>
                        <span>{transaction.currency}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium">
                      {transaction.type === 'deposit' || transaction.type === 'bot_profit' || transaction.type === 'referral' 
                        ? '+' 
                        : '-'
                      }
                      {transaction.amount.toFixed(
                        transaction.currency === 'BTC' || transaction.currency === 'ETH' ? 5 : 2
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : transaction.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-neutral-400">
                      {new Date(transaction.createdAt).toLocaleString('en-US', { 
                        year: 'numeric', 
                        month: '2-digit', 
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <span className="crypto-address truncate w-24">
                          {transaction.txHash 
                            ? truncateHash(transaction.txHash) 
                            : 'Internal'
                          }
                        </span>
                        {transaction.txHash && (
                          <>
                            <button 
                              className="ml-2 text-neutral-400 hover:text-primary"
                              onClick={() => copyToClipboard(transaction.txHash)}
                            >
                              <i className="ri-file-copy-line"></i>
                            </button>
                            <button 
                              className="ml-2 text-neutral-400 hover:text-primary"
                              onClick={() => openExplorer(transaction.txHash, transaction.currency)}
                            >
                              <i className="ri-external-link-line"></i>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
