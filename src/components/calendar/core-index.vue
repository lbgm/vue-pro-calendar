<template>
  <div class="widget-calendar-wrapper relative">
    <div
      class="w-full h-screen flex flex-row flex-nowrap fixed top-0 left-0 right-0 bottom-0 z-[8889] bg-F4F6F9 min-h-screen"
    >
      <!-- left menu-->
      <LeftMenu
        @calendar:datepicker="dateSelected = $event"
        @calendar:close="closeCalendar()"
        ref="leftMenu"
      >
        <template #loader>
          <Loader v-if="isLoading" />
        </template>
        <!---->
        <template #sideEvent>
          <div :key="Cky" class="h-3/6 overflow-y-auto custom-scrll p-1">
            <SideEvent :eventDate="dateSelected || new Date()" />
            <!--_-->
            <SideEvent
              :eventDate="nextDate(dateSelected) || nextDate(new Date())"
            />
          </div>
        </template>
      </LeftMenu>

      <!-- calendar base-->
      <div
        class="calendar-base w-full grow border border-white bg-white p-4 pb-0"
      >
        <!-- calendar base header -->
        <HeaderComp>
          <!--Arrows-->
          <Arrows
            @calendar-arrow:left="leftMenu.datepicked = prevDate(dateSelected)"
            @calendar-arrow:right="leftMenu.datepicked = nextDate(dateSelected)"
            :label="
              /calendar/i.test(dateLabel(dateSelected))
                ? $t(`${dateLabel(dateSelected)}`)
                : dateLabel(dateSelected)
            "
          />
          <!-- DayToggle-->
          <Toggle
            ref="viewToggle"
            @calendar:viewtype="view_type = $event"
            :setView="urlRequestView"
          />
          <!--Search-->
          <Search @calendar:search="void 0" @typing:finished="runSearch" />
        </HeaderComp>
        <!--calendar-->
        <div
          data-widget-item="widget-calendar-comp"
          class="calendar-wrapper w-full mt-4 overflow-y-auto custom-scrll"
          :key="Cky"
        >
          <!--calendar week-view-->
          <template v-if="view_type === 'week'">
            <WeekView
              :weekDays="weekDays"
              :dateSelected="dateSelected"
              :dayTimes="dayTimes"
              @report:event="reportEventFor = $event"
            />
          </template>

          <!--calendar day-view-->
          <template v-if="view_type === 'day'">
            <DayView
              :dateSelected="dateSelected"
              :dayTimes="dayTimes"
              @report:event="reportEventFor = $event"
            />
          </template>

          <!--calendar month-view-->
          <template v-if="view_type === 'month'">
            <MonthView
              :weekDays="weekDays"
              :monthDays="monthDays"
              :dateSelected="dateSelected"
              @report:event="reportEventFor = $event"
            />
          </template>
        </div>
      </div>

      <!----------- modal zone ---------->

      <!---->
    </div>
  </div>
</template>

<script setup lang="ts">
export interface Props {
  date?: string | null;
  view?: string;
  events?: Appointment[];
  loading?: boolean;
}

import { onMounted, onBeforeMount, ref, computed, watch, toRef } from "vue";
import type { Ref } from "vue";
import LeftMenu from "./left-menu.vue";
import { cloneDeep } from "lodash";
import HeaderComp from "./calendar-base-header.vue";
import Arrows from "./calendar-arrows.vue";
import Search from "./calendar-search.vue";
import Toggle from "./day-toggle.vue";
import Loader from "./assets/loader-widget.vue";
import { useEventsStore } from "@/stores/events";
import type { Appointment } from "@/stores/events";

import MonthView from "./calendar-month-view.vue";
import DayView from "./calendar-day-view.vue";
import WeekView from "./calendar-week-view.vue";
import SideEvent from "./calendar-side-event.vue";

import {
  dateLabel,
  twoDigitTime,
  incrementTime,
  fixDateTime,
  randomId,
  dayName,
  copyDate,
  isoStringToDate,
  dateToIsoString,
  getWeekInterval,
  weekGenerator,
  monthGenerator,
  prevDate,
  nextDate,
} from "./common";

const props = withDefaults(defineProps<Props>(), {
  date: null,
  view: "",
  events: () => [],
  loading: false,
});

const emit = defineEmits(["calendarClosed", "fetchEvents"]);

const store = useEventsStore();

const propEvents = toRef(props, "events");
const propLoading = toRef(props, "loading");

