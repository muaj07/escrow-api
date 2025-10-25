const { ethers } = require('ethers');
require('dotenv').config();

// Initialize provider and wallet
const provider = new ethers.JsonRpcProvider(process.env.BSC_TESTNET_RPC);
const wallet = new ethers.Wallet(process.env.GAS_FEE_PROVIDER_KEY, provider);

/**
 * Common Escrow Contract ABI
 * Using human-readable format for flexibility
 * These are common functions found in most Escrow contracts
 */
const ESCROW_ABI = [
  // Owner function - most contracts have this
  "function owner() view returns (address)",
  
  // Common Escrow functions
  "function totalDeals() view returns (uint256)",
  "function dealCount() view returns (uint256)",
  "function getDeal(uint256 dealId) view returns (address buyer, address seller, uint256 amount, uint8 status)",
  
  // ERC20-like functions for token balance
  "function balanceOf(address account) view returns (uint256)"
];

/**
 * ERC20 ABI for USDT token interactions
 */
const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)"
];

// Initialize contract instances
const escrowContract = new ethers.Contract(
  process.env.ESCROW_CONTRACT_ADDRESS,
  ESCROW_ABI,
  provider
);

const usdtContract = new ethers.Contract(
  process.env.USDT_TOKEN_ADDRESS,
  ERC20_ABI,
  provider
);

/**
 * Fetch comprehensive Escrow contract data
 * Gracefully handles errors for functions that may not exist
 * 
 * @returns {Object} Contract data including owner, deals, balances, and wallet info
 */
async function getEscrowData() {
  try {
    console.log('\n🔍 Connecting to BSC Testnet...');
    
    // Get network information
    const network = await provider.getNetwork();
    console.log(`✅ Connected to Chain ID: ${network.chainId}`);
    
    // Get proxy wallet info
    const walletAddress = wallet.address;
    const walletBalance = await provider.getBalance(walletAddress);
    console.log(`📍 Proxy Wallet: ${walletAddress}`);
    console.log(`💰 Proxy Balance: ${ethers.formatEther(walletBalance)} BNB`);
    
    // Initialize result object
    const result = {
      network: {
        name: 'BSC Testnet',
        chainId: Number(network.chainId),
      },
      escrowContract: {
        address: process.env.ESCROW_CONTRACT_ADDRESS,
        owner: null,
        totalDeals: null,
        dealCount: null
      },
      usdtToken: {
        address: process.env.USDT_TOKEN_ADDRESS,
        name: null,
        symbol: null,
        decimals: null,
        escrowBalance: null
      },
      proxyWallet: {
        address: walletAddress,
        bnbBalance: ethers.formatEther(walletBalance)
      },
      timestamp: new Date().toISOString()
    };
    
    // Try to get contract owner
    try {
      const owner = await escrowContract.owner();
      result.escrowContract.owner = owner;
      console.log(`👤 Contract Owner: ${owner}`);
    } catch (error) {
      console.log('⚠️  owner() function not available on this contract');
      result.escrowContract.owner = 'N/A';
    }
    
    // Try to get total deals (try both common function names)
    try {
      const totalDeals = await escrowContract.totalDeals();
      result.escrowContract.totalDeals = totalDeals.toString();
      console.log(`📊 Total Deals: ${totalDeals}`);
    } catch (error) {
      try {
        const dealCount = await escrowContract.dealCount();
        result.escrowContract.dealCount = dealCount.toString();
        console.log(`📊 Deal Count: ${dealCount}`);
      } catch (innerError) {
        console.log('⚠️  Deal counting functions not available');
        result.escrowContract.totalDeals = 'N/A';
      }
    }
    
    // Get USDT token information
    try {
      const [name, symbol, decimals] = await Promise.all([
        usdtContract.name(),
        usdtContract.symbol(),
        usdtContract.decimals()
      ]);
      
      result.usdtToken.name = name;
      result.usdtToken.symbol = symbol;
      result.usdtToken.decimals = Number(decimals);
      
      console.log(`🪙  Token: ${name} (${symbol})`);
      console.log(`🔢 Decimals: ${decimals}`);
      
      // Get USDT balance of escrow contract
      const escrowUsdtBalance = await usdtContract.balanceOf(process.env.ESCROW_CONTRACT_ADDRESS);
      result.usdtToken.escrowBalance = ethers.formatUnits(escrowUsdtBalance, decimals);
      console.log(`💵 Escrow USDT Balance: ${result.usdtToken.escrowBalance} ${symbol}`);
      
    } catch (error) {
      console.log('⚠️  Error fetching USDT token data:', error.message);
      result.usdtToken.name = 'USDT';
      result.usdtToken.symbol = 'USDT';
      result.usdtToken.decimals = 18;
    }
    
    // Get contract code to verify it exists
    const code = await provider.getCode(process.env.ESCROW_CONTRACT_ADDRESS);
    result.escrowContract.verified = code !== '0x';
    console.log(`${result.escrowContract.verified ? '✅' : '❌'} Contract verified on blockchain`);
    
    return result;
    
  } catch (error) {
    console.error('❌ Error fetching escrow data:', error);
    throw new Error(`Blockchain interaction failed: ${error.message}`);
  }
}

/**
 * Get a specific deal by ID (if function exists)
 * 
 * @param {number} dealId - The deal ID to fetch
 * @returns {Object} Deal details
 */
async function getDealById(dealId) {
  try {
    const deal = await escrowContract.getDeal(dealId);
    return {
      buyer: deal.buyer || deal[0],
      seller: deal.seller || deal[1],
      amount: deal.amount ? deal.amount.toString() : deal[2].toString(),
      status: deal.status || deal[3]
    };
  } catch (error) {
    throw new Error(`getDeal function not available or deal ${dealId} not found`);
  }
}

module.exports = {
  getEscrowData,
  getDealById,
  escrowContract,
  usdtContract,
  provider,
  wallet
};
