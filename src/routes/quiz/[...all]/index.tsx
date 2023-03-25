import { $, component$, useSignal } from "@builder.io/qwik";
import { routeLoader$, useLocation } from "@builder.io/qwik-city";
import { setupQuiz } from "../../../../server/quiz/generateQuiz";
import { generateKey } from "crypto";
import Button from "~/components/styled/Button";

// export const genQuiz = routeLoader$((reqEvent) => {
// });

export default component$(() => {
  return (
    <div>
      <div>The Quiz</div>
    </div>
  );
});
