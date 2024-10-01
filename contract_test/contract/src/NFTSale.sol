// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

//在sign event中購買特定數量NFT參與簽售活動
contract NFTSale is ERC721, Ownable {
    // 替换 Counters
    uint256 private _currentTokenId;
    uint256 public price;
    uint256 public saleEndTime;

    //紀錄參與者購買次數、數量與對應ID
    struct Participant {
        uint256 purchaseCount;
        uint256 tokenCount;
        uint256[] tokenIds;
    }

    //記錄所有參與者
    mapping(address => Participant) public participants;
    address[] public participantList;
    uint256 public totalUniqueParticipants;

    event NFTMinted(address buyer, uint256 tokenId);
    event ParticipantAdded(address participant);

    constructor(
        string memory name,
        string memory symbol,
        uint256 _price,
        uint256 _saleEndTime
    ) ERC721(name, symbol) Ownable(msg.sender) {
        price = _price;
        saleEndTime = _saleEndTime;
    }

    function mintNFT(uint256 amount) public payable {
        require(block.timestamp < saleEndTime, "Sale has ended");
        require(msg.value >= price * amount, "Insufficient payment");

        Participant storage buyer = participants[msg.sender];

        //判斷參與者是否為第一次購買
        if (buyer.purchaseCount == 0) {
            participantList.push(msg.sender);
            totalUniqueParticipants++;
            emit ParticipantAdded(msg.sender);
        }

        buyer.purchaseCount++;

        //mint出購買數量的NFT
        for (uint256 i = 0; i < amount; i++) {
            _currentTokenId++;
            uint256 newTokenId = _currentTokenId;
            _safeMint(msg.sender, newTokenId);
            buyer.tokenIds.push(newTokenId);
            emit NFTMinted(msg.sender, newTokenId);
        }

        buyer.tokenCount += amount;
    }

    //紀錄當前售出NFT總數量
    function totalSupply() public view returns (uint256) {
        return _currentTokenId;
    }

    //查看特定參與者購買資訊
    function getParticipantInfo(
        address participant
    )
        public
        view
        returns (
            uint256 purchaseCount,
            uint256 tokenCount,
            uint256[] memory tokenIds
        )
    {
        Participant storage p = participants[participant];
        return (p.purchaseCount, p.tokenCount, p.tokenIds);
    }

    //查看所有參與者地址
    function getAllParticipants() public view returns (address[] memory) {
        return participantList;
    }

    //進行支付
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Transfer failed");
    }
}
