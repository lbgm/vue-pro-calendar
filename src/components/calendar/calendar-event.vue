<template>
  <div
    ref="eventContainer"
    :data-date-start="datetime_start"
    :data-date-end="datetime_end"
    :data-evendate="eventDate"
    class="w-full"
  >
    <template v-if="slots.eventCard">
      <component
        :is="slots.eventCard"
        :date="eventDate"
        :time="eventTime"
        :cardEvent="RdvsPkg"
      />
    </template>
    <template v-else>
      <!-- event side -->
      <div
        data-widget-item="event--button"
        class="cursor-pointer rounded event-card hover:opacity-80 active:animate-pulse calendar--event"
        ref="eventSide"
        @click.stop.prevent="openEvtList()"
      >
        <!-- 1 event -->
        <div
          v-if="RdvsPkg.length === 1"
          class="event-body select-none w-full p-0dt375"
        >
          <div class="single-event-inf">
            <span
              :data-rdv-date="RdvsPkg[0].date"
              :title="
                isoStringToDate(RdvsPkg[0].date).toLocaleString($i18n.locale)
              "
              class="block text-left text-09101D font-medium text-xs calendar--event-time"
            >
              {{
                timeFormat(
                  `${hours(RdvsPkg[0].date)}:${minutes(RdvsPkg[0].date)}`,
                  true
                )
              }}
              <!-- {{ hours(RdvsPkg[0].date) }}:{{ minutes(RdvsPkg[0].date) }} -->
            </span>
            <div class="font-semibold text-0EA5E9 text-sm leading-4">
              <span
                :title="RdvsPkg[0]?.comment ?? ''"
                class="block text-left capitalize truncate calendar--event-name"
              >
                {{ RdvsPkg[0].name }}
              </span>
              <span class="block truncate">
                <span
                  class="text-left text-1dt563 leading-4 event-dot calendar--event-dot"
                  >&#183;</span
                >
                &nbsp;
                <span
                  class="text-left calendar--event-keyword text-A1A1AA font-normal"
                >
                  {{ RdvsPkg[0].keywords }}
                </span>
              </span>
            </div>
          </div>
        </div>
        <!-- more than 1 event-->
        <div
          v-else-if="RdvsPkg.length > 1"
          class="event-body select-none w-full p-0dt375"
        >
          <span
            class="font-semibold text-0EA5E9 text-sm leading-4 block truncate text-left calendar--events-count"
          >
            {{ RdvsPkg.length }}&nbsp;{{
              configs?.eventName || $t("calendar.appointment", { add: "s" })
            }}
          </span>
        </div>
      </div>

      <!--------------------------------- popups zone ------------------------------->

      <!-- single event popup -->
      <div
        class="absolute z-one w-full bg-white rounded-lg p-3 flex flex-col single-event-popup space-y-2"
        v-if="openSingleEvent && actionsEnabled"
        :class="{ 'right-0': popupr, 'bottom-full': popupb }"
        ref="eventList"
      >
        <!-- we use eventList here just to get popupr or popupb -->
        <LinkAction
          v-if="configs?.viewEvent"
          @clicked="viewEvent(RdvsPkg[0].id)"
          class="calendar--event-view-action calendar--action"
          :text="configs?.viewEvent?.text || $t('calendar.view')"
        >
          <template v-if="configs?.viewEvent?.icon" #icon>
            <BlueEye />
          </template>
        </LinkAction>
        <!---->
        <LinkAction
          v-if="configs?.reportEvent"
          @clicked="reportEventFor(RdvsPkg[0].id)"
          :text="configs?.reportEvent?.text || $t('calendar.report')"
          class="calendar--event-report-action calendar--action"
        >
          <template v-if="configs?.reportEvent?.icon" #icon>
            <OrangeUpdate />
          </template>
        </LinkAction>
      </div>

      <!-- more than one Event list popup -->
      <div
        class="overflow-y-auto custom-scrll max-h-18dt75 absolute z-one min-w-24dt813 bg-white more-event-body rounded-lg p-3"
        :class="{ 'right-0': popupr, 'bottom-full': popupb }"
        v-if="openEventList"
        ref="eventList"
      >
        <!-- item -->
        <div
          class="group more-event-body--item flex flex-row flew-wrap space-x-4 p-2 bg-white border-b"
          v-for="(rdv, rdvi) in RdvsPkg"
          :key="rdvi"
        >
          <!--event informations-->
          <div
            class="flex-grow flex flex-row space-x-2 flex-nowrap items-start"
          >
            <span
              class="more-event-body-item-dot block bg-3B82F6 h-3 w-3 opacity-20 group-hover:opacity-100 rounded-full flex-shrink-0"
            />
            <div class="w-full grow flex-shrink more-event-body-item-body">
              <!--title-->
              <div class="font-semibold text-A1A1AA leading-4 text-0dt688">
                <span
                  :data-rdv-date="rdv.date"
                  :title="
                    isoStringToDate(rdv.date).toLocaleString($i18n.locale)
                  "
                  class="calendar--event-time"
                >
                  {{
                    timeFormat(`${hours(rdv.date)}:${minutes(rdv.date)}`, true)
                  }}
                  <!-- {{ hours(rdv.date) }}:{{ minutes(rdv.date) }} -->
                </span>
              </div>
              <!--name and engin-->
              <div class="font-medium text-xs text-09101D">
                <span
                  :title="rdv?.comment ?? ''"
                  class="block capitalize calendar--event-name"
                >
                  {{ rdv.name }}
                </span>
                <!---->
                <span
                  class="block text-A1A1AA capitalize truncate calendar--event-keyword"
                >
                  {{ rdv.keywords }}
                </span>
              </div>
            </div>
          </div>
          <!-- event actions -->
          <div
            v-if="actionsEnabled"
            class="flex flex-row space-x-4 flex-nowrap max-w-max items-center"
          >
            <LinkAction
              v-if="configs?.viewEvent"
              @clicked="viewEvent(rdv.id)"
              :text="configs?.viewEvent?.text || $t('calendar.view')"
              class="calendar--event-view-action calendar--action"
            >
              <template v-if="configs?.viewEvent?.icon" #icon>
                <BlueEye />
              </template>
            </LinkAction>
            <!---->
            <LinkAction
              v-if="configs?.reportEvent"
              @clicked="reportEventFor(rdv.id)"
              :text="configs?.reportEvent?.text || $t('calendar.report')"
              class="calendar--event-report-action calendar--action"
            >
              <template v-if="configs?.reportEvent?.icon" #icon>
                <OrangeUpdate />
              </template>
            </LinkAction>
          </div>
        </div>
      </div>
      <!---->
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Slots } from "vue";

