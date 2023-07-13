<script lang="ts">
	type Box = 'empty' | 'snake' | 'food';
	type Grid = Box[];

	let grid: Grid = [...Array(480)].map((el) => (el = 'empty'));

  const boxStyle = (boxType: Box): string => {
    if (boxType === "empty") {
      return "bg-gray-300"
    } else if (boxType === "snake") {
      return "bg-green-500"
    } else {
      return "bg-red-500"
    }
  }
</script>

<div>
	<h1 class="text-3xl text-center font-bold pt-5">svelte snake</h1>

	<div class="pt-5 flex justify-center">
    <div class="grid grid-cols-24 gap-1">
		{#each grid as box}
			<div class={`w-6 h-6 border-1px border-gray-500 bg-gray-500 ${boxStyle(box)}`} />
		{/each}
    </div>
	</div>
</div>
