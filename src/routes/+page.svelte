<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<svelte:head>
	<title>Party Time</title>
	<meta
		name="description"
		content="Party Time makes it easy to create a shareable event planning page where friends can add their availability, keep up with updates, and vote on polls."
	/>
</svelte:head>
<div class="flex min-h-screen flex-col bg-gradient-to-t from-base-100 to-base-200">
	<div class="flex flex-grow flex-col items-center justify-center">
		<div class="flex flex-col gap-8">
			<h1 class="text-center text-4xl font-extrabold text-primary xl:text-6xl">
				🎉 It's Party Time
			</h1>
			<section class="m-4 max-w-xl rounded-2xl bg-base-100 p-10 text-center shadow-lg">
				<h2 class="mb-4 text-2xl font-bold">Plan Your Perfect Event</h2>
				<p class="mb-8">
					Party Time makes it easy to create a shareable event planning page where friends can add
					their availability, keep up with updates, and vote on polls.
				</p>

				<form class="flex flex-col justify-center gap-4 sm:flex-row" method="POST">
					<label for="title" class="sr-only">Event Name</label>
					<input
						type="text"
						id="title"
						name="title"
						placeholder="Enter your event name..."
						class="input"
						required
					/>
					<button type="submit" class="btn btn-primary"> Create Event </button>
				</form>
			</section>
		</div>
	</div>

	<footer class="py-6 text-center text-sm text-gray-500">
		&copy; <span id="year"></span> Aditha Doratiyawa. All rights reserved.
	</footer>
</div>
