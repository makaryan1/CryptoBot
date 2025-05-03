// Простой модуль для интернационализации
import { create } from 'zustand'

// Доступные языки
export type Language = 'en' | 'ru';

// Состояние языка
export type LanguageState = {
  language: Language;
  setLanguage: (lang: Language) => void;
}

// Хук для управления языком
export const useLanguage = create<LanguageState>((set) => {
  // Получаем сохраненный язык из localStorage или устанавливаем по умолчанию 'ru'
  const savedLanguage = localStorage.getItem('language') as Language | null;
  
  return {
    language: savedLanguage || 'ru',
    setLanguage: (lang: Language) => {
      // Сохраняем выбранный язык в localStorage
      localStorage.setItem('language', lang);
      set({ language: lang });
    }
  };
});

// Тип для словаря переводов
export type Translations = {
  [key: string]: string;
}

// Тип для всех переводов по языкам
export type TranslationDictionary = {
  [key in Language]: Translations;
}

// Функция для перевода текста
export function translate(key: string, params?: Record<string, string | number>): string {
  const { language } = useLanguage.getState();
  const translation = translations[language][key] || translations['en'][key] || key;
  
  if (params) {
    // Заменяем параметры в строке формата: "Hello, {{name}}!"
    return Object.entries(params).reduce((acc, [paramKey, paramValue]) => {
      return acc.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(paramValue));
    }, translation);
  }
  
  return translation;
}

