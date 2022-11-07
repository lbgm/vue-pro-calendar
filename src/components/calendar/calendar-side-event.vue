<template>
  <div
    ref="eventContainer"
    :data-date-start="datetime_start"
    :data-date-end="datetime_end"
    :data-evendate="eventDate"
    class="select-none w-full mb-2 mt-[1.125rem]"
  >
    <!-- events header -->
    <div
      class="w-full day-header text-005743 font-bold text-[0.813rem] leading-5 mb-2"
    >
      <span class="mr-1 capitalize">
        {{
          /calendar/i.test(dateLabel(eventDate))
            ? $t(`${dateLabel(eventDate)}`)
            : dateLabel(eventDate)
        }}
      </span>
      <span class="font-normal">
        {{ eventDate.toLocaleDateString($i18n.locale) }}
      </span>
    </div>
    <!-- events -->
    <div class="w-full">
      <!--items-->
      <template v-if="RdvsPkg.length === 0">
        <span class="text-09101D text-left font-medium text-xs">
          {{ $t("calendar.no_events") }}
        </span>
      </template>
      <template v-else>
        <div
          class="active:animate-pulse more-event-body--item flex flex-row space-x-2 flex-nowrap items-start p-2 pr-4 bg-transparent mb-2 cursor-pointer"
          v-for="(rdv, rdvi) in RdvsPkg"
          :key="rdvi"
          role="button"
          aria-label="Event"
          @click="viewEvent(rdv?.id)"
        >
          <span
            class="more-event-body-item-dot block bg-3B82F6 h-3 w-3 rounded-full flex-shrink-0"
          />
          <div class="w-full flex-shrink more-event-body-item-body">
            <div class="font-semibold text-A1A1AA leading-4 text-[0.688rem]">
              <span
                :data-event-date="rdv?.date"
                :title="isoStringToDate(rdv?.date).toLocaleString('fr')"
              >
                {{ hours(rdv?.date) }}:{{ minutes(rdv?.date) }}
              </span>
              &nbsp;-&nbsp;
              <span :title="''"> __:__ </span>
            </div>
            <div
              class="font-medium text-xs text-09101D flex flex-nowrap items-center"
            >
              <span
                :title="username(rdv)"
                class="inline-block capitalize truncate max-w-[50%]"
              >
                {{ username(rdv) }}
              </span>
              &nbsp;-&nbsp;
              <span class="text-A1A1AA capitalize truncate">
                {{ rdv.user.engineType ? rdv.user.engineType.name : "" }}
              </span>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface Props {
  eventDate: Date;
}

import { onMounted, ref, watch, computed } from "vue";
import type { Ref } from "vue";
import {
  dateLabel,
  twoDigit,
  isoStringToDate,
  incrementTime,
  fixDateTime,
  hours,
  minutes,
  username,
} from "./common";

import { useEventsStore } from "@/stores/events";

const props = withDefaults(defineProps<Props>(), {});

const eventContainer: Ref<HTMLElement | null> = ref(null);

const datetime_start: Ref<Date | null> = ref(null);
const datetime_end: Ref<Date | null> = ref(null);

//events containers
const RdvsPkg: Ref<any[]> = ref([]);

const store = useEventsStore();

// computed on store state
const calendarEvents = computed(() => store.getEvents);

//filt and Retrive <Event /> data
const eventEvents = () => {
  const start = datetime_start.value as Date;
  const end = datetime_end.value as Date;

  RdvsPkg.value = calendarEvents.value.filter((rdv: unknown) => {
    const d = isoStringToDate((rdv as { date: Date }).date);
    return d >= start && d < end;
  });
};

const viewEvent = (id: string | number | unknown) => {
  const event = new CustomEvent("calendar.request.view", {
    detail: { id },
  });
  document.body.dispatchEvent(event);
};

onMounted(() => {
  // transform props binding to datetime
  datetime_start.value = fixDateTime(props.eventDate as Date, "");
  datetime_end.value = fixDateTime(props.eventDate as Date, incrementTime(""));
  //
  eventEvents();
});
</script>

<style lang="scss" scoped>
.more-event-body--item:hover {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
}

.more-event-body-item-dot {
  position: relative;
  top: 2px;
}
</style>
