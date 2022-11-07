<template>
  <div
    class="min-w-[11.5rem] bg-F4F4F5 border border-F4F4F5 rounded px-1 py-1.5 flex flex-shrink-0 flex-nowrap items-center space-x-2"
  >
    <span class="inline-flex flex-whrink-0">
      <Icon />
    </span>
    <input
      v-typing="{
        finish: (event) => {
          $emit('typing:finished', event.target.value);
        },
        run: (event) => {
          $emit('typing:running', event.target.value);
        },
      }"
      @input="$emit('calendar:search', $event.target.value)"
      :placeholder="$t(`global.${placeholder}`)"
      class="bg-F4F4F5 flex-shrink w-full text-xs text-left text-A1A1AA font-medium appearance-none border-0 outline-none focus:font-bold"
      type="text"
    />
  </div>
</template>

<script>
import Icon from "./assets/search-icon.vue";

export default {
  components: {
    Icon,
  },
  props: {
    placeholder: {
      type: String,
      default: "search",
    },
  },
};
</script>
<style>
.text {
  font-size: 12px;
}
</style>
