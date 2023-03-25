import {
  $,
  Resource,
  Signal,
  component$,
  useResource$,
  useSignal,
} from "@builder.io/qwik";
import { routeLoader$, useLocation } from "@builder.io/qwik-city";
import Button from "~/components/styled/Button";
import { readLatestQuizFromDb } from "../../../../server/database/databaseHandler";
import { QuizQuestion } from "../../../../types/QuizQuestion";
import { time } from "console";
import { QuizQuestionComponent } from "~/components/styled/QuizQuestionComponent";

// todo maybe make this route a bit more opinionated

export const useGetPeriod = routeLoader$((reqEvent) => {
  const searchParams = reqEvent.query;
  return searchParams.get("timeperiod");
});

export default component$(() => {
  const timePeriod = useGetPeriod();
  const quizQuestionsResource = useResource$<QuizQuestion[] | null>(
    async ({ track, cleanup }) => {
      track(() => timePeriod.value);
      const quizFromDb = await readLatestQuizFromDb(timePeriod.value);
      cleanup(() => {
        console.log(`recieved quiz`);
      });
      return quizFromDb;
    }
  );
  return (
    <div>
      <div class="font-bold text-center text-5xl mb-10">
        The quiz of The {timePeriod.value}
      </div>
      <div>
        <Resource
          value={quizQuestionsResource}
          onPending={() => <div>loading</div>}
          onRejected={() => <div>unable to load data</div>}
          onResolved={(quizQuestions) => {
            console.log(`resolved:`, quizQuestions);
            return quizQuestions.map((question, index) => {
              return (
                <div class="my-20">
                  <QuizQuestionComponent
                    question={question}
                    index={index}
                  ></QuizQuestionComponent>
                </div>
              );
            });
          }}
        ></Resource>
        {/* {quiz.value.map((question) => {
          console.log("aaaa");
          return <QuizComponent question={question}></QuizComponent>;
        })} */}
      </div>
    </div>
  );
});
