<script>
	let { form } = $props();
</script>

<div class="flex h-screen items-center justify-center">
	<form method="POST" class="flex w-1/4 flex-col gap-3 rounded-xl bg-base-100 p-4 shadow-md">
		<h1 class="text-2xl font-bold">Who are you?</h1>
		<label for="name">Name</label>
		<input id="name" name="name" class="input w-full" />
		<label for="password">Password (optional)</label>
		<input name="password" type="password" class="input mb-4 w-full" />
		<button class="btn btn-primary">Submit</button>
		<p>{form?.message}</p>
	</form>
</div>
