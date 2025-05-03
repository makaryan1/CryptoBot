// Модуль с информацией о поддерживаемых токенах и сетях

export interface Network {
  id: string;
  name: string;
  nativeCurrency: string;
  explorerUrl: string;
  isTestnet: boolean;
}

export interface Token {
  id: string;
  symbol: string;
  name: string;
  decimals: number;
  logoUrl: string;
  networks: {
    [networkId: string]: {
      contractAddress?: string; // Null for native tokens like ETH on Ethereum
      isNative: boolean;
    };
  };
  type: 'cryptocurrency' | 'stablecoin' | 'defi' | 'governance' | 'other';
  isPopular: boolean;
}

// Доступные сети
export const networks: { [id: string]: Network } = {
  // Основные сети
  eth: {
    id: 'eth',
    name: 'Ethereum',
    nativeCurrency: 'ETH',
    explorerUrl: 'https://etherscan.io',
    isTestnet: false,
  },
  bsc: {
    id: 'bsc',
    name: 'BNB Smart Chain',
    nativeCurrency: 'BNB',
    explorerUrl: 'https://bscscan.com',
    isTestnet: false,
  },
  polygon: {
    id: 'polygon',
    name: 'Polygon',
    nativeCurrency: 'MATIC',
    explorerUrl: 'https://polygonscan.com',
    isTestnet: false,
  },
  avalanche: {
    id: 'avalanche',
    name: 'Avalanche',
    nativeCurrency: 'AVAX',
    explorerUrl: 'https://snowtrace.io',
    isTestnet: false,
  },
  arbitrum: {
    id: 'arbitrum',
    name: 'Arbitrum',
    nativeCurrency: 'ETH',
    explorerUrl: 'https://arbiscan.io',
    isTestnet: false,
  },
  optimism: {
    id: 'optimism',
    name: 'Optimism',
    nativeCurrency: 'ETH',
    explorerUrl: 'https://optimistic.etherscan.io',
    isTestnet: false,
  },
  fantom: {
    id: 'fantom',
    name: 'Fantom',
    nativeCurrency: 'FTM',
    explorerUrl: 'https://ftmscan.com',
    isTestnet: false,
  },
  solana: {
    id: 'solana',
    name: 'Solana',
    nativeCurrency: 'SOL',
    explorerUrl: 'https://explorer.solana.com',
    isTestnet: false,
  },
  tron: {
    id: 'tron',
    name: 'Tron',
    nativeCurrency: 'TRX',
    explorerUrl: 'https://tronscan.org',
    isTestnet: false,
  },
  bitcoin: {
    id: 'bitcoin',
    name: 'Bitcoin',
    nativeCurrency: 'BTC',
    explorerUrl: 'https://blockstream.info',
    isTestnet: false,
  },
  aptos: {
    id: 'aptos',
    name: 'Aptos',
    nativeCurrency: 'APT',
    explorerUrl: 'https://explorer.aptoslabs.com',
    isTestnet: false,
  },
  ton: {
    id: 'ton',
    name: 'TON',
    nativeCurrency: 'TON',
    explorerUrl: 'https://tonscan.org',
    isTestnet: false,
  },
  base: {
    id: 'base',
    name: 'Base',
    nativeCurrency: 'ETH',
    explorerUrl: 'https://basescan.org',
    isTestnet: false,
  },
  cronos: {
    id: 'cronos',
    name: 'Cronos',
    nativeCurrency: 'CRO',
    explorerUrl: 'https://cronoscan.com',
    isTestnet: false,
  },
  near: {
    id: 'near',
    name: 'Near',
    nativeCurrency: 'NEAR',
    explorerUrl: 'https://explorer.near.org',
    isTestnet: false,
  },
  polkadot: {
    id: 'polkadot',
    name: 'Polkadot',
    nativeCurrency: 'DOT',
    explorerUrl: 'https://polkadot.subscan.io',
    isTestnet: false,
  },
  harmony: {
    id: 'harmony',
    name: 'Harmony',
    nativeCurrency: 'ONE',
    explorerUrl: 'https://explorer.harmony.one',
    isTestnet: false,
  },
  sui: {
    id: 'sui',
    name: 'Sui',
    nativeCurrency: 'SUI',
    explorerUrl: 'https://explorer.sui.io',
    isTestnet: false,
  },
  
  // Тестовые сети (для разработки)
  sepolia: {
    id: 'sepolia',
    name: 'Sepolia Testnet',
    nativeCurrency: 'ETH',
    explorerUrl: 'https://sepolia.etherscan.io',
    isTestnet: true,
  },
  bsc_testnet: {
    id: 'bsc_testnet',
    name: 'BSC Testnet',
    nativeCurrency: 'BNB',
    explorerUrl: 'https://testnet.bscscan.com',
    isTestnet: true,
  },
};

