import { Slot, component$ } from "@builder.io/qwik";

export const Modal = component$(() => {
  return (
    <div class="relative z-50">
      <div class="fixed inset-0 bg-black/50" aria-hidden="true" />

      <div class="fixed inset-0 flex items-center justify-center p-4">
        <div class="flex items-center justify-center bg-neutral-800 rounded-lg">
          <Slot />
        </div>
      </div>
    </div>
  );
});
