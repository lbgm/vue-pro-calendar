<template>
  <div
    ref="eventContainer"
    :data-date-start="datetime_start"
    :data-date-end="datetime_end"
    :data-evendate="eventDate"
    class="w-full"
  >
    <!-- event side -->
    <div
      data-widget-item="event--button"
      class="cursor-pointer rounded event-card border-l-[0.188rem] border-0EA5E9 hover:opacity-80 active:animate-pulse"
      ref="eventSide"
      @click="openEvtList()"
    >
      <!-- 1 event -->
      <div
        v-if="RdvsPkg.length === 1"
        class="event-body select-none w-full p-1.5"
      >
        <div class="single-event-inf">
          <span
            :data-rdv-date="RdvsPkg[0].date"
            :title="isoStringToDate(RdvsPkg[0].date).toLocaleString('fr')"
            class="block text-left text-09101D font-medium text-xs"
          >
            {{ hours(RdvsPkg[0].date) }}:{{ minutes(RdvsPkg[0].date) }}
          </span>
          <div class="font-semibold text-0369A1 text-sm leading-4">
            <span
              :title="username(RdvsPkg[0])"
              class="block text-left capitalize truncate"
            >
              {{ username(RdvsPkg[0]) }}
            </span>
            <span class="block">
              <span class="text-left text-[1.563rem] leading-4 event-dot"
                >&#183;</span
              >
              &nbsp;
              <span class="text-left">
                {{
                  RdvsPkg[0].user.engineType
                    ? RdvsPkg[0].user.engineType.name
                    : ""
                }}
              </span>
            </span>
          </div>
        </div>
      </div>
      <!-- more than 1 event-->
      <div
        v-else-if="RdvsPkg.length > 1"
        class="event-body select-none w-full p-1.5"
      >
        <span
          class="font-semibold text-0369A1 text-sm leading-4 block text-left"
        >
          {{ RdvsPkg.length }}&nbsp;{{ "rendez-vous" }}
        </span>
      </div>
    </div>

    <!--------------------------------- popups zone ------------------------------->

    <!-- single event popup -->
    <div
      class="absolute z-[1] w-full bg-white rounded-lg p-3 flex flex-col single-event-popup"
      v-if="openSingleEvent"
      :class="{ 'right-0': popupr, 'bottom-full': popupb }"
      ref="eventList"
    >
      <!-- we use eventList here just to get popupr or popupb -->
      <LinkAction
        @clicked="viewEvent(RdvsPkg[0]?.id)"
        class="mb-2"
        :text="$t('calendar.view')"
      >
        <template #icon><BlueEye /></template>
      </LinkAction>
      <!---->
      <LinkAction
        @clicked="$emit('report:event', RdvsPkg[0]?.id)"
        :text="'Reporter'"
        class="block !text-E07A2C"
      >
        <template #icon><OrangeUpdate /></template>
      </LinkAction>
    </div>

    <!-- more than one Event list popup -->
    <div
      class="overflow-y-auto custom-scrll max-h-[18.75rem] absolute z-[1] min-w-[24.813rem] bg-white more-event-body rounded-lg p-3"
      :class="{ 'right-0': popupr, 'bottom-full': popupb }"
      v-if="openEventList"
      ref="eventList"
    >
      <!-- item -->
      <div
        class="more-event-body--item flex flex-row flew-wrap space-x-4 p-2 bg-white border-b"
        v-for="(rdv, rdvi) in RdvsPkg"
        :key="rdvi"
      >
        <!--event informations-->
        <div class="flex-grow flex flex-row space-x-2 flex-nowrap items-start">
          <span
            class="more-event-body-item-dot block bg-3B82F6 h-3 w-3 rounded-full flex-shrink-0"
          />
          <div class="w-full grow flex-shrink more-event-body-item-body">
            <!--title-->
            <div class="font-semibold text-A1A1AA leading-4 text-[0.688rem]">
              <span
                :data-rdv-date="rdv.date"
                :title="isoStringToDate(rdv.date).toLocaleString('fr')"
              >
                {{ hours(rdv.date) }}:{{ minutes(rdv.date) }}
              </span>
              &nbsp;-&nbsp;
              <span :title="''"> --:-- </span>
            </div>
            <!--name and engin-->
            <div class="font-medium text-xs text-09101D">
              <span :title="username(rdv)" class="capitalize">
                {{ username(rdv) }}
              </span>
              &nbsp;-&nbsp;
              <span class="text-A1A1AA capitalize truncate">
                {{ rdv.user.engineType ? rdv.user.engineType.name : "" }}
              </span>
            </div>
          </div>
        </div>
        <!-- event actions -->
        <div class="flex flex-row space-x-4 flex-nowrap max-w-max items-center">
          <LinkAction
            @clicked="viewEvent(rdv?.user?.kyc?.id)"
            :text="$t('calendar.view')"
          >
            <template #icon><BlueEye /></template>
          </LinkAction>
          <!---->
          <LinkAction
            @clicked="$emit('report:event', rdv?.id)"
            :text="'Reporter'"
            class="!text-E07A2C"
          >
            <template #icon><OrangeUpdate /></template>
          </LinkAction>
        </div>
      </div>
    </div>
    <!---->
  </div>
