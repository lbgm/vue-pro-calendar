# Pro Calendar (We are working on it...)
Another one Best Professional Calendar ever

## Install
```sh
# for the moment, clone the project and run
npm run build-lib
# use npm pack
# the npm package will be available after all works
```

## Screenshot

<img width="736" alt="image" src="https://user-images.githubusercontent.com/92580505/201697197-c89acb54-1e71-4dfb-942f-379b0164bbde.png">

## Use

```js
// where you want
import { widget as ProCalendar } from "@lbgm/pro-calendar-vue";
```

```html
<!-- all props are optional -->
<pro-calendar
  :events="evts"
  :loading="false"
  :config="cfg"
  view="week"
  date="'isoStringDate'"
/>
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

## Slots
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








