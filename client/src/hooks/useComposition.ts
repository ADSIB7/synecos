import { useEffect, useRef } from "react";
import { usePersistFn } from "./usePersistFn";

export interface UseCompositionReturn<
  T extends HTMLInputElement | HTMLTextAreaElement,
> {
  onCompositionStart: React.CompositionEventHandler<T>;
  onCompositionEnd: React.CompositionEventHandler<T>;
  onKeyDown: React.KeyboardEventHandler<T>;
  isComposing: () => boolean;
}

export interface UseCompositionOptions<
  T extends HTMLInputElement | HTMLTextAreaElement,
> {
  onKeyDown?: React.KeyboardEventHandler<T>;
  onCompositionStart?: React.CompositionEventHandler<T>;
  onCompositionEnd?: React.CompositionEventHandler<T>;
}

type TimerResponse = ReturnType<typeof setTimeout>;

export function useComposition<
  T extends HTMLInputElement | HTMLTextAreaElement = HTMLInputElement,
>(options: UseCompositionOptions<T> = {}): UseCompositionReturn<T> {
  const {
    onKeyDown: originalOnKeyDown,
    onCompositionStart: originalOnCompositionStart,
    onCompositionEnd: originalOnCompositionEnd,
  } = options;

  const isComposingRef = useRef(false);
  const compositionEndTimer = useRef<TimerResponse | null>(null);
  const compositionResetTimer = useRef<TimerResponse | null>(null);

  const clearCompositionTimers = () => {
    if (compositionEndTimer.current) {
      clearTimeout(compositionEndTimer.current);
      compositionEndTimer.current = null;
    }
    if (compositionResetTimer.current) {
      clearTimeout(compositionResetTimer.current);
      compositionResetTimer.current = null;
    }
  };

  useEffect(() => clearCompositionTimers, []);

  const onCompositionStart = usePersistFn(
    (event: React.CompositionEvent<T>) => {
      clearCompositionTimers();
      isComposingRef.current = true;
      originalOnCompositionStart?.(event);
    }
  );

  const onCompositionEnd = usePersistFn((event: React.CompositionEvent<T>) => {
    // Safari can dispatch compositionend before the associated keydown event.
    clearCompositionTimers();
    compositionEndTimer.current = setTimeout(() => {
      compositionResetTimer.current = setTimeout(() => {
        isComposingRef.current = false;
        compositionEndTimer.current = null;
        compositionResetTimer.current = null;
      });
    });
    originalOnCompositionEnd?.(event);
  });

  const onKeyDown = usePersistFn((event: React.KeyboardEvent<T>) => {
    const isCompositionSubmitKey =
      event.key === "Escape" || (event.key === "Enter" && !event.shiftKey);

    if (isComposingRef.current && isCompositionSubmitKey) {
      event.stopPropagation();
      return;
    }

    originalOnKeyDown?.(event);
  });

  const isComposing = usePersistFn(() => isComposingRef.current);

  return {
    onCompositionStart,
    onCompositionEnd,
    onKeyDown,
    isComposing,
  };
}
