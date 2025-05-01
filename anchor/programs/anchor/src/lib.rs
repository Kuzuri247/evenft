use anchor_lang::prelude::*;

declare_id!("3GUbnxw466eagkVxL5fP4Z3EYn5yfv3Ch6sMofzBCRqq");

#[program]
pub mod anchor {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
