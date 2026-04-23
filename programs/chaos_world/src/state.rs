use anchor_lang::prelude::*;

// ═══ Account State Definitions ═══

/// The global world state — the "brain" of Chaos World
#[account]
#[derive(InitSpace)]
pub struct WorldState {
    /// Admin authority
    pub authority: Pubkey,
    /// Current chaos level (0-100)
    pub chaos_level: u8,
    /// Total transactions processed
    pub total_transactions: u64,
    /// Last event timestamp (unix)
    pub last_event_timestamp: i64,
    /// Number of active factions
    pub faction_count: u8,
    /// Last chaos event type (0=none, 1=war, 2=betrayal, 3=airdrop)
    pub last_event_type: u8,
    /// PDA bump
    pub bump: u8,
}

/// Faction state
#[account]
#[derive(InitSpace)]
pub struct Faction {
    /// Faction name
    #[max_len(32)]
    pub name: String,
    /// Faction leader
    pub leader: Pubkey,
    /// Total power
    pub power: u64,
    /// Number of members
    pub member_count: u32,
    /// Number of territories owned
    pub territory_count: u8,
    /// SOL treasury (lamports)
    pub treasury: u64,
    /// Faction ID (1-3)
    pub faction_id: u8,
    /// PDA bump
    pub bump: u8,
}

/// Player state
#[account]
#[derive(InitSpace)]
pub struct Player {
    /// Player wallet
    pub wallet: Pubkey,
    /// Faction ID (0 = unaffiliated)
    pub faction_id: u8,
    /// Player power
    pub power: u64,
    /// Join timestamp
    pub join_timestamp: i64,
    /// Total trades
    pub total_trades: u32,
    /// PDA bump
    pub bump: u8,
}

/// Territory state
#[account]
#[derive(InitSpace)]
pub struct Territory {
    /// Zone ID
    pub zone_id: u8,
    /// Owner faction ID (0 = unclaimed)
    pub owner_faction_id: u8,
    /// Defense power
    pub defense_power: u64,
    /// Last time contested
    pub last_contested: i64,
    /// PDA bump
    pub bump: u8,
}

// ═══ Events ═══

#[event]
pub struct ChaosEventEmitted {
    pub event_type: u8,      // 1=war, 2=betrayal, 3=airdrop
    pub chaos_level: u8,
    pub faction_id: u8,
    pub target_faction_id: u8,
    pub impact: i64,
    pub timestamp: i64,
}

#[event]
pub struct TradeExecuted {
    pub player: Pubkey,
    pub faction_id: u8,
    pub amount: u64,
    pub new_power: u64,
    pub chaos_level: u8,
}

#[event]
pub struct TerritoryAttacked {
    pub attacker_faction: u8,
    pub zone_id: u8,
    pub success: bool,
    pub new_owner: u8,
}
