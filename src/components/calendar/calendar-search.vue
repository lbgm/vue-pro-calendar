<template>
  <div
    class="min-w-[11.5rem] bg-F4F4F5 border border-F4F4F5 rounded px-1 py-1.5 flex flex-shrink-0 flex-nowrap items-center space-x-2"
  >
    <span class="inline-flex flex-whrink-0">
      <Icon />
    </span>
    <input
      v-typing="{
        finish: typingFinish,
        run: typingRun,
        timing,
      }"
      @input="handleInput($event)"
      :placeholder="placeholder"
      class="bg-F4F4F5 flex-shrink w-full text-xs text-left text-A1A1AA font-medium appearance-none border-0 outline-none focus:font-bold"
      type="text"
    />
  </div>
</template>

<script setup lang="ts">
export interface Props {
  placeholder?: string;
  timing?: number;
}

import Icon from "./assets/search-icon.vue";
import { typing } from "@/assets/directives";

const vTyping = { ...typing };

const props = withDefaults(defineProps<Props>(), {
  placeholder: "Rechercher",
  timing: 200,
});

const emit = defineEmits([
  "calendar:search",
  "typing:finished",
  "typing:running",
]);

const handleInput = (event: Event) => {
  emit("calendar:search", (event.target as HTMLInputElement).value);
};

const typingFinish = (event: Event) => {
  emit("typing:finished", (event.target as HTMLInputElement).value);
};

const typingRun = (event: Event) => {
  emit("typing:running", (event.target as HTMLInputElement).value);
};
</script>

<style>
.text {
  font-size: 12px;
}
</style>
