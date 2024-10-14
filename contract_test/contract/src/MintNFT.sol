// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MintNFT is ERC721, Ownable {
    uint256 public constant MAX_SUPPLY = 12;
    mapping(uint256 => bool) private _mintedTokens;

    constructor() ERC721("KpopNFT", "KNFT") Ownable(msg.sender) {}

    function mintSpecificNFT(address recipient, uint256 tokenId) public onlyOwner {
        require(tokenId > 0 && tokenId <= MAX_SUPPLY, "Invalid token ID");
        require(!_mintedTokens[tokenId], "Token already minted");
        _safeMint(recipient, tokenId);
        _mintedTokens[tokenId] = true;
    }

    function batchMintNFTs(address recipient, uint256[] memory tokenIds) public onlyOwner {
        for (uint i = 0; i < tokenIds.length; i++) {
            mintSpecificNFT(recipient, tokenIds[i]);
        }
    }

    function tokensOfOwner(address owner) public view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(owner);
        uint256[] memory tokens = new uint256[](tokenCount);
        uint256 index = 0;
        for (uint256 i = 1; i <= MAX_SUPPLY; i++) {
            if (_mintedTokens[i] && ownerOf(i) == owner) {
                tokens[index] = i;
                index++;
            }
        }
        return tokens;
    }

    function tokenOfOwnerByIndex(address owner, uint256 index) public view returns (uint256) {
        require(index < balanceOf(owner), "Owner index out of bounds");
        uint256 tokenCount = 0;
        for (uint256 i = 1; i <= MAX_SUPPLY; i++) {
            if (_mintedTokens[i] && ownerOf(i) == owner) {
                if (tokenCount == index) {
                    return i;
                }
                tokenCount++;
            }
        }
        revert("Owner index out of bounds");
    }
}