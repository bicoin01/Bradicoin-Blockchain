// bradicoin.js
// Bradicoin Mainnet Integration for www.bradichain.com
// Complete RPC Client for BRD Blockchain

// ==================== CONFIGURATION ====================
const BRADICOIN_CONFIG = {
    // UPDATE THIS URL WHEN RPC IS LIVE
    rpcUrl: 'https://rpc.bradichain.com',  // Production URL
    // For local testing: 'http://localhost:8545'
    // For development: 'http://YOUR_SERVER_IP:8545'
    
    network: 'mainnet',
    symbol: 'BRD',
    chainId: '8888',
    decimals: 18,
    explorerUrl: 'https://explorer.bradichain.com',
    websiteUrl: 'https://www.bradichain.com'
};

// ==================== CORE API FUNCTIONS ====================

// Connect to Bradicoin Mainnet
async function connectBradicoin() {
    try {
        const response = await fetch(`${BRADICOIN_CONFIG.rpcUrl}/bradicoin/getinfo`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        
        const data = await response.json();
        console.log('✓ Bradicoin Mainnet Connected:', data);
        return data;
    } catch (error) {
        console.error('✗ Connection failed:', error.message);
        throw error;
    }
}

// Create new wallet / generate new address
async function createWallet() {
    try {
        const response = await fetch(`${BRADICOIN_CONFIG.rpcUrl}/bradicoin/getnewaddress`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        
        if (data.address) {
            console.log('✓ New wallet created:', data.address);
            return {
                success: true,
                address: data.address,
                symbol: BRADICOIN_CONFIG.symbol
            };
        } else {
            throw new Error('No address returned');
        }
    } catch (error) {
        console.error('✗ Create wallet failed:', error.message);
        return { success: false, error: error.message };
    }
}

// Get balance for a specific address
async function getBalance(address) {
    if (!address) {
        return { success: false, error: 'Address is required' };
    }
    
    try {
        const response = await fetch(`${BRADICOIN_CONFIG.rpcUrl}/bradicoin/getbalance`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address })
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        
        console.log(`✓ Balance for ${address.substring(0, 10)}...: ${data.balance} ${data.symbol || BRADICOIN_CONFIG.symbol}`);
        
        return {
            success: true,
            address: address,
            balance: data.balance,
            symbol: data.symbol || BRADICOIN_CONFIG.symbol
        };
    } catch (error) {
        console.error('✗ Get balance failed:', error.message);
        return { success: false, error: error.message };
    }
}

// Send transaction to another address
async function sendTransaction(from, to, amount) {
    if (!from || !to || !amount) {
        return { success: false, error: 'Missing parameters: from, to, amount' };
    }
    
    try {
        const response = await fetch(`${BRADICOIN_CONFIG.rpcUrl}/bradicoin/sendtoaddress`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                from: from, 
                to: to, 
                amount: parseFloat(amount) 
            })
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        
        if (data.txid) {
            console.log(`✓ Transaction sent! TXID: ${data.txid}`);
            return {
                success: true,
                txid: data.txid,
                from: from,
                to: to,
                amount: amount,
                symbol: BRADICOIN_CONFIG.symbol
            };
        } else {
            throw new Error(data.error || 'Transaction failed');
        }
    } catch (error) {
        console.error('✗ Send transaction failed:', error.message);
        return { success: false, error: error.message };
    }
}

// Get transaction details
async function getTransaction(txid) {
    if (!txid) {
        return { success: false, error: 'Transaction ID is required' };
    }
    
    try {
        const response = await fetch(`${BRADICOIN_CONFIG.rpcUrl}/bradicoin/gettransaction`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ txid })
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        
        console.log(`✓ Transaction found: ${txid}`);
        return { success: true, transaction: data };
    } catch (error) {
        console.error('✗ Get transaction failed:', error.message);
        return { success: false, error: error.message };
    }
}

// Get transaction receipt
async function getTransactionReceipt(txid) {
    if (!txid) {
        return { success: false, error: 'Transaction ID is required' };
    }
    
    try {
        const response = await fetch(`${BRADICOIN_CONFIG.rpcUrl}/bradicoin/gettransactionreceipt`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ txid })
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        
        return { success: true, receipt: data };
    } catch (error) {
        console.error('✗ Get receipt failed:', error.message);
        return { success: false, error: error.message };
    }
}

// Stake BRD tokens
async function stakeTokens(address, amount) {
    if (!address || !amount) {
        return { success: false, error: 'Address and amount are required' };
    }
    
    try {
        const response = await fetch(`${BRADICOIN_CONFIG.rpcUrl}/bradicoin/stake`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                address: address, 
                amount: parseFloat(amount) 
            })
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        
        if (data.success) {
            console.log(`✓ Staked ${amount} BRD successfully`);
            return {
                success: true,
                amount: amount,
                address: address,
                symbol: BRADICOIN_CONFIG.symbol
            };
        } else {
            throw new Error(data.error || 'Staking failed');
        }
    } catch (error) {
        console.error('✗ Stake failed:', error.message);
        return { success: false, error: error.message };
    }
}

