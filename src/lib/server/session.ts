import { db } from "./db";
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";

import { sessions, users, type User } from "$lib/server/db/schema";
import type { RequestEvent } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    const session = await db.query.sessions.findFirst({
        where: eq(sessions.id, sessionId),
    })

    if (!session) {
        return { session: null, user: null };
    }


    if (Date.now() >= session.expiresAt.getTime()) {
        await db.delete(sessions).where(eq(sessions.id, session.id))
        return { session: null, user: null };
    }
    if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
        session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
        await db.update(sessions).set({ expiresAt: session.expiresAt }).where(eq(sessions.id, session.id));
    }
    const user = await db.query.users.findFirst({ where: eq(users.id, session.user), columns: { passwordHash: false } });

    if (!user) {
        return { session: null, user: null }
    }

    return { session, user };
}

export async function invalidateSession(sessionId: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.id, sessionId))
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date): void {
    event.cookies.set("session", token, {
        httpOnly: true,
        path: "/",
        secure: import.meta.env.PROD,
        sameSite: "lax",
        expires: expiresAt
    });
}

export function deleteSessionTokenCookie(event: RequestEvent): void {
    event.cookies.set("session", "", {
        httpOnly: true,
        path: "/",
        secure: import.meta.env.PROD,
        sameSite: "lax",
        maxAge: 0
    });
}

export function generateSessionToken(): string {
    const tokenBytes = new Uint8Array(20);
    crypto.getRandomValues(tokenBytes);
    const token = encodeBase32LowerCaseNoPadding(tokenBytes).toLowerCase();
    return token;
}

export async function createSession(token: string, userId: string, eventId: string): Promise<Session> {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    const session = await db.insert(sessions).values({
        id: sessionId,
        user: userId,
        event: eventId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
    }).returning();
    return session[0];
}

export interface Session {
    id: string;
    expiresAt: Date;
    user: string;
    event: string;
}

type SessionValidationResult = { session: Session; user: Omit<User, "passwordHash"> } | { session: null; user: null };