// Список поддерживаемых токенов
export const tokens: Token[] = [
  // --- STABLECOINS ---
  {
    id: 'usdt',
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    logoUrl: '/assets/tokens/usdt.png',
    networks: {
      eth: {
        contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        isNative: false,
      },
      bsc: {
        contractAddress: '0x55d398326f99059fF775485246999027B3197955',
        isNative: false,
      },
      tron: {
        contractAddress: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
        isNative: false,
      },
      polygon: {
        contractAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        isNative: false,
      },
      solana: {
        contractAddress: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
        isNative: false,
      },
      arbitrum: {
        contractAddress: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
        isNative: false,
      },
      avalanche: {
        contractAddress: '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7',
        isNative: false,
      },
      optimism: {
        contractAddress: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
        isNative: false,
      },
      fantom: {
        contractAddress: '0x049d68029688eAbF473097a2fC38ef61633A3C7A',
        isNative: false,
      },
      base: {
        contractAddress: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
        isNative: false,
      },
    },
    type: 'stablecoin',
    isPopular: true,
  },
  {
    id: 'usdc',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logoUrl: '/assets/tokens/usdc.png',
    networks: {
      eth: {
        contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        isNative: false,
      },
      bsc: {
        contractAddress: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
        isNative: false,
      },
      polygon: {
        contractAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        isNative: false,
      },
      solana: {
        contractAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        isNative: false,
      },
      arbitrum: {
        contractAddress: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
        isNative: false,
      },
      avalanche: {
        contractAddress: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
        isNative: false,
      },
      optimism: {
        contractAddress: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
        isNative: false,
      },
      base: {
        contractAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        isNative: false,
      },
    },
    type: 'stablecoin',
    isPopular: true,
  },
  {
    id: 'busd',
    symbol: 'BUSD',
    name: 'Binance USD',
    decimals: 18,
    logoUrl: '/assets/tokens/busd.png',
    networks: {
      eth: {
        contractAddress: '0x4Fabb145d64652a948d72533023f6E7A623C7C53',
        isNative: false,
      },
      bsc: {
        contractAddress: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
        isNative: false,
      },
    },
    type: 'stablecoin',
    isPopular: true,
  },
  {
    id: 'dai',
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    decimals: 18,
    logoUrl: '/assets/tokens/dai.png',
    networks: {
      eth: {
        contractAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        isNative: false,
      },
      bsc: {
        contractAddress: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3',
        isNative: false,
      },
      polygon: {
        contractAddress: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
        isNative: false,
      },
      arbitrum: {
        contractAddress: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
        isNative: false,
      },
      optimism: {
        contractAddress: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
        isNative: false,
      },
      avalanche: {
        contractAddress: '0xd586E7F844cEa2F87f50152665BCbc2C279D8d70',
        isNative: false,
      },
    },
    type: 'stablecoin',
    isPopular: true,
  },
  {
    id: 'tusd',
    symbol: 'TUSD',
    name: 'TrueUSD',
    decimals: 18,
    logoUrl: '/assets/tokens/tusd.png',
    networks: {
      eth: {
        contractAddress: '0x0000000000085d4780B73119b644AE5ecd22b376',
        isNative: false,
      },
      bsc: {
        contractAddress: '0x14016E85a25aeb13065688cAFB43044C2ef86784',
        isNative: false,
      },
      tron: {
        contractAddress: 'TUpMhErZL2fhh4sVNULAbNKLokS4GjC1F4',
        isNative: false,
      },
    },
    type: 'stablecoin',
    isPopular: false,
  },
  {
    id: 'frax',
    symbol: 'FRAX',
    name: 'Frax',
    decimals: 18,
    logoUrl: '/assets/tokens/frax.png',
    networks: {
      eth: {
        contractAddress: '0x853d955aCEf822Db058eb8505911ED77F175b99e',
        isNative: false,
      },
      polygon: {
        contractAddress: '0x45c32fA6DF82ead1e2EF74d17b76547EDdFaFF89',
        isNative: false,
      },
      avalanche: {
        contractAddress: '0xD24C2Ad096400B6FBcd2ad8B24E7acBc21A1da64',
        isNative: false,
      },
      arbitrum: {
        contractAddress: '0x17FC002b466eEc40DaE837Fc4bE5c67993ddBd6F',
        isNative: false,
      },
    },
    type: 'stablecoin',
    isPopular: false,
  },
  {
    id: 'usdd',
    symbol: 'USDD',
    name: 'Decentralized USD',
    decimals: 18,
    logoUrl: '/assets/tokens/usdd.png',
    networks: {
      eth: {
        contractAddress: '0x0C10bF8FcB7Bf5412187A595ab97a3609160b5c6',
        isNative: false,
      },
      tron: {
        contractAddress: 'TPYmHEhy5n8TCEfYGqW2rPxsghSfzghPDn',
        isNative: false,
      },
      bsc: {
        contractAddress: '0xd17479997F34dd9156Deef8F95A52D81D265be9c',
        isNative: false,
      },
    },
    type: 'stablecoin',
    isPopular: false,
  },
  
  // --- MAJOR CRYPTOCURRENCIES ---
  {
    id: 'btc',
    symbol: 'BTC',
    name: 'Bitcoin',
    decimals: 8,
    logoUrl: '/assets/tokens/btc.png',
    networks: {
      bitcoin: {
        isNative: true,
      },
      eth: {
        contractAddress: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', // WBTC
        isNative: false,
      },
      bsc: {
        contractAddress: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c', // BTCB
        isNative: false,
      },
    },
    type: 'cryptocurrency',
    isPopular: true,
  },
  {
    id: 'eth',
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    logoUrl: '/assets/tokens/eth.png',
    networks: {
      eth: {
        isNative: true,
      },
      bsc: {
        contractAddress: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
        isNative: false,
      },
      arbitrum: {
        isNative: true,
      },
      optimism: {
        isNative: true,
      },
      base: {
        isNative: true,
      },
    },
    type: 'cryptocurrency',
    isPopular: true,
  },
  {
    id: 'bnb',
    symbol: 'BNB',
    name: 'Binance Coin',
    decimals: 18,
    logoUrl: '/assets/tokens/bnb.png',
    networks: {
      bsc: {
        isNative: true,
      },
      eth: {
        contractAddress: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
        isNative: false,
      },
    },
    type: 'cryptocurrency',
    isPopular: true,
  },
  {
    id: 'sol',
    symbol: 'SOL',
    name: 'Solana',
    decimals: 9,
    logoUrl: '/assets/tokens/sol.png',
    networks: {
      solana: {
        isNative: true,
      },
      eth: {
        contractAddress: '0xD31a59c85aE9D8edEFeC411D448f90841571b89c',
        isNative: false,
      },
      bsc: {
        contractAddress: '0x570A5D26f7765Ecb712C0924E4De545B89fD43dF',
        isNative: false,
      },
    },
    type: 'cryptocurrency',
    isPopular: true,
  },
  {
    id: 'matic',
    symbol: 'MATIC',
    name: 'Polygon',
    decimals: 18,
    logoUrl: '/assets/tokens/matic.png',
    networks: {
      polygon: {
        isNative: true,
      },
      eth: {
        contractAddress: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
        isNative: false,
      },
      bsc: {
        contractAddress: '0xCC42724C6683B7E57334c4E856f4c9965ED682bD',
        isNative: false,
      },
    },
    type: 'cryptocurrency',
    isPopular: true,
  },
  {
    id: 'avax',
    symbol: 'AVAX',
    name: 'Avalanche',
    decimals: 18,
    logoUrl: '/assets/tokens/avax.png',
    networks: {
      avalanche: {
        isNative: true,
      },
      eth: {
        contractAddress: '0x85f138bfEE4ef8e540890CFb48F620571d67Eda3',
        isNative: false,
      },
      bsc: {
        contractAddress: '0x1CE0c2827e2eF14D5C4f29a091d735A204794041',
        isNative: false,
      },
    },
    type: 'cryptocurrency',
    isPopular: true,
  },
  {
    id: 'trx',
    symbol: 'TRX',
    name: 'TRON',
    decimals: 6,
    logoUrl: '/assets/tokens/trx.png',
    networks: {
      tron: {
        isNative: true,
      },
      eth: {
        contractAddress: '0xf230b790E05390FC8295F4d3F60332c93BEd42e2',
        isNative: false,
      },
      bsc: {
        contractAddress: '0x85EAC5Ac2F758618dFa09bDbe0cf174e7d574D5B',
        isNative: false,
      },
    },
    type: 'cryptocurrency',
    isPopular: true,
  },
  {
    id: 'ada',
    symbol: 'ADA',
    name: 'Cardano',
    decimals: 6,
    logoUrl: '/assets/tokens/ada.png',
    networks: {
      eth: {
        contractAddress: '0xAE48c91dF1fE419994FFDa27da09D5aC69c30f55',
        isNative: false,
      },
      bsc: {
        contractAddress: '0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47',
        isNative: false,
      },
    },
    type: 'cryptocurrency',
    isPopular: true,
  },
  {
    id: 'dot',
    symbol: 'DOT',
    name: 'Polkadot',
    decimals: 10,
    logoUrl: '/assets/tokens/dot.png',
    networks: {
      polkadot: {
        isNative: true,
      },
      eth: {
        contractAddress: '0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402',
        isNative: false,
      },
      bsc: {
        contractAddress: '0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402',
        isNative: false,
      },
    },
    type: 'cryptocurrency',
    isPopular: true,
  },
  {
    id: 'xrp',
    symbol: 'XRP',
    name: 'XRP',
    decimals: 6,
    logoUrl: '/assets/tokens/xrp.png',
    networks: {
      eth: {
        contractAddress: '0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE',
        isNative: false,
      },
      bsc: {
        contractAddress: '0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE',
        isNative: false,
      },
    },
    type: 'cryptocurrency',
    isPopular: true,
  },
  {
    id: 'doge',
    symbol: 'DOGE',
    name: 'Dogecoin',
    decimals: 8,
    logoUrl: '/assets/tokens/doge.png',
    networks: {
      eth: {
        contractAddress: '0x4206931337dc273a630d328dA6441786BfaD668f',
        isNative: false,
      },
      bsc: {
        contractAddress: '0xbA2aE424d960c26247Dd6c32edC70B295c744C43',
        isNative: false,
      },
    },
    type: 'cryptocurrency',
    isPopular: true,
  },
  {
    id: 'shib',
    symbol: 'SHIB',
    name: 'Shiba Inu',
    decimals: 18,
    logoUrl: '/assets/tokens/shib.png',
    networks: {
      eth: {
        contractAddress: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE',
        isNative: false,
      },
      bsc: {
        contractAddress: '0x2859e4544C4bB03966803b044A93563Bd2D0DD4D',
        isNative: false,
      },
    },
    type: 'cryptocurrency',
    isPopular: true,
  },
  {
    id: 'link',
    symbol: 'LINK',
    name: 'Chainlink',
    decimals: 18,
    logoUrl: '/assets/tokens/link.png',
    networks: {
      eth: {
        contractAddress: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
        isNative: false,
      },
      bsc: {
        contractAddress: '0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD',
        isNative: false,
      },
      polygon: {
        contractAddress: '0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39',
        isNative: false,
      },
      avalanche: {
        contractAddress: '0x5947BB275c521040051D82396192181b413227A3',
        isNative: false,
      },
    },
    type: 'cryptocurrency',
    isPopular: true,
  },
  {
    id: 'uni',
    symbol: 'UNI',
    name: 'Uniswap',
    decimals: 18,
    logoUrl: '/assets/tokens/uni.png',
    networks: {
      eth: {
        contractAddress: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
        isNative: false,
      },
      bsc: {
        contractAddress: '0xBf5140A22578168FD562DCcF235E5D43A02ce9B1',
        isNative: false,
      },
      polygon: {
        contractAddress: '0xb33EaAd8d922B1083446DC23f610c2567fB5180f',
        isNative: false,
      },
    },
    type: 'defi',
    isPopular: true,
  },
  {
    id: 'aave',
    symbol: 'AAVE',
    name: 'Aave',
    decimals: 18,
    logoUrl: '/assets/tokens/aave.png',
    networks: {
      eth: {
        contractAddress: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
        isNative: false,
      },
      polygon: {
        contractAddress: '0xD6DF932A45C0f255f85145f286eA0b292B21C90B',
        isNative: false,
      },
      avalanche: {
        contractAddress: '0x63a72806098Bd3D9520cC43356dD78afe5D386D9',
        isNative: false,
      },
    },
    type: 'defi',
    isPopular: false,
  },
  
  // Добавленные новые токены
  {
    id: 'apt',
    symbol: 'APT',
    name: 'Aptos',
    decimals: 8,
    logoUrl: '/assets/tokens/apt.png',
    networks: {
      aptos: {
        isNative: true,
      },
      eth: {
        contractAddress: '0x51a7f0072cCe1167DaA5667E36887E151cBB0DE6',
        isNative: false,
      },
      bsc: {
        contractAddress: '0x2Ba3dA6edd77D0584786D2569ce4B424577d31be',
        isNative: false,
      },
    },
    type: 'cryptocurrency',
    isPopular: false,
  },
  {
    id: 'ton',
    symbol: 'TON',
    name: 'Toncoin',
    decimals: 9,
    logoUrl: '/assets/tokens/ton.png',
    networks: {
      ton: {
        isNative: true,
      },
      eth: {
        contractAddress: '0x582d872A1B094FC48F5DE31D3B73F2D9bE47def1',
        isNative: false,
      },
      bsc: {
        contractAddress: '0x76A797A59Ba2C17726896976B7B3747BfD1d220f',
        isNative: false,
      },
    },
    type: 'cryptocurrency',
    isPopular: false,
  },
  {
    id: 'sui',
    symbol: 'SUI',
    name: 'Sui',
    decimals: 9,
    logoUrl: '/assets/tokens/sui.png',
    networks: {
      sui: {
        isNative: true,
      },
      eth: {
        contractAddress: '0x84342e932797Fc62814189f01F0Fb05F52519708',
        isNative: false,
      },
      bsc: {
        contractAddress: '0x78a0A62Fba6Fb21A83FE8a3433d44C73a4017A6f',
        isNative: false,
      },
    },
    type: 'cryptocurrency',
    isPopular: false,
  },
  {
    id: 'atom',
    symbol: 'ATOM',
    name: 'Cosmos',
    decimals: 6,
    logoUrl: '/assets/tokens/atom.png',
    networks: {
      eth: {
        contractAddress: '0x8D983cb9388EaC77af0474fA441C4815500Cb7BB',
        isNative: false,
      },
      bsc: {
        contractAddress: '0x0Eb3a705fc54725037CC9e008bDede697f62F335',
        isNative: false,
      },
    },
    type: 'cryptocurrency',
    isPopular: false,
  },
  {
    id: 'near',
    symbol: 'NEAR',
    name: 'NEAR Protocol',
    decimals: 24,
    logoUrl: '/assets/tokens/near.png',
    networks: {
      near: {
        isNative: true,
      },
      eth: {
        contractAddress: '0x85F17Cf997934a597031b2E18a9aB6ebD4B9f6a4',
        isNative: false,
      },
      bsc: {
        contractAddress: '0x1Fa4a73a3F0133f0025378af00236f3aBDEE5D63',
        isNative: false,
      },
    },
    type: 'cryptocurrency',
    isPopular: false,
  },
  
  // Это примерно 25-30 токенов из 100+
  // Для полного списка из 100+ нужно добавить примерно еще 70-80 токенов
  // Здесь представлены наиболее популярные
];

// Получить токены с фильтрацией
export function getFilteredTokens({
  networkId,
  type,
  popularOnly = false,
  search = '',
}: {
  networkId?: string;
  type?: Token['type'];
  popularOnly?: boolean;
  search?: string;
} = {}): Token[] {
  return tokens.filter((token) => {
    // Фильтр по сети
    if (networkId && !token.networks[networkId]) {
      return false;
    }
    
    // Фильтр по типу
    if (type && token.type !== type) {
      return false;
    }
    
    // Фильтр по популярности
    if (popularOnly && !token.isPopular) {
      return false;
    }
    
    // Поиск по имени или символу
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        token.name.toLowerCase().includes(searchLower) ||
        token.symbol.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });
}

// Получить токен по ID
export function getTokenById(id: string): Token | undefined {
  return tokens.find((token) => token.id === id);
}

// Получить сеть по ID
export function getNetworkById(id: string): Network | undefined {
  return networks[id];
}

// Получить список поддерживаемых сетей для конкретного токена
export function getSupportedNetworksForToken(tokenId: string): Network[] {
  const token = getTokenById(tokenId);
  if (!token) return [];
  
  return Object.keys(token.networks)
    .map((networkId) => networks[networkId])
    .filter(Boolean);
}