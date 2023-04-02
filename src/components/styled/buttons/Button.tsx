import {
  QRL,
  Signal,
  Slot,
  component$,
  useSignal,
  useTask$,
} from "@builder.io/qwik";

interface ButtonProps {
  // text: string;
  onClick: QRL<() => void>;
  theme: string;
}

export default component$((props: ButtonProps) => {
  /**
   * Styled button to keep everything consisten through the app
   */
  const colors: Signal<string> = useSignal<string>(
    "bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-blue-500 "
  );
  useTask$(({ track }) => {
    track(() => {
      colors;
    });
    if (props.theme === "warm") {
      colors.value =
        "bg-gradient-to-r from-red-500 to-rose-600 hover:bg-gradient-to-r hover:from-orange-500  hover:to-red-500 ";
    }
  });
  return (
    <button
      class={
        colors.value +
        "p-3 px-5 rounded-2xl font-bold text-stone-300 transition ease-in-out delay-70 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-700"
      }
      onClick$={props.onClick}
    >
      <Slot />
    </button>
  );
});
