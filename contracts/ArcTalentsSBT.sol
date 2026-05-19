// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ArcTalentsSBT is ERC721, Ownable {
    uint256 private _tokenIdCounter;

    // Mapping from token ID to badge name
    mapping(uint256 => string) public badgeNames;

    constructor() ERC721("ArcTalents Badges", "ARTB") Ownable(msg.sender) {}

    /**
     * @dev Only the owner (Admin) can mint new badges.
     * SBTs are minted directly to the contributor's address.
     */
    function mint(address to, string memory badgeName) public onlyOwner returns (uint256) {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        _safeMint(to, tokenId);
        badgeNames[tokenId] = badgeName;
        
        return tokenId;
    }

    /**
     * @dev Overriding transfer functions to make it Soulbound (non-transferable).
     */
    function _update(address to, uint256 tokenId, address auth)
        internal
        virtual
        override
        returns (address)
    {
        address from = _ownerOf(tokenId);
        require(from == address(0) || to == address(0), "SBT: Soulbound tokens cannot be transferred");
        return super._update(to, tokenId, auth);
    }

    /**
     * @dev Helper function to get badge name for a token.
     */
    function getBadgeName(uint256 tokenId) public view returns (string memory) {
        _requireOwned(tokenId);
        return badgeNames[tokenId];
    }
}
