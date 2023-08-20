<template>
  <div
    data-widget-item="calendar-datepicker"
    class="bg-white border w-full border-E0E0E0 rounded flex justify-between flex-shrink flex-nowrap items-center relative selectDate select-none"
  >
    <!-- selected date -->
    <span class="block p-2 text-09101D capitalize text-xs leading-4">
      {{ selectedDate ? displayDate : "YYYY-MM-AA" }}
    </span>
    <!--icon -->
    <font-awesome-icon
      icon="fa-solid fa-calendar"
      fixed-width
      class="text-base text-71717A mr-2"
    ></font-awesome-icon>
    <!---->
    <input
      ref="dateinput"
      name="vue-pro-calendar-datepicker"
      id="vue-pro-calendar-datepicker"
      v-model="selectedDate"
      type="date"
      @change="emitDate"
    />
  </div>
</template>

<script setup lang="ts">
export interface Props {
  value?: Date;
}

import {
  ref,
  toRef,
  watch,
  computed,
  inject,
  onMounted,
  type ComponentPublicInstance,
} from "vue";
import type { Ref } from "vue";
import { dateLabel } from "./common";

type CalendarDateInput = HTMLInputElement & {
  showPicker(): void;
};

const $t: any = inject("$t");
const props = withDefaults(defineProps<Props>(), {
  value: () => new Date(),
});
const emit = defineEmits(["changed"]);

const dateToString = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

const selectedDate: Ref<string> = ref(dateToString(props.value));
const dateinput: Ref<ComponentPublicInstance<HTMLInputElement>> = ref<
  ComponentPublicInstance<HTMLInputElement>
>() as Ref<ComponentPublicInstance<HTMLInputElement>>;

const emitDate = (event: Event): void => {
  void event;
  if (!selectedDate.value) selectedDate.value = dateToString(new Date());
  //
  emit("changed", new Date(selectedDate.value));
};

const displayDate = computed<string>((): string => {
  const _nd = new Date(selectedDate.value);

  return /calendar/i.test(dateLabel(_nd))
    ? $t(`${dateLabel(_nd)}`)
    : dateLabel(_nd);
});

watch(props, () => {
  selectedDate.value = dateToString(props.value);
});

onMounted(() => {
  if ("showPicker" in HTMLInputElement.prototype) {
    dateinput.value.addEventListener("click", (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
      (event.target as CalendarDateInput).showPicker();
    });
  } else
    console.error("HTMLInputElement.prototype: `showPicker` not supported");
});

defineExpose({
  selectedDate,
});
</script>

<style scoped lang="scss">
input[type="date"],
input[type="date"]::-webkit-calendar-picker-indicator {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  box-sizing: border-box;
  cursor: pointer;
}
</style>
