import type { Signal } from "@builder.io/qwik";
import { $, useVisibleTask$ } from "@builder.io/qwik";

export const previousFocus = $((list: NodeListOf<HTMLElement>) => {
  const focusedEl = document.activeElement as HTMLElement;
  const index = Array.from(list).findIndex((el) => el === focusedEl || el.contains(focusedEl))
  const nextIndex = (index - 1 + list.length) % list.length;
  list[nextIndex].focus();
});

export const nextFocus = $((list: NodeListOf<HTMLElement>) => {
  const focusedEl = document.activeElement as HTMLElement;
  const index = Array.from(list).findIndex((el) => el === focusedEl || el.contains(focusedEl))
  const nextIndex = (index + 1) % list.length;
  list[nextIndex].focus();
});

const previousLine = $((root: HTMLElement, selector: string) => {
  const list = root.querySelectorAll<HTMLElement>(selector);
  const focusedEl = document.activeElement as HTMLElement;
  const index = Array.from(list).findIndex((el) => el === focusedEl || el.contains(focusedEl));
  const { width: rootWidth } = root.getBoundingClientRect();
  const { width: itemWidth } = list[0].getBoundingClientRect();
  const line = Math.floor(rootWidth / itemWidth);
  const nextIndex = (index - line + list.length) % list.length;
  list[nextIndex].focus();
});

const nextLine = $((root: HTMLElement, selector: string) => {
  const list = root.querySelectorAll<HTMLElement>(selector);
  const focusedEl = document.activeElement as HTMLElement;
  const index = Array.from(list).findIndex((el) => el === focusedEl || el.contains(focusedEl));
  const { width: rootWidth } = root.getBoundingClientRect();
  const { width: itemWidth } = list[0].getBoundingClientRect();
  const line = Math.floor(rootWidth / itemWidth);
  const nextIndex = (index + line) % list.length;
  list[nextIndex].focus();
});

export const useGridFocus = (root: Signal<HTMLElement | undefined>, selector: string = 'li > a') => {
  useVisibleTask$(() => {
    const handler = (event: KeyboardEvent) => {
      if (!root.value) return;
      const key = event.key;
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(key)) event.preventDefault();
      if (key === 'ArrowRight') nextFocus(root.value.querySelectorAll<HTMLElement>(selector));
      if (key === 'ArrowLeft') previousFocus(root.value.querySelectorAll<HTMLElement>(selector));
      if (key === 'ArrowDown') nextLine(root.value, selector);
      if (key === 'ArrowUp') previousLine(root.value, selector);
      if (key === 'Esc') root.value.blur();
    }
    root.value?.addEventListener('keydown', handler);
    return () => root.value?.removeEventListener('keydown', handler);
  });
}
