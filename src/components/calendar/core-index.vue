<template>
  <div
    class="widget-calendar-wrapper relative w-full h-screen flex flex-row flex-nowrap bg-white min-h-screen"
  >
    <!-- left menu-->
    <LeftMenu
      :date="externalRequestDate"
      @calendar:datepicker="dateSelected = $event"
      ref="leftMenu"
    >
      <template #closeButton>
        <template v-if="slots.closeButton">
          <span class="inline-flex">
            <component
              :is="slots.closeButton"
              @click.prevent.stop="closeCalendar()"
            />
          </span>
        </template>
        <CloseButton v-else @tap="closeCalendar()" />
      </template>
      <!-- / -->
      <template #loader>
        <template v-if="slots.loader">
          <span class="inline-flex">
            <component :is="slots.loader" :calendarGotLoading="isLoading" />
          </span>
        </template>
        <Loader v-else-if="isLoading" />
      </template>
      <!---->
      <template #sideEvent>
        <div
          class="side-event-box overflow-y-auto custom-scrll p-1"
          :class="{
            'h-50p': !configs?.nativeDatepicker,
            'below-native-datepicker': configs?.nativeDatepicker,
          }"
        >
          <template v-if="slots.sideEvent">
            <component
              :is="slots.sideEvent"
              :dateSelected="dateSelected"
              :calendarEvents="calendarEvents"
            />
          </template>
          <template v-else>
            <SideEvent :eventDate="dateSelected" />
            <!-- / -->
            <SideEvent
              v-if="
                nextDate(dateSelected).toLocaleDateString('en-CA') !=
                dateSelected.toLocaleDateString('en-CA')
              "
              :eventDate="nextDate(dateSelected)"
            />
          </template>
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
          :slots="slots"
        />
        <!-- DayToggle-->
        <Toggle
          ref="viewToggle"
          @calendar:view-changed="defineView = $event"
          :view="view"
        />
        <!--Search-->
        <Search
          @calendar:search="void 0"
          @typing:finished="runSearch"
          :placeholder="configs.searchPlaceholder"
          :slots="slots"
        />
      </HeaderComp>
      <!--calendar-->
      <div
        data-widget-item="widget-calendar-comp"
        class="calendar-wrapper w-full mt-4 overflow-y-auto custom-scrll"
      >
        <!--calendar week-view-->
        <template v-if="defineView === 'week'">
          <WeekView
            :weekDays="weekDays"
            :dateSelected="dateSelected"
            :dayTimes="dayTimes"
            :slots="slots"
          />
        </template>

        <!--calendar day-view-->
        <template v-if="defineView === 'day'">
          <DayView
            :dateSelected="dateSelected"
            :dayTimes="dayTimes"
            :slots="slots"
          />
        </template>

        <!--calendar month-view-->
        <template v-if="defineView === 'month'">
          <MonthView
            :weekDays="weekDays"
            :monthDays="monthDays"
            :dateSelected="dateSelected"
            :slots="slots"
          />
        </template>
      </div>
    </div>
    <!---->
  </div>
</template>

<script setup lang="ts">
export interface Props {
  date?: string;
  view?: T_View;
  events?: Appointment[];
  loading?: boolean;
  config?: Configs;
}

// import v-calendar style
import "v-calendar/dist/style.css";

import "../../assets/tailwind.scss";

import {
  onMounted,
  onBeforeMount,
  ref,
  computed,
  watch,
  toRef,
  useSlots,
  type ComponentPublicInstance,
} from "vue";
import type { Ref } from "vue";
import LeftMenu from "./left-menu.vue";
import HeaderComp from "./calendar-base-header.vue";
import Arrows from "./calendar-arrows.vue";
import Search from "./calendar-search.vue";
import Toggle from "./view-toggle.vue";
import Loader from "./assets/loader-widget.vue";
import CloseButton from "./close-button.vue";
import { useEventsStore } from "../../stores/events";
import type { Appointment, Configs, T_View } from "../../stores/events";

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

type T_Toggle = typeof Toggle;
type T_LeftMenu = typeof LeftMenu;

