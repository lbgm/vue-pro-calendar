<template>
  <!--calendar day-view-->
  <div data-widget-item="calendar-inside">
    <!--calendar--header-->
    <div
      class="calendar--day-view--header grid grid-cols-3rem-1fr-3rem grid-flow-col w-full sticky top-0 z-two"
    >
      <!--time-column-cell-->
      <div class="time-header" />
      <!--day-column-cell-->
      <div
        class="select-none day-header w-full pt-1 px-2 pb-4 text-left border-b border-E0E0E0 bg-white"
      >
        <!--dayname-->
        <span
          class="block text-71717A font-bold text-0dt625 leading-3 uppercase"
        >
          {{ dayName(dateSelected, dateSelected.getDate()).slice(0, -1) }}
        </span>
        <!--daynumber-->
        <span class="block text-black font-medium text-1dt375 leading-8">{{
          dateSelected.getDate()
        }}</span>
      </div>
      <!--time-column-cell-->
      <div class="time-header" />
    </div>
    <!--calendar--row-->
    <div
      v-for="time in dayTimes"
      :key="time"
      class="calendar--day-view--row grid grid-cols-3rem-1fr-3rem grid-flow-col w-full"
    >
      <!--time-row-cell-->
      <div
        class="time-cell select-none text-left text-71717A font-medium text-xs"
      >
        {{ timeFormat(time) }}
      </div>
      <!--day-row-cell-->
      <div
        class="relative select-none day-cell w-full text-left border-b border-E0E0E0"
        v-for="(day, dayindex) of [dateSelected]"
        :key="dayindex"
      >
        <!-- events are here -->
        <span class="block w-full min-h-2dt25 border-b border-F7F7F7" />
        <span class="block w-full min-h-2dt25" />
        <!-- event component -->
        <Events
          class="absolute top-0"
          :eventDate="day"
          :eventTime="time"
          :slots="slots"
        />
      </div>
      <!--time-row-cell-->
      <div
        class="time-cell select-none text-right text-71717A font-medium text-xs"
      >
        {{ timeFormat(time) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Slots } from "vue";

export interface Props {
  dateSelected: Date;
  dayTimes?: string[];
  slots: Slots;
}

import Events from "./calendar-event.vue";
import {
  twoDigitTime,
  incrementTime,
  fixDateTime,
  randomId,
  dayName,
  copyDate,
  timeFormat,
} from "./common";

const props = withDefaults(defineProps<Props>(), {
  dayTimes: () => [],
});
</script>

<style lang="scss" scoped>
.calendar--day-view--row {
  .time-cell {
    position: relative;
    transform: translateY(-0.5rem);
  }
}
</style>