const leftMenu: Ref<HTMLElement | any> = ref(null);
const viewToggle = ref(null);
const dateSelected: Ref<Date> = ref(null) as Ref<any>;
const weekDays: Ref<Date[]> = ref([]);
const dayTimes: Ref<string[]> = ref([]);
const view_type: Ref<string> = ref("");
const urlRequestView: Ref<string> = ref(props.view);
const monthDays: Ref<Date[]> = ref([]);
const monthDates: Ref<{ start: Date | string; end: Date | string }> = ref({
  start: "",
  end: "",
});
const calendarEvents: Ref<Appointment[]> = computed(() => store.getEvents);
const reportEventFor: Ref<string> = ref("");
const isLoading: Ref<boolean> = ref(false);

/**
 * for calendar interface refreshing
 */
const Cky = ref(randomId());

/**
 * closeCalendar
 */
const closeCalendar = () => {
  window.location.href = "https://www.linkedin.com/in/lbgm/";
  emit("calendarClosed");
};

/**
 * runSearch
 * search by event
 * @param value {string}
 */
const runSearch = async (value: string) => {
  const _s = new RegExp(value, "i");
  let _search = [];
  const _copyEvents = cloneDeep(calendarEvents.value);
  //
  if (!value.replace(/\s/g, "").length) {
    store.setEvents(propEvents.value);
    return;
  }
  //
  isLoading.value = true;
  _search = _copyEvents.filter((rdv: any) => {
    try {
      return _s.test(`${rdv.name}`) || _s.test(`${rdv.keywords}`);
    } catch (e) {
      return false;
    }
  });
  isLoading.value = false;
  console.log(_search, _s);
  if (_search.length !== 0) store.setEvents(_search);
};

/**
 * fetch Appointments
 */
const fetchAppointments = () => {
  // fetch appointments from server
  emit("fetchEvents", {
    start: dateToIsoString(
      fixDateTime(monthDates.value.start as Date, "00:00")
    ),
    end: dateToIsoString(fixDateTime(monthDates.value.end as Date, "23:59")),
  });
};

/**
 * watch reportEventFor and emit customEvent
 */
watch(reportEventFor, () => {
  if (reportEventFor.value) {
    const event = new CustomEvent("calendar.request.report", {
      detail: { reportEventFor },
    });
    document.body.dispatchEvent(event);
  }
});

/**
 * watch dateSelected to change everything
 */
watch(dateSelected, () => {
  //refresh week days'date
  weekDays.value = weekGenerator(getWeekInterval(dateSelected.value as Date));
  //refresh month days'date
  monthDays.value = monthGenerator(dateSelected.value as Date)._days;
  //month date start & end
  monthDates.value = {
    start: monthGenerator(dateSelected.value as Date).firstDay,
    end: monthGenerator(dateSelected.value as Date).lastDay,
  };
  // fetch appointments
  fetchAppointments();
  //
  Cky.value = randomId();
  //
  console.log({ monthDays, weekDays, interval: getWeekInterval(dateSelected.value as Date) });
});

// just to test
watch(calendarEvents, () => {
  console.log({ "watch(calendarEvents)": calendarEvents.value });
  //
  Cky.value = randomId();
});

/**
 * watch propEvents and set events in store
 */
watch(propEvents, () => {
  console.log({ "watch(propEvents)": propEvents.value });
  store.setEvents(propEvents.value);
});

/**
 * watch propLoading and set calendar loading
 */
watch(propLoading, () => {
  console.log({ "watch(propLoading)": propLoading.value });
  isLoading.value = propLoading.value;
});

onBeforeMount(async () => {
  // dayTimes generation from 08h00 to 23h00
  const _p1 = Array.from(
    { length: 23 - 8 + 1 },
    (_, i) => `${twoDigitTime(i + 8)}:${twoDigitTime(0)}`
  );
  //dayTimes generation from 07h00 to 23h59
  const _p2 = Array.from(
    { length: 7 - 0 + 1 },
    (_, i) => `${twoDigitTime(i + 0)}:${twoDigitTime(0)}`
  );
  dayTimes.value = _p1.concat(_p2);
});

const verifyFirstBind = () => {
  if (props.date) {
    const b = isoStringToDate(props.date);
    if (b.getTime()) {
      dateSelected.value = b;
    }
  }

  // events
  store.setEvents(propEvents.value);
};

onMounted(async () => {
  // verify first bind props: date, events
  verifyFirstBind();
});
</script>

<style lang="scss" scoped>
@import "@/assets/tailwind.scss";

.calendar-wrapper {
  height: calc(100vh - 66px);
}
</style>
