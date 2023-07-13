<script lang="ts">
	import { genRandomNum } from '$lib';
	import { onMount } from 'svelte';

	type Box = 'empty' | 'snake' | 'food';
	type Grid = Box[];

	let grid: Grid = [...Array(480)].map((el) => (el = 'empty'));

	const boxStyle = (boxType: Box): string => {
		switch (boxType) {
			case 'snake':
				return 'bg-green-500';
			case 'food':
				return 'bg-red-500';
			default:
				return 'bg-gray-300';
		}
	};

	onMount(() => {
		const snakeSpawnPos = genRandomNum();
		grid[snakeSpawnPos] = 'snake';
	});

	// @ts-ignore
	const move = (e) => {
		e = e || window.event;

		if (e.keyCode == '38') {
			// up arrow
			console.log('up');
		} else if (e.keyCode == '40') {
			// down arrow
			console.log('down');
		} else if (e.keyCode == '37') {
			// left arrow
			console.log('left');
		} else if (e.keyCode == '39') {
			// right arrow
			console.log('right');
		}
	};
</script>

<svelte:window on:keydown={move} />

<div>
	<h1 class="text-3xl text-center font-bold pt-5">svelte snake</h1>

	<div class="pt-5 flex justify-center">
		<div class="grid grid-cols-24 gap-[1px]">
			{#each grid as box}
				<div class={`w-6 h-6 ${boxStyle(box)}`} />
			{/each}
		</div>
	</div>
</div>
