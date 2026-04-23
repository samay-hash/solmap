use anchor_lang::prelude::*;
use crate::state::{WorldState, Faction, Player, ChaosEventEmitted, TradeExecuted};
use crate::errors::ChaosError;

/// Execute a trade — convert SOL → faction power
/// This is the MAIN chaos trigger
pub fn handler(ctx: Context<Trade>, amount: u64) -> Result<()> {
    require!(amount > 0 && amount <= 100, ChaosError::InvalidTradeAmount);

    let player = &mut ctx.accounts.player;
    require!(player.faction_id > 0, ChaosError::NotInFaction);

    let faction = &mut ctx.accounts.faction;
    let world = &mut ctx.accounts.world_state;

    // Update power
    let power_gain = amount * 10;
    player.power += power_gain;
    faction.power += power_gain;
    player.total_trades += 1;

    // Update world state
    world.total_transactions += 1;
    world.chaos_level = world.chaos_level.saturating_add(3).min(100);
    world.last_event_timestamp = Clock::get()?.unix_timestamp;

    // Emit trade event
    emit!(TradeExecuted {
        player: player.wallet,
        faction_id: faction.faction_id,
        amount,
        new_power: faction.power,
        chaos_level: world.chaos_level,
    });

    // ═══ CHAOS ENGINE CHECK ═══
    let clock = Clock::get()?;
    let seed = (clock.unix_timestamp as u64)
        ^ world.total_transactions
        ^ (world.chaos_level as u64);
    let roll = seed % 100;

    if world.chaos_level > 80 && roll < 25 {
        // WAR EVENT
        world.last_event_type = 1;
        let target_faction_id = (faction.faction_id % 3) + 1;

        emit!(ChaosEventEmitted {
            event_type: 1,
            chaos_level: world.chaos_level,
            faction_id: faction.faction_id,
            target_faction_id,
            impact: -20,
            timestamp: clock.unix_timestamp,
        });

        msg!("⚔️ WAR EVENT! Faction {} attacks Faction {}!", faction.faction_id, target_faction_id);
    } else if world.chaos_level > 50 && roll < 12 {
        // BETRAYAL
        world.last_event_type = 2;

        emit!(ChaosEventEmitted {
            event_type: 2,
            chaos_level: world.chaos_level,
            faction_id: faction.faction_id,
            target_faction_id: 0,
            impact: -15,
            timestamp: clock.unix_timestamp,
        });

        msg!("🗡️ BETRAYAL! Internal sabotage in faction {}!", faction.faction_id);
    } else if roll < 8 {
        // AIRDROP
        world.last_event_type = 3;
        faction.power += 25;

        emit!(ChaosEventEmitted {
            event_type: 3,
            chaos_level: world.chaos_level,
            faction_id: faction.faction_id,
            target_faction_id: 0,
            impact: 25,
            timestamp: clock.unix_timestamp,
        });

        msg!("✨ POWER SURGE! Faction {} gains +25 power!", faction.faction_id);
    }

    msg!("💰 Trade: {} power → {} | Chaos: {}", power_gain, faction.name, world.chaos_level);
    Ok(())
}

#[derive(Accounts)]
pub struct Trade<'info> {
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
