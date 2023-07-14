<script lang="ts">
	import { genRandomNum } from '$lib';
	import { onMount } from 'svelte';

	type Box = 'empty' | 'snake' | 'food' | 'head';
	type Grid = Box[];

	let grid: Grid = [...Array(480)].map((el) => (el = 'empty'));
	let snake: number[] = [115];
	let direction: string = '';
	let score: number = 0;
	let speed: number = 250;

	let gameOver: boolean = false;

	const boxStyle = (boxType: Box): string => {
		switch (boxType) {
			case 'snake':
				return 'bg-green-500';
			case 'food':
				return 'bg-red-500';
			case 'head':
				return 'bg-green-700';
			default:
				return 'bg-gray-300';
		}
	};

	const updateGrid = (): void => {
		grid = grid.map((_, i) => {
			if (grid[i] !== 'food') {
				return 'empty';
			}
			return grid[i];
		});

		snake.forEach((el) => {
			if (el === snake[0]) {
				grid[el] = 'head';
			} else {
				grid[el] = 'snake';
			}
		});
	};

	const moveSnake = (): void => {
		if (gameOver) return;

		const head = snake[0];

		let newHead = head;

		if (direction === 'up') {
			newHead -= 24;
		} else if (direction === 'down') {
			newHead += 24;
		} else if (direction === 'left') {
			newHead -= 1;
		} else if (direction === 'right') {
			newHead += 1;
		}

		if (snake.length > 1 && snake.includes(newHead)) {
			gameOver = true;
			return;
		}

		if (newHead < 0 || newHead > 479) {
			gameOver = true;
			return;
		}

		if (newHead % 24 === 0 && direction === 'right') {
			gameOver = true;
			return;
		}

		if ((newHead + 1) % 24 === 0 && direction === 'left') {
			gameOver = true;
			return;
		}

		snake.unshift(newHead);

		if (grid[newHead] === "food") {
			genFood(1);
			score++;
			speed > 80 ? (speed -= 20) : speed;
		} else {
			snake.pop();
		}

		updateGrid();
	};

	const genFood = (amt: number): void => {
		for (let i = 0; i < amt; i++) {
			let food = genRandomNum();
			grid[food] = 'food';
		}
	};

	onMount(() => {
		genFood(2);
	});

	const handleKeyDown = (e: KeyboardEvent): void => {
		if (e.key === 'ArrowUp' && direction !== 'down') {
			direction = 'up';
		} else if (e.key === 'ArrowDown' && direction !== 'up') {
			direction = 'down';
		} else if (e.key === 'ArrowLeft' && direction !== 'right') {
			direction = 'left';
		} else if (e.key === 'ArrowRight' && direction !== 'left') {
			direction = 'right';
		} else if (e.key === 'Enter' && gameOver) {
			resetGame();
		}
	};

	const resetGame = () => {
		score = 0;
		gameOver = false;
		snake = [115];
		direction = '';
		speed = 250;
		grid = grid.map((el) => (el = 'empty'));
		genFood(2);
	};

	const fn = () => {
		moveSnake();
		setTimeout(fn, speed);
	};

	fn();

	$: score = score;
</script>

<svelte:window on:keydown={handleKeyDown} />

<div>
	<h1 class="text-3xl text-center font-bold pt-5">svelte snake</h1>
	<div class="text-center pt-4">
		score: <p class="font-bold text-4xl">{score}</p>
	</div>

	{#if gameOver}
		<div class="text-center text-2xl font-bold">game over</div>

		<div class="flex justify-center pt-3">
			<button class="bg-black p-4 rounded-lg text-white hover:bg-slate-900" on:click={resetGame}
				>play again</button
			>
		</div>

		<div class="pt-3 flex justify-center">
			<p>
				press <kbd class="p-1 bg-red-200 rounded-lg font-mono">enter</kbd> to restart
			</p>
		</div>
	{/if}

	<div class="pt-5 flex justify-center">
		<div class="grid grid-cols-24 gap-[1px]">
			{#each grid as box}
				<div class={`w-6 h-6 ${boxStyle(box)}`} />
			{/each}
		</div>
	</div>
</div>
