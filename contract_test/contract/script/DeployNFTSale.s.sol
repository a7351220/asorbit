// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/NFTSale.sol";

contract DeployNFTSale is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        NFTSale nftSale = new NFTSale(
            "MyNFT",
            "MNFT",
            0.001 ether, // 價格
            block.timestamp + 1 days // 銷售結束時間
        );

        vm.stopBroadcast();

        console.log("NFTSale deployed at:", address(nftSale));
    }
}
