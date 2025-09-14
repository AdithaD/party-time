<script lang="ts">
	let { data } = $props();

	let postMode = $state<'none' | 'comment' | 'poll' | 'payment'>('none');
</script>

<div class="relative flex h-screen items-stretch justify-center space-x-8">
	<div class="w-1/3 bg-base-100 p-16 shadow-2xl">
		<div class="mb-4 flex justify-between">
			<h1 class="text-4xl font-bold">{data.event.title}</h1>
			<a class="btn btn-neutral" href={`/event/${data.event.id}/edit`}>Edit</a>
		</div>
		<form method="POST" action="?/registerInterest">
			<button class="btn {data.user.registered ? 'btn-error' : 'btn-primary'}" type="submit">
				{data.user.registered ? 'Leave' : 'Register'}
			</button>
		</form>
		<hr class="my-8" />
		<div class="space-y-4">
			<h2 class="mb-4 font-semibold">Details</h2>
			<div class="space-y-4">
				<div class="flex space-x-4">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="size-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
						/>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
						/>
					</svg>
					<div>{data.event.location ?? 'Undecided'}</div>
				</div>
				<div class="flex space-x-4">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="size-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
						/>
					</svg>
					<div>
						{data.event.scheduledTime?.toLocaleString() ?? 'Undecided'} - {data.event.endTime?.toLocaleString()}
					</div>
				</div>
			</div>
			<div class="flex space-x-4">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
					/>
				</svg>
				<div>
					{data.users.map((user) => user.name).join(', ')}
				</div>
			</div>
			<div>
				<p>{data.event.description}</p>
			</div>
			<div>
				<h2 class="mb-2 font-semibold">Polls</h2>
			</div>
		</div>
	</div>
	<div class="flex w-1/3 flex-col bg-base-100 p-16 shadow-2xl">
		<h2 class="text-2xl font-bold">Posts</h2>
		<div class="flex-grow"></div>
		<hr class="my-8" />
		<div class="flex justify-center space-x-4">
			<button class="btn btn-neutral">+ Comment</button>
			<button class="btn btn-neutral">+ Poll</button>
			<button class="btn btn-neutral">+ Payment</button>
		</div>
	</div>
</div>
