import type { QRL, QwikTouchEvent} from "@builder.io/qwik";
import { $, useSignal } from "@builder.io/qwik";

interface UseSwipeProps {
  onSwipeLeft$?: QRL<(delta: number) => void>
  onSwipeRight$?: QRL<(delta: number) => void>
}
export const useSwipe = ({ onSwipeLeft$, onSwipeRight$ }: UseSwipeProps) => {
  const position = useSignal({ x: 0, y: 0 });
  const onTouchStart$ = $((event: QwikTouchEvent) => {
    const touch = event.touches.item(0);
    if (!touch) return;
    position.value = {
      x: touch.clientX,
      y: touch.clientY,
    }
  });
  const onTouchEnd$ = $((event: QwikTouchEvent) => {
    const touch = event.changedTouches.item(0);
    if (!touch) return;
    const { x } = position.value;
    const delta = touch.clientX - x;
    if (delta < 0 && onSwipeLeft$) onSwipeLeft$(-delta);
    if (delta > 0 && onSwipeRight$) onSwipeRight$(delta);
  });
  return { onTouchStart$, onTouchEnd$ }
}