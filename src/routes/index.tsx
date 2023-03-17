import { component$, useSignal } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import Explainer from "../components/explainer/explainer";

export default component$(() => {
  const hasStartedQuiz = useSignal(false);

  return (
    <div class="text-gray-50">
      {hasStartedQuiz ? <Explainer></Explainer> : <></>}
      <button class="bg-gradient-to-r from-yellow-200 via-green-200 to-green-300 p-2 rounded-lg font-bold text-black">
        Start
      </button>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
