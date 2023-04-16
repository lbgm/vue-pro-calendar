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
          view_type === tab,
        'bg-white': view_type !== tab,
      }"
      @click.prevent="changeViewType(tab)"
    >
      {{ $t(`calendar.${tab}`) }}
    </a>
    <!---->
  </div>
</template>

<script setup lang="ts">
export interface Props {
  view?: string;
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
import { viewSupported } from "./common";

const props = withDefaults(defineProps<Props>(), {
  view: "",
});

const emit = defineEmits(["calendar:viewtype"]);

const view_type: Ref<string> = ref("week"); //'week' is default
const tabs: Ref<Record<string, string>> = ref({
  ...viewSupported,
});

const changeViewType = (state: string): void => {
  if (!state) return void 0;
  view_type.value = state;
};

watch(view_type, () => {
  emit("calendar:viewtype", view_type.value);
});

watch(props, () => {
  if (props.view) {
    changeViewType(props.view);
  }
});

onMounted(() => {
  emit("calendar:viewtype", view_type.value);
});
</script>
