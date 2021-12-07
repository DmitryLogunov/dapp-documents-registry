//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract TokensRegistry is AccessControl, ERC721URIStorage, ERC721Enumerable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor(address adminAccount, string memory name_, string memory symbol_) ERC721(name_, symbol_) {
        _setupRole(MINTER_ROLE, adminAccount);
    }

    /**
    * Override supportsInterface()
    */
    function supportsInterface(bytes4 interfaceId)
    public view virtual override(ERC721, ERC721Enumerable, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    /**
    * Override _beforeTokenTransfer()
    */
    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal virtual override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    /**
    * Override tokenURI()
    */
    function tokenURI(uint256 tokenId) public view virtual override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    /**
    * Override _burn()
    */
    function _burn(uint256 tokenId) internal virtual override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    /**
    * Creates new token and transfers it to owner. Returns the tokenId of a new token.
    */
    function createToken(address owner, string memory _tokenURI) public onlyRole(MINTER_ROLE) returns (uint256) {
        _tokenIds.increment();

        address provider = msg.sender;
        uint256 newTokenId = _tokenIds.current();
        _mint(provider, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);

        transferFrom(provider, owner, newTokenId);

        return newTokenId;
    }

    /**
    * Transfers token
    */
    function transfer(uint256 tokenId, address to) public {
        address owner = ownerOf(tokenId);
        transferFrom(owner, to, tokenId);
    }

    /**
    * Returns all tokens of account.
    */
    function getAccountTokens(address accountAddress) public view returns (uint256[] memory) {
        uint accountsTokensNumber = balanceOf(accountAddress);

        if (accountsTokensNumber == 0) {
            return new uint256[](0);
        }

        uint256[] memory accountTokens = new uint256[](accountsTokensNumber);
        for (uint i = 0; i < balanceOf(accountAddress); i++) {
            accountTokens[i] = tokenOfOwnerByIndex(accountAddress, i);
        }

        return accountTokens;
    }

    /**
    * Returns the number of tokens in contract
    */
    function getTokensNumber() public view returns (uint256) {
        return totalSupply();
    }
}