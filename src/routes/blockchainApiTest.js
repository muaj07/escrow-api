const express = require('express');
const router = express.Router();
const { getEscrowData, getDealById } = require('../config/escrowContract');

/**
 * @route    GET /api/blockchainApiTest
 * @desc     Fetch Escrow contract data from BSC Testnet - demonstrates blockchain interaction
 * @author   Assessment Candidate
 * @access   Public
 * @returns  {JSON} Comprehensive contract data including owner, deal count, token info, and wallet balances
 * @throws   {500} Error on blockchain connection failure or contract interaction error
 * 
 * @example
 * // Example request
 * curl http://localhost:3001/api/blockchainApiTest
 * 
 * // Example response
 * {
 *   "success": true,
 *   "message": "Successfully fetched escrow contract data from BSC Testnet",
 *   "data": {
 *     "network": { "name": "BSC Testnet", "chainId": 97 },
 *     "escrowContract": { ... },
 *     "usdtToken": { ... },
 *     "proxyWallet": { ... }
 *   }
 * }
 */
router.get('/', async (req, res, next) => {
  try {
    console.log('\n' + '='.repeat(70));
    console.log('🚀 BLOCKCHAIN API TEST - BSC Testnet Escrow Contract');
    console.log('='.repeat(70));
    console.log(`⏰ Request Time: ${new Date().toLocaleString()}`);
    
    // Fetch data from blockchain
    const data = await getEscrowData();
    
    // Display results in console (required by assessment)
    console.log('\n📋 RESULTS:');
    console.log('─'.repeat(70));
    console.log(`Network:          ${data.network.name} (Chain ID: ${data.network.chainId})`);
    console.log(`Escrow Contract:  ${data.escrowContract.address}`);
    console.log(`Contract Owner:   ${data.escrowContract.owner}`);
    console.log(`Total Deals:      ${data.escrowContract.totalDeals || data.escrowContract.dealCount || 'N/A'}`);
    console.log(`Contract Verified: ${data.escrowContract.verified ? 'Yes' : 'No'}`);
    console.log(`\nUSDT Token:       ${data.usdtToken.address}`);
    console.log(`Token Name:       ${data.usdtToken.name} (${data.usdtToken.symbol})`);
    console.log(`Token Decimals:   ${data.usdtToken.decimals}`);
    console.log(`Escrow Balance:   ${data.usdtToken.escrowBalance} ${data.usdtToken.symbol}`);
    console.log(`\nProxy Wallet:     ${data.proxyWallet.address}`);
    console.log(`Wallet Balance:   ${data.proxyWallet.bnbBalance} BNB`);
    console.log(`\nTimestamp:        ${data.timestamp}`);
    console.log('─'.repeat(70));
    console.log('✅ Data fetch completed successfully!');
    console.log('='.repeat(70) + '\n');

    // Return JSON response
    res.json({
      success: true,
      message: 'Successfully fetched escrow contract data from BSC Testnet',
      data: data,
      metadata: {
        apiVersion: '1.0',
        responseTime: new Date().toISOString(),
        blockchain: 'Binance Smart Chain Testnet',
        provider: 'Alchemy'
      }
    });
    
  } catch (err) {
    console.error('\n❌ ERROR in blockchainApiTest:');
    console.error('─'.repeat(70));
    console.error(`Message: ${err.message}`);
    console.error(`Stack: ${err.stack}`);
    console.error('='.repeat(70) + '\n');
    
    // Pass error to Express error handler
    next(err);
  }
});

/**
 * @route    GET /api/blockchainApiTest/deal/:dealId
 * @desc     Fetch specific deal details by ID (if supported by contract)
 * @author   Assessment Candidate
 * @access   Public
 * @param    {number} dealId - The deal ID to fetch
 * @returns  {JSON} Deal details including buyer, seller, amount, status
 * 
 * @example
 * curl http://localhost:3001/api/blockchainApiTest/deal/1
 */
router.get('/deal/:dealId', async (req, res, next) => {
  try {
    const dealId = parseInt(req.params.dealId);
    
    if (isNaN(dealId) || dealId < 0) {
      const err = new Error('Invalid deal ID');
      err.status = 400;
      throw err;
    }
    
    console.log(`\n🔍 Fetching Deal ID: ${dealId}...`);
    const deal = await getDealById(dealId);
    
    console.log(`✅ Deal ${dealId} fetched successfully`);
    console.log(`   Buyer: ${deal.buyer}`);
    console.log(`   Seller: ${deal.seller}`);
    console.log(`   Amount: ${deal.amount}`);
    console.log(`   Status: ${deal.status}\n`);
    
    res.json({
      success: true,
      dealId: dealId,
      deal: deal
    });
    
  } catch (err) {
    console.error(`❌ Error fetching deal: ${err.message}\n`);
    next(err);
  }
});

module.exports = router;
