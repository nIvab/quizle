import { $, QRL, component$, useSignal } from "@builder.io/qwik";
import { QuizQuestion } from "../../../types/QuizQuestion";
import { AnswerComponent } from "../AnswerComponent/AnswerComponent";
import {
  checkAndTrimString,
  constructQuestionTextClipboard,
  mapIntToAlphabet,
} from "./utility";
import Button from "../buttons/Button";

type QuizComponentProps = {
  index: number;
  question: QuizQuestion;
  incrementAnswer: QRL<(isRight: boolean) => void>;
};

export const QuizQuestionComponent = component$((props: QuizComponentProps) => {
  const questionObj = props.question; // prevents weird type bug :shrug:

  const hasAnsweredCorrectlySignal = useSignal<boolean | null>(null); // determines
  const userAnswerSignal = useSignal<number>(-1); // handles showing the AnswerComponent

  const handleAnswerGiven = $((answerIndex: number) => {
    // saves the index of the button pressed to the signal
    userAnswerSignal.value = answerIndex;
    hasAnsweredCorrectlySignal.value =
      userAnswerSignal.value == props.question.answer;
    props.incrementAnswer(hasAnsweredCorrectlySignal.value);
  });

  const copyQuestionToClipboard = $(() => {
    navigator.clipboard.writeText(
      constructQuestionTextClipboard(props.index, props.question)
    );
  });

  return (
    <div>
      <div class="font-bold text-3xl max-w-3xl mx-auto pb-4">
        Question {props.index + 1}
        <p class="font-medium	mt-2 text-xl">{questionObj.question}</p>
      </div>
      {/* todo: fix image sizing for smaller screens  */}
      <img
        class="rounded-lg max-w-3xl mx-auto max-w-full h-auto"
        src={props.question.image ?? undefined}
      ></img>
      <ul>
        {userAnswerSignal.value < 0 &&
          props.question.choices.map((choice, index) => {
            return (
              <li class="my-5">
                <div class="">
                  <QuizButton
                    text={`${choice} `}
                    onClick={handleAnswerGiven}
                    index={index}
                    isAnswer={props.index === props.question.answer}
                  ></QuizButton>
                </div>
                {/* {choice} */}
              </li>
            );
          })}
      </ul>
      {userAnswerSignal.value < 0 && (
        <div class="flex justify-center mx-auto mt-4">
          <Button onClick={copyQuestionToClipboard} theme="warm">
            Copy question to clipboard
          </Button>
        </div>
      )}
      {userAnswerSignal.value >= 0 && (
        <AnswerComponent
          isCorrect={hasAnsweredCorrectlySignal.value}
          userAnswer={userAnswerSignal.value}
          correctAnswerNumber={props.question.answer}
          summary={props.question.summary}
        ></AnswerComponent>
      )}
    </div>
  );
});

// ----------------------------------------------------------------------------------------

interface QuizButtonProps {
  text: string;
  onClick: QRL<(value: number) => void>;
  index: number;
  isAnswer: boolean;
}

const QuizButton = component$((props: QuizButtonProps) => {
  /**
   * Renders buttons for the quiz
   */
  const handleAnswer = $(() => {
    props.onClick(props.index);
  });
  //return divs instead of buttons bc styling  makes it easier
  return (
    <div
      onClick$={handleAnswer}
      class="flex flex-row bg-gradient-to-r from-cyan-500 to-blue-500 hover:-translate-y-1 hover:drop-shadow-xl hover:scale-110 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition ease-in-out delay-80 px-5 py-3 rounded-lg w-auto max-w-3xl mx-auto	font-bold overflow-hidden"
    >
      <div class="pr-5 pl-30 py-30 text-xl">
        {
          mapIntToAlphabet(props.index) // int to string in the form of 1:a, 2:b etc
        }
      </div>
      <div class="px-2"></div>
      {checkAndTrimString(props.text)}
    </div>
  );
});
