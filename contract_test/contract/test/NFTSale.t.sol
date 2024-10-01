// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "forge-std/Test.sol";
import "../src/NFTSale.sol";

contract NFTSaleTest is Test {
    NFTSale public nftSale;
    address public owner;
    address public buyer;
    uint256 public constant PRICE = 0.1 ether;
    uint256 public constant SALE_DURATION = 7 days;

    receive() external payable {}

    function setUp() public {
        owner = address(this);
        buyer = address(0x1);
        vm.warp(1000); // Set initial timestamp
        nftSale = new NFTSale(
            "TestNFT",
            "TNFT",
            PRICE,
            block.timestamp + SALE_DURATION
        );
        assertEq(
            nftSale.owner(),
            address(this),
            "Test contract should be the owner of NFTSale"
        );
    }

    function testMintNFT() public {
        vm.startPrank(buyer);
        vm.deal(buyer, 1 ether);

        uint256 initialBalance = buyer.balance;
        uint256 amountToMint = 2;

        nftSale.mintNFT{value: PRICE * amountToMint}(amountToMint);

        assertEq(
            nftSale.balanceOf(buyer),
            amountToMint,
            "Buyer should have minted NFTs"
        );
        assertEq(
            buyer.balance,
            initialBalance - (PRICE * amountToMint),
            "Buyer's balance should be reduced"
        );
        assertEq(
            nftSale.totalSupply(),
            amountToMint,
            "Total supply should be updated"
        );

        (
            uint256 purchaseCount,
            uint256 tokenCount,
            uint256[] memory tokenIds
        ) = nftSale.getParticipantInfo(buyer);
        assertEq(purchaseCount, 1, "Purchase count should be 1");
        assertEq(
            tokenCount,
            amountToMint,
            "Token count should match minted amount"
        );
        assertEq(
            tokenIds.length,
            amountToMint,
            "Token IDs array length should match minted amount"
        );

        vm.stopPrank();
    }

    function testFailMintAfterSaleEnd() public {
        vm.warp(block.timestamp + SALE_DURATION + 1);
        vm.prank(buyer);
        vm.expectRevert("Sale has ended");
        nftSale.mintNFT{value: PRICE}(1);
    }

    function testFailMintInsufficientPayment() public {
        vm.prank(buyer);
        vm.expectRevert("Insufficient payment");
        nftSale.mintNFT{value: PRICE - 0.01 ether}(1);
    }

    function testWithdraw() public {
        vm.deal(address(nftSale), 1 ether);
        uint256 initialBalance = address(this).balance;

        console.log(
            "Contract balance before withdrawal:",
            address(nftSale).balance
        );
        console.log("Owner balance before withdrawal:", address(this).balance);
        console.log("NFTSale owner:", nftSale.owner());
        console.log("Test contract address:", address(this));

        vm.prank(nftSale.owner());
        nftSale.withdraw();

        console.log(
            "Contract balance after withdrawal:",
            address(nftSale).balance
        );
        console.log("Owner balance after withdrawal:", address(this).balance);

        assertEq(
            address(nftSale).balance,
            0,
            "Contract balance should be zero after withdrawal"
        );
        assertEq(
            address(this).balance,
            initialBalance + 1 ether,
            "Owner should receive contract balance"
        );
    }

    function testFailWithdrawNonOwner() public {
        vm.prank(buyer);
        vm.expectRevert("Ownable: caller is not the owner");
        nftSale.withdraw();
    }
}
