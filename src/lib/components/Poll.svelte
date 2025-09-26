<script lang="ts">
	type ExpandedPoll = {
		title: string;
		id: number;
		description: string | null;
		event: string;
		createdAt: Date;
		pollOptions: {
			poll: number;
			id: number;
			value: string;
			votes: {
				poll: number;
				user: string & {
					id: string;
					name: string;
				};
				pollOption: number;
			}[];
		}[];
	};

	import { formatDistance } from 'date-fns';
	let {
		poll,
		userId
	}: {
		poll: ExpandedPoll;
		userId: string;
	} = $props();

	let optionForm: HTMLFormElement;

	$inspect(poll);

	const totalVotes = poll.pollOptions.map((po) => po.votes.length).reduce((a, b) => a + b);
</script>

<div class="group card relative w-full bg-base-300 shadow-sm card-sm">
	<div class="card-body space-y-4">
		<div class="flex items-baseline gap-4">
			<h2 class="card-title">{poll.title}</h2>
			<div class="text-neutral">
				{formatDistance(poll.createdAt, new Date(), { addSuffix: true })}
			</div>
		</div>
		<form id="{poll.id}-poll" bind:this={optionForm} method="POST" action="?/updateVote">
			<input name="poll" value={poll.id} hidden />
			<div class="card flex flex-col items-stretch space-y-4">
				{#each poll.pollOptions as option}
					<div class="rounded-md bg-base-100 p-4 shadow-md">
						<div class="flex justify-between">
							<div class="space-x-2">
								<input
									type="radio"
									class="radio radio-primary"
									name="pollOption"
									id="{poll.id}-{option.id}"
									checked={option.votes.find((v) => v.user.id == userId) != null}
									value={option.id}
									onchange={() => optionForm.requestSubmit()}
								/>
								<label for="{poll.id}-{option.id}">{option.value}</label>
							</div>
							<div>
								{option.votes.map((v) => v.user.name).join(', ')}
							</div>
						</div>
						<progress class="progress progress-primary" max={totalVotes} value={option.votes.length}
						></progress>
					</div>
				{/each}
			</div>
		</form>
		<div
			class="absolute right-4 -bottom-2 opacity-0 transition-all group-hover:visible group-hover:opacity-100"
		>
			<div class="flex justify-end">
				<form method="POST" action="?/deletePoll">
					<input hidden value={poll.id} name="id" />
					<button class="btn btn-xs">delete</button>
				</form>
			</div>
		</div>
	</div>
</div>
