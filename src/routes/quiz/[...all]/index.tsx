import { $, component$, useSignal } from "@builder.io/qwik";
import { routeLoader$, useLocation } from "@builder.io/qwik-city";
// export const quizProps = routeLoader$((reqEvent) => {
//   console.log(reqEvent);
// });

export default component$(() => {
  const loc = useLocation();
  console.log(loc);
  //   quizProps();
  return (
    <div>
      <div>The Quiz</div>
    </div>
  );
});
