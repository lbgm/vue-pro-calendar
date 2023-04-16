import { defineStore } from "pinia";

export interface Appointment {
  date: string; //DateIsoString
  comment?: string;
  createdAt?: string; //DateIsoString
  id: string;
  updatedAt?: string; //DateIsoString
  keywords: string;
  name: string;
}

export interface Configs {
  actions?: {
    view?: {
      enabled?: boolean;
      icon?: boolean;
      text?: string;
    };
    report?: {
      enabled?: boolean;
      icon?: boolean;
      text?: string;
    };
  };
  searchPlaceHolder?: string;
  eventName?: string;
  closeText?: string;
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
      actions: {
        view: {
          enabled: true,
          icon: true,
          text: "",
        },
        report: {
          enabled: true,
          icon: true,
          text: "",
        },
      },
      searchPlaceHolder: "",
      eventName: "",
      closeText: "",
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
