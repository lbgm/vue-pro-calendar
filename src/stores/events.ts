import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useEventsStore = defineStore({
  id: 'CalendarEvents',

  state: () => ({
    calendarEvents: [] as unknown[],
  }),

  getters: {
    getEvents: (state) => state.calendarEvents
  },

  actions: {
    setEvents (payload: unknown[]) {
      this.calendarEvents = payload;
    }
  }
});
