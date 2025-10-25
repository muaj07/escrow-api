# Blockchain Assessment - BSC Testnet Escrow Integration

## 📝 Project Overview

This Node.js backend application demonstrates blockchain smart contract interaction by connecting to a BSC (Binance Smart Chain) Testnet Escrow contract. The implementation fetches on-chain data including contract ownership, deal counts, USDT token balances, and wallet information through a RESTful API endpoint.

---

## 🎯 Assessment Objectives Completed

✅ **Node.js Backend Development**: Express.js server with proper routing and middleware  
✅ **Blockchain Smart Contract Interaction**: Direct integration with BSC Testnet via ethers.js v6  
✅ **API Endpoint Creation**: New `/api/blockchainApiTest` endpoint that fetches contract data  
✅ **Console Output**: Comprehensive logging of blockchain data as required  
✅ **Error Handling**: Graceful fallbacks for missing contract functions  


---

## 🏗️ Architecture & Implementation

### Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js v4.18.2
- **Blockchain Library**: ethers.js v6 (latest)
- **Network**: Binance Smart Chain Testnet (Chain ID: 97)
- **RPC Provider**: Alchemy
- **Module System**: CommonJS

### Project Structure
```
assessment1/
├── src/
│   ├── index.js                    # Main Express server (updated)
│   ├── routes/
│   │   ├── items.js                # Existing routes
│   │   ├── stats.js                # Existing routes
│   │   └── blockchainApiTest.js    # ✨ NEW: Blockchain API endpoint
│   ├── config/
│   │   ├── escrowContract.js       # ✨ NEW: Blockchain service layer
│   │   ├── constant.js             # Existing multi-chain RPC configs
│   │   ├── getContract.js          # Existing contract helpers
│   │   ├── db.js                   # Database config
│   │   └── runtimeConfig.js        # Runtime initialization
│   ├── contract/
│   │   └── abi.json                # Sample ABI
│   ├── middleware/
│   │   ├── errorHandler.js         # Error handling middleware
│   │   └── logger.js               # Request logging
│   └── utils/
│       └── stats.js                # Statistics utilities
├── data/
│   └── items.json                  # Sample data
├── .env                            # ✨ UPDATED: Environment configuration
├── .gitignore                      # Git ignore rules
├── package.json                    # ✨ UPDATED: Dependencies (ethers added)
└── README.md                       # ✨ UPDATED: This file

✨ = New or modified files for blockchain integration
```

---

## 🔐 Smart Contract Configuration

### BSC Testnet Details
| Parameter | Value |
|-----------|-------|
| **Network** | BSC Testnet |
| **Chain ID** | 97 |
| **RPC URL** | `https://bnb-testnet.g.alchemy.com/v2/...` |
| **Explorer** | https://testnet.bscscan.com/ |

### Deployed Contracts
| Contract | Address | Purpose |
|----------|---------|---------|
| **Escrow** | `0x4C8a3c84DF9373C729DD76F2336933a06dc62Dc4` | Main escrow contract for USDT holdings |
| **USDT Token** | `0xF978c2D5DC2Ec5E643740A186Bd143B6cBDFC854` | BEP-20 USDT token on testnet |

### Proxy Wallet
The system uses a designated proxy wallet to pay for gas fees in blockchain transactions:
- **Private Key**: Stored securely in `.env` file
- **Purpose**: Funds gas for automated escrow operations (completion, disputes)
- **Network**: BSC Testnet only (test environment)

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v14+ recommended)
- npm or yarn
- BSC Testnet RPC access (provided via Alchemy)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd assessment1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   
   **New Dependencies Added:**
   - `ethers@6` - Ethereum/BSC blockchain interaction library

3. **Environment setup**
   
   The `.env` file is already configured with:
   ```env
   # Server
   PORT=3001
   NODE_ENV=development
   
   # BSC Testnet Blockchain
   BSC_TESTNET_RPC=https://bnb-testnet.g.alchemy.com/v2/...
   ESCROW_CONTRACT_ADDRESS=0x4C8a3c84DF9373C729DD76F2336933a06dc62Dc4
   USDT_TOKEN_ADDRESS=0xF978c2D5DC2Ec5E643740A186Bd143B6cBDFC854
   GAS_FEE_PROVIDER_KEY=<private-key>
   ```

4. **Start the server**
   ```bash
   npm start
   ```
   
   The server will start on `http://localhost:3001`

---

## 📡 API Endpoints

### 1. Blockchain API Test (Main Endpoint)

**Endpoint**: `GET /api/blockchainApiTest`

**Description**: Fetches comprehensive data from the BSC Testnet Escrow contract including:
- Network information (Chain ID, network name)
- Contract ownership details
- Total deals count (if available)
- USDT token information (name, symbol, decimals)
- Escrow contract's USDT balance
- Proxy wallet address and BNB balance
- Contract verification status

**Request**:
```bash
curl http://localhost:3001/api/blockchainApiTest
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Successfully fetched escrow contract data from BSC Testnet",
  "data": {
    "network": {
      "name": "BSC Testnet",
      "chainId": 97
    },
    "escrowContract": {
      "address": "0x4C8a3c84DF9373C729DD76F2336933a06dc62Dc4",
      "owner": "0x...",
      "totalDeals": "10",
      "verified": true
    },
    "usdtToken": {
      "address": "0xF978c2D5DC2Ec5E643740A186Bd143B6cBDFC854",
      "name": "Tether USD",
      "symbol": "USDT",
      "decimals": 18,
      "escrowBalance": "1000.0"
    },
    "proxyWallet": {
      "address": "0x...",
      "bnbBalance": "0.05"
    },
    "timestamp": "2025-10-25T10:30:00.000Z"
  },
  "metadata": {
    "apiVersion": "1.0",
    "responseTime": "2025-10-25T10:30:00.500Z",
    "blockchain": "Binance Smart Chain Testnet",
    "provider": "Alchemy"
  }
}
```