// Unstake BRD tokens
async function unstakeTokens(address) {
    if (!address) {
        return { success: false, error: 'Address is required' };
    }
    
    try {
        const response = await fetch(`${BRADICOIN_CONFIG.rpcUrl}/bradicoin/unstake`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address })
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        
        if (data.success) {
            console.log(`✓ Unstaked ${data.amount} BRD successfully`);
            return {
                success: true,
                amount: data.amount,
                address: address,
                symbol: BRADICOIN_CONFIG.symbol
            };
        } else {
            throw new Error(data.error || 'Unstaking failed');
        }
    } catch (error) {
        console.error('✗ Unstake failed:', error.message);
        return { success: false, error: error.message };
    }
}

// Get staking information
async function getStakingInfo() {
    try {
        const response = await fetch(`${BRADICOIN_CONFIG.rpcUrl}/bradicoin/getstakinginfo`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        
        console.log('✓ Staking info retrieved:', data);
        return { success: true, stakingInfo: data };
    } catch (error) {
        console.error('✗ Get staking info failed:', error.message);
        return { success: false, error: error.message };
    }
}

// Get BRD price from market
async function getBRDPrice() {
    try {
        const response = await fetch(`${BRADICOIN_CONFIG.rpcUrl}/bradicoin/getprice`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ symbol: 'BRD' })
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        
        console.log(`✓ BRD Price: $${data.price} USD`);
        return {
            success: true,
            symbol: 'BRD',
            price: data.price,
            currency: 'USD'
        };
    } catch (error) {
        console.error('✗ Get price failed:', error.message);
        return { success: false, error: error.message };
    }
}

// Get blockchain analytics
async function getBlockchainAnalytics() {
    try {
        const response = await fetch(`${BRADICOIN_CONFIG.rpcUrl}/bradicoin/getanalytics`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        
        console.log('✓ Analytics retrieved');
        return { success: true, analytics: data };
    } catch (error) {
        console.error('✗ Get analytics failed:', error.message);
        return { success: false, error: error.message };
    }
}

// Get block by hash or number
async function getBlock(blockIdentifier) {
    if (!blockIdentifier) {
        return { success: false, error: 'Block hash or number is required' };
    }
    
    try {
        const response = await fetch(`${BRADICOIN_CONFIG.rpcUrl}/bradicoin/getblock`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ hash: blockIdentifier })
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        
        return { success: true, block: data };
    } catch (error) {
        console.error('✗ Get block failed:', error.message);
        return { success: false, error: error.message };
    }
}

// Get current block count
async function getBlockCount() {
    try {
        const response = await fetch(`${BRADICOIN_CONFIG.rpcUrl}/bradicoin/getblockcount`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        
        return { success: true, count: data.count };
    } catch (error) {
        console.error('✗ Get block count failed:', error.message);
        return { success: false, error: error.message };
    }
}

// List unspent transactions (UTXOs)
async function listUnspent(address) {
    if (!address) {
        return { success: false, error: 'Address is required' };
    }
    
    try {
        const response = await fetch(`${BRADICOIN_CONFIG.rpcUrl}/bradicoin/listunspent`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        
        return { success: true, utxos: data.utxos };
    } catch (error) {
        console.error('✗ List unspent failed:', error.message);
        return { success: false, error: error.message };
    }
}

// Create smart contract
async function createContract(code, owner) {
    if (!code || !owner) {
        return { success: false, error: 'Code and owner are required' };
    }
    
    try {
        const response = await fetch(`${BRADICOIN_CONFIG.rpcUrl}/bradicoin/createcontract`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, owner })
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        
        console.log(`✓ Contract created at: ${data.contractAddress}`);
        return {
            success: true,
            contractAddress: data.contractAddress,
            symbol: BRADICOIN_CONFIG.symbol
        };
    } catch (error) {
        console.error('✗ Create contract failed:', error.message);
        return { success: false, error: error.message };
    }
}

// Call smart contract
async function callContract(address, method, params) {
    if (!address || !method) {
        return { success: false, error: 'Address and method are required' };
    }
    
    try {
        const response = await fetch(`${BRADICOIN_CONFIG.rpcUrl}/bradicoin/callcontract`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address, method, params: params || [] })
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        
        return { success: true, result: data.result };
    } catch (error) {
        console.error('✗ Call contract failed:', error.message);
        return { success: false, error: error.message };
    }
}

