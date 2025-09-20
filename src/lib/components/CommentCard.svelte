<script lang="ts">
	import type { Comment } from '$lib/server/db/schema';

	import { formatDistance } from 'date-fns';
	let { comment }: { comment: Comment & { user: { name: string } } } = $props();
</script>

<div class="group relative chat-end chat shadow-sm card-sm">
	<div class="parent chat-bubble">
		<div class="flex items-baseline gap-4">
			<h2 class="card-title">{comment.user.name}</h2>
			<div class="text-neutral">
				{formatDistance(comment.createdAt, new Date(), { addSuffix: true })}
			</div>
		</div>
		<p>
			{comment.text}
		</p>
		<div
			class="absolute right-1 -bottom-2 opacity-0 transition-all group-hover:visible group-hover:opacity-100"
		>
			<div class="flex justify-end">
				<form method="POST" action="?/deleteComment">
					<input hidden value={comment.id} name="id" />
					<button class="btn btn-xs">delete</button>
				</form>
			</div>
		</div>
	</div>
</div>
