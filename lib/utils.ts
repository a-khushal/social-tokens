import {clsx, type ClassValue} from "clsx";
import { twMerge } from "tailwind-merge";
import { Schema, serialize, deserialize } from "borsh";


export function cn(...inputs: ClassValue[]){
  return twMerge(clsx(inputs));
}
export enum UserType{
  Creator = 0,
  Viewer =1,
}

export class UserAccount{
  owner: Uint8Array;
  is_initialized: boolean;
  userType: UserType;
  token_balance: bigint;

  static scheme: Schema = new Map([
    [
      UserAccount,
      {
        kind: "struct",
        fields: [
          ["owner", [32]],
          ["is_initialized", "u8"],
          ["userType", "u8"],
          ["token_balance", "u64"],
        ],
      }],
  ]);

  constructor(obj: {owner: Uint8Array; is_initialized: boolean; userType: UserType; token_balance: bigint;}){
    this.owner = obj.owner;
    this.is_initialized = obj.is_initialized;
    this.userType = obj.userType;
    this.token_balance = obj.token_balance;
  }

}

export function serializeUserAccount(userAccount: UserAccount): Uint8Array{
  return serialize(UserAccount.scheme, userAccount);
}

export function deserializeUserAccount(data: Buffer): UserAccount{
  return deserialize(UserAccount.scheme, UserAccount, data);
}


export class ContentAccess{
  creator_pubkey: Uint8Array;
  ipfs_cid: string;
  required_tokens: bigint;

  static schema: Schema = new Map([
    [
      ContentAccess,
      {
        kind: "struct",
        fields: [
          ["creator_pubkey",[32]],
          ["ipfs_cid", [32]],
          ["required_tokens", "u64"],
        ],
      }],
  ]);

  constructor(obj: {creator_pubkey: Uint8Array; ipfs_cid: string; required_tokens: bigint;}){
    this.creator_pubkey = obj.creator_pubkey;
    this.ipfs_cid = obj.ipfs_cid;
    this.required_tokens = obj.required_tokens;
  }
}
export function serializeContentAccess(contentAccess: ContentAccess): Uint8Array{
  return serialize(ContentAccess.schema, contentAccess);
}

export function deserializeContentAccess(data: Buffer): ContentAccess{
  return deserialize(ContentAccess.schema, ContentAccess, data);
}


// import { clsx, type ClassValue } from "clsx"
// import { twMerge } from "tailwind-merge"
// import {Schema, serialize, deserialize} from "borsh"
// import { PublicKey } from "@solana/web3.js"

// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs))
// }

// export enum UserType{
//   Creator = 0,
//   Viewer = 1,
// }

// export class UserAccount{
//   owner: PublicKey;
//   userType: UserType;

//   static schema: Schema = new Map([
//     [UserAccount,
//       {
//         kind: 'struct',
//         fields: [
//           ['owner',[32]],
//           ['userType', 'u8'],
//         ]
//       }],
//   ]);
//   constructor(obj: {
//     owner: Uint8Array;
//     userType: UserType
//   }){
//     this.owner = new PublicKey(obj.owner);
//     this.userType = obj.userType;
//   }
//   serialize(): Uint8Array{
//     return serialize(UserAccount.schema, this);
//   }

//   deserialize(data: Buffer): UserAccount{
//     return deserialize(UserAccount.schema, UserAccount, data);
//   }
// }




// export class UserAccount {
//   owner: PublicKey;
//   userType: UserType;

//   constructor(properties: { owner: Uint8Array; userType: UserType }) {
//     this.owner = new PublicKey(properties.owner);
//     this.userType = properties.userType;
//   }
// }

// const UserAccountSchema = (new Map<any, any>([
//   [
//     UserAccount,
//     {
//       kind: "struct",
//       fields: [
//         ["owner", [32]],
//         ["userType", "u8"], 
//       ],
//     },
//   ],
// ]) as unknown) as Schema;

// export function serializeUserAccount(userAccount: UserAccount): Uint8Array {
//   return serialize(UserAccountSchema, userAccount);
// }

// export function deserializeUserAccount(data: Uint8Array): UserAccount {
//   return deserialize(UserAccountSchema, data) as UserAccount;
// }
