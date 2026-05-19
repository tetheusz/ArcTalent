require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const ADMIN_PRIVATE_KEY = process.env.ADMIN_PRIVATE_KEY || "";

module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      evmVersion: "cancun",
    },
  },
  networks: {
    arc: {
      url: "https://5042002.rpc.thirdweb.com",
      chainId: 5042002,
      accounts: [ADMIN_PRIVATE_KEY],
    },
  },
};
