import { $, Component, QRL, Signal, component$ } from "@builder.io/qwik";

interface RadioButtonsFromArrayProps {
  arr: string[]; // values to be rendered
  onClick: QRL<(T: string) => void>; // handles active button
  activeValue: Signal<string>; // which button is actually active
}
export const RadioButtonsFromArray = component$(
  (props: RadioButtonsFromArrayProps) => {
    const onClickReWrapped = $((value: string) => {
      // need to do this as qwik does not allow HTML to call QRL's defined outside of the scope of the component its defined in
      props.onClick(value);
    });
    return (
      <>
        {props.arr.map((text) => {
          return (
            <RadioButton
              text={text}
              onClick={onClickReWrapped}
              isActive={text == props.activeValue.value}
              key={text}
            ></RadioButton>
          );
        })}
      </>
    );
  }
);

interface RadioButtonProps {
  text: string;
  onClick: QRL<(T: string) => void>;
  isActive: boolean;
}

const RadioButton: Component<RadioButtonProps> = component$(
  (props: RadioButtonProps) => {
    /*
     * Component to create button that mimics how a radio checkobox behavies but styled
     */
    let style =
      "p-3 px-5 rounded-2xl font-bold text-stone-300 transition ease-in-out delay-80 hover:-translate-y-1 hover:scale-110";
    props.isActive
      ? (style +=
          " bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-blue-500")
      : (style +=
          " bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-r hover:from-pink-500 hover:to-rose-500");
    const onClickReWrapped = $(() => {
      // need to do this as qwik does not allow HTML to call QRL's defined outside of the scope of the component its defined in
      props.onClick(props.text);
    });
    return (
      <div class="p-3">
        <button class={style} onClick$={onClickReWrapped}>
          {props.text}
        </button>
      </div>
    );
  }
);
