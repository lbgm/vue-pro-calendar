<template>
  <div
    class="select-none flex flex-row flex-nowrap items-center min-w-[10.125rem]"
  >
    <!--left button icon master-->
    <a
      class="bg-F4F4F5 w-7 h-7 rounded-tl-md rounded-bl-md inline-flex flex-shrink-0 items-center justify-center hover:opacity-80 active:animate-pulse cursor-pointer"
      href="#"
      @click.prevent="$emit('calendar-arrow:left')"
      :title="$t('calendar.previous_day')"
    >
      <Left />
    </a>
    <span
      class="capitalize bg-F4F4F5 text-18181B text-center py-1.5 px-4 flex-shrink-0 font-medium text-xs mx-px"
    >
      {{ label }}
    </span>
    <!--right button icon master-->
    <a
      class="bg-F4F4F5 rounded-tr-md rounded-br-md w-7 h-7 inline-flex flex-shrink-0 items-center justify-center hover:opacity-80 active:animate-pulse cursor-pointer"
      href="#"
      @click.prevent="$emit('calendar-arrow:right')"
      :title="$t('calendar.next_day')"
    >
      <Right />
    </a>
  </div>
</template>

<script setup lang="ts">
export interface Props {
  label?: string;
}

import Left from "./assets/button-master-left.vue";
import Right from "./assets/button-master-right.vue";

const props = withDefaults(defineProps<Props>(), {
  label: "dd/mm/yyyy",
});
</script>
