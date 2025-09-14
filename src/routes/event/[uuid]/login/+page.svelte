<script>
	import * as Form from '$lib/components/ui/form';

	let { form } = $props();
</script>

<div class="">
	<form method="POST" class="flex w-1/4 flex-col rounded-xl bg-white p-4 shadow-md">
		<h1>Sign in</h1>
		<input name="name" class="" />
		<input name="password" type="password" />
		<button class="btn btn-primary">Submit</button>
		<p>{form?.message}</p>
	</form>
</div>
