<template>
  <character-list></character-list>
</template>

<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount } from "vue";
import CharacterList from "./views/dashboard/character-list/character-list.vue";
import { setup, teardown } from "./legacy-js/character-list.js";

onBeforeMount(() => {
  setup();
});

onBeforeUnmount(() => {
  teardown();
});
</script>

<style scoped>
</style>
