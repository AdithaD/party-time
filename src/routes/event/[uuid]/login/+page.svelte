<script>
	let { form } = $props();
</script>

<svelte:head>
	<title>Login | Party Time</title>
	<meta
		name="description"
		content="A login page for an event link where users will register their name."
	/>
</svelte:head>

<div class="flex h-screen items-center justify-center bg-gradient-to-t from-base-100 to-base-200">
	<form
		method="POST"
		class="m-4 flex flex-grow flex-col gap-2 rounded-xl bg-base-100 p-10 shadow-md xl:w-1/3"
	>
		<h1 class="text-2xl font-bold">Who are you?</h1>
		<label class="label" for="name">Name</label>
		<input id="name" name="name" class="input w-full" />
		<label class="label" for="password">Password (optional)</label>
		<input id="password" name="password" type="password" class="input mb-4 w-full" />
		<button class="btn btn-primary">Submit</button>
		<p>{form?.message}</p>
	</form>
</div>
