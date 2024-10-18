// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";
import {VRFConsumerBaseV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

interface INFTSale {
    function totalSupply() external view returns (uint256);
    function ownerOf(uint256 tokenId) external view returns (address);
    function getAllParticipants() external view returns (address[] memory);
    function getParticipantInfo(
        address participant
    )
        external
        view
        returns (
            uint256 purchaseCount,
            uint256 tokenCount,
            uint256[] memory tokenIds
        );
    function transferFrom(address from, address to, uint256 tokenId) external;
}

contract NFTLottery is VRFConsumerBaseV2Plus, ERC721 {
    uint256 public s_subscriptionId;
    bytes32 public constant KEY_HASH =
        0x9e1344a1247c8a1785d0a4681a27152bffdb43666ae5bf7d14d24a5efd44bf71;
    uint32 public constant CALLBACK_GAS_LIMIT = 2500000;
    uint16 public constant REQUEST_CONFIRMATIONS = 3;
    uint32 public numWords;

    INFTSale public nftSaleContract;
    uint256 public winnerCount; //中籤名額
    uint256 public limitedEditionCount; //限量NFT名額
    address[] public winners;
    mapping(uint256 => bool) public isLimitedEdition;
    mapping(uint256 => bool) private _tokenExists;

    struct Participant {
        address addr;
        uint256 weight;
        uint256 startRange;
        uint256 endRange;
    }

    Participant[] public participants;
    uint256 public totalWeight;

    uint256[] public winnerTokenIds;
    uint256[] public limitedEditionTokenIds;
    bool public lotteryFinished = false;
    uint256[] public randomNumbers;

    event WinnersSelected(uint256[] winnerTokenIds);
    event LimitedEditionsAssigned(uint256[] limitedEditionTokenIds);
    event RandomnessRequested(
        uint256 requestId,
        uint32 numWords,
        uint32 callbackGasLimit
    );
    event RandomWordsFulfilled(uint256 requestId, uint256[] randomWords);
    event ParticipantsUpdated(uint256 participantCount, uint256 totalWeight);
    event NFTsDistributed(uint256[] winnerTokenIds);

    uint256 private _winnerTokenIdCounter;

    constructor(
        address _nftSaleContract,
        uint256 subscriptionId,
        uint256 _winnerCount,
        uint256 _limitedEditionCount
    )
        VRFConsumerBaseV2Plus(0x5C210eF41CD1a72de73bF76eC39637bB0d3d7BEE)
        ERC721("Winner NFT", "WNFT")
    {
        s_subscriptionId = subscriptionId;
        nftSaleContract = INFTSale(_nftSaleContract);
        winnerCount = _winnerCount;
        limitedEditionCount = _limitedEditionCount;
        numWords = uint32(winnerCount + limitedEditionCount); //要抽出的隨機數數量
        _winnerTokenIdCounter = 0;
    }

    //更新參與者資訊並記錄權重 //private
    function updateParticipants() external onlyOwner {
        require(!lotteryFinished, "Lottery already finished");
        delete participants;
        totalWeight = 0;

        address[] memory allParticipants = nftSaleContract.getAllParticipants();
        for (uint256 i = 0; i < allParticipants.length; i++) {
            (, uint256 tokenCount, ) = nftSaleContract.getParticipantInfo(
                allParticipants[i]
            );
            if (tokenCount > 0) {
                participants.push(
                    Participant(
                        allParticipants[i],
                        tokenCount,
                        totalWeight,
                        totalWeight + tokenCount - 1
                    )
                );
                totalWeight += tokenCount;
            }
        }
        emit ParticipantsUpdated(participants.length, totalWeight);
    }

    uint256[] private s_randomWords;
    uint256 private s_requestId;

    function requestRandomness()
        external
        onlyOwner
        returns (uint256 requestId)
    {
        require(!lotteryFinished, "Lottery already finished");
        require(
            nftSaleContract.totalSupply() >= winnerCount,
            "Not enough NFTs sold"
        );

        requestId = s_vrfCoordinator.requestRandomWords(
            VRFV2PlusClient.RandomWordsRequest({
                keyHash: KEY_HASH,
                subId: s_subscriptionId,
                requestConfirmations: REQUEST_CONFIRMATIONS,
                callbackGasLimit: CALLBACK_GAS_LIMIT,
                numWords: numWords,
                extraArgs: VRFV2PlusClient._argsToBytes(
                    VRFV2PlusClient.ExtraArgsV1({nativePayment: false})
                )
            })
        );
        s_requestId = requestId;
        emit RandomnessRequested(requestId, numWords, CALLBACK_GAS_LIMIT);
    }

    function fulfillRandomWords(
        uint256 /*requestId*/,
        uint256[] calldata _randomWords
    ) internal override {
        s_randomWords = _randomWords;
        emit RandomWordsFulfilled(s_requestId, _randomWords);
    }

    function selectWinners() external onlyOwner {
        require(!lotteryFinished, "Lottery already finished");
        require(participants.length > 0, "No participants available");
        require(s_randomWords.length > 0, "Random words not received yet");
        require(
            winnerCount <= participants.length,
            "Not enough participants for the number of winners"
        );

        uint256 totalSupply = nftSaleContract.totalSupply();

        // Select winners
        for (uint256 i = 0; i < winnerCount; i++) {
            uint256 winningNumber = s_randomWords[i] % totalWeight;
            for (uint256 j = 0; j < participants.length; j++) {
                if (
                    winningNumber >= participants[j].startRange &&
                    winningNumber <= participants[j].endRange
                ) {
                    (, , uint256[] memory tokenIds) = nftSaleContract
                        .getParticipantInfo(participants[j].addr);
                    uint256 randomIndex = uint256(
                        keccak256(
                            abi.encodePacked(
                                s_randomWords[i],
                                participants[j].addr
                            )
                        )
                    ) % tokenIds.length;
                    winnerTokenIds.push(tokenIds[randomIndex]);
                    winners.push(participants[j].addr);
                    // Remove the participant to avoid duplicate winners
                    totalWeight -= participants[j].weight;
                    participants[j] = participants[participants.length - 1];
                    participants.pop();
                    break;
                }
            }
        }

        // Assign limited editions
        for (uint256 i = 0; i < limitedEditionCount; i++) {
            uint256 tokenId = (s_randomWords[winnerCount + i] % totalSupply) +
                1;
            limitedEditionTokenIds.push(tokenId);
        }

        lotteryFinished = true;
        emit WinnersSelected(winnerTokenIds);
        emit LimitedEditionsAssigned(limitedEditionTokenIds);
    }

    function distributeNFTsToWinners() public onlyOwner {
        require(lotteryFinished, "Lottery not finished yet");
        for (uint i = 0; i < winnerTokenIds.length; i++) {
            uint256 tokenId = winnerTokenIds[i];
            address winner = nftSaleContract.ownerOf(tokenId);
            nftSaleContract.transferFrom(address(this), winner, tokenId);
        }
        emit NFTsDistributed(winnerTokenIds);
    }

    function isLimitedEditionToken(uint256 tokenId) public view returns (bool) {
        for (uint i = 0; i < limitedEditionTokenIds.length; i++) {
            if (limitedEditionTokenIds[i] == tokenId) {
                return true;
            }
        }
        return false;
    }

    function mintAndDistributeWinnerNFTs() public onlyOwner {
        require(lotteryFinished, "Lottery not finished yet");
        for (uint i = 0; i < winners.length; i++) {
            address winner = winners[i];

            _winnerTokenIdCounter++;
            _safeMint(winner, _winnerTokenIdCounter);
            _tokenExists[_winnerTokenIdCounter] = true;
            if (isLimitedEditionToken(winnerTokenIds[i])) {
                isLimitedEdition[_winnerTokenIdCounter] = true;
            }
        }
        emit NFTsDistributed(winnerTokenIds);
    }

    function _exists(uint256 tokenId) public view returns (bool) {
        return _tokenExists[tokenId];
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        if (isLimitedEdition[tokenId]) {
            return "https://example.com/api/limited-edition-metadata/";
        }
        return "https://example.com/api/regular-winner-metadata/";
    }

    function getWinners()
        public
        view
        returns (address[] memory, uint256[] memory)
    {
        address[] memory uniqueWinners = new address[](winners.length);
        uint256[] memory counts = new uint256[](winners.length);
        uint256 uniqueCount = 0;

        for (uint256 i = 0; i < winners.length; i++) {
            bool found = false;
            for (uint256 j = 0; j < uniqueCount; j++) {
                if (uniqueWinners[j] == winners[i]) {
                    counts[j]++;
                    found = true;
                    break;
                }
            }
            if (!found) {
                uniqueWinners[uniqueCount] = winners[i];
                counts[uniqueCount] = 1;
                uniqueCount++;
            }
        }

        // 創建新的數組以匹配實際的唯一獲獎者數量
        address[] memory finalWinners = new address[](uniqueCount);
        uint256[] memory finalCounts = new uint256[](uniqueCount);
        for (uint256 i = 0; i < uniqueCount; i++) {
            finalWinners[i] = uniqueWinners[i];
            finalCounts[i] = counts[i];
        }

        return (finalWinners, finalCounts);
    }

    function getWinnerTokenIds() public view returns (uint256[] memory) {
        require(lotteryFinished, "Lottery not finished yet");
        return winnerTokenIds;
    }

    function getLimitedEditionTokenIds()
        public
        view
        returns (uint256[] memory)
    {
        require(lotteryFinished, "Lottery not finished yet");
        return limitedEditionTokenIds;
    }

    function getParticipantCount() public view returns (uint256) {
        return participants.length;
    }

    function getParticipant(
        uint256 index
    ) public view returns (address, uint256, uint256, uint256) {
        require(index < participants.length, "Index out of bounds");
        Participant memory p = participants[index];
        return (p.addr, p.weight, p.startRange, p.endRange);
    }

    function getTotalWeight() public view returns (uint256) {
        return totalWeight;
    }

    function getRandomWords() public view returns (uint256[] memory) {
        return s_randomWords;
    }
}
