<template>
  <!--calendar day-view-->
  <div data-widget-item="calendar-inside">
    <!--calendar--header-->
    <div
      class="calendar--day-view--header grid grid-cols-3rem-1fr-3rem grid-flow-col w-full"
    >
      <!--time-column-cell-->
      <div class="time-header" />
      <!--day-column-cell-->
      <div
        class="select-none day-header w-full pt-1 px-2 pb-4 text-left border-b border-E0E0E0"
      >
        <!--dayname-->
        <span
          class="block text-71717A font-bold text-0dt625 leading-3 uppercase"
        >
          {{ dayName(inDateView, inDateView.getDate()).slice(0, -1) }}
        </span>
        <!--daynumber-->
        <span class="block text-black font-medium text-1dt375 leading-8">{{
          inDateView.getDate()
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
        {{ time }}
      </div>
      <!--day-row-cell-->
      <div
        class="relative select-none day-cell w-full text-left border-b border-E0E0E0"
        v-for="(day, dayindex) of [inDateView]"
        :key="dayindex"
      >
        <!-- events are here -->
        <span class="block w-full min-h-2dt25 border-b border-F7F7F7" />
        <span class="block w-full min-h-2dt25" />
        <!-- custom events -->
        <Events
          class="absolute top-0"
          :eventDate="inDateView"
          :eventTime="time"
          :slots="slots"
          @report:event="$emit('report:event', $event)"
        />
      </div>
      <!--time-row-cell-->
      <div
        class="time-cell select-none text-right text-71717A font-medium text-xs"
      >
        {{ time }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Slots } from "vue";

export interface Props {
  dateSelected: string | Date;
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
} from "./common";
import { toRef } from "vue";
import type { Ref } from "vue";

const props = withDefaults(defineProps<Props>(), {
  dayTimes: () => [],
});

const inDateView: Ref<Date> = toRef(props, "dateSelected") as Ref<Date>;
</script>

<style lang="scss" scoped></style>
