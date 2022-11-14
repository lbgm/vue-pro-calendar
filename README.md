# Pro Calendar (We working on it...)
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

## Prop view type
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
 <!-- coming -->
</pro-calendar>








