# Pro Calendar (we are working on it...)
Another one Best Professional Calendar ever

## Install
```sh
# (not available for the moment) npm i @lbgm/phone-number-input
```

## Screenshot

<img width="1435" alt="image" src="https://user-images.githubusercontent.com/92580505/201934522-0650e870-3dda-40c2-b11d-82a9af822f84.png">

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

</script>

<template>
<!-- all props are optional -->
<pro-calendar
  :events="evts"
  :loading="false"
  :config="cfg"
  view="week"
  date="'isoStringDate'"
  @calendarClosed="void 0"
/>
</template>
```


## Props
```ts
// interface
interface Props {
  date?: string | null;
  view?: string;
  events?: Appointment[];
  loading?: boolean;
  config?: {
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
  };
}

// defaults
{
  date: null,
  view: "",
  events: () => [],
  loading: false,
  config: () => ({
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
  }),
}
```

## Prop `events` type
```ts
interface Appointment {
  date: string, //DateIsoString
  comment?: string,
  createdAt?: string, //DateIsoString
  id: string,
  updatedAt?: string, //DateIsoString
  keywords: string,
  name: string,
}

events: Appointment[];
```

## Prop `view` type
```ts
'day' | 'week' | 'month'
```

## Events
`@calendarClosed`:
This event is fired when user clicks close button.

## Slots
Draw your own calendars using scoped slots

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

## Custom Events fired

`calendar.request.view` & `calendar.request.report`

When the user clicks on view or report action, an custom html event is fired with the id of event in detail.
You can listen these events like this:

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








