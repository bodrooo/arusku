import { ref } from 'vue';

const stack = ref<Array<() => void>>([]);

export const push = (closeFunction: () => void) => {
  stack.value.push(closeFunction);
};

export const pop = () => {
  stack.value.pop();
};

export const closeTop = () => {
  if (stack.value.length > 0) {
    const topModalCloseFunction = stack.value[stack.value.length - 1];
    topModalCloseFunction();
  }
};
