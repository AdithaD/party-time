<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<div class="flex h-screen items-center justify-center">
	<div class="h-[60vh] w-1/4">
		<h1 class="mb-8 text-4xl font-bold">It's Party Time</h1>
		<form method="POST" use:enhance class="space-y-4">
			<input name="title" placeholder="Event Title" class="input" minlength={1} />
			<button class="btn btn-primary">Create a New Event</button>
		</form>
	</div>
</div>
