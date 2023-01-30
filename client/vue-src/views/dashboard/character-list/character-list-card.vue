<template>
  <div class="column is-4">
    <div
      class="card character-card is-unselectable"
      :data-char-id="character.id"
      :data-char-name="character.name"
    >
      <div class="card-content cursor-clickable pt-2">
        <a :href="`/profile/characters/${character.id}`">
          <span class="is-size-8 has-txt-noted char-id"
            ># {{ character.id }}</span
          >
          <p class="is-size-5 has-txt-value-number text-overflow-ellipsis">
            {{ character.name }}
          </p>
          <p class="is-size-7 pl-4 text-overflow-ellipsis">
            Lvl {{ character.level }} | {{ character.heritageName }}
            {{ character.className }}
          </p>
        </a>
      </div>
      <div class="card-footer is-paddingless">
        <a class="card-footer-item character-card-edit has-txt-listing">
          <template v-if="character.isPlayable">
            <span class="character-card-edit-text is-size-6 pr-1">Edit</span>
            <span class="icon is-small">
              <i class="fas fa-sm fa-edit"></i>
            </span>
          </template>
          <template v-else>
            <span class="character-card-edit-text is-size-6 pr-1"
              >Continue</span
            >
            <span class="icon is-small">
              <i class="fas fa-sm fa-wrench"></i>
            </span>
          </template>
        </a>
        <a
          class="card-footer-item character-card-options has-txt-listing"
          @click="characterOptionsModalOpen = true"
        >
          <span class="character-card-options-text is-size-6 pr-1"
            >Options</span
          >
          <span class="icon is-small">
            <i class="fas fa-sm fa-ellipsis-h"></i>
          </span>
        </a>
        <a
          class="card-footer-item character-card-delete has-txt-listing"
          style="overflow: hidden"
        >
          <span class="character-card-delete-text is-size-6 pr-1">Delete</span>
          <span class="icon is-small">
            <i class="fas fa-sm fa-trash"></i>
          </span>
        </a>
      </div>
    </div>
  </div>

  <character-list-options-modal
    :character="character"
    :can-make-character="canMakeCharacter"
    v-model="characterOptionsModalOpen"
  ></character-list-options-modal>
</template>
<script setup lang="ts">
import characterListOptionsModal from "./character-list-options-modal.vue";
import type { character } from "../../../stores/characters";
import { ref } from "vue";

const props = defineProps<{
  character: character;
  characterLimit: number;
  canMakeCharacter: boolean;
}>();

let characterOptionsModalOpen = ref(false);
</script>
<style></style>
