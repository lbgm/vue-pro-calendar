/**
 * custom typing directive
 * pass a function to this Directive, change inputInterval value to increase or decrease reactivity
 */

import type { DirectiveBinding, VNode, VueElement } from "vue";

export const typing = {
  beforeMount(el: HTMLInputElement | VueElement, binding: DirectiveBinding, vnode: VNode) {
    void vnode;
    let inputTimer: number;
    const inputInterval = binding.value.timing || 300;

    for (const evt of ["keydown", "keyup"] ) {
      (el as HTMLInputElement).addEventListener(evt, (event: Event) => {
        if (event.type === "keyup") {
          if (
            (event as KeyboardEvent).key !== "Backspace" &&
            typeof binding.value.run === "function"
          )
            binding.value.run(event); // is typing running callback
          else if (binding.value.allowBackspace === true) binding.value.run(event); // is typing running callback
          //
          clearTimeout(inputTimer);
          inputTimer = setTimeout(() => {
            if (typeof binding.value.finish === "function")
              binding.value.finish(event);
          }, inputInterval); // when typing finished

        } else if (event.type === "keydown") {
          clearTimeout(inputTimer);
        }
        return null;
      });
    }
  },
};
