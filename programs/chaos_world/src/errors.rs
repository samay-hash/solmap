use anchor_lang::prelude::*;

/// Custom error codes for Chaos World
#[error_code]
pub enum ChaosError {
    #[msg("Chaos level has reached maximum")]
    MaxChaosReached,

    #[msg("Player already registered")]
    PlayerAlreadyRegistered,

    #[msg("Player not in any faction")]
    NotInFaction,

    #[msg("Player already in a faction")]
    AlreadyInFaction,

    #[msg("Invalid faction ID")]
    InvalidFaction,

    #[msg("Insufficient power for this action")]
    InsufficientPower,

    #[msg("Cannot attack your own territory")]
    CannotAttackOwnTerritory,

    #[msg("Invalid trade amount")]
    InvalidTradeAmount,

    #[msg("Faction name too long")]
    FactionNameTooLong,

    #[msg("Maximum factions reached")]
    MaxFactionsReached,
}
