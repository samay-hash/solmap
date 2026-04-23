use anchor_lang::prelude::*;
use crate::state::Player;

/// Register a new player
pub fn handler(ctx: Context<RegisterPlayer>) -> Result<()> {
    let player = &mut ctx.accounts.player;
    player.wallet = ctx.accounts.user.key();
    player.faction_id = 0;
    player.power = 0;
    player.join_timestamp = Clock::get()?.unix_timestamp;
    player.total_trades = 0;
    player.bump = ctx.bumps.player;

    msg!("⭐ Player registered: {}", player.wallet);
    Ok(())
}

#[derive(Accounts)]
pub struct RegisterPlayer<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + Player::INIT_SPACE,
        seeds = [b"player", user.key().as_ref()],
        bump,
    )]
    pub player: Account<'info, Player>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}
