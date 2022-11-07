<template>
  <!--calendar week-view-->
  <div data-widget-item="calendar-inside">
    <!--calendar--header-->
    <div
      class="calendar--week-view--header grid grid-cols-[3rem,repeat(7,minmax(0,1fr)),3rem] grid-flow-col w-full"
    >
      <!--time-column-cell-->
      <div class="time-header" />
      <!--day-column-cell-->
      <div
        class="select-none day-header w-full pt-1 px-2 pb-4 text-left border-b border-E0E0E0"
        v-for="(weekDayDate, weekindex) in weekDays"
        :class="{
          'border-r': weekindex !== weekDays.length - 1,
          'bg-FAFAFA': weekindex === weekDays.length - 1,
          'bg-EFF6FF': weekDayDate.getDate() === dateSelected.getDate(),
        }"
        :key="weekindex"
      >
        <!--dayname-->
        <span
          class="block text-71717A font-bold text-[0.625rem] leading-3 uppercase"
        >
          {{ dayName(weekDayDate, weekDayDate.getDate()).slice(0, -1) }}
        </span>
        <!--daynumber-->
        <span class="block text-black font-medium text-[1.375rem] leading-8">{{
          weekDayDate.getDate()
        }}</span>
      </div>
      <!--time-column-cell-->
      <div class="time-header" />
    </div>
    <!--calendar--row-->
    <div
      v-for="time in dayTimes"
      :key="time"
      class="calendar--week-view--row grid grid-cols-[3rem,repeat(7,minmax(0,1fr)),3rem] grid-flow-col w-full"
    >
      <!--time-row-cell-->
      <div
        class="select-none time-cell text-left text-71717A font-medium text-xs"
      >
        {{ time }}
      </div>
      <!--day-row-cell-->
      <div
        class="relative select-none day-cell w-full text-left border-b border-E0E0E0"
        v-for="(weekDayDate, weekindex) in weekDays"
        :class="{
          'border-r': weekindex !== weekDays.length - 1,
          'bg-FAFAFA': weekindex === weekDays.length - 1,
          'bg-EFF6FF': weekDayDate.getDate() === dateSelected.getDate(),
        }"
        :key="weekindex"
      >
        <!-- events are here -->
        <span class="block w-full min-h-[2.25rem] border-b border-F7F7F7" />
        <span class="block w-full min-h-[2.25rem]" />
        <!-- custom events -->
        <Events
          class="absolute top-0"
          :eventDate="weekDayDate"
          :eventTime="time"
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

<script>
import Events from "./calendar-event.vue";
import {
  twoDigitTime,
  incrementTime,
  fixDateTime,
  randomId,
  dayName,
  copyDate,
} from "./common";

export default {
  components: {
    Events,
  },
  props: {
    weekDays: {
      type: Array,
      default: () => [],
    },

    dateSelected: {
      type: Object,
      required: true,
    },

    dayTimes: {
      type: Array,
      default: () => [],
    },
  },

  setup() {
    return {
      dayName,
    };
  },
};
</script>

<style lang="scss" scoped></style>
