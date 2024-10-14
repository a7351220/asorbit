// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/MintNFT.sol";

contract DeployMintNFT is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        MintNFT nft = new MintNFT();
        console.log("MintNFT deployed at:", address(nft));

        address[4] memory recipients = [
            0xF6c6f66528BA9DD00583fb74525481f4275273c8,
            0x5CA12DfEeADE5CDB6cbaA94726a68cF636AF633A,
            0x891381e22c7cF22EF0a1F967Ec3CeD029c8c910e,
            0x0ACD7fdBDc0AFD1dE17A9F082D4a35589b35b532
        ];

        uint256[] memory tokenIds = generateRandomTokenIds();

        for (uint i = 0; i < recipients.length; i++) {
            uint256[] memory recipientTokenIds = new uint256[](3);
            for (uint j = 0; j < 3; j++) {
                recipientTokenIds[j] = tokenIds[i * 3 + j];
            }
            nft.batchMintNFTs(recipients[i], recipientTokenIds);

            console.log("Minted NFTs for", recipients[i]);
            console.log("  Token IDs:", recipientTokenIds[0], recipientTokenIds[1], recipientTokenIds[2]);
        }

        vm.stopBroadcast();
    }

    function generateRandomTokenIds() internal view returns (uint256[] memory) {
        uint256[] memory tokenIds = new uint256[](12);
        
        for (uint i = 0; i < 12; i++) {
            tokenIds[i] = i + 1;
        }

        for (uint i = 11; i > 0; i--) {
            uint j = uint(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, i))) % (i + 1);
            (tokenIds[i], tokenIds[j]) = (tokenIds[j], tokenIds[i]);
        }

        return tokenIds;
    }
}