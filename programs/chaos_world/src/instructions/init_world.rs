use anchor_lang::prelude::*;
use crate::state::WorldState;

/// Initialize the world state (one-time admin action)
pub fn handler(ctx: Context<InitWorld>) -> Result<()> {
    let world = &mut ctx.accounts.world_state;
    world.authority = ctx.accounts.authority.key();
    world.chaos_level = 0;
    world.total_transactions = 0;
    world.last_event_timestamp = Clock::get()?.unix_timestamp;
    world.faction_count = 0;
    world.last_event_type = 0;
    world.bump = ctx.bumps.world_state;

    msg!("🌀 Chaos World initialized!");
    Ok(())
}

#[derive(Accounts)]
pub struct InitWorld<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + WorldState::INIT_SPACE,
        seeds = [b"world_state"],
        bump,
    )]
    pub world_state: Account<'info, WorldState>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}
