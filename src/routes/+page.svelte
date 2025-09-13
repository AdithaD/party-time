<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Form from '$lib/components/ui/form';

	let { data } = $props();
</script>

<div class="h-[60vh] w-1/2">
	<h1 class="mb-8 text-4xl font-bold">It's Party Time</h1>
	<form method="POST" use:enhance class="space-y-4">
		<Input name="title" placeholder="Event Title" class="input" minlength={1} />
		<Form.Button>Create a New Event</Form.Button>
	</form>
</div>
