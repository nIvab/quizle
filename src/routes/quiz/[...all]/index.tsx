import {
  $,
  QRL,
  Resource,
  component$,
  useSignal,
  useStore,
  useTask$,
} from "@builder.io/qwik";
import { routeLoader$, useNavigate } from "@builder.io/qwik-city";
import { readLatestQuizFromDb } from "../../../../server/database/databaseHandler";
import { QuizQuestion } from "../../../../types/QuizQuestion";
import { QuizQuestionComponent } from "~/components/styled/QuizQuestionComponent/QuizQuestionComponent";
import { Modal } from "~/components/styled/Modal";
import Button from "~/components/styled/buttons/Button";

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
  const resultsTotal: number = props.results.reduce((cumSum, nextNum) => {
    return cumSum + nextNum;
  }, 0);

  const resultsComment = useStore({
    gptResultsComment: "",
    giphyImage: "",
  });

  const nav = useNavigate();
  const onClickNav = $(() => {
    /**
     * to take us back to the home menu
     */
    const url = `/`;
    nav(url);
  });

  useTask$(async ({ track }) => {
    track(() => resultsComment.gptResultsComment);

    if (resultsTotal <= 5) {
      resultsComment.giphyImage =
        "https://media.tenor.com/l3GV2R9MbygAAAAC/breaking-bad-looking-at-phone.gif";
    } else if (resultsTotal <= 7) {
      resultsComment.giphyImage =
        "https://media.tenor.com/vcD_AP7z80UAAAAd/happy-breaking-bad.gif";
    } else if (resultsTotal <= 9) {
      resultsComment.giphyImage =
        "https://media.tenor.com/NBhaEjU1ZOcAAAAC/mr-burns-vingan%C3%A7a.gif";
    } else if (resultsTotal == 10) {
      resultsComment.giphyImage =
        "https://media.tenor.com/g9_690TA-mMAAAAC/homer-smart.gif";
    } else {
      console.error("unhandled results - something went wrong");
    }
  });

  return (
    <Modal>
      <div class="p-10 flex flex-row space-x-4 ">
        <div class="bg-gradient-to-bl from-pink-300 via-purple-300 to-indigo-400 p-2 rounded-lg">
          <img
            src={resultsComment.giphyImage}
            alt="reaction to quiz result"
            class="rounded-lg max-w-sm"
          />
        </div>
        <div class="flex flex-col items-center bg-neutral-700 p-3 rounded-lg max-w-lg">
          <div class="my-auto">
            <div class="text-4xl font-medium mx-auto text-center	">
              Your score: {resultsTotal}/10
            </div>
            <div class="flex justify-center items-center mt-3">
              <Button onClick={onClickNav} theme="default">
                Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
});
