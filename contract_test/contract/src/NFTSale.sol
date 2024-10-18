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

    // 在合约开始处添加新的状态变量和结构体
    struct Listing {
        address seller;
        uint256 price;
    }

    mapping(uint256 => Listing) public listings;

    event NFTMinted(address buyer, uint256 tokenId);
    event ParticipantAdded(address participant);
    event NFTListed(
        uint256 indexed tokenId,
        address indexed seller,
        uint256 price
    );
    event NFTSold(
        uint256 indexed tokenId,
        address indexed seller,
        address indexed buyer,
        uint256 price
    );

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

    // 添加新的函数用于上架NFT
    function listNFT(uint256 tokenId, uint256 listingPrice) public {
        require(ownerOf(tokenId) == msg.sender, "You don't own this NFT");
        require(listings[tokenId].seller == address(0), "NFT already listed");

        approve(address(this), tokenId);
        listings[tokenId] = Listing(msg.sender, listingPrice);

        emit NFTListed(tokenId, msg.sender, listingPrice);
    }

    // 添加新的函数用于购买上架的NFT
    function buyNFT(uint256 tokenId) public payable {
        Listing memory listing = listings[tokenId];
        require(listing.seller != address(0), "NFT not listed for sale");
        require(msg.value >= listing.price, "Insufficient payment");

        address seller = listing.seller;
        uint256 price = listing.price;

        delete listings[tokenId];
        _transfer(seller, msg.sender, tokenId);

        payable(seller).transfer(price);

        if (msg.value > price) {
            payable(msg.sender).transfer(msg.value - price);
        }

        emit NFTSold(tokenId, seller, msg.sender, price);
    }

    // 添加新的函数用于取消上架
    function cancelListing(uint256 tokenId) public {
        require(listings[tokenId].seller == msg.sender, "Not the seller");
        delete listings[tokenId];
    }

    // 添加新的函数用于查看NFT的上架状态
    function getListing(
        uint256 tokenId
    ) public view returns (address seller, uint256 price) {
        Listing memory listing = listings[tokenId];
        return (listing.seller, listing.price);
    }

    // 在合約中添加以下函數

    // 獲取所有上架的NFT
    function getAllListedNFTs() public view returns (uint256[] memory) {
        uint256 listedCount = 0;
        for (uint256 i = 1; i <= _currentTokenId; i++) {
            if (listings[i].seller != address(0)) {
                listedCount++;
            }
        }

        uint256[] memory listedNFTs = new uint256[](listedCount);
        uint256 index = 0;
        for (uint256 i = 1; i <= _currentTokenId; i++) {
            if (listings[i].seller != address(0)) {
                listedNFTs[index] = i;
                index++;
            }
        }

        return listedNFTs;
    }

    // 獲取用戶擁有的NFT
    function getOwnedNFTs(
        address owner
    ) public view returns (uint256[] memory) {
        uint256 ownedCount = balanceOf(owner);
        uint256[] memory ownedNFTs = new uint256[](ownedCount);
        uint256 index = 0;
        for (uint256 i = 1; i <= _currentTokenId; i++) {
            if (ownerOf(i) == owner) {
                ownedNFTs[index] = i;
                index++;
            }
        }
        return ownedNFTs;
    }

    // 添加這個新函數來檢查 NFT 是否已經被列出
    function isListed(uint256 tokenId) public view returns (bool) {
        return listings[tokenId].seller != address(0);
    }

    // 修改 getOwnedNFTs 函數，包含一個布爾值來表示是否只返回未列出的 NFT
    function getOwnedNFTs(
        address owner,
        bool onlyUnlisted
    ) public view returns (uint256[] memory) {
        uint256 ownedCount = balanceOf(owner);
        uint256[] memory tempNFTs = new uint256[](ownedCount);
        uint256 actualCount = 0;

        for (uint256 i = 1; i <= _currentTokenId; i++) {
            if (ownerOf(i) == owner) {
                if (!onlyUnlisted || !isListed(i)) {
                    tempNFTs[actualCount] = i;
                    actualCount++;
                }
            }
        }

        uint256[] memory ownedNFTs = new uint256[](actualCount);
        for (uint256 i = 0; i < actualCount; i++) {
            ownedNFTs[i] = tempNFTs[i];
        }

        return ownedNFTs;
    }
}
