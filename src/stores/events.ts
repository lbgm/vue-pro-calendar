import { ref, computed } from "vue";
import { defineStore } from "pinia";

export interface Appointment {
  date: string, //DateIsoString
  comment?: string | null | undefined,
  createdAt: string, //DateIsoString
  id: string,
  updatedAt: string, //DateIsoString
  keywords: string,
  name: string,
}

export const useEventsStore = defineStore({
  id: 'CalendarEvents',

  state: () => ({
    calendarEvents: [] as Appointment[],
  }),

  getters: {
    getEvents: (state): Appointment[] => state.calendarEvents
  },

  actions: {
    setEvents (payload: Appointment[]) {
      this.calendarEvents = payload;
    }
  }
});
