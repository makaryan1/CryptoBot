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
    'common.viewAll': 'View All',
    
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
    'nav.bots': 'Trading Bots',
    'nav.transactions': 'Transactions',
    'nav.kyc': 'Verification',
    'nav.profile': 'Profile',
    'nav.referrals': 'Referrals',
    'nav.support': 'Support',
    
    // Dashboard
    'dashboard.welcomeBack': 'Welcome back, {name}!',
    'dashboard.accountSummary': 'Account Summary',
    'dashboard.totalBalance': 'Total Balance',
    'dashboard.activeBots': 'Active Bots',
    'dashboard.totalProfit': 'Total Profit',
    'dashboard.depositFunds': 'Deposit Funds',
    'dashboard.quickActions': 'Quick Actions',
    'dashboard.startTrading': 'Start Trading',
    'dashboard.viewTransactions': 'View Transactions',
    'dashboard.completeVerification': 'Complete Verification',
    'dashboard.inviteFriends': 'Invite Friends',
    
    // Sidebar
    'sidebar.main': 'Main',
    'sidebar.dashboard': 'Dashboard',
    'sidebar.tradingBots': 'Trading Bots',
    'sidebar.wallet': 'Wallet',
    'sidebar.transactions': 'Transactions',
    'sidebar.referrals': 'Referrals',
    'sidebar.account': 'Account',
    'sidebar.profileSettings': 'Profile Settings',
    'sidebar.verification': 'Verification',
    'sidebar.security': 'Security',
    'sidebar.support': 'Support',
    'sidebar.faq': 'FAQ',
    'sidebar.supportChat': 'Support Chat',
    'sidebar.admin': 'Admin',
    'sidebar.adminDashboard': 'Admin Panel',
    'sidebar.botManagement': 'Bot Management',
    'sidebar.userManagement': 'User Management',
    'sidebar.kycManagement': 'KYC Management',
    'sidebar.commissionSettings': 'Commission Settings',
    
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
    
    // KYC
    'kyc.level': 'Level',
    'kyc.completeLevel2': 'Complete Level 2 to unlock higher limits',
    'kyc.accountVerified': 'Your account is fully verified',
    
    // Bots
    'bots.available': 'Available Bots',
    'bots.profit': 'Avg. profit',
    'bots.riskLevel': 'Risk level',
    'bots.launch': 'Launch Bot',
    'bots.of': 'of',
    'bots.launch.modal.title': 'Launch Bot',
    'bots.launch.modal.description': 'Enter the details to launch this trading bot',
    'bots.launch.modal.investment': 'Investment',
    'bots.launch.modal.currency': 'Currency',
    'bots.launch.modal.cancel': 'Cancel',
    'bots.launch.modal.launch': 'Launch',
    'bots.launch.modal.launching': 'Launching...',
    'bots.launch.modal.advancedSettings': 'Advanced Settings',
    'bots.launch.modal.advancedSettingsDescription': 'Configure additional protections and controls for your bot',
    'bots.launch.modal.protectionSettings': 'Protection Settings',
    'bots.minInvestment': 'Min. Investment',
    'bots.avgCycle': 'Avg. Cycle',
    'bots.risk': 'Risk Level',
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
    'bots.useAdvancedSettings': 'Use advanced settings for more control',
    'bots.stopLoss': 'Stop Loss',
    'bots.stopLossDescription': 'Automatically stop the bot if the investment falls below this percentage of the initial value',
    'bots.takeProfit': 'Take Profit',
    'bots.takeProfitDescription': 'Automatically stop the bot when profit reaches this percentage of the initial investment',
    'bots.maxDuration': 'Maximum Duration',
    'bots.maxDurationDescription': 'Automatically stop the bot after this number of days',
    'bots.days': 'days',
    'bots.day': 'day',
    'bots.months': 'months',
    'bots.availableOption': 'Available',
    'bots.allBots': 'All Bots',
    'bots.activeBots': 'Active Bots',
    'bots.byRiskLevel': 'By Risk Level',
    'bots.yourActiveBots': 'Your Active Bots',
    'bots.availableBots': 'Available Bots',
    'bots.noActiveBots': 'No Active Bots',
    'bots.noActiveBotsDescription': 'You don\'t have any active trading bots yet. Start by launching one of the available bots.',
    'bots.active': 'Active',
    'bots.lowRisk': 'Low Risk Bots',
    'bots.mediumRisk': 'Medium Risk Bots',
    'bots.highRisk': 'High Risk Bots',
    'bots.details': 'Details',
    'bots.botsAvailable': 'bots available',
    'bots.initialInvestment': 'Initial Investment',
    'bots.currentValue': 'Current Value',
    'bots.currentProfit': 'Current Profit',
    'bots.recommendedTimeframe': 'Recommended Timeframe',
    'bots.history': 'History',
    'bots.stop': 'Stop Bot',
    'bots.stopBot.title': 'Stop Bot',
    'bots.stopBot.description': 'Are you sure you want to stop this bot? All current positions will be closed and the bot will cease trading.',
    'bots.stopBot.confirm': 'Yes, Stop Bot',
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
    'common.viewAll': 'Показать все',
    
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
    'nav.bots': 'Торговые боты',
    'nav.transactions': 'Транзакции',
    'nav.kyc': 'Верификация',
    'nav.profile': 'Профиль',
    'nav.referrals': 'Рефералы',
    'nav.support': 'Поддержка',
    
    // Dashboard
    'dashboard.welcomeBack': 'С возвращением, {name}!',
    'dashboard.accountSummary': 'Сводка аккаунта',
    'dashboard.totalBalance': 'Общий баланс',
    'dashboard.activeBots': 'Активные боты',
    'dashboard.totalProfit': 'Общая прибыль',
    'dashboard.depositFunds': 'Пополнить средства',
    'dashboard.quickActions': 'Быстрые действия',
    'dashboard.startTrading': 'Начать торговлю',
    'dashboard.viewTransactions': 'Посмотреть транзакции',
    'dashboard.completeVerification': 'Завершить верификацию',
    'dashboard.inviteFriends': 'Пригласить друзей',
    
    // Sidebar
    'sidebar.main': 'Главное',
    'sidebar.dashboard': 'Панель управления',
    'sidebar.tradingBots': 'Торговые боты',
    'sidebar.wallet': 'Кошелек',
    'sidebar.transactions': 'Транзакции',
    'sidebar.referrals': 'Реферальная программа',
    'sidebar.account': 'Аккаунт',
    'sidebar.profileSettings': 'Настройки профиля',
    'sidebar.verification': 'Верификация',
    'sidebar.security': 'Безопасность',
    'sidebar.support': 'Поддержка',
    'sidebar.faq': 'Частые вопросы',
    'sidebar.supportChat': 'Чат поддержки',
    'sidebar.admin': 'Админ-панель',
    'sidebar.adminDashboard': 'Главная',
    'sidebar.botManagement': 'Управление ботами',
    'sidebar.userManagement': 'Управление пользователями',
    'sidebar.kycManagement': 'Управление KYC',
    'sidebar.commissionSettings': 'Настройки комиссий',
    
    // KYC
    'kyc.level': 'Уровень',
    'kyc.completeLevel2': 'Пройдите верификацию Уровня 2 для увеличения лимитов',
    'kyc.accountVerified': 'Ваш аккаунт полностью верифицирован',
    
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
    'bots.of': 'из',
    'bots.launch.modal.title': 'Запуск бота',
    'bots.launch.modal.description': 'Введите данные для запуска торгового бота',
    'bots.launch.modal.investment': 'Инвестиция',
    'bots.launch.modal.currency': 'Валюта',
    'bots.launch.modal.cancel': 'Отмена',
    'bots.launch.modal.launch': 'Запустить',
    'bots.launch.modal.launching': 'Запуск...',
    'bots.launch.modal.advancedSettings': 'Расширенные настройки',
    'bots.launch.modal.advancedSettingsDescription': 'Настройте дополнительные параметры защиты и управления для вашего бота',
    'bots.launch.modal.protectionSettings': 'Настройки защиты',
    'bots.minInvestment': 'Мин. инвестиция',
    'bots.avgCycle': 'Средний цикл',
    'bots.risk': 'Уровень риска',
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
    'bots.useAdvancedSettings': 'Использовать расширенные настройки для большего контроля',
    'bots.stopLoss': 'Стоп-лосс',
    'bots.stopLossDescription': 'Автоматически останавливать бота, если инвестиция упадет ниже указанного процента от начальной стоимости',
    'bots.takeProfit': 'Тейк-профит',
    'bots.takeProfitDescription': 'Автоматически останавливать бота, когда прибыль достигнет указанного процента от начальной инвестиции',
    'bots.maxDuration': 'Максимальная длительность',
    'bots.maxDurationDescription': 'Автоматически останавливать бота после указанного количества дней',
    'bots.days': 'дней',
    'bots.day': 'день',
    'bots.months': 'месяцев',
    'bots.availableOption': 'Доступно',
    'bots.allBots': 'Все боты',
    'bots.activeBots': 'Активные боты',
    'bots.byRiskLevel': 'По уровню риска',
    'bots.yourActiveBots': 'Ваши активные боты',
    'bots.availableBots': 'Доступные боты',
    'bots.noActiveBots': 'Нет активных ботов',
    'bots.noActiveBotsDescription': 'У вас еще нет активных торговых ботов. Начните с запуска одного из доступных ботов.',
    'bots.active': 'Активен',
    'bots.lowRisk': 'Боты с низким риском',
    'bots.mediumRisk': 'Боты со средним риском',
    'bots.highRisk': 'Боты с высоким риском',
    'bots.details': 'Подробности',
    'bots.botsAvailable': 'ботов доступно',
    'bots.initialInvestment': 'Начальная инвестиция',
    'bots.currentValue': 'Текущая стоимость',
    'bots.currentProfit': 'Текущая прибыль',
    'bots.recommendedTimeframe': 'Рекомендуемый период',
    'bots.history': 'История',
    'bots.stop': 'Остановить',
    'bots.stopBot.title': 'Остановить бота',
    'bots.stopBot.description': 'Вы уверены, что хотите остановить этого бота? Все текущие позиции будут закрыты, и бот прекратит торговлю.',
    'bots.stopBot.confirm': 'Да, остановить бота',
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