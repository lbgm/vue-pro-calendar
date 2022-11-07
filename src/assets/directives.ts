/**
 * custom typing directive
 * pass a function to this Directive, change inputInterval value to increase or decrease reactivity
 */

export const typing = {
  beforeMount(el: any, binding: any, vnode: any) {
    void vnode;
    let inputTimer: any;
    const inputInterval = binding.value.timing || 300;

    "keydown|keyup".split("|").forEach(function (eitem) {
      el.addEventListener(eitem, (event: any) => {
        if (event.type === "keyup") {
          if (
            event.key !== "Backspace" &&
            typeof binding.value.run === "function"
          )
            binding.value.run(event); // is typing running callback
          clearTimeout(inputTimer);
          inputTimer = setTimeout(() => {
            if (typeof binding.value.finish === "function")
              binding.value.finish(event);
          }, inputInterval); // when typing finished
        } else if (event.type === "keydown") {
          clearTimeout(inputTimer);
        }
      });
    });
  },
};
