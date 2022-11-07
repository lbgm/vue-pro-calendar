import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";

import "./assets/index.scss";

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faUserSecret)


const app = createApp(App);

app.use(createPinia());

/* add font awesome icon component */
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount("#app");
