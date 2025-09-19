<script lang="ts">
	import type { Comment } from '$lib/server/db/schema';

	import { formatDistance } from 'date-fns';
	let { comment }: { comment: Comment & { user: { name: string } } } = $props();
</script>

<div class="chat-end chat shadow-sm card-sm">
	<div class="chat-bubble">
		<div class="flex items-baseline gap-4">
			<h2 class="card-title">{comment.user.name}</h2>
			<div class="text-neutral">
				{formatDistance(comment.createdAt, new Date(), { addSuffix: true })}
			</div>
		</div>
		<p>
			{comment.text}
		</p>
	</div>
</div>
