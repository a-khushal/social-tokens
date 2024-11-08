import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {Schema, serialize, deserialize} from "borsh"
import { PublicKey } from "@solana/web3.js"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export enum UserType{
  Creator = 0,
  Viewer = 1,
}

export class UserAccount {
  owner: PublicKey;
  userType: UserType;

  constructor(properties: { owner: Uint8Array; userType: UserType }) {
    this.owner = new PublicKey(properties.owner);
    this.userType = properties.userType;
  }
}

const UserAccountSchema = (new Map<any, any>([
  [
    UserAccount,
    {
      kind: "struct",
      fields: [
        ["owner", [32]],
        ["userType", "u8"], 
      ],
    },
  ],
]) as unknown) as Schema;

export function serializeUserAccount(userAccount: UserAccount): Uint8Array {
  return serialize(UserAccountSchema, userAccount);
}

export function deserializeUserAccount(data: Uint8Array): UserAccount {
  return deserialize(UserAccountSchema, data) as UserAccount;
}