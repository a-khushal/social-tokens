import GoogleProvider from "next-auth/providers/google";
import db from "@/app/db"
import { Session } from "next-auth"

export interface session extends Session {
    user: {
        email: string;
        name: string;
        image: string;
        uid: string;
    }
}

export const AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
        })
    ],

    secret: process.env.NEXTAUTH_SECRET,

    callbacks: {
        async jwt({token, account}: unknown) {
            const user = await db.user.findFirst({
                where: {
                    sub: account?.providerAccountId ?? ""
                }
            })

            if(user) {
                token.uid = user.id
            }
            
            return token;
        }, 
        async session({ session, token }: unknown) {
            const newSession: session = session as session

            if(newSession.user && token.uid) {
                newSession.user.uid = token.uid ?? "";
            }

            return newSession;
        },
        async signIn({ user, account, profile }: unknown) {
            if(account?.provider === 'google') {
                const email = user.email

                if(!email) {
                    return false
                }

                const userDb = await db.user.findUnique({
                    where: {
                        email
                    }
                })

                if(userDb) {
                    return true
                }

                await db.user.create({
                    data: {
                        email: email,
                        name: profile?.name,
                        profilePicture: profile?.picture,
                        provider: "Google",
                        sub: account.providerAccountId,
                    }
                })

                return true
            }
            
            return false
        }
    },
};

