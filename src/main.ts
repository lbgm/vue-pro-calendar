import { createApp } from "vue";
import App from "./App.vue";

// for tailwind
import "./assets/index.scss";

// import plugin
import { ProCalendar } from "./index";

const app = createApp(App);

app.use(ProCalendar);

app.mount("#app");
