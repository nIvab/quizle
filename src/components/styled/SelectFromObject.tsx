import { Signal, component$ } from "@builder.io/qwik";

type SelectFromObjectProps = {
  object: object;
  objectSignal: Signal<string>;
};

export const SelectFromObject = component$((props: SelectFromObjectProps) => {
  type ObjectKey = keyof typeof props.object;
  return (
    <div>
      <select
        name="Category"
        id="category-select-form"
        class="bg-black p-2 rounded-2xl transition ease-in-out delay-70 hover:bg-stone-900"
        onChange$={(e) => {
          props.objectSignal.value = e.target.value;
          console.log(`cat value ${props.objectSignal.value}`);
        }}
      >
        {Object.keys(props.object).map((k) => {
          const key: ObjectKey = k as ObjectKey;
          const value = props.object[key];
          return (
            <option value={`${value}`} class="" key={`${value}`}>
              {key}
            </option>
          );
        })}
      </select>
    </div>
  );
});
