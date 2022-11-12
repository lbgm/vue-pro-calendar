<script setup lang="ts">
import "v-calendar/dist/style.css";
import { ref } from "vue";

import ProCalendar from "@/components/calendar/core-index.vue";

const evts = ref([
  {
    date: "2022-05-24T16:00:50.253Z",
    comment: "Faire une livraison à moto de Mont Sinaï à Calavi",
    createdAt: "2022-05-20T11:39:50.255Z",
    id: "cl3eddmjz1435801pqwfa5ihd1",
    updatedAt: "2022-05-20T11:39:50.255Z",
    keywords: "Anniversaire",
    name: "SAGBO Aimé",
  },
  {
    date: "2022-05-19T14:00:00.000Z",
    comment: null,
    createdAt: "2022-05-12T08:36:54.848Z",
    id: "cl32rbkjk1700101o53e3e3uhn",
    updatedAt: "2022-05-12T09:00:16.217Z",
    keywords: "Projet BAMBA",
    name: "MONTCHO Kévin",
  },
  {
    date: "2022-05-17T13:00:36.284Z",
    comment: null,
    createdAt: "2022-05-13T09:15:36.288Z",
    id: "cl34856g01439801piot8vp3jr",
    updatedAt: "2022-05-13T09:15:36.288Z",
    keywords: "Rencontre",
    name: "Cornelia ADADJO",
  },
  {
    date: "2022-05-10T07:00:00.000Z",
    comment: null,
    createdAt: "2022-05-10T18:18:01.818Z",
    id: "cl2yk477s136301pbmh49btdg",
    updatedAt: "2022-05-24T08:57:55.028Z",
    keywords: "Anniversaire",
    name: "Sylla Rahamata",
  },
  {
    date: "2022-05-10T07:00:00.000Z",
    comment: null,
    createdAt: "2022-05-10T18:18:01.818Z",
    id: "cl30h76qi116501nu2dc1wnv1",
    updatedAt: "2022-05-24T08:57:55.028Z",
    keywords: "Réunion",
    name: "Espéra AWO",
  },
]);
</script>

<template>
  <div>
    <pro-calendar :events="evts" view="day" :loading="false" />
  </div>
</template>

<style scoped></style>
