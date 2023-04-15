import { defineStore } from "pinia";

export enum E_View {
  DAY = "day",
  WEEK = "week",
  MONTH = "month",
}

export type Appointment = {
  id: string;
  name: string;
  date: string; //DateIsoString
  keywords: string;
  comment?: string;
  createdAt?: string; //DateIsoString
  updatedAt?: string; //DateIsoString
}

export type T_View = 'day' | 'week' | 'month';

export type T_Action = {
  icon?: boolean;
  text?: string;
}

export type Configs = {
  viewEvent?: T_Action;
  reportEvent?: T_Action;
  searchPlaceholder?: string;
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
      searchPlaceholder: "",
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
