import { $, QRL, Resource, component$, useSignal } from "@builder.io/qwik";
import { routeLoader$, useLocation } from "@builder.io/qwik-city";
import { readLatestQuizFromDb } from "../../../../server/database/databaseHandler";
import { QuizQuestion } from "../../../../types/QuizQuestion";
import { QuizQuestionComponent } from "~/components/styled/QuizQuestionComponent";
import { Modal } from "~/components/styled/Modal";

interface QuizRoute {
  quiz: QuizQuestion[];
  timePeriod: string;
}

export const getQuiz = routeLoader$(
  async (reqEvent): Promise<QuizRoute | null> => {
    const searchParams = reqEvent.query;
    const timePeriod: string | null = searchParams.get("timeperiod");
    if (timePeriod) {
      const quiz: QuizQuestion[] | null = await readLatestQuizFromDb(
        timePeriod
      );
      if (quiz) {
        const quizPage: QuizRoute = { quiz: quiz, timePeriod: timePeriod };
        return quizPage;
      }
    }
    return null;
  }
);

export default component$(() => {
  const quizQuestions = getQuiz();
  const quizResults = useSignal<number[]>([]);
  const showResults = useSignal<boolean>(false); // probably a better way to do this but does the job for now
  const incrementResult: QRL<(isRight: boolean) => void> = $(
    (isRight: boolean) => {
      isRight ? quizResults.value.push(1) : quizResults.value.push(0);
      if (quizResults.value.length >= 10) {
        showResults.value = true;
      }
      console.log(
        `hit! ${isRight}, ${quizResults.value}, ${
          quizResults.value.length >= 10
        }  `
      );
    }
  );

  return (
    <div>
      <div class="font-semibold text-center text-6xl mb-10">
        {quizQuestions.value &&
          `The quiz of The ${quizQuestions.value.timePeriod}`.toLocaleUpperCase()}
      </div>
      <div>
        {quizQuestions.value &&
          quizQuestions.value.quiz.map((question, index) => {
            return (
              <div class="my-20">
                <QuizQuestionComponent
                  question={question}
                  index={index}
                  incrementAnswer={incrementResult}
                ></QuizQuestionComponent>
              </div>
            );
          })}
        <Resource
          value={quizQuestions}
          onPending={() => <div>...loading</div>}
          onRejected={() => <div>unable to load data</div>}
          onResolved={(quizQuestions) => {
            console.log(`resolved:`, quizQuestions);
            return <></>;
          }}
        ></Resource>
      </div>
      <div>
        {showResults.value && (
          <ResultsComponent results={quizResults.value}></ResultsComponent>
        )}
      </div>
    </div>
  );
});

interface ResultsComponentProps {
  results: number[];
}

const ResultsComponent = component$((props: ResultsComponentProps) => {
  console.log("results hit");

  const cumResults: number = props.results.reduce((cumSum, nextNum) => {
    cumSum + nextNum;
  }, 0);
  return (
    <Modal>
      <div class="p-10 flex flex-row space-x-4 ">
        <div class="bg-gradient-to-bl from-pink-300 via-purple-300 to-indigo-400 p-2 rounded-lg">
          <img
            src="https://media3.giphy.com/media/LlLFGZjdihWyjveNzx/giphy.gif?cid=ecf05e472zxi0e7m6xzb8byqhj9hn09koisbrhhpim20f54s&rid=giphy.gif&ct=g"
            alt=""
            class="rounded-lg max-w-sm"
          />
        </div>
        <div class="bg-neutral-700 p-3 rounded-lg">
          <h3 class="text-lg font-semibold">Your score: {cumResults}/10</h3>
        </div>
      </div>
    </Modal>
  );
});