**Console Output**:
```
======================================================================
🚀 BLOCKCHAIN API TEST - BSC Testnet Escrow Contract
======================================================================
⏰ Request Time: 10/25/2025, 10:30:00 AM

🔍 Connecting to BSC Testnet...
✅ Connected to Chain ID: 97
📍 Proxy Wallet: 0x...
💰 Proxy Balance: 0.05 BNB
👤 Contract Owner: 0x...
📊 Total Deals: 10
🪙  Token: Tether USD (USDT)
🔢 Decimals: 18
💵 Escrow USDT Balance: 1000.0 USDT
✅ Contract verified on blockchain

📋 RESULTS:
──────────────────────────────────────────────────────────────────────
Network:          BSC Testnet (Chain ID: 97)
Escrow Contract:  0x4C8a3c84DF9373C729DD76F2336933a06dc62Dc4
Contract Owner:   0x...
Total Deals:      10
Contract Verified: Yes

USDT Token:       0xF978c2D5DC2Ec5E643740A186Bd143B6cBDFC854
Token Name:       Tether USD (USDT)
Token Decimals:   18
Escrow Balance:   1000.0 USDT

Proxy Wallet:     0x...
Wallet Balance:   0.05 BNB

Timestamp:        2025-10-25T10:30:00.000Z
──────────────────────────────────────────────────────────────────────
✅ Data fetch completed successfully!
======================================================================
```

### 2. Get Specific Deal (Optional Endpoint)

**Endpoint**: `GET /api/blockchainApiTest/deal/:dealId`

**Description**: Fetches specific deal details by ID (if `getDeal` function exists on contract)

**Request**:
```bash
curl http://localhost:3001/api/blockchainApiTest/deal/1
```

**Response** (200 OK):
```json
{
  "success": true,
  "dealId": 1,
  "deal": {
    "buyer": "0x...",
    "seller": "0x...",
    "amount": "500000000000000000000",
    "status": 1
  }
}
```

### Existing Endpoints (Unchanged)
- `GET /api/items` - List all items
- `GET /api/items/:id` - Get specific item
- `POST /api/items` - Create new item
- `GET /api/stats` - Get statistics

---

## 🔧 Implementation Details

### 1. Blockchain Service Layer (`src/config/escrowContract.js`)

**Purpose**: Encapsulates all blockchain interaction logic

**Key Functions**:

```javascript
// Fetch comprehensive escrow data
async function getEscrowData() {
  // - Connects to BSC Testnet via Alchemy RPC
  // - Fetches contract owner, deal count
  // - Gets USDT token info (name, symbol, decimals)
  // - Checks escrow USDT balance
  // - Gets proxy wallet BNB balance
  // - Verifies contract exists on blockchain
  // - Handles errors gracefully with fallbacks
}

// Get specific deal by ID
async function getDealById(dealId) {
  // - Fetches individual deal details
  // - Returns buyer, seller, amount, status
}
```

**Contract ABIs**:
- Uses **human-readable ABI format** for flexibility
- Defines common Escrow functions (`owner`, `totalDeals`, `getDeal`)
- Includes ERC20 functions for token interaction
- Gracefully handles missing functions

**Error Handling**:
- Try-catch blocks for each contract call
- Fallback values when functions don't exist
- Detailed error logging
- No crashes on missing contract functions

### 2. API Route Layer (`src/routes/blockchainApiTest.js`)

**Purpose**: Express router handling HTTP requests and responses

**Features**:
- RESTful endpoint design
- Comprehensive console logging (assessment requirement)
- Structured JSON responses
- Express error middleware integration
- Optional deal-specific endpoint
- Input validation for deal IDs

**Logging Format**:
- Visual separators for readability
- Emoji indicators for status
- Timestamp information
- Success/error indicators
- Data formatting for console display

### 3. Environment Configuration (`.env`)

**Minimized Variables**:
- Removed unused AWS, SMTP, Redis, JWT configs
- Kept only active blockchain and server settings
- Database keys retained for existing routes
- All sensitive data in environment variables

### 4. Main Server Updates (`src/index.js`)

**Changes**:
- Imported new blockchain router
- Registered `/api/blockchainApiTest` route
- No other modifications to existing functionality
- Maintains backward compatibility

---

## 🧪 Testing Instructions

### Manual Testing

1. **Start the server**
   ```bash
   npm start
   ```
   
   Expected output:
   ```
   Port 3001 free. Starting fresh server...
   Backend running on http://localhost:3001
   ```

2. **Test the blockchain endpoint**
   
   **Option A: Using cURL**
   ```bash
   curl http://localhost:3001/api/blockchainApiTest
   ```
   
   **Option B: Using Browser**
   - Navigate to: `http://localhost:3001/api/blockchainApiTest`
   
   **Option C: Using Postman/Insomnia**
   - GET request to `http://localhost:3001/api/blockchainApiTest`

3. **Verify console output**
   - Check terminal for formatted blockchain data
   - Confirm all data points are displayed
   - Look for success indicators

4. **Test deal endpoint** (optional)
   ```bash
   curl http://localhost:3001/api/blockchainApiTest/deal/0
   ```

### Expected Results

✅ Server starts without errors  
✅ GET request returns 200 OK status  
✅ JSON response contains all expected fields  
✅ Console displays formatted blockchain data  
✅ No errors or warnings in console  
✅ Timestamp shows current time  
✅ Contract addresses match configuration  

---

