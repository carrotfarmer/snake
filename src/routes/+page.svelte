<script lang="ts">
	import { DEFAULT_SPEED, MAP_SIZE, genRandomNum, getLocalStorage, setLocalStorage } from '$lib';
	import { onMount } from 'svelte';
	import { Button } from '$components/ui/button';

	type Box = 'empty' | 'snake' | 'food' | 'head';
	type Grid = Box[];

	let grid: Grid = [...Array(MAP_SIZE)].map((el) => (el = 'empty'));
	let snake: number[] = [115];
	let direction: string = '';
	let score: number = 0;
	let highScore: number = 0;
	let speed: number = DEFAULT_SPEED;

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

		let thud = new Audio('/thud.mp3');

		if (snake.length > 1 && snake.includes(newHead)) {
			gameOver = true;
			thud.play();
			return;
		}

		if (newHead < 0 || newHead > MAP_SIZE - 1) {
			gameOver = true;
			thud.play();
			return;
		}

		if (newHead % 24 === 0 && direction === 'right') {
			gameOver = true;
			thud.play();
			return;
		}

		if ((newHead + 1) % 24 === 0 && direction === 'left') {
			gameOver = true;
			thud.play();
			return;
		}

		snake.unshift(newHead);

		if (grid[newHead] === 'food') {
			genFood(1);
			score++;

			let audio = new Audio('/crunch.mov');
			audio.play();

			if (score > highScore) {
				highScore = score;
				setLocalStorage(score);
			}

			if (speed > 80) {
				speed -= 20;
			}
		} else {
			snake.pop();
		}

		updateGrid();
	};

	const genFood = (amt: number): void => {
    const empty = grid.map((el, i) => (el === 'empty' ? i : -1)).filter((el) => el !== -1);

    for (let i = 0; i < amt; i++) {
      const rand = genRandomNum(empty.length - 1) 
      grid[empty[rand]] = 'food';
    }
	};

	onMount(() => {
		highScore = getLocalStorage();
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
		speed = DEFAULT_SPEED;
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
	<div class="flex justify-center gap-20">
		<div class="text-center pt-4">
			score: <p class="font-bold text-4xl">{score}</p>
		</div>
		<div class="text-center pt-4">
			high score: <p class="font-bold text-4xl">{highScore}</p>
		</div>
	</div>

	{#if gameOver}
		<div class="flex justify-center pt-3">
			<h3 class="scroll-m-20 text-2xl font-semibold tracking-tight">u ded</h3>
		</div>
		<div class="flex flex-row gap-5 justify-center pt-3">
			<div>
				<Button on:click={resetGame}>play again</Button>
			</div>
			<div>
				<p class="text-lg pt-2">
					or press <code
						class="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
					>
						enter
					</code>
					to restart
				</p>
			</div>
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
