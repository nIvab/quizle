import { $, Signal, component$, useSignal } from "@builder.io/qwik";
import { DocumentHead, useNavigate } from "@builder.io/qwik-city";

import Button from "~/components/styled/buttons/Button";
import { RadioButtonsFromArray } from "~/components/styled/buttons/RadioButtonsFromArray";

export default component$(() => {
  const nav = useNavigate();

  const timeSelections: string[] = ["Week", "Month"];
  const activeTimeValue: Signal<string> = useSignal<string>("Week");

  const handleActiveTimeValue = $((value: string) => {
    activeTimeValue.value = value;
  });

  const onClickNav = $(() => {
    const url = `/quiz/?timeperiod=${activeTimeValue.value.toLocaleLowerCase()}`;
    nav(url);
  });

  return (
    <div class="text-white flex flex-col justify-center items-center ">
      <div class="flex justify-center items-center leading-3 place-items-center ">
        <h2 class="text-7xl font-semibold leading-3"> QUIZLE </h2>{" "}
        <p class="mt-10">News</p>
      </div>
      <div class="mt-12">
        <p>
          Quizle is a site that automatically generates quizes from the latest
          news articles in Australia!
        </p>
        <p>
          At the end of the week, or month a new quiz will be generated for you
          to complete.
        </p>
        <p class="mt-1">
          Use the options below to set the time period for which a quiz will
          serve you questions from.
        </p>
        <div>
          <div class="mt-5">
            <h4 class="text-center font-semibold text-xl mb-3">
              Time Period: {activeTimeValue.value}
            </h4>
            <div class="flex justify-center">
              <RadioButtonsFromArray
                arr={timeSelections}
                onClick={handleActiveTimeValue}
                activeValue={activeTimeValue}
              ></RadioButtonsFromArray>
            </div>
          </div>
        </div>
        <div class="flex justify-center items-center mt-10">
          <Button onClick={onClickNav} theme="default">
            Take me to the Quiz already
          </Button>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Quizle",
  meta: [
    {
      name: "AI generated news Quiz",
      content:
        "Each day this site will generate a quiz from the time period set below by feeding Australian news articles into OpenAI's GPT large language model. At the end of the day (ACDT 00:00) the questions will be reset and regenerated. Use the options below to set the timescale desired.",
    },
  ],
};
