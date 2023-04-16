# Pro Calendar

Another one Best Professional Calendar ever

## Install

```sh
npm i @lbgm/pro-calendar-vue
```

## Screenshot with Native Datepicker

![Pro-calendar-vue screenshot with native datepicker](https://user-images.githubusercontent.com/92580505/232162535-22e42701-6290-4c00-bc4c-73cfb4352055.png)

## Screenshot with VCalendar Datepicker

![Pro-calendar-vue screenshot with vcalendar datepicker](https://user-images.githubusercontent.com/92580505/232162232-b1df28bc-a995-4628-afa4-7491dfbb9e41.png)

## Use

`main.ts`

```js
import { ProCalendar } from "@lbgm/pro-calendar-vue";

//...

app.use(ProCalendar);
```

`App.vue`

```html
<script setup lang="ts">
import "@lbgm/pro-calendar-vue/style";
import { ref, type Ref } from "vue";
import type { Configs, Appointment } from "@lbgm/pro-calendar-vue";

const cfg = ref<Configs>({
  viewEvent: undefined,
  reportEvent: {
    icon: true,
    text: "",
  },
  searchPlaceholder: "",
  eventName: "",
  closeText: "",
  nativeDatepicker: true,
});

const evts: Ref<Appointment[]> = ref([
  {
    date: "2022-11-19T14:00:00.000Z",
    comment: "",
    id: "cl32rbkjk1700101o53e3e3uhn",
    keywords: "Projet BAMBA",
    name: "MONTCHO Kévin",
  },
  //...
]);

</script>

<template>
<!-- all props are optional -->
<pro-calendar
  :events="evts"
  :loading="false"
  :config="cfg"
  view="month"
  date="2022-11-10T00:00:00.000Z"
  @calendarClosed="void 0"
  @fetchEvents="void 0"
/>
</template>
```

## Props & Types

`nativeDatepicker`:
> false or undefined : use VCalendar DatePicker instead

`property?: T_Action`:
> undefined : the action is disabled

```ts
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

type Appointment = {
  id: string;
  name: string;
  date: string; //DateIsoString
  keywords: string;
  comment?: string;
  createdAt?: string; //DateIsoString
  updatedAt?: string; //DateIsoString
}

// interface
interface Props {
  date?: string;
  view?: T_View;
  events?: Appointment[];
  loading?: boolean;
  config?: Configs;
}

// defaults
{
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
}
```

## Events

`@calendarClosed`:
> This event is fired when user clicks close button.

`@fetchEvents`:
> This event is fired when date selected changes. `$event: { start: string; end: string }`. `start` and `end` are iso string date.

## Slots

Draw your own calendar using scoped slots

```html
<pro-calendar
  :events="evts"
  :loading="false"
  :config="cfg"
  view="week"
  date="'isoStringDate'"
>
  <template #leftSwitchArrow>
    <!-- replace left switch arrow with this slot -->
  </template>

  <template #rightSwitchArrow>
    <!-- replace left switch arrow with this slot -->
  </template>

  <template #closeButton>
    <!-- replace close button with this slot -->
  </template>

  <template #loader="{ calendarGotLoading }">
    <!-- replace calendar loader with this slot -->
  </template>

  <template #searchIcon>
    <!-- replace search widget icon with this slot -->
  </template>

  <template #dateLeftArrow>
    <!-- replace date picker left arrow with this -->
  </template>

  <template #dateRightArrow>
    <!-- replace date picker right arrow with this -->
  </template>

  <template #sideEvent="{ dateSelected, calendarEvents }">
    <!-- use this slot to show yourself side events in appearance you want -->
    <!--
      dateSelected: Date;
      calendarEvents: Appointment[]; // all events
    -->
  </template>

  <template #eventCard="{ date, time, cardEvent }">
    <!-- use this slot to show yourself calendar event in appearance you want -->
    <!--
      date: Date;
      time: string;
      cardEvent: Appointment[]; // events according to date/time
    -->
  </template>
</pro-calendar>
```

## Custom HTML Events fired

`calendar.request.view` & `calendar.request.report`

> When the user clicks on view or report action, a custom html event is fired with the id of event in detail.
> You can listen these events like this:

```html
<script setup lang="ts">
import { ref, onMounted } from "vue";

onMounted(() => {
  ["calendar.request.view", "calendar.request.report"].forEach((e: string) => {
    document.body.addEventListener(e, (event: Event | CustomEvent) => {
      console.log({ event });
    });
  });
});

</script>
```

> On default `#sideEvent template`, when user clicks on event, `calendar.request.view` is fired.
