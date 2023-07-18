<template>
  <div
    class="calendar-day-toggle select-none flex flex-row flex-nowrap items-center transition-all min-w-16dt563"
  >
    <!---->
    <a
      v-for="(tab, index) in tabs"
      :key="index"
      href="#"
      class="text-71717A py-0dt375 px-4 inline-flex font-medium text-sm leading-5 flex-shrink-0 items-center justify-center hover:opacity-80 active:animate-pulse cursor-pointer"
      :class="{
        'rounded-md bg-14-165-233 text-white hover:opacity-90':
          viewModel === tab,
        'bg-white': viewModel !== tab,
      }"
      @click.stop.prevent="changeView(tab as T_View)"
    >
      {{ $t(`calendar.${tab}`) }}
    </a>
    <!---->
  </div>
</template>

<script setup lang="ts">
export interface Props {
  view?: T_View;
}

import {
  defineComponent,
  onMounted,
  ref,
  computed,
  toRefs,
  toRef,
  watch,
} from "vue";
import type { Ref } from "vue";
import { E_View, type T_View } from "@/stores/events";

const props = withDefaults(defineProps<Props>(), {
  view: "week",
});

const emit = defineEmits(["calendar:view-changed"]);

const viewModel: Ref<T_View> = ref(props.view); //'week' is default
const tabs: Ref<Record<string, string>> = ref({
  ...Object.fromEntries(Object.entries(E_View)),
});

const changeView = (state: T_View): void => {
  viewModel.value = state;
};

watch(viewModel, () => {
  emit("calendar:view-changed", viewModel.value);
});

watch(props, () => {
  if (props.view) {
    changeView(props.view);
  }
});

onMounted(() => {
  emit("calendar:view-changed", viewModel.value);
});
</script>
