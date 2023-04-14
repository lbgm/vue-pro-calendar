import { defineStore } from "pinia";

export type Appointment = {
  date: string; //DateIsoString
  comment?: string;
  createdAt?: string; //DateIsoString
  id: string;
  updatedAt?: string; //DateIsoString
  keywords: string;
  name: string;
}

export type T_Action = {
  icon?: boolean;
  text?: string;
}

export type Configs = {
  viewEvent?: T_Action;
  reportEvent?: T_Action;
  searchPlaceHolder?: string;
  eventName?: string;
  closeText?: string;
  nativeDatepicker?: boolean;
}

interface State {
  calendarEvents: Appointment[];
  configs: Configs;
}

export const useEventsStore = defineStore({
  id: "CalendarEvents",

  state: (): State => ({
    calendarEvents: [],
    configs: {
      viewEvent: {
        icon: true,
        text: "",
      },
      reportEvent: {
        icon: true,
        text: "",
      },
      searchPlaceHolder: "",
      eventName: "",
      closeText: "",
      nativeDatepicker: true,
    }
  }),

  getters: {
    getEvents: (state): Appointment[] => state.calendarEvents,
    getConfigs: (state): Configs => state.configs,
  },

  actions: {
    setEvents(payload: Appointment[]): void {
      this.calendarEvents = payload;
    },
    setConfigs(payload: Configs): void {
      this.configs = Object.assign(this.configs, payload);
    },
  },
});
