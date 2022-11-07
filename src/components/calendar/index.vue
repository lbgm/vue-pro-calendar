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
            :setView="$route.query.view || ''"
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
      <CalendarReportEvent
        v-if="reportEventFor"
        :eventId="reportEventFor"
        @close="reportEventFor = ''"
        @event:reported="eventIsReported"
        :dayTimes="dayTimes"
      />

      <!---->
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, onBeforeMount, ref, computed, watch } from "vue";
import LeftMenu from "./left-menu.vue";
import { cloneDeep } from "lodash";
import HeaderComp from "./calendar-base-header.vue";
import Arrows from "./calendar-arrows.vue";
import Search from "./calendar-search.vue";
import Toggle from "./day-toggle.vue";
import Loader from "./assets/loader.vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";

import MonthView from "./calendar-month-view.vue";
import DayView from "./calendar-day-view.vue";
import WeekView from "./calendar-week-view.vue";
import SideEvent from "./calendar-side-event.vue";
import CalendarReportEvent from "./calendar-report-event.vue";

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

export default {
  components: {
    LeftMenu,
    HeaderComp,
    Arrows,
    Search,
    Toggle,
    Loader,
    MonthView,
    DayView,
    WeekView,
    SideEvent,
    CalendarReportEvent,
  },

  setup(props, context) {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();

    const leftMenu = ref(null);
    const viewToggle = ref(null);
    const dateSelected = ref(null);
    const weekDays = ref([]);
    const dayTimes = ref([]);
    const view_type = ref("");
    const monthDays = ref([]);
    const monthDates = ref({});
    const calendarEvents = computed(
      () => store.state["calendar"].calendarEvents
    );
    const reportEventFor = ref("");
    const isLoading = ref(false);

    const Cky = ref(randomId());

    const closeCalendar = () => {
      router.push({ name: "Dashboard.Overview" });
    };

    const setViewType = (state) => {
      view_type.value = state;
    };

    // search into Value
    const runSearch = async (value) => {
      const _s = new RegExp(value, "i");
      let _search = [];
      const _copyEvents = cloneDeep(calendarEvents.value);
      //
      if (!value.replace(/\s/g, "").length) {
        store.dispatch("calendar/getEvents");
        return;
      }
      //
      isLoading.value = true;
      _search = await _copyEvents.filter((rdv) => {
        try {
          return (
            _s.test(`${rdv.user.firstName}`) ||
            _s.test(`${rdv.user.lastName}`) ||
            _s.test(`${rdv.user.engineType.name}`)
          );
        } catch (e) {
          return false;
        }
      });
      isLoading.value = false;
      console.log(_search, _s);
      if (_search.length !== 0) store.commit("calendar/searchEvents", _search);
    };

    const fetchAppointements = async () => {
      // fetch appointments from server
      isLoading.value = true;
      await store.dispatch("calendar/getEvents", {
        start: dateToIsoString(fixDateTime(monthDates.value.start, "00:00")),
        end: dateToIsoString(fixDateTime(monthDates.value.end, "23:59")),
      });
      isLoading.value = false;
    };

    const eventIsReported = async (data) => {
      await fetchAppointements();
      localStorage.setItem("calendar.event.reported", JSON.stringify(data));
    };

    watch(dateSelected, async () => {
      //refresh week days'date
      weekDays.value = weekGenerator(getWeekInterval(dateSelected.value));
      //refresh month days'date
      monthDays.value = monthGenerator(dateSelected.value)._days;
      //month date start & end
      monthDates.value = {
        start: monthGenerator(dateSelected.value).firstDay,
        end: monthGenerator(dateSelected.value).lastDay,
      };
      // fetch appointments from server
      await fetchAppointements();
      //
      Cky.value = randomId();
    });

    // just to test
    watch(calendarEvents, () => {
      console.log("watch(calendarEvents)", calendarEvents.value);
      //
      Cky.value = randomId();
    });

    const verifyRouteRequest = () => {
      if (route.query.date && route.query.view) {
        //
        const getview_date = isoStringToDate(route.query.date);
        if (getview_date) {
          dateSelected.value = getview_date;
        }
      }
    };

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

    onMounted(async () => {
      //
      verifyRouteRequest();
    });

    return {
      innerHeight,
      closeCalendar,
      setViewType,
      dateSelected,
      weekDays,
      copyDate,
      dayName,
      dayTimes,
      twoDigitTime,
      view_type,
      leftMenu,
      nextDate,
      prevDate,
      dateLabel,
      viewToggle,
      monthDays,
      calendarEvents,
      Cky,
      runSearch,
      reportEventFor,
      fetchAppointements,
      eventIsReported,
      isLoading,
    };
  },
};
</script>

<style lang="scss" scoped>
.calendar-wrapper {
  height: calc(100vh - 66px);
}
</style>
