<!-- routes/roll/[roll_id]/(components)/DevDetails.svelte -->
<script lang="ts">
	import CreateComplexRecordDialog from '$lib/components/custom/CreateComplexRecordDialog.svelte';
	import RichTextEditor from '$lib/components/custom/RichTextEditor.svelte';
	import DetailsAreaTrigger from './DetailsAreaTrigger.svelte';

	let { labs } = $props(); // Recibimos labs como prop

	let isNewDevDetailsDialogOpen = $state(false);
	let selectedLab = $state('');
	let notesContent = $state('');
</script>

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
