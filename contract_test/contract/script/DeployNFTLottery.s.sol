// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/NFTLottery.sol";

contract DeployNFTLottery is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // 這些參數需要根據你的具體需求進行調整
        address nftSaleAddress = 0x729fEd5Fa9703923206A7Ca732Bb84BcB00CadE3; // 替換為實際的 NFTSale 合約地址
        uint256 subscriptionId = 14327289756238418072171787957176927005001802818593754882820454675324826202191; // 替換為你的 Chainlink VRF 訂閱 ID
        uint256 winnerCount = 1; // 設置中獎者數量
        uint256 limitedEditionCount = 1; // 設置限量版 NFT 數量

        NFTLottery nftLottery = new NFTLottery(
            nftSaleAddress,
            subscriptionId,
            winnerCount,
            limitedEditionCount
        );

        vm.stopBroadcast();

        console.log("NFTLottery deployed at:", address(nftLottery));
    }
}
// forge script script/DeployNFTLottery.s.sol:DeployNFTLottery --rpc-url base_sepolia --broadcast --verify
