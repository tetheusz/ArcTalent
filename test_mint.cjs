const { createWalletClient, http, publicActions } = require('viem');
const { privateKeyToAccount } = require('viem/accounts');
const dotenv = require('dotenv');
const { join } = require('path');

dotenv.config();

const arcTestnet = {
  id: 5042002,
  name: 'Arc Network',
  nativeCurrency: { name: 'USDC', symbol: 'USDC', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.arc.testnet.arcana.network'] },
  },
};

const ADMIN_KEY = process.env.ADMIN_PRIVATE_KEY;
const SBT_CONTRACT_ADDRESS = process.env.SBT_CONTRACT_ADDRESS;

const account = privateKeyToAccount(ADMIN_KEY);
const client = createWalletClient({
  account,
  chain: arcTestnet,
  transport: http()
}).extend(publicActions);

const SBT_ABI = [
  {
    name: 'mint',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'badgeName', type: 'string' }
    ],
    outputs: [{ name: 'tokenId', type: 'uint256' }],
  }
];

async function testMint() {
  console.log('Testing mint with account:', account.address);
  try {
    const hash = await client.writeContract({
      address: SBT_CONTRACT_ADDRESS,
      abi: SBT_ABI,
      functionName: 'mint',
      args: ['0x8690bba9c3d0bc867641090ebb8bfde7d658e7ec', 'Genesis Contributor'],
    });
    console.log('Success! Hash:', hash);
  } catch (err) {
    console.error('Error:', err.message);
    if (err.details) console.error('Details:', err.details);
  }
}

testMint();
