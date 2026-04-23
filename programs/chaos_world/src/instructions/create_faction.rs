use anchor_lang::prelude::*;
use crate::state::{WorldState, Faction};
use crate::errors::ChaosError;

/// Create a new faction
pub fn handler(ctx: Context<CreateFaction>, name: String, faction_id: u8) -> Result<()> {
    require!(name.len() <= 32, ChaosError::FactionNameTooLong);
    require!(faction_id >= 1 && faction_id <= 3, ChaosError::InvalidFaction);

    let world = &mut ctx.accounts.world_state;
    require!(world.faction_count < 3, ChaosError::MaxFactionsReached);

    let faction = &mut ctx.accounts.faction;
    faction.name = name;
    faction.leader = ctx.accounts.creator.key();
    faction.power = 100;
    faction.member_count = 1;
    faction.territory_count = 0;
    faction.treasury = 0;
    faction.faction_id = faction_id;
    faction.bump = ctx.bumps.faction;

    world.faction_count += 1;
    world.chaos_level = world.chaos_level.saturating_add(5).min(100);
    world.total_transactions += 1;

    msg!("🏛️ Faction '{}' created! Chaos +5", faction.name);
    Ok(())
}

#[derive(Accounts)]
#[instruction(name: String, faction_id: u8)]
pub struct CreateFaction<'info> {
    #[account(
        init,
        payer = creator,
        space = 8 + Faction::INIT_SPACE,
        seeds = [b"faction", &[faction_id]],
        bump,
    )]
    pub faction: Account<'info, Faction>,

    #[account(
        mut,
        seeds = [b"world_state"],
        bump = world_state.bump,
    )]
    pub world_state: Account<'info, WorldState>,

    #[account(mut)]
    pub creator: Signer<'info>,

    pub system_program: Program<'info, System>,
}
