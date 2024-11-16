import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {Schema, serialize, deserialize} from "borsh"
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export enum UserType{
  Creator = 0,
  Viewer = 1,
}
export class UserAccount {
  owner: Uint8Array;
  userType: UserType;
  static schema: Schema = new Map([
    [UserAccount,
      {
        kind: 'struct',
        fields: [
          ['owner',[32]],
          ['userType', 'u8'],
        ]
      }],
  ]);
  constructor(properties: { owner: Uint8Array; userType: UserType }) {
    this.owner = properties.owner;
    this.userType = properties.userType;
  }
}
export function serializeUserAccount(userAccount: UserAccount): Uint8Array {
  return serialize(UserAccount.schema, userAccount);
}
export function deserializeUserAccount(data: Buffer): UserAccount {
  return deserialize(UserAccount.schema, UserAccount, data) as UserAccount;
}