</template>

<script setup lang="ts">
export interface Props {
  eventDate: Object | Date;
  eventTime?: string;
}

import { useEventsStore } from "@/stores/events";
import LinkAction from "@/components/link-action.vue";
import BlueEye from "./assets/blue-eye.vue";
import OrangeUpdate from "./assets/orange-update.vue";
import { onMounted, ref, watch, computed } from "vue";
import type { Ref } from "vue";
import {
  twoDigit,
  isoStringToDate,
  incrementTime,
  fixDateTime,
  hours,
  minutes,
  username,
} from "./common";

const props = withDefaults(defineProps<Props>(), {
  eventTime: "",
});

const store = useEventsStore();
const eventContainer: Ref<HTMLElement | null> = ref(null);
const eventSide = ref(null);
const eventList = ref(null);
const openEventList = ref(false);
const openSingleEvent = ref(false);

const datetime_start: Ref<Date | null> = ref(null);
const datetime_end: Ref<Date | null> = ref(null);

// to define popup position
const popupr = ref(false);
const popupb = ref(false);

//events containers
const RdvsPkg: Ref<any[]> = ref([]);

const closeEventList = () => {
  openEventList.value = false;
  // to hide single event popup
  openSingleEvent.value = false;
};

const openEvtList = () => {
  const _bpos = (eventSide.value as any).getBoundingClientRect();
  const _bpar = (
    document.querySelector('[data-widget-item="calendar-inside"]') as any
  ).getBoundingClientRect();
  if (RdvsPkg.value.length > 1) openEventList.value = true;
  else if (RdvsPkg.value.length === 1) openSingleEvent.value = true;
  //set automatically popup position, right or left
  popupr.value = _bpar.width < _bpos.x;
  popupb.value = _bpos.y > _bpar.height * 0.8;
};

// computed on store state
const calendarEvents = computed(() => store.getEvents);

//filt and Retrive <Event /> data
const eventEvents = () => {
  const _start = datetime_start.value as Date;
  const _end = datetime_end.value as Date;

  RdvsPkg.value = calendarEvents.value.filter((rdv: unknown) => {
    const _d = isoStringToDate((rdv as { date: Date }).date);
    return _d >= _start && _d < _end;
  });
};

const viewEvent = (id: string | number | unknown) => {
  const event = new CustomEvent("calendar.request.view", {
    detail: { id },
  });
  document.body.dispatchEvent(event);
};

onMounted(() => {
  document.addEventListener("click", (event) => {
    if (
      eventContainer.value &&
      !(eventContainer.value as HTMLElement).contains(
        event.target as Node | null
      )
    ) {
      closeEventList();
    }
  });
  // transform props binding to datetime
  datetime_start.value = fixDateTime(props.eventDate as Date, props.eventTime);
  datetime_end.value = fixDateTime(
    props.eventDate as Date,
    incrementTime(props.eventTime)
  );
  //
  eventEvents();
});
</script>

<style lang="scss" scoped>
.event-card {
  background: rgba(14, 165, 233, 0.1);
}

.event-dot {
  position: relative;
  top: 2px;
  left: 4px;
}

.more-event-body,
.single-event-popup {
  margin-top: -16px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.more-event-body--item {
  border-color: rgba(0, 0, 0, 0.15);
}

.more-event-body-item-dot {
  position: relative;
  top: 2px;
}

.more-event-body--item:last-child {
  border: 0;
}
</style>
