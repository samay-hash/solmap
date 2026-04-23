use anchor_lang::prelude::*;
use crate::state::{WorldState, Faction, Player};
use crate::errors::ChaosError;

/// Join an existing faction
pub fn handler(ctx: Context<JoinFaction>) -> Result<()> {
    let player = &mut ctx.accounts.player;
    require!(player.faction_id == 0, ChaosError::AlreadyInFaction);

    let faction = &mut ctx.accounts.faction;
    player.faction_id = faction.faction_id;
    player.power += 10;
    faction.member_count += 1;
    faction.power += 10;

    let world = &mut ctx.accounts.world_state;
    world.chaos_level = world.chaos_level.saturating_add(2).min(100);
    world.total_transactions += 1;

    msg!("🤝 Player joined faction '{}'! Chaos +2", faction.name);
    Ok(())
}

#[derive(Accounts)]
pub struct JoinFaction<'info> {
    #[account(
        mut,
        seeds = [b"player", user.key().as_ref()],
        bump = player.bump,
    )]
    pub player: Account<'info, Player>,

    #[account(mut)]
    pub faction: Account<'info, Faction>,

    #[account(
        mut,
        seeds = [b"world_state"],
        bump = world_state.bump,
    )]
    pub world_state: Account<'info, WorldState>,

    pub user: Signer<'info>,
}
