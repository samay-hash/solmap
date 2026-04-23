use anchor_lang::prelude::*;
use crate::state::{WorldState, Faction, Player, Territory, TerritoryAttacked};
use crate::errors::ChaosError;

/// Attack a territory — try to capture from another faction
pub fn handler(ctx: Context<AttackTerritory>) -> Result<()> {
    let player = &mut ctx.accounts.player;
    require!(player.faction_id > 0, ChaosError::NotInFaction);
    require!(player.power >= 20, ChaosError::InsufficientPower);

    let territory = &mut ctx.accounts.territory;
    require!(
        territory.owner_faction_id != player.faction_id,
        ChaosError::CannotAttackOwnTerritory
    );

    let faction = &mut ctx.accounts.faction;
    let world = &mut ctx.accounts.world_state;

    // Attack calculation
    let attack_power = faction.power * 40 / 100; // 40% of faction power
    let success = attack_power > territory.defense_power;

    if success {
        let old_owner = territory.owner_faction_id;
        territory.owner_faction_id = player.faction_id;
        territory.defense_power = attack_power / 2;
        territory.last_contested = Clock::get()?.unix_timestamp;

        faction.territory_count += 1;
        player.power = player.power.saturating_sub(20);

        world.chaos_level = world.chaos_level.saturating_add(10).min(100);

        emit!(TerritoryAttacked {
            attacker_faction: player.faction_id,
            zone_id: territory.zone_id,
            success: true,
            new_owner: player.faction_id,
        });

        msg!("🏰 Territory {} captured by faction {}!", territory.zone_id, player.faction_id);
    } else {
        player.power = player.power.saturating_sub(20);
        world.chaos_level = world.chaos_level.saturating_add(3).min(100);

        emit!(TerritoryAttacked {
            attacker_faction: player.faction_id,
            zone_id: territory.zone_id,
            success: false,
            new_owner: territory.owner_faction_id,
        });

        msg!("💥 Attack on territory {} failed!", territory.zone_id);
    }

    world.total_transactions += 1;
    world.last_event_timestamp = Clock::get()?.unix_timestamp;

    Ok(())
}

#[derive(Accounts)]
pub struct AttackTerritory<'info> {
    #[account(
        mut,
        seeds = [b"player", user.key().as_ref()],
        bump = player.bump,
    )]
    pub player: Account<'info, Player>,

    #[account(mut)]
    pub faction: Account<'info, Faction>,

    #[account(mut)]
    pub territory: Account<'info, Territory>,

    #[account(
        mut,
        seeds = [b"world_state"],
        bump = world_state.bump,
    )]
    pub world_state: Account<'info, WorldState>,

    pub user: Signer<'info>,
}