const props = withDefaults(defineProps<Props>(), {
  date: undefined,
  view: "week",
  events: () => [],
  loading: false,
  config: () => ({
    viewEvent: {
      icon: true,
      text: "",
    },
    reportEvent: {
      icon: true,
      text: "",
    },
    searchPlaceholder: "",
    eventName: "",
    closeText: "",
    nativeDatepicker: true,
  }),
});

const emit = defineEmits(["calendarClosed", "fetchEvents"]);

const store = useEventsStore();

const leftMenu: Ref<ComponentPublicInstance<T_LeftMenu>> = ref<
  ComponentPublicInstance<T_LeftMenu>
>() as Ref<ComponentPublicInstance<T_LeftMenu>>;
const viewToggle: Ref<ComponentPublicInstance<T_Toggle>> = ref<
  ComponentPublicInstance<T_Toggle>
>() as Ref<ComponentPublicInstance<T_Toggle>>;
const dateSelected: Ref<Date> = ref(new Date());
const weekDays: Ref<Date[]> = ref([]);
const dayTimes: Ref<string[]> = ref([]);
const defineView: Ref<T_View> = ref(props.view);
const externalRequestDate: Ref<Date | undefined> = ref(undefined);
const monthDays: Ref<Date[]> = ref([]);
const monthDates: Ref<{ start: Date | string; end: Date | string }> = ref({
  start: "",
  end: "",
});
const calendarEvents = computed<Appointment[]>(() => store.getEvents);
const configs = computed<Configs>(() => store.getConfigs);
const isLoading: Ref<boolean> = ref(props.loading);
const slots = useSlots();

/**
 * closeCalendar
 */
const closeCalendar = (): void => {
  emit("calendarClosed");
};

/**
 * runSearch
 * search by event
 * @param value {string}
 */
const runSearch = async (value: string): Promise<void> => {
  const _s = new RegExp(value, "i");
  let _search = [];
  //
  if (!value.replace(/\s/g, "").length) {
    store.setEvents(props.events);
    return void 0;
  }
  //
  isLoading.value = true;
  _search = calendarEvents.value.filter((rdv: any) => {
    try {
      return _s.test(`${rdv.name}`) || _s.test(`${rdv.keywords}`);
    } catch (e) {
      return false;
    }
  });
  isLoading.value = false;
  if (_search.length !== 0) store.setEvents(_search);
};

/**
 * fetch Appointments
 */
const fetchAppointments = (): void => {
  // fetch appointments from server
  emit("fetchEvents", {
    start: dateToIsoString(
      fixDateTime(monthDates.value.start as Date, "00:00")
    ),
    end: dateToIsoString(fixDateTime(monthDates.value.end as Date, "23:59")),
  });
};

/**
 * verifyFirst Props
 */
const verifyFirstBind = (): void => {
  // date
  if (props.date) {
    const b = isoStringToDate(props.date);
    if (b.getTime()) {
      dateSelected.value = b;
      externalRequestDate.value = dateSelected.value;
    }
  }

  // events
  store.setEvents(props.events);
  // config
  store.setConfigs(props.config);
};

/**
 * generateDayTimes
 */
const generateDayTimes = (): void => {
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
};

/**
 * watch dateSelected to change everything
 */
watch(dateSelected, () => {
  //refresh week days'date
  weekDays.value = weekGenerator(getWeekInterval(dateSelected.value));
  //refresh month days'date
  monthDays.value = monthGenerator(dateSelected.value)._days;
  //month date start & end
  monthDates.value = {
    start: monthGenerator(dateSelected.value).firstDay,
    end: monthGenerator(dateSelected.value).lastDay,
  };
  // fetch appointments
  fetchAppointments();
});

/**
 * watch props and set needed in store
 */
watch(props, () => {
  store.setEvents(props.events);
  store.setConfigs(props.config);

  isLoading.value = props.loading;
});

onBeforeMount(async () => {
  generateDayTimes();
});

onMounted(async () => {
  // verify first bind props: date, events
  verifyFirstBind();
});
</script>

<style lang="scss" scoped>
.calendar-wrapper {
  height: calc(100vh - 66px);
}

.side-event-box {
  &.below-native-datepicker {
    height: calc(100% - 92px);
  }
}
</style>
