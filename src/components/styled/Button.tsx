import { QRL, QwikMouseEvent, component$ } from "@builder.io/qwik";

interface ButtonProps {
  text: string;
  onClick: QRL<() => void>;
}

export default component$((props: ButtonProps) => {
  return (
    <button
      class="bg-blue-700 p-3 px-5 rounded-2xl font-bold text-stone-300 transition ease-in-out delay-70 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-700"
      onClick$={props.onClick}
    >
      {props.text}
    </button>
  );
});
