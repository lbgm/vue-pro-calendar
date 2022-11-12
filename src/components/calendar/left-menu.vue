<template>
  <div class="w-full h-full bg-F4F6F9 max-w-20rm flex-shrink-0 p-4 pb-0">
    <!--closer and loader-->
    <div class="flex flex-row flex-wrap items-center justify-between">
      <CloseButton @tap="$emit('calendar:close')" />
      <slot name="loader" />
    </div>
    <!-- date picker -->
    <div class="mt-4">
      <DatePicker
        ref="calendar_date_picker"
        title-position="left"
        is-expanded
        :locale="{ id: $i18n.locale, masks: { weekdays: 'WWW' } }"
        transition="fade"
        v-model="datepicked"
        :attributes="datePickerAttrs"
      >
        <template #header-left-button>
          <span :title="$t('calendar.previous_month')"><ChevronLeft /></span>
        </template>

        <template #header-right-button>
          <span :title="$t('calendar.next_month')"><ChevronRight /></span>
        </template>

        <template #header-title="page">
          <div
            class="date-picker--header-title flex flex-row flex-nowrap space-x-1 flex-shrink-0 items-center"
          >
            <span
              class="font-medium text-2xl text-09101D text-left leading-10 capitalize"
            >
              {{ page.monthLabel }}
            </span>
            <span class="text-2xl text-6D7580 text-left leading-10">
              {{ page.yearLabel }}
            </span>
          </div>
        </template>
      </DatePicker>
    </div>
    <!-- slot: ? side events -->
    <slot name="sideEvent" />
    <!-- copyright -->
    <span class="mt-4 block text-xs leading-3 text-18181B">
      &copy;&thinsp;<LinkAction
        href="https://www.linkedin.com/in/lbgm/"
        target="_blank"
        :direct-link="true"
        text="lbgm"
      />
      & Contributors
    </span>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import CloseButton from "./close-button.vue";
import { DatePicker } from "v-calendar";
import ChevronLeft from "./assets/chevron-left.vue";
import ChevronRight from "./assets/chevron-right.vue";
import LinkAction from "@/components/link-action.vue";

import type { Ref } from "vue";

const datepicked: Ref<Date> = ref(new Date());

const calendar_date_picker = ref(null);

const datePickerAttrs = ref([
  {
    highlight: {
      color: "#3B82F6",
      fillMode: "solid",
    },
  },
]);

const emit = defineEmits(["calendar:datepicker", "calendar:close"]);

watch(datepicked, () => {
  emit("calendar:datepicker", new Date(datepicked.value));
});

onMounted(() => {
  emit("calendar:datepicker", new Date(datepicked.value));
});

defineExpose({
  datepicked,
});
</script>

<style lang="scss" scoped>
:deep(.vc-container) {
  background: transparent;
  border: 0;
  border-color: transparent;
  box-shadow: none;
}

:deep(.vc-nav-popover-container) {
  background-color: rgb(14, 165, 233);
  border-color: rgb(14, 165, 233);
}

:deep(.vc-nav-item) {
  &:hover {
    background-color: rgba(255, 255, 255, 0.4);
    border: 0;
  }
  &.is-current {
    border: 1px solid rgba(255, 255, 255, 0.5);
  }
  &:focus {
    background-color: rgba(255, 255, 255, 0.2);
    border: 0;
  }
}

:deep(.vc-nav-arrow),
:deep(.vc-nav-title) {
  &:hover,
  &:active,
  &:focus {
    background-color: rgba(255, 255, 255, 0.3);
    border: 0;
  }
}

:deep(.vc-header) {
  padding: 0;
}

:deep(.vc-day.is-not-in-month *) {
  color: #71717a;
  opacity: 1;
}

:deep(.vc-weeks) {
  font-family: Montserrat;
  font-size: 11px;
  font-style: normal;
  font-weight: 600;
  line-height: 16px;
  color: #09101d;
}

:deep(.vc-weekday) {
  font-size: 10px;
  font-style: normal;
  font-weight: 600;
  line-height: 16px;
  color: #71717a;
  text-transform: uppercase;
}

:deep(.vc-highlights .vc-highlight) {
  background: #2062f6 !important;
}

:deep(.vc-weekday) {
  border-bottom: 0;
}

:deep(.date-picker--header-title) {
  font-family: "Montserrat";
}
</style>