export interface Props {
  eventDate: Date;
  eventTime?: string;
  slots: Slots;
}

import { useEventsStore } from "../../stores/events";
import type { Appointment, Configs } from "../../stores/events";
import LinkAction from "./assets/link-action.vue";
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
  timeFormat,
} from "./common";

const props = withDefaults(defineProps<Props>(), {
  eventTime: "",
});

const store = useEventsStore();
const eventContainer: Ref<HTMLElement | null> = ref(null);
const eventSide: Ref<HTMLElement | null> = ref(null);
const eventList: Ref<HTMLElement | null> = ref(null);
const openEventList: Ref<boolean> = ref(false);
const openSingleEvent: Ref<boolean> = ref(false);

const configs = computed<Configs>(() => store.getConfigs);
const actionsEnabled = computed<boolean>(() => {
  const actions = ["viewEvent", "reportEvent"];
  return actions.some(
    (it: string) => (configs?.value as Record<string, any>)[it] !== undefined
  );
});

const datetime_start: Ref<Date | null> = ref(null);
const datetime_end: Ref<Date | null> = ref(null);

// to define popup position
const popupr: Ref<boolean> = ref(false);
const popupb: Ref<boolean> = ref(false);

//events containers
const RdvsPkg: Ref<Appointment[]> = ref([]);

const closeEventList = () => {
  openEventList.value = false;
  // to hide single event popup
  openSingleEvent.value = false;
};

const openEvtList = () => {
  const _bpos = (eventSide.value as HTMLElement).getBoundingClientRect();
  const _bpar = (
    document.querySelector(
      '[data-widget-item="calendar-inside"]'
    ) as HTMLElement
  ).getBoundingClientRect();
  if (RdvsPkg.value.length > 1) openEventList.value = true;
  else if (RdvsPkg.value.length === 1) openSingleEvent.value = true;
  //set automatically popup position, right or left
  popupr.value = _bpar.width < _bpos.x;
  popupb.value = _bpos.y > _bpar.height * 0.8;
};

// computed on store state
const calendarEvents = computed<Appointment[]>(() => store.getEvents);

//filt and Retrieve <Event /> data
const eventEvents = (): void => {
  const _start = datetime_start.value as Date;
  const _end = datetime_end.value as Date;

  RdvsPkg.value = calendarEvents.value.filter((rdv: Appointment) => {
    const _d = isoStringToDate(rdv.date);
    return _d >= _start && _d < _end;
  });
};

const viewEvent = (id: string | number | unknown): void => {
  const event = new CustomEvent("calendar.request.view", {
    detail: { id },
  });
  document.body.dispatchEvent(event);
  closeEventList();
};

const reportEventFor = (id: string | number | unknown): void => {
  const event = new CustomEvent("calendar.request.report", {
    detail: { id },
  });
  document.body.dispatchEvent(event);
  closeEventList();
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
  // filt events
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

:deep(.calendar--event-report-action) {
  color: #e07a2c;
}

:deep(.calendar--event-view-action) {
  color: #0ea5e9;
}

:deep(.calendar--action) {
  text-decoration: none;
}
</style>
