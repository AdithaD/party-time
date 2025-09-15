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
</script>

<div class="card w-full bg-base-200 shadow-sm card-sm">
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
					<div class="flex justify-between rounded-md bg-base-100 p-4 shadow-md">
						<div class="space-x-2">
							<input
								type="radio"
								class="radio radio-primary"
								name="option"
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
				{/each}
			</div>
		</form>
	</div>
</div>
