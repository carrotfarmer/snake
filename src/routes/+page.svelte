<script lang="ts">
	import { genRandomNum } from '$lib';
	import { onMount } from 'svelte';

	type Box = 'empty' | 'snake' | 'food';
	type Grid = Box[];

	let grid: Grid = [...Array(480)].map((el) => (el = 'empty'));
	let snake: number[] = [115];
	let direction: string = '';
	let food: number = 0;
	let score: number = 0;
	let speed: number = 250;

	let gameOver: boolean = false;

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

	const updateGrid = (): void => {
		grid = grid.map((_, i) => {
			if (grid[i] !== 'food') {
				return 'empty';
			}
			return grid[i];
		});

		snake.forEach((el) => {
			grid[el] = 'snake';
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

    if (newHead % 24 === 0 && direction === "right") {
      gameOver = true;
      return;
    }

    if ((newHead + 1) % 24 === 0 && direction === "left") {
      console.log("LEFT HIT")
      gameOver = true;
      return;
    }

		snake.unshift(newHead);

		if (newHead === food) {
			food = genRandomNum();
			grid[food] = 'food';
			score++;
			speed > 125 ? (speed -= 20) : speed;
		} else {
			snake.pop();
		}

		updateGrid();
	};

	onMount(() => {
		food = genRandomNum();
		grid[food] = 'food';

		food = genRandomNum();
		grid[food] = 'food';
		console.log(speed);
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
		}
	};

	const resetGame = () => {
		score = 0;
		gameOver = false;
		snake = [115];
		direction = '';
		speed = 250;
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
	{/if}

	<div class="pt-5 flex justify-center">
		<div class="grid grid-cols-24 gap-[1px]">
			{#each grid as box}
				<div class={`w-6 h-6 ${boxStyle(box)}`} />
			{/each}
		</div>
	</div>
</div>
