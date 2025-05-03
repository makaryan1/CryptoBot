import { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';

export interface Translations {
  [locale: string]: {
    [key: string]: string;
  };
}

const defaultTranslations: Translations = {
  en: {
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.yes': 'Yes',
    'common.no': 'No',
    
    // Auth
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.logout': 'Logout',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.confirmPassword': 'Confirm Password',
    'auth.name': 'Name',
    'auth.alreadyHaveAccount': 'Already have an account?',
    'auth.dontHaveAccount': 'Don\'t have an account?',
    
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.wallet': 'Wallet',
    'nav.bots': 'Bots',
    'nav.transactions': 'Transactions',
    'nav.kyc': 'KYC',
    'nav.profile': 'Profile',
    'nav.referrals': 'Referrals',
    'nav.support': 'Support',
    
    // Wallet
    'wallet.title': 'Wallet',
    'wallet.description': 'Manage your crypto assets and transactions',
    'wallet.balance': 'Balance',
    'wallet.balanceDescription': 'Your available crypto balance',
    'wallet.noWallets': 'You don\'t have any wallets yet',
    'wallet.makeFirstDeposit': 'Make your first deposit',
    'wallet.deposit': 'Deposit',
    'wallet.withdraw': 'Withdraw',
    'wallet.depositFunds': 'Deposit Funds',
    'wallet.depositDescription': 'Add funds to your account by transferring cryptocurrency',
    'wallet.withdrawalWarning': 'Make sure to only send {network} network compatible tokens to this address. Sending other assets may result in permanent loss.',
    'wallet.selectAsset': 'Select Asset',
    'wallet.selectNetwork': 'Select Network',
    'wallet.selectToken': 'Select Token',
    'wallet.network': 'Network',
    'wallet.noTokensFound': 'No tokens found',
    'wallet.noNetworksFound': 'No networks found',
    'wallet.generatingQrCode': 'Generating QR Code...',
    'wallet.depositAddress': 'Deposit Address',
    'wallet.warning': 'Send only {token} on {network} network to this address. Sending other tokens may result in loss of funds.',
    'wallet.copied': 'Copied',
    'wallet.copy': 'Copy Address',
    'wallet.explorer': 'View in Explorer',
    'wallet.testnet': 'Testnet',
    'wallet.generatingAddress': 'Generating deposit address...',
    'wallet.noAddressYet': 'No deposit address has been generated yet',
    'wallet.generateAddress': 'Generate Address',
    'wallet.recipientAddress': 'Recipient Address',
    'wallet.amount': 'Amount',
    'wallet.max': 'Max',
    'wallet.available': 'Available',
    'wallet.networkFee': 'Network Fee',
    'wallet.youWillReceive': 'You will receive',
    'wallet.processing': 'Processing...',
    'wallet.transactionHistory': 'Transaction History',
    'wallet.transactionHistoryDescription': 'Recent deposits and withdrawals',
    'wallet.noTransactions': 'No transactions found',
    'wallet.viewAllTransactions': 'View All Transactions',
    
    // Bots
    'bots.available': 'Available Bots',
    'bots.profit': 'Avg. profit',
    'bots.riskLevel': 'Risk level',
    'bots.launch': 'Launch Bot',
    'bots.launch.modal.title': 'Launch Bot',
    'bots.launch.modal.description': 'Enter the details to launch this trading bot',
    'bots.launch.modal.investment': 'Investment',
    'bots.launch.modal.currency': 'Currency',
    'bots.launch.modal.cancel': 'Cancel',
    'bots.launch.modal.launch': 'Launch',
    'bots.minInvestment': 'Minimum investment is {min} USDT',
    'bots.expectedReturns': 'Expected Returns',
    'bots.daily': 'Daily',
    'bots.weekly': 'Weekly',
    'bots.monthly': 'Monthly',
    'bots.strategy': 'Strategy',
    'bots.overview': 'Overview',
    'bots.performance': 'Performance',
    'bots.settings': 'Settings',
    'bots.profitPotential': 'Profit Potential',
    'bots.riskAssessment': 'Risk Assessment',
    'bots.strategies': 'Trading Strategies',
    'bots.features': 'Key Features',
    'bots.suitability': 'Suitability',
    'bots.suitabilityDescription': 'This bot is suitable for investors looking for consistent returns with moderate risk. Best for medium to long term investments.',
    'bots.suitabilityTag1': 'Medium term',
    'bots.suitabilityTag2': 'Moderate risk',
    'bots.suitabilityTag3': 'Automated',
    'bots.feature1': 'Automated trading 24/7',
    'bots.feature2': 'Smart risk management',
    'bots.feature3': 'Multiple trading strategies',
    'bots.feature4': 'Real-time performance tracking',
    'bots.feature5': 'Historical backtesting',
    'bots.historicalPerformance': 'Historical Performance',
    'bots.totalGain': 'Total Gain',
    'bots.dailyAvg': 'Daily Avg',
    'bots.weeklyProj': 'Weekly Proj',
    'bots.monthlyProj': 'Monthly Proj',
    'bots.defaultSettings': 'Default Settings',
    'bots.timeframe': 'Timeframe',
    'bots.leverageUsed': 'Leverage Used',
    'bots.maxDrawdown': 'Max Drawdown',
    'bots.rebalancing': 'Rebalancing',
    'bots.automatic': 'Automatic',
    'bots.advancedSettings': 'Advanced Settings',
    'bots.availableAfterLaunch': 'Advanced settings will be available after you launch the bot',
    'bots.backToBots': 'Back to Bots',
    'bots.notFound': 'Bot Not Found',
    'bots.notFoundDescription': 'The bot you are looking for does not exist or has been removed',
  },
  ru: {
    // Common
    'common.loading': 'Загрузка...',
    'common.error': 'Ошибка',
    'common.success': 'Успешно',
    'common.cancel': 'Отмена',
    'common.save': 'Сохранить',
    'common.edit': 'Редактировать',
    'common.delete': 'Удалить',
    'common.yes': 'Да',
    'common.no': 'Нет',
    
    // Auth
    'auth.login': 'Войти',
    'auth.register': 'Регистрация',
    'auth.logout': 'Выйти',
    'auth.email': 'Эл. почта',
    'auth.password': 'Пароль',
    'auth.forgotPassword': 'Забыли пароль?',
    'auth.confirmPassword': 'Подтвердите пароль',
    'auth.name': 'Имя',
    'auth.alreadyHaveAccount': 'Уже есть аккаунт?',
    'auth.dontHaveAccount': 'Нет аккаунта?',
    
    // Navigation
    'nav.dashboard': 'Панель управления',
    'nav.wallet': 'Кошелек',
    'nav.bots': 'Боты',
    'nav.transactions': 'Транзакции',
    'nav.kyc': 'KYC',
    'nav.profile': 'Профиль',
    'nav.referrals': 'Рефералы',
    'nav.support': 'Поддержка',
    
    // Wallet
    'wallet.title': 'Кошелек',
    'wallet.description': 'Управление криптовалютными активами и транзакциями',
    'wallet.balance': 'Баланс',
    'wallet.balanceDescription': 'Ваш доступный криптовалютный баланс',
    'wallet.noWallets': 'У вас еще нет кошельков',
    'wallet.makeFirstDeposit': 'Сделать первый депозит',
    'wallet.deposit': 'Пополнить',
    'wallet.withdraw': 'Вывести',
    'wallet.depositFunds': 'Пополнение средств',
    'wallet.depositDescription': 'Добавьте средства на счет, переведя криптовалюту',
    'wallet.withdrawalWarning': 'Убедитесь, что вы отправляете только токены, совместимые с сетью {network}. Отправка других активов может привести к постоянной потере.',
    'wallet.selectAsset': 'Выберите актив',
    'wallet.selectNetwork': 'Выберите сеть',
    'wallet.selectToken': 'Выберите токен',
    'wallet.network': 'Сеть',
    'wallet.noTokensFound': 'Токены не найдены',
    'wallet.noNetworksFound': 'Сети не найдены',
    'wallet.generatingQrCode': 'Генерация QR-кода...',
    'wallet.depositAddress': 'Адрес для пополнения',
    'wallet.warning': 'Отправляйте только {token} в сети {network} на этот адрес. Отправка других токенов может привести к потере средств.',
    'wallet.copied': 'Скопировано',
    'wallet.copy': 'Копировать адрес',
    'wallet.explorer': 'Просмотр в обозревателе',
    'wallet.testnet': 'Тестовая сеть',
    'wallet.generatingAddress': 'Генерация адреса для пополнения...',
    'wallet.noAddressYet': 'Адрес для пополнения еще не сгенерирован',
    'wallet.generateAddress': 'Сгенерировать адрес',
    'wallet.recipientAddress': 'Адрес получателя',
    'wallet.amount': 'Сумма',
    'wallet.max': 'Макс',
    'wallet.available': 'Доступно',
    'wallet.networkFee': 'Комиссия сети',
    'wallet.youWillReceive': 'Вы получите',
    'wallet.processing': 'Обработка...',
    'wallet.transactionHistory': 'История транзакций',
    'wallet.transactionHistoryDescription': 'Последние пополнения и выводы',
    'wallet.noTransactions': 'Транзакции не найдены',
    'wallet.viewAllTransactions': 'Просмотреть все транзакции',
    
    // Bots
    'bots.available': 'Доступные боты',
    'bots.profit': 'Средняя прибыль',
    'bots.riskLevel': 'Уровень риска',
    'bots.launch': 'Запустить бота',
    'bots.launch.modal.title': 'Запуск бота',
    'bots.launch.modal.description': 'Введите данные для запуска торгового бота',
    'bots.launch.modal.investment': 'Инвестиция',
    'bots.launch.modal.currency': 'Валюта',
    'bots.launch.modal.cancel': 'Отмена',
    'bots.launch.modal.launch': 'Запустить',
    'bots.minInvestment': 'Минимальная инвестиция: {min} USDT',
    'bots.expectedReturns': 'Ожидаемая доходность',
    'bots.daily': 'Ежедневно',
    'bots.weekly': 'Еженедельно',
    'bots.monthly': 'Ежемесячно',
    'bots.strategy': 'Стратегия',
    'bots.overview': 'Обзор',
    'bots.performance': 'Производительность',
    'bots.settings': 'Настройки',
    'bots.profitPotential': 'Потенциал прибыли',
    'bots.riskAssessment': 'Оценка риска',
    'bots.strategies': 'Торговые стратегии',
    'bots.features': 'Ключевые особенности',
    'bots.suitability': 'Применимость',
    'bots.suitabilityDescription': 'Этот бот подходит для инвесторов, ищущих стабильную доходность со средним риском. Лучше всего подходит для средне- и долгосрочных инвестиций.',
    'bots.suitabilityTag1': 'Среднесрочная',
    'bots.suitabilityTag2': 'Умеренный риск',
    'bots.suitabilityTag3': 'Автоматический',
    'bots.feature1': 'Автоматическая торговля 24/7',
    'bots.feature2': 'Умное управление рисками',
    'bots.feature3': 'Несколько торговых стратегий',
    'bots.feature4': 'Отслеживание производительности в реальном времени',
    'bots.feature5': 'Историческое тестирование',
    'bots.historicalPerformance': 'Историческая производительность',
    'bots.totalGain': 'Общая прибыль',
    'bots.dailyAvg': 'Ежедневная средняя',
    'bots.weeklyProj': 'Недельный прогноз',
    'bots.monthlyProj': 'Месячный прогноз',
    'bots.defaultSettings': 'Настройки по умолчанию',
    'bots.timeframe': 'Временной интервал',
    'bots.leverageUsed': 'Используемое плечо',
    'bots.maxDrawdown': 'Макс. просадка',
    'bots.rebalancing': 'Ребалансировка',
    'bots.automatic': 'Автоматически',
    'bots.advancedSettings': 'Расширенные настройки',
    'bots.availableAfterLaunch': 'Расширенные настройки будут доступны после запуска бота',
    'bots.backToBots': 'Вернуться к ботам',
    'bots.notFound': 'Бот не найден',
    'bots.notFoundDescription': 'Бот, который вы ищете, не существует или был удален',
  }
};

interface I18nContextProps {
  locale: string;
  setLocale: (locale: string) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  availableLocales: string[];
}

const I18nContext = createContext<I18nContextProps | undefined>(undefined);

interface I18nProviderProps {
  children: ReactNode;
  initialLocale?: string;
  translations?: Translations;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({
  children,
  initialLocale = 'en',
  translations = defaultTranslations,
}) => {
  const [locale, setLocaleState] = useState(initialLocale);
  const availableLocales = Object.keys(translations);
  
  // Загрузить локаль из localStorage при инициализации
  useEffect(() => {
    const savedLocale = localStorage.getItem('locale');
    if (savedLocale && availableLocales.includes(savedLocale)) {
      setLocaleState(savedLocale);
    }
  }, [availableLocales]);
  
  // Сохранить локаль в localStorage при изменении
  const setLocale = useCallback((newLocale: string) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
  }, []);
  
  // Функция перевода
  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    const translation = translations[locale]?.[key] || translations['en']?.[key] || key;
    
    if (params) {
      return Object.entries(params).reduce((acc, [paramKey, paramValue]) => {
        return acc.replace(new RegExp(`{${paramKey}}`, 'g'), String(paramValue));
      }, translation);
    }
    
    return translation;
  }, [locale, translations]);
  
  return (
    <I18nContext.Provider value={{ locale, setLocale, t, availableLocales }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

// Компонент для перевода
interface TProps {
  keyName: string;
  params?: Record<string, string | number>;
  values?: Record<string, string | number>;
}

export const T: React.FC<TProps> = ({ keyName, params, values }) => {
  // Support both params and values for backward compatibility
  const translationParams = values || params;
  const { t } = useI18n();
  return <>{t(keyName, translationParams)}</>;
};

// Хук для определения текущего направления текста (RTL или LTR)
export const useTextDirection = () => {
  const { locale } = useI18n();
  
  // RTL языки
  const rtlLocales = ['ar', 'he', 'fa', 'ur'];
  
  return {
    isRtl: rtlLocales.includes(locale),
    dir: rtlLocales.includes(locale) ? 'rtl' : 'ltr',
  };
};