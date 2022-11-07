<template>
  <div v-if="eventId" data-widget-item="report-calendar-event">
    <modalVue
      :title="$t('calendar.report_event_title')"
      @close="$emit('close')"
    >
      <DateSelector
        class="w-full mb-4"
        :label="$t('calendar.choose_a_date')"
        @date:selected="setDate"
        @date:reset="form.date = null"
      />
      <!---->
      <SelectGroup
        class="mb-4 w-full"
        :label="$t('calendar.choose_a_hour')"
        :data="Times"
        :defaultKey="'16:00'"
        @change="setHour($event.value)"
      >
        <template #icon><ClockIcon /></template>
        <template #arrow><ArrowIcon /></template>
      </SelectGroup>
      <!---->
      <TextArea
        :label="$t('calendar.send_report_comment')"
        name="calendar_report_event"
        :value="form.comment"
        @update:value="form.comment = $event"
      />
      <!---->
      <PrimaryButton
        class="w-full mt-4"
        :text="$t('calendar.report_event')"
        @clicked="onSubmit"
        :loading="loading"
      />
    </modalVue>
  </div>
</template>

<script>
import {
  defineComponent,
  onMounted,
  ref,
  toRef,
  onBeforeMount,
  toRefs,
  inject,
  computed,
  watch,
} from "vue";

import modalVue from "@/components/global/modal.vue";
import PrimaryButton from "@/components/global/primary-button.vue";
import SelectGroup from "@/components/global/select-slotted-table.vue";
import DateSelector from "@/components/global/date-selector.vue";
import ArrowIcon from "@/components/global/icons/arrow-down-mask.vue";
import ClockIcon from "@/components/global/icons/clock.vue";
import TextArea from "@/components/global/base-textarea.vue";

import { fixDateTime } from "./common";

import { useStore } from "vuex";

export default defineComponent({
  components: {
    modalVue,
    PrimaryButton,
    SelectGroup,
    ArrowIcon,
    ClockIcon,
    DateSelector,
    TextArea,
  },
  props: {
    dayTimes: {
      type: Array,
      default: () => [],
    },
    eventId: {
      type: String,
      default: "",
    },
  },
  setup(props, context) {
    const $t = inject("$t");
    //
    const Times = ref([]);
    const dayTimes = toRef(props, "dayTimes");
    const eventId = toRef(props, "eventId");
    const loading = ref(false);
    //
    const form = ref({
      date: null,
      hour: "16:00",
      comment: "",
    });
    //
    const notify = inject("$showNotif");
    const store = useStore();

    const setDate = (date) => {
      date = date || form.value.date;
      console.log(date);
      form.value.date = fixDateTime(
        new Date(date),
        form.value.hour
      ).toISOString();
    };

    const setHour = (hour) => {
      form.value.hour = hour;
      if (form.value.date) setDate();
    };

    onBeforeMount(async () => {
      //
    });

    onMounted(async () => {
      Times.value = dayTimes.value.map((it) => {
        return { value: it, label: it };
      });
    });

    const onSubmit = async () => {
      if (form.value.date === null) {
        return notify({
          error: true,
          note: $t("calendar.please_choose_a_date"),
        });
      }

      const body = {
        data: {
          appointmentDate: form.value.date,
          message: form.value.comment,
        },
        id: eventId.value,
      };

      console.log("calendar-report-event", body);

      loading.value = true;
      const res = await store.dispatch("calendar/reportRDV", body);
      loading.value = false;

      if (![200, 201].includes(res.status)) {
        return notify({
          error: true,
          note: $t("global.error"),
        });
      }

      context.emit("event:reported", {
        id: eventId.value,
        date: form.value.date,
        view: "day",
      });
      context.emit("close");
      notify({
        //icon: true,
        //button: $t('calendar.view_rdv'),
        success: true,
        note: $t("calendar.event_reported"),
      });
    };

    return {
      Times,
      form,
      fixDateTime,
      setDate,
      setHour,
      onSubmit,
      loading,
    };
  },
});
</script>

<style lang="scss" scoped>
div[data-widget-item="report-calendar-event"] {
  :deep(.modal) {
    align-items: flex-start;
  }
  :deep(.widget-modal) {
    margin-top: 30px;
  }

  :deep(.widget-modal-header) {
    align-items: flex-start;
    min-height: 48px;
  }
}
</style>
