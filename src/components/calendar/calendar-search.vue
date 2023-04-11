<template>
  <div
    class="min-w-11dt5 bg-F4F4F5 border border-F4F4F5 rounded px-1 py-0dt375 flex flex-shrink-0 flex-nowrap items-center space-x-2"
    :title="$t('calendar.search_tip')"
    :aria-label="$t('calendar.search_tip')"
  >
    <span class="inline-flex flex-whrink-0">
      <template v-if="slots.searchIcon">
        <component :is="slots.searchIcon" />
      </template>
      <template v-else>
        <Icon />
      </template>
    </span>
    <input
      v-typing="{
        finish: typingFinish,
        run: typingRun,
        timing,
      }"
      @input="handleInput($event)"
      :placeholder="placeholder || tr('calendar.search')"
      class="bg-F4F4F5 flex-shrink w-full text-xs text-left text-A1A1AA font-medium appearance-none border-0 outline-none focus:font-bold"
      type="text"
    />
  </div>
</template>

<script setup lang="ts">
import type { Slots } from "vue";

export interface Props {
  placeholder?: string;
  timing?: number;
  slots: Slots;
}

import Icon from "./assets/search-icon.vue";
import { typing } from "@/assets/directives";
import { inject, computed } from "vue";

const vTyping = { ...typing };

const tr: any = inject("$t");

const props = withDefaults(defineProps<Props>(), {
  placeholder: "",
  timing: 200,
});

const emit = defineEmits([
  "calendar:search",
  "typing:finished",
  "typing:running",
]);

const handleInput = (event: Event): void => {
  emit("calendar:search", (event.target as HTMLInputElement).value);
};

const typingFinish = (event: Event): void => {
  emit("typing:finished", (event.target as HTMLInputElement).value);
};

const typingRun = (event: Event): void => {
  emit("typing:running", (event.target as HTMLInputElement).value);
};
</script>

<style>
.text {
  font-size: 12px;
}
</style>