// Словарь переводов
export const translations: TranslationDictionary = {
  'en': {
    // Общие
    'app.name': 'CryptoTrader Pro',
    'app.tagline': 'Professional Trading Bots for Crypto Markets',
    
    // Навигация
    'nav.dashboard': 'Dashboard',
    'nav.bots': 'Trading Bots',
    'nav.wallet': 'Wallet',
    'nav.transactions': 'Transactions',
    'nav.referrals': 'Referrals',
    'nav.kyc': 'KYC Verification',
    'nav.support': 'Support',
    'nav.profile': 'Profile',
    'nav.logout': 'Logout',
    'nav.admin': 'Admin Panel',
    
    // Авторизация
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.noAccount': 'Don\'t have an account?',
    'auth.hasAccount': 'Already have an account?',
    'auth.loginSuccess': 'Successfully logged in',
    'auth.registerSuccess': 'Successfully registered',
    'auth.logoutSuccess': 'Successfully logged out',
    
    // Дашборд
    'dashboard.welcome': 'Welcome',
    'dashboard.totalBalance': 'Total Balance',
    'dashboard.activeReferrals': 'Active Referrals',
    'dashboard.availableBots': 'Available Bots',
    'dashboard.activeBots': 'Active Bots',
    'dashboard.recentTransactions': 'Recent Transactions',
    'dashboard.notifications': 'Notifications',
    
    // Ботыs
    'bots.available': 'Available Bots',
    'bots.myBots': 'My Bots',
    'bots.active': 'Active',
    'bots.inactive': 'Inactive',
    'bots.launch': 'Launch Bot',
    'bots.profit': 'Avg. profit',
    'bots.riskLevel': 'Risk level',
    'bots.investment': 'Investment',
    'bots.launch.modal.title': 'Launch Bot',
    'bots.launch.modal.description': 'Enter the amount you want to invest in this bot',
    'bots.launch.modal.investment': 'Investment',
    'bots.launch.modal.currency': 'Currency',
    'bots.launch.modal.cancel': 'Cancel',
    'bots.launch.modal.launch': 'Launch',
    
    // KYC
    'kyc.title': 'KYC Verification',
    'kyc.subtitle': 'Complete your verification to unlock full platform access',
    'kyc.status': 'Verification Status',
    'kyc.currentLevel': 'Your current verification level',
    'kyc.level1': 'Basic Verification',
    'kyc.level2': 'Advanced Verification',
    'kyc.level3': 'Advanced+ Verification',
    'kyc.status.approved': 'Approved',
    'kyc.status.pending': 'Pending',
    'kyc.status.rejected': 'Rejected',
    'kyc.status.notStarted': 'Not Started',
    'kyc.status.locked': 'Locked',
    'kyc.basicLimits': 'Limits: Deposit up to $10,000, withdraw up to $5,000',
    'kyc.advancedLimits': 'Limits: Deposit up to $100,000, withdraw up to $50,000',
    'kyc.unlimitedLimits': 'Limits: Unlimited deposits and withdrawals',
    'kyc.rejected.title': 'Verification Rejected',
    'kyc.inProgress.title': 'Verification in Progress',
    'kyc.inProgress.description': 'Your Level 1 verification is currently being processed. This usually takes 1-2 business days.',
    'kyc.form.level1.title': 'Basic Verification (Level 1)',
    'kyc.form.level1.description': 'Please provide your personal information and upload your identification documents',
    'kyc.form.level2.title': 'Advanced Verification (Level 2)',
    'kyc.form.level2.description': 'Please upload additional documents for enhanced verification',
    'kyc.form.fullName': 'Full Name',
    'kyc.form.fullName.description': 'Enter your full name as it appears on your ID',
    'kyc.form.country': 'Country of Residence',
    'kyc.form.dateOfBirth': 'Date of Birth',
    'kyc.form.dateOfBirth.description': 'You must be at least 18 years old',
    'kyc.form.idDocument': 'ID Document',
    'kyc.form.idDocument.description': 'Upload a photo of your passport, driver\'s license, or national ID card',
    'kyc.form.selfieWithId': 'Selfie with ID',
    'kyc.form.selfieWithId.description': 'Upload a selfie of yourself holding your ID document',
    'kyc.form.addressProof': 'Proof of Address',
    'kyc.form.addressProof.description': 'Upload a utility bill, bank statement, or other document showing your address (not older than 3 months)',
    'kyc.form.videoVerification': 'Video Verification',
    'kyc.form.videoVerification.description': 'Record a short video of yourself stating "I am [your full name] and I am verifying my account on CryptoTrader Pro" and today\'s date',
    'kyc.form.submit': 'Submit Verification',
    
    // Кошелек
    'wallet.title': 'Wallet',
    'wallet.balance': 'Balance',
    'wallet.deposit': 'Deposit',
    'wallet.withdraw': 'Withdraw',
    'wallet.depositAddress': 'Deposit Address',
    'wallet.depositInstructions': 'Send only {{currency}} to this address. Sending any other currency may result in permanent loss.',
    'wallet.withdrawAmount': 'Withdrawal Amount',
    'wallet.withdrawAddress': 'Withdrawal Address',
    'wallet.fee': 'Fee',
    'wallet.total': 'Total',
    'wallet.confirmWithdrawal': 'Confirm Withdrawal',
    
    // Транзакции
    'transactions.title': 'Transactions',
    'transactions.empty': 'No transactions found',
    'transactions.type': 'Type',
    'transactions.amount': 'Amount',
    'transactions.status': 'Status',
    'transactions.date': 'Date',
    'transactions.txHash': 'Transaction Hash',
    'transactions.deposit': 'Deposit',
    'transactions.withdrawal': 'Withdrawal',
    'transactions.botInvestment': 'Bot Investment',
    'transactions.botReturn': 'Bot Return',
    'transactions.botProfit': 'Bot Profit',
    'transactions.referralCommission': 'Referral Commission',
    'transactions.pending': 'Pending',
    'transactions.completed': 'Completed',
    'transactions.failed': 'Failed',
    
    // Реферальная система
    'referrals.title': 'Referral Program',
    'referrals.description': 'Invite friends and earn commission from their bot profits',
    'referrals.yourLink': 'Your Referral Link',
    'referrals.copy': 'Copy',
    'referrals.copied': 'Copied!',
    'referrals.yourStats': 'Your Referral Stats',
    'referrals.totalReferrals': 'Total Referrals',
    'referrals.activeReferrals': 'Active Referrals',
    'referrals.totalEarnings': 'Total Earnings',
    'referrals.commissionRates': 'Commission Rates',
    'referrals.level.bronze': 'Bronze Level',
    'referrals.level.silver': 'Silver Level',
    'referrals.level.gold': 'Gold Level',
    'referrals.rate.bronze': '1% of bot profits',
    'referrals.rate.silver': '2% of bot profits',
    'referrals.rate.gold': '5% of bot profits',
    'referrals.upgrade.bronze': 'Refer 5 users to upgrade to Silver',
    'referrals.upgrade.silver': 'Refer 20 users to upgrade to Gold',
    'referrals.yourReferrals': 'Your Referrals',
    'referrals.user': 'User',
    'referrals.joinDate': 'Join Date',
    'referrals.earnings': 'Earnings',
    
    // Поддержка
    'support.title': 'Support',
    'support.newTicket': 'New Ticket',
    'support.myTickets': 'My Tickets',
    'support.subject': 'Subject',
    'support.message': 'Message',
    'support.submit': 'Submit',
    'support.status': 'Status',
    'support.createDate': 'Created',
    'support.lastUpdate': 'Last Update',
    'support.open': 'Open',
    'support.closed': 'Closed',
    'support.replyToTicket': 'Reply to Ticket',
    'support.closeTicket': 'Close Ticket',
    'support.reopenTicket': 'Reopen Ticket',
    
    // Профиль
    'profile.title': 'Profile',
    'profile.personalInfo': 'Personal Information',
    'profile.email': 'Email',
    'profile.name': 'Name',
    'profile.joinDate': 'Join Date',
    'profile.kycLevel': 'KYC Level',
    'profile.changePassword': 'Change Password',
    'profile.currentPassword': 'Current Password',
    'profile.newPassword': 'New Password',
    'profile.confirmNewPassword': 'Confirm New Password',
    'profile.update': 'Update',
    'profile.language': 'Language',
    'profile.twoFactorAuth': 'Two-Factor Authentication',
    'profile.enable2FA': 'Enable 2FA',
    'profile.disable2FA': 'Disable 2FA',
    
    // Админка
    'admin.dashboard': 'Admin Dashboard',
    'admin.users': 'Users',
    'admin.kyc': 'KYC Verification',
    'admin.bots': 'Bots Management',
    'admin.settings': 'Platform Settings',
    'admin.logs': 'System Logs',
    
    // Уведомления
    'notifications.all': 'All Notifications',
    'notifications.mark': 'Mark all as read',
    'notifications.empty': 'No notifications',
    
    // Ошибки
    'error.login': 'Invalid email or password',
    'error.register': 'Registration failed',
    'error.passwordMatch': 'Passwords do not match',
    'error.invalidEmail': 'Invalid email address',
    'error.requiredField': 'This field is required',
    'error.minLength': 'Must be at least {{length}} characters',
    'error.insufficientBalance': 'Insufficient balance',
    'error.invalidAddress': 'Invalid address',
    'error.kycRequired': 'KYC verification required',
    'error.generalError': 'Something went wrong. Please try again.',
    
    // Подтверждения
    'confirm.withdraw': 'Are you sure you want to withdraw {{amount}} {{currency}}?',
    'confirm.launchBot': 'Are you sure you want to launch this bot with {{amount}} {{currency}}?',
    'confirm.stopBot': 'Are you sure you want to stop this bot? Your investment and profits will be returned to your wallet.',
    
    // Успех
    'success.withdraw': 'Withdrawal submitted successfully',
    'success.deposit': 'Deposit detected successfully',
    'success.kycSubmitted': 'KYC documents submitted successfully',
    'success.botLaunched': 'Bot launched successfully',
    'success.botStopped': 'Bot stopped successfully',
    'success.passwordChanged': 'Password changed successfully',
    'success.profileUpdated': 'Profile updated successfully',
    
    // Языки
    'language.en': 'English',
    'language.ru': 'Russian',
  },
  
  'ru': {
    // Общие
    'app.name': 'КриптоТрейдер Про',
    'app.tagline': 'Профессиональные торговые боты для крипторынков',
    
    // Навигация
    'nav.dashboard': 'Дашборд',
    'nav.bots': 'Торговые боты',
    'nav.wallet': 'Кошелек',
    'nav.transactions': 'Транзакции',
    'nav.referrals': 'Рефералы',
    'nav.kyc': 'KYC Верификация',
    'nav.support': 'Поддержка',
    'nav.profile': 'Профиль',
    'nav.logout': 'Выход',
    'nav.admin': 'Админ панель',
    
    // Авторизация
    'auth.login': 'Вход',
    'auth.register': 'Регистрация',
    'auth.email': 'Email',
    'auth.password': 'Пароль',
    'auth.confirmPassword': 'Подтвердите пароль',
    'auth.forgotPassword': 'Забыли пароль?',
    'auth.noAccount': 'Нет аккаунта?',
    'auth.hasAccount': 'Уже есть аккаунт?',
    'auth.loginSuccess': 'Вход выполнен успешно',
    'auth.registerSuccess': 'Регистрация выполнена успешно',
    'auth.logoutSuccess': 'Выход выполнен успешно',
    
    // Дашборд
    'dashboard.welcome': 'Добро пожаловать',
    'dashboard.totalBalance': 'Общий баланс',
    'dashboard.activeReferrals': 'Активные рефералы',
    'dashboard.availableBots': 'Доступные боты',
    'dashboard.activeBots': 'Активные боты',
    'dashboard.recentTransactions': 'Последние транзакции',
    'dashboard.notifications': 'Уведомления',
    
    // Боты
    'bots.available': 'Доступные боты',
    'bots.myBots': 'Мои боты',
    'bots.active': 'Активен',
    'bots.inactive': 'Неактивен',
    'bots.launch': 'Запустить бота',
    'bots.profit': 'Средняя прибыль',
    'bots.riskLevel': 'Уровень риска',
    'bots.investment': 'Инвестиция',
    'bots.launch.modal.title': 'Запуск бота',
    'bots.launch.modal.description': 'Введите сумму, которую вы хотите инвестировать в этого бота',
    'bots.launch.modal.investment': 'Инвестиция',
    'bots.launch.modal.currency': 'Валюта',
    'bots.launch.modal.cancel': 'Отмена',
    'bots.launch.modal.launch': 'Запустить',
    
    // KYC
    'kyc.title': 'KYC Верификация',
    'kyc.subtitle': 'Завершите верификацию, чтобы разблокировать полный доступ к платформе',
    'kyc.status': 'Статус верификации',
    'kyc.currentLevel': 'Ваш текущий уровень верификации',
    'kyc.level1': 'Базовая верификация',
    'kyc.level2': 'Расширенная верификация',
    'kyc.level3': 'Расширенная+ верификация',
    'kyc.status.approved': 'Одобрено',
    'kyc.status.pending': 'На рассмотрении',
    'kyc.status.rejected': 'Отклонено',
    'kyc.status.notStarted': 'Не начато',
    'kyc.status.locked': 'Заблокировано',
    'kyc.basicLimits': 'Лимиты: Депозит до $10,000, вывод до $5,000',
    'kyc.advancedLimits': 'Лимиты: Депозит до $100,000, вывод до $50,000',
    'kyc.unlimitedLimits': 'Лимиты: Неограниченные депозиты и выводы',
    'kyc.rejected.title': 'Верификация отклонена',
    'kyc.inProgress.title': 'Верификация в процессе',
    'kyc.inProgress.description': 'Ваша верификация Уровня 1 в настоящее время обрабатывается. Обычно это занимает 1-2 рабочих дня.',
    'kyc.form.level1.title': 'Базовая верификация (Уровень 1)',
    'kyc.form.level1.description': 'Пожалуйста, предоставьте вашу личную информацию и загрузите документы, удостоверяющие личность',
    'kyc.form.level2.title': 'Расширенная верификация (Уровень 2)',
    'kyc.form.level2.description': 'Пожалуйста, загрузите дополнительные документы для расширенной верификации',
    'kyc.form.fullName': 'Полное имя',
    'kyc.form.fullName.description': 'Введите ваше полное имя, как оно указано в вашем удостоверении личности',
    'kyc.form.country': 'Страна проживания',
    'kyc.form.dateOfBirth': 'Дата рождения',
    'kyc.form.dateOfBirth.description': 'Вам должно быть не менее 18 лет',
    'kyc.form.idDocument': 'Документ, удостоверяющий личность',
    'kyc.form.idDocument.description': 'Загрузите фото вашего паспорта, водительского удостоверения или национального удостоверения личности',
    'kyc.form.selfieWithId': 'Селфи с документом',
    'kyc.form.selfieWithId.description': 'Загрузите селфи себя, держащего документ, удостоверяющий личность',
    'kyc.form.addressProof': 'Подтверждение адреса',
    'kyc.form.addressProof.description': 'Загрузите счет за коммунальные услуги, выписку из банка или другой документ, показывающий ваш адрес (не старше 3 месяцев)',
    'kyc.form.videoVerification': 'Видео верификация',
    'kyc.form.videoVerification.description': 'Запишите короткое видео себя, говорящего "Я [ваше полное имя] и я верифицирую свой аккаунт на КриптоТрейдер Про" и сегодняшнюю дату',
    'kyc.form.submit': 'Отправить на верификацию',
    
    // Кошелек
    'wallet.title': 'Кошелек',
    'wallet.balance': 'Баланс',
    'wallet.deposit': 'Пополнить',
    'wallet.withdraw': 'Вывести',
    'wallet.depositAddress': 'Адрес для пополнения',
    'wallet.depositInstructions': 'Отправляйте только {{currency}} на этот адрес. Отправка любой другой валюты может привести к необратимой потере средств.',
    'wallet.withdrawAmount': 'Сумма вывода',
    'wallet.withdrawAddress': 'Адрес для вывода',
    'wallet.fee': 'Комиссия',
    'wallet.total': 'Итого',
    'wallet.confirmWithdrawal': 'Подтвердить вывод',
    
    // Транзакции
    'transactions.title': 'Транзакции',
    'transactions.empty': 'Транзакции не найдены',
    'transactions.type': 'Тип',
    'transactions.amount': 'Сумма',
    'transactions.status': 'Статус',
    'transactions.date': 'Дата',
    'transactions.txHash': 'Хэш транзакции',
    'transactions.deposit': 'Пополнение',
    'transactions.withdrawal': 'Вывод',
    'transactions.botInvestment': 'Инвестиция в бота',
    'transactions.botReturn': 'Возврат от бота',
    'transactions.botProfit': 'Прибыль от бота',
    'transactions.referralCommission': 'Реферальная комиссия',
    'transactions.pending': 'В обработке',
    'transactions.completed': 'Завершена',
    'transactions.failed': 'Не удалась',
    
    // Реферальная система
    'referrals.title': 'Реферальная программа',
    'referrals.description': 'Приглашайте друзей и зарабатывайте комиссию с их прибыли от ботов',
    'referrals.yourLink': 'Ваша реферальная ссылка',
    'referrals.copy': 'Копировать',
    'referrals.copied': 'Скопировано!',
    'referrals.yourStats': 'Ваша реферальная статистика',
    'referrals.totalReferrals': 'Всего рефералов',
    'referrals.activeReferrals': 'Активных рефералов',
    'referrals.totalEarnings': 'Всего заработано',
    'referrals.commissionRates': 'Ставки комиссии',
    'referrals.level.bronze': 'Бронзовый уровень',
    'referrals.level.silver': 'Серебряный уровень',
    'referrals.level.gold': 'Золотой уровень',
    'referrals.rate.bronze': '1% от прибыли ботов',
    'referrals.rate.silver': '2% от прибыли ботов',
    'referrals.rate.gold': '5% от прибыли ботов',
    'referrals.upgrade.bronze': 'Пригласите 5 пользователей для повышения до Серебряного',
    'referrals.upgrade.silver': 'Пригласите 20 пользователей для повышения до Золотого',
    'referrals.yourReferrals': 'Ваши рефералы',
    'referrals.user': 'Пользователь',
    'referrals.joinDate': 'Дата регистрации',
    'referrals.earnings': 'Заработок',
    
    // Поддержка
    'support.title': 'Поддержка',
    'support.newTicket': 'Новый тикет',
    'support.myTickets': 'Мои тикеты',
    'support.subject': 'Тема',
    'support.message': 'Сообщение',
    'support.submit': 'Отправить',
    'support.status': 'Статус',
    'support.createDate': 'Создан',
    'support.lastUpdate': 'Последнее обновление',
    'support.open': 'Открыт',
    'support.closed': 'Закрыт',
    'support.replyToTicket': 'Ответить на тикет',
    'support.closeTicket': 'Закрыть тикет',
    'support.reopenTicket': 'Переоткрыть тикет',
    
    // Профиль
    'profile.title': 'Профиль',
    'profile.personalInfo': 'Личная информация',
    'profile.email': 'Email',
    'profile.name': 'Имя',
    'profile.joinDate': 'Дата регистрации',
    'profile.kycLevel': 'Уровень KYC',
    'profile.changePassword': 'Изменить пароль',
    'profile.currentPassword': 'Текущий пароль',
    'profile.newPassword': 'Новый пароль',
    'profile.confirmNewPassword': 'Подтвердите новый пароль',
    'profile.update': 'Обновить',
    'profile.language': 'Язык',
    'profile.twoFactorAuth': 'Двухфакторная аутентификация',
    'profile.enable2FA': 'Включить 2FA',
    'profile.disable2FA': 'Отключить 2FA',
    
    // Админка
    'admin.dashboard': 'Админ панель',
    'admin.users': 'Пользователи',
    'admin.kyc': 'KYC верификация',
    'admin.bots': 'Управление ботами',
    'admin.settings': 'Настройки платформы',
    'admin.logs': 'Системные логи',
    
    // Уведомления
    'notifications.all': 'Все уведомления',
    'notifications.mark': 'Отметить все как прочитанные',
    'notifications.empty': 'Нет уведомлений',
    
    // Ошибки
    'error.login': 'Неверный email или пароль',
    'error.register': 'Ошибка регистрации',
    'error.passwordMatch': 'Пароли не совпадают',
    'error.invalidEmail': 'Неверный адрес электронной почты',
    'error.requiredField': 'Это поле обязательно для заполнения',
    'error.minLength': 'Должно быть не менее {{length}} символов',
    'error.insufficientBalance': 'Недостаточный баланс',
    'error.invalidAddress': 'Неверный адрес',
    'error.kycRequired': 'Требуется KYC верификация',
    'error.generalError': 'Что-то пошло не так. Пожалуйста, попробуйте еще раз.',
    
    // Подтверждения
    'confirm.withdraw': 'Вы уверены, что хотите вывести {{amount}} {{currency}}?',
    'confirm.launchBot': 'Вы уверены, что хотите запустить этого бота с {{amount}} {{currency}}?',
    'confirm.stopBot': 'Вы уверены, что хотите остановить этого бота? Ваша инвестиция и прибыль будут возвращены на ваш кошелек.',
    
    // Успех
    'success.withdraw': 'Запрос на вывод средств успешно отправлен',
    'success.deposit': 'Депозит успешно обнаружен',
    'success.kycSubmitted': 'Документы KYC успешно отправлены',
    'success.botLaunched': 'Бот успешно запущен',
    'success.botStopped': 'Бот успешно остановлен',
    'success.passwordChanged': 'Пароль успешно изменен',
    'success.profileUpdated': 'Профиль успешно обновлен',
    
    // Языки
    'language.en': 'Английский',
    'language.ru': 'Русский',
  }
};

// Компонент для перевода текста
export function T({ 
  keyName, 
  params 
}: { 
  keyName: string; 
  params?: Record<string, string | number> 
}) {
  const { language } = useLanguage();
  const translation = translations[language][keyName] || translations['en'][keyName] || keyName;
  
  if (params) {
    // Заменяем параметры в строке формата: "Hello, {{name}}!"
    return Object.entries(params).reduce((acc, [paramKey, paramValue]) => {
      return acc.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(paramValue));
    }, translation);
  }
  
  return translation;
}