// Bridge deposit (cross-chain)
async function bridgeDeposit(fromChain, toChain, asset, amount, destination) {
    if (!fromChain || !toChain || !asset || !amount || !destination) {
        return { success: false, error: 'Missing bridge parameters' };
    }
    
    try {
        const response = await fetch(`${BRADICOIN_CONFIG.rpcUrl}/bradicoin/bridge/deposit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fromChain, toChain, asset, amount, destination })
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        
        console.log(`✓ Bridge deposit initiated: ${data.bridgeTxId}`);
        return { success: true, bridgeTxId: data.bridgeTxId };
    } catch (error) {
        console.error('✗ Bridge deposit failed:', error.message);
        return { success: false, error: error.message };
    }
}

// Create private payment (ZK Privacy)
async function createPrivatePayment(from, to, amount, proof) {
    if (!from || !to || !amount) {
        return { success: false, error: 'Missing payment parameters' };
    }
    
    try {
        const response = await fetch(`${BRADICOIN_CONFIG.rpcUrl}/bradicoin/createprivatepayment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ from, to, amount, proof: proof || 'valid' })
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        
        if (data.success) {
            console.log(`✓ Private payment created: ${data.txid}`);
            return { success: true, txid: data.txid, private: true };
        } else {
            throw new Error(data.error || 'Private payment failed');
        }
    } catch (error) {
        console.error('✗ Private payment failed:', error.message);
        return { success: false, error: error.message };
    }
}

// Validate address format
async function validateAddress(address) {
    if (!address) {
        return { success: false, error: 'Address is required' };
    }
    
    try {
        const response = await fetch(`${BRADICOIN_CONFIG.rpcUrl}/bradicoin/validateaddress`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address })
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        
        return {
            success: true,
            address: address,
            isValid: data.isValid,
            symbol: data.symbol
        };
    } catch (error) {
        console.error('✗ Validate address failed:', error.message);
        return { success: false, error: error.message };
    }
}

// Health check
async function healthCheck() {
    try {
        const response = await fetch(`${BRADICOIN_CONFIG.rpcUrl}/health`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        
        console.log(`✓ Bradicoin RPC Health: ${data.status}`);
        return { success: true, status: data.status, network: data.network };
    } catch (error) {
        console.error('✗ Health check failed:', error.message);
        return { success: false, error: error.message };
    }
}

// ==================== EXPORT FOR USE IN HTML ====================
// Make functions available globally for browser
if (typeof window !== 'undefined') {
    window.Bradicoin = {
        config: BRADICOIN_CONFIG,
        connect: connectBradicoin,
        createWallet: createWallet,
        getBalance: getBalance,
        sendTransaction: sendTransaction,
        getTransaction: getTransaction,
        getTransactionReceipt: getTransactionReceipt,
        stakeTokens: stakeTokens,
        unstakeTokens: unstakeTokens,
        getStakingInfo: getStakingInfo,
        getBRDPrice: getBRDPrice,
        getBlockchainAnalytics: getBlockchainAnalytics,
        getBlock: getBlock,
        getBlockCount: getBlockCount,
        listUnspent: listUnspent,
        createContract: createContract,
        callContract: callContract,
        bridgeDeposit: bridgeDeposit,
        createPrivatePayment: createPrivatePayment,
        validateAddress: validateAddress,
        healthCheck: healthCheck
    };
    
    console.log('✓ Bradicoin SDK Loaded');
    console.log(`  Network: ${BRADICOIN_CONFIG.network}`);
    console.log(`  Symbol: ${BRADICOIN_CONFIG.symbol}`);
    console.log(`  RPC URL: ${BRADICOIN_CONFIG.rpcUrl}`);
}

// ==================== USAGE EXAMPLES ====================
/*
// Example 1: Connect and get network info
async function example1() {
    const info = await connectBradicoin();
    console.log('Network:', info.networkName);
    console.log('Blocks:', info.blocks);
    console.log('Symbol:', info.symbol);
}

// Example 2: Create wallet and check balance
async function example2() {
    // Create new wallet
    const wallet = await createWallet();
    if (wallet.success) {
        console.log('New Address:', wallet.address);
        
        // Check balance
        const balance = await getBalance(wallet.address);
        console.log('Balance:', balance.balance, balance.symbol);
    }
}

// Example 3: Send BRD tokens
async function example3() {
    const result = await sendTransaction(
        'BRD123...',  // from address
        'BRD456...',  // to address
        10.5          // amount
    );
    
    if (result.success) {
        console.log('Transaction sent! TXID:', result.txid);
    }
}

// Example 4: Stake BRD tokens
async function example4() {
    const result = await stakeTokens('BRD123...', 1000);
    
    if (result.success) {
        console.log(`Staked ${result.amount} ${result.symbol}`);
    }
}

// Example 5: Get BRD price
async function example5() {
    const price = await getBRDPrice();
    if (price.success) {
        console.log(`BRD Price: $${price.price} USD`);
    }
}
*/
