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
            "IVE",
            "IVE",
            0.0005 ether, // 價格
            block.timestamp + 1 days // 銷售結束時間，設置為10分鐘
        );

        console.log("NFTSale deployed at:", address(nftSale));

        // Deploy NFTLottery
        NFTLottery nftLottery = new NFTLottery(
            address(nftSale),
            68243684758120062287473575528302979982098457404998953588869079544149016865901, // subscriptionId
            2, // winnerCount
            1 // limitedEditionCount
        );

        console.log("NFTLottery deployed at:", address(nftLottery));

        vm.stopBroadcast();
    }
}
