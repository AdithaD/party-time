// See https://svelte.dev/docs/kit/types#app.d.ts

import type { User } from "$lib/server/db/schema";
import type { Session } from "$lib/server/session";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: Omit<User, "passwordHash"> | null;
			session: Session | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export { };
