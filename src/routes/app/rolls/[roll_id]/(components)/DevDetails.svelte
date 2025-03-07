<!-- routes/roll/[roll_id]/(components)/DevDetails.svelte -->
<script lang="ts">
	import CreateComplexRecordDialog from '$lib/components/custom/CreateComplexRecordDialog.svelte';
	import Rating from '$lib/components/custom/Rating.svelte';
	import RichTextEditor from '$lib/components/custom/RichTextEditor.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import DetailsAreaTrigger from './DetailsAreaTrigger.svelte';

	let { labs, devDetail } = $props(); // Recibimos labs como prop

	let isNewDevDetailsDialogOpen = $state(false);
	let selectedLab = $state('');
	let notesContent = $state('');
	$inspect(devDetail);
</script>

{#if devDetail}
	<div class="flex flex-col space-y-4">
		<div class="flex flex-col space-y-1">
			<h2 class="text-lg font-semibold">Laboratory</h2>
			<p>{devDetail.lab.name}</p>
		</div>
		<div class="flex flex-col space-y-1">
			<h2 class="text-lg font-semibold">Score</h2>
			<Badge variant="outline" class="mr-auto"
				><Rating rating={devDetail.score} dateCreated={devDetail.created_at} /></Badge
			>
		</div>
		<div class="flex flex-col space-y-1">
			<h2 class="mb-2 text-lg font-semibold">Notes</h2>
			<Separator />
			<div class="prose-sm prose-neutral">
				{@html devDetail.notes}
			</div>
		</div>
	</div>
{:else}
	<CreateComplexRecordDialog
		bind:open={isNewDevDetailsDialogOpen}
		actionUrl="?/createDevDetail"
		title="Add Development Details"
		description="Add notes about the development process..."
		successMessage="Details added successfully 🎉"
		invalidateKey="devDetails"
		width="w-[80vw] max-w-[700px]"
		fields={[
			{
				id: 'lab_id',
				label: 'Laboratory',
				type: 'select',
				required: true,
				options: labs
					.filter((l: { active: any }) => l.active)
					.map((lab: { id: any; name: any }) => ({
						value: lab.id,
						label: lab.name
					}))
			},
			{
				id: 'score',
				label: 'Rating (0-5)',
				type: 'number',
				min: 0,
				max: 5,
				step: 0.5,
				required: false,
				placeholder: '4.5'
			},
			{
				id: 'notes',
				label: 'Development Notes',
				type: 'custom',
				component: RichTextEditor,
				onSave: (content: string) => (notesContent = content)
			}
		]}
	>
		<DetailsAreaTrigger slot="trigger" />
	</CreateComplexRecordDialog>
{/if}
