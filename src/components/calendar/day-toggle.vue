<template>
  <div
    class="select-none flex flex-row flex-nowrap items-center transition-all min-w-[16.563rem]"
  >
    <!--day-->
    <a
      href="#"
      class="bg-white text-71717A py-1.5 px-4 inline-flex font-medium text-sm leading-5 flex-shrink-0 items-center justify-center hover:opacity-80 active:animate-pulse cursor-pointer"
      :class="{
        'rounded-lg bg-DD4816 text-[#FFF] hover:opacity-90':
          view_type === 'day',
      }"
      @click.prevent="changeViewType('day')"
    >
      {{ $t("calendar.day") }}
    </a>
    <!--week-->
    <a
      href="#"
      class="bg-white text-71717A py-1.5 px-4 inline-flex font-medium text-sm leading-5 flex-shrink-0 items-center justify-center hover:opacity-80 active:animate-pulse cursor-pointer"
      :class="{
        'rounded-lg bg-DD4816 text-[#FFF] hover:opacity-90':
          view_type === 'week',
      }"
      @click.prevent="changeViewType('week')"
    >
      {{ $t("calendar.week") }}
    </a>
    <!--Month-->
    <a
      href="#"
      class="bg-white text-71717A py-1.5 px-4 inline-flex font-medium text-sm leading-5 flex-shrink-0 items-center justify-center hover:opacity-80 active:animate-pulse cursor-pointer"
      :class="{
        'rounded-lg bg-DD4816 text-[#FFF] hover:opacity-90':
          view_type === 'month',
      }"
      @click.prevent="changeViewType('month')"
    >
      {{ $t("calendar.month") }}
    </a>
  </div>
</template>

<script>
import {
  defineComponent,
  onMounted,
  ref,
  computed,
  toRefs,
  toRef,
  watch,
} from "vue";

export default {
  props: {
    setView: {
      type: String,
      default: "",
    },
  },
  setup(props, context) {
    const view_type = ref("week"); //'week' is default
    const getSetView = toRef(props, "setView");

    const changeViewType = (state) => {
      view_type.value = state;
    };

    watch(view_type, () => {
      context.emit("calendar:viewtype", view_type.value);
    });

    onMounted(() => {
      // in case of view_type requested
      if (getSetView.value.length !== 0) changeViewType(getSetView.value);
      else context.emit("calendar:viewtype", view_type.value);
    });

    return {
      view_type,
      changeViewType,
    };
  },
};
</script>
