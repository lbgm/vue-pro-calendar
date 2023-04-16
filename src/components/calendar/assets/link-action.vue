<template>
  <a
    v-if="!directLink"
    href="#"
    class="underline inline-flex items-center font-medium text-2062F6 text-xs leading-relaxed hover:opacity-80 active:animate-pulse"
    @click.prevent.stop="$emit('clicked')"
  >
    <span
      v-if="hasIconSlot"
      class="inline-flex items-center justify-center"
      :class="{
        'mr-2': iconmgl === 2,
        'mr-1': iconmgl === 1,
      }"
    >
      <slot name="icon" />
    </span>
    <span class="truncate">
      {{ text }}
    </span>
  </a>
  <!-- v-else -->
  <a
    v-else
    href="#"
    class="underline inline-flex items-center font-medium text-2062F6 text-xs leading-relaxed hover:opacity-80 active:animate-pulse"
  >
    <span
      v-if="hasIconSlot"
      class="inline-flex mr-2 items-center justify-center"
    >
      <slot name="icon" />
    </span>
    <span class="truncate">
      {{ text }}
    </span>
  </a>
</template>

<script setup lang="ts">
export interface Props {
  text?: string | number;
  directLink?: boolean;
  iconmgl?: number;
}

import { computed, useSlots } from "vue";

const props = withDefaults(defineProps<Props>(), {
  text: "",
  directLink: false,
  iconmgl: 2,
});

const slots = useSlots();
const emit = defineEmits(["clicked"]);

const hasIconSlot = computed<boolean>(() => {
  return !!slots.icon;
});
</script>
