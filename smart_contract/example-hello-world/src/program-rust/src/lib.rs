use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program::{invoke, invoke_signed},
    program_error::ProgramError,
    pubkey::Pubkey,
    sysvar::{rent::Rent, Sysvar},
};
use spl_token::state::Account as TokenAccount;
//use spl_token::instruction::{mint_to, transfer};

// Data structures
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct UserAccount {
    pub is_initialized: bool,
    pub user_type: UserType,
    pub token_balance: u64, // Track user's token balance for access control
}

#[derive(BorshSerialize, BorshDeserialize, Debug, PartialEq, Copy, Clone)]
pub enum UserType {
    Creator,
    Viewer,
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct ContentAccess {
    pub creator_pubkey: [u8; 32], // Store Pubkey as a byte array
    pub ipfs_cid: String, // IPFS hash for storing content
    pub required_tokens: u64, // Token threshold for access
}

impl ContentAccess {
    pub fn new(creator_pubkey: &Pubkey, ipfs_cid: String, required_tokens: u64) -> Self {
        Self {
            creator_pubkey: creator_pubkey.to_bytes(),
            ipfs_cid,
            required_tokens,
        }
    }
}

// Entry point for the Solana program
entrypoint!(process_instruction);

fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    match instruction_data[0] {
        0 => register_user(program_id, accounts, instruction_data), // Register user
        1 => mint_tokens(program_id, accounts, instruction_data),    // Mint tokens
        2 => access_content(program_id, accounts, instruction_data), // Access content
        _ => Err(ProgramError::InvalidInstructionData),
    }
}

// Function to register users
fn register_user(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let user_account = next_account_info(accounts_iter)?;
    let creator_account = next_account_info(accounts_iter)?;

    if user_account.owner != program_id {
        msg!("User account does not have the correct program id");
        return Err(ProgramError::IncorrectProgramId);
    }

    let mut user_data = UserAccount::try_from_slice(&user_account.data.borrow())?;
    if user_data.is_initialized {
        msg!("User already registered.");
        return Err(ProgramError::AccountAlreadyInitialized);
    }

    let user_type = match instruction_data[1] {
        0 => UserType::Creator,
        1 => UserType::Viewer,
        _ => return Err(ProgramError::InvalidInstructionData),
    };

    user_data.is_initialized = true;
    user_data.user_type = user_type;
    user_data.token_balance = 0;
    user_data.serialize(&mut &mut user_account.data.borrow_mut()[..])?;


    Ok(())
}

// Initializes content access for a creator
fn initialize_content_access(
    creator_account: &AccountInfo,
    data: Vec<u8>,
) -> ProgramResult {
    let ipfs_cid = String::from_utf8(data[0..46].to_vec()).expect("Invalid CID data");
    let required_tokens = u64::from_le_bytes(
        data[46..].try_into().expect("Invalid token requirement data"),
    );

    let content_access = ContentAccess::new(creator_account.key, ipfs_cid, required_tokens);
    content_access.serialize(&mut &mut creator_account.data.borrow_mut()[..])?;

    msg!(
        "Content access initialized with CID: {}, Tokens Required: {}",
        content_access.ipfs_cid,
        content_access.required_tokens
    );

    Ok(())
}

// Function to mint tokens to a user’s account
fn mint_tokens(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let mint = next_account_info(accounts_iter)?;
    let recipient_token_account = next_account_info(accounts_iter)?;
    let authority = next_account_info(accounts_iter)?;
    let token_program = next_account_info(accounts_iter)?;

    let amount = u64::from_le_bytes(instruction_data[1..9].try_into().unwrap());

    let mint_instruction = spl_token::instruction::mint_to(
        token_program.key,
        mint.key,
        recipient_token_account.key,
        authority.key,
        &[],
        amount,
    )?;

    invoke_signed(
        &mint_instruction,
        &[
            mint.clone(),
            recipient_token_account.clone(),
            authority.clone(),
            token_program.clone(),
        ],
        &[&[b"authority"]],
    )?;

    msg!("Minted {} tokens to recipient account", amount);
    Ok(())
}

// Function to access content based on token balance
fn access_content(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let user_account = next_account_info(accounts_iter)?;
    let creator_account = next_account_info(accounts_iter)?;
    let user_token_account = next_account_info(accounts_iter)?;
    let creator_token_account = next_account_info(accounts_iter)?;
    let token_program = next_account_info(accounts_iter)?;
    let authority = next_account_info(accounts_iter)?;

    let content_access = ContentAccess::try_from_slice(&creator_account.data.borrow())?;
    let token_balance = get_token_balance(user_token_account)?;

    if token_balance < content_access.required_tokens {
        msg!(
            "Insufficient tokens for access. Required: {}, Available: {}",
            content_access.required_tokens,
            token_balance
        );
        return Err(ProgramError::InsufficientFunds);
    }

    let transfer_instruction = spl_token::instruction::transfer(
        token_program.key,
        user_token_account.key,
        creator_token_account.key,
        authority.key,
        &[],
        content_access.required_tokens,
    )?;

    invoke(
        &transfer_instruction,
        &[
            user_token_account.clone(),
            creator_token_account.clone(),
            authority.clone(),
            token_program.clone(),
        ],
    )?;

    msg!("Access granted to content with CID: {}", content_access.ipfs_cid);
    Ok(())
}

// Helper function to fetch the token balance
fn get_token_balance(token_account: &AccountInfo) -> Result<u64, ProgramError> {
    let token_data = token_account.try_borrow_data()?;
    let balance_bytes = &token_data[0..8];
    let token_balance = u64::from_le_bytes(balance_bytes.try_into().unwrap());
    Ok(token_balance)
}




