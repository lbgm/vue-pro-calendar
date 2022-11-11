<template>
  <div
    class="select-none flex flex-row flex-nowrap items-center transition-all min-w-16dt563"
  >
    <!---->
    <a
      v-for="(tab, index) in tabs"
      :key="index"
      href="#"
      class="bg-white text-71717A py-0dt375 px-4 inline-flex font-medium text-sm leading-5 flex-shrink-0 items-center justify-center hover:opacity-80 active:animate-pulse cursor-pointer"
      :class="{
        'rounded-md bg-14-165-233 text-white hover:opacity-90':
          view_type === tab,
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
  setView?: string;
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

const props = withDefaults(defineProps<Props>(), {
  setView: "",
});

const emit = defineEmits(["calendar:viewtype", "calendar:viewtype"]);

const view_type: Ref<string> = ref("week"); //'week' is default
const getSetView = toRef(props, "setView");
const tabs = ref({
  day: "day",
  week: "week",
  month: "month",
});

const changeViewType = (state: string) => {
  view_type.value = state;
};

watch(view_type, () => {
  emit("calendar:viewtype", view_type.value);
});

onMounted(() => {
  // in case of view_type requested
  if (getSetView.value.length !== 0) changeViewType(getSetView.value);
  else emit("calendar:viewtype", view_type.value);
});
</script>
