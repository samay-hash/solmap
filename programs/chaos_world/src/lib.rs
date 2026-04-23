use anchor_lang::prelude::*;

pub mod state;
pub mod errors;
pub mod instructions;

use instructions::*;

declare_id!("ChaosWorLd111111111111111111111111111111111");

#[program]
pub mod chaos_world {
    use super::*;

    /// Initialize the world state (admin only, one-time)
    pub fn init_world(ctx: Context<InitWorld>) -> Result<()> {
        instructions::init_world::handler(ctx)
    }

    /// Create a new faction
    pub fn create_faction(ctx: Context<CreateFaction>, name: String, faction_id: u8) -> Result<()> {
        instructions::create_faction::handler(ctx, name, faction_id)
    }

    /// Register as a player
    pub fn register_player(ctx: Context<RegisterPlayer>) -> Result<()> {
        instructions::register_player::handler(ctx)
    }

    /// Join a faction
    pub fn join_faction(ctx: Context<JoinFaction>) -> Result<()> {
        instructions::join_faction::handler(ctx)
    }

    /// Trade — buy power (main chaos trigger)
    pub fn trade(ctx: Context<Trade>, amount: u64) -> Result<()> {
        instructions::trade::handler(ctx, amount)
    }

    /// Attack a territory
    pub fn attack_territory(ctx: Context<AttackTerritory>) -> Result<()> {
        instructions::attack_territory::handler(ctx)
    }
}
