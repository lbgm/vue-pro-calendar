import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";

import "./assets/index.scss";

import { i18n } from "@/assets/i18n";

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faEye, faXmark, faChevronRight, faChevronLeft, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faEye, faXmark, faChevronRight, faChevronLeft, faMagnifyingGlass)


const app = createApp(App);

app.use(createPinia());
app.use(i18n);

export const $t = app.config.globalProperties.$t;
export const $i18n = app.config.globalProperties.$i18n;
export const $locale = app.config.globalProperties.$i18n.locale;

//provide global variable
app.provide("$t", app.config.globalProperties.$t);

/* add font awesome icon component */
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount("#app");
