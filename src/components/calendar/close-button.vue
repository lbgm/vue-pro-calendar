<template>
  <a
    :aria-label="$t('calendar.close_calendar')"
    :title="$t('calendar.close_calendar')"
    href="#"
    class="select-none cursor-pointer inline-flex items-center flex-row space-x-2 flex-nowrap text-left text-005743 hover:opacity-80 active:animate-pulse"
    @click.prevent="$emit('tap')"
  >
    <span class="inline-flex items-center justify-center w-6 h-6 flex-shrink-0"
      ><CloseIcon
    /></span>
    <span class="font-semibold -tracking-[0.02em] text-base">
      {{ $t("global.close") }}
    </span>
  </a>
</template>

<script>
import CloseIcon from "./assets/close-icon.vue";
export default {
  components: {
    CloseIcon,
  },
};
</script>
