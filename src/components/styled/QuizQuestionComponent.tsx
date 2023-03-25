import {
  $,
  Component,
  QRL,
  Signal,
  component$,
  useSignal,
} from "@builder.io/qwik";
import { QuizQuestion } from "../../../types/QuizQuestion";
import Button from "./Button";

type QuizComponentProps = {
  index: number;
  question: QuizQuestion;
};

export const QuizQuestionComponent = component$((props: QuizComponentProps) => {
  const questionObj = props.question;
  console.log(` quiz q ${questionObj}`);
  const hasAnsweredCorrectlySignal = useSignal<boolean | null>(null);
  const hasAnsweredSignal = useSignal<boolean>(false);
  const handleAnswerGiven = $((isAnswer: boolean) => {
    hasAnsweredSignal.value = true;
    hasAnsweredCorrectlySignal.value = isAnswer;
  });
  return (
    <div>
      <h2 class="font-semibold text-3xl pb-4">
        Question {props.index + 1}: {questionObj.question}
      </h2>
      <img class="rounded-lg" src={props.question.image}></img>
      <ul>
        {props.question.choices.map((choice, index) => {
          return (
            <li class="my-5">
              <div class="">
                <QuizButton
                  text={`${choice} `}
                  onClick={handleAnswerGiven}
                  index={index}
                  isAnswer={props.index === props.question.answerIndex}
                ></QuizButton>
              </div>
              {/* {choice} */}
            </li>
          );
        })}
      </ul>
    </div>
  );
});

interface QuizButtonProps {
  text: string;
  onClick: QRL<() => void>;
  index: number;
  isAnswer: boolean;
}

const QuizButton = component$((props: QuizButtonProps) => {
  const handleAnswer = $(() => {
    props.onClick;
  });
  return (
    <div
      onClick$={handleAnswer}
      class="flex flex-row bg-gradient-to-r from-cyan-500 to-blue-500 hover:-translate-y-1 hover:drop-shadow-xl hover:scale-110 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition ease-in-out delay-80 p-5 rounded-lg w-auto	 font-bold overflow-hidden"
    >
      <div class="pr-5 pl-30 py-30 text-xl">{props.index}</div>
      <div class="px-2"></div>
      {props.text}
    </div>
  );
});
