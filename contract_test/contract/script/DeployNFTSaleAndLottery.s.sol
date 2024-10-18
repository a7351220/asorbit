// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/NFTSale.sol";
import "../src/NFTLottery.sol";

contract DeployNFTSaleAndLottery is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy NFTSale
        NFTSale nftSale = new NFTSale(
            "MyNFT",
            "MNFT",
            0.00001 ether, // 價格
            block.timestamp + 10 minutes // 銷售結束時間，設置為10分鐘
        );

        console.log("NFTSale deployed at:", address(nftSale));

        // Deploy NFTLottery
        NFTLottery nftLottery = new NFTLottery(
            address(nftSale),
            103798843019592730386279729263496122955905342229275573833742759892634297171832, // subscriptionId
            2, // winnerCount
            1 // limitedEditionCount
        );

        console.log("NFTLottery deployed at:", address(nftLottery));

        vm.stopBroadcast();
    }
}

// 部署命令：
// forge script script/DeployNFTSaleAndLottery.s.sol:DeployNFTSaleAndLottery --rpc-url base_sepolia --broadcast --verify
