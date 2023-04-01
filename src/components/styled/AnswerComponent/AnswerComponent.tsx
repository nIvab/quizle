import { $, component$ } from "@builder.io/qwik";
import { constructAnswerTextClipboard } from "./utility";
import Button from "../buttons/Button";

const mapIntToAlphabet = (num: number) => {
  return String.fromCharCode(97 + num).toLocaleUpperCase();
};

interface AnswerComponentProps {
  isCorrect: boolean | null;
  userAnswer: number;
  correctAnswerNumber: number;
  summary: string;
}

export const AnswerComponent = component$((props: AnswerComponentProps) => {
  const copyAnswerToClipboard = $(() => {
    if (props.isCorrect !== null) {
      navigator.clipboard.writeText(
        constructAnswerTextClipboard(
          props.isCorrect,
          props.summary,
          props.correctAnswerNumber
        )
      );
    }
  });
  return (
    <div class="bg-zinc-700	w-auto max-w-3xl mx-auto p-3 rounded-md mt-4">
      {(() => {
        if (props.isCorrect !== null && props.isCorrect) {
          return (
            <div>
              {" "}
              <span class="font-bold text-green-500 text-xl"> Correct! </span>
              {props.summary}
              <div class="flex mx-auto justify-center mt-5">
                <Button onClick={copyAnswerToClipboard} theme="warm">
                  Copy answer to clipboard
                </Button>
              </div>
            </div>
          );
        } else if (props.isCorrect !== null && !props.isCorrect) {
          return (
            <div>
              <div>
                {" "}
                <span class="font-bold text-red-500 text-xl"> False: </span>
                {props.summary}
              </div>
              <div class="font-bold">
                The correct Answer was:{" "}
                {mapIntToAlphabet(props.correctAnswerNumber)}
              </div>
              <div class="flex mx-auto justify-center mt-5">
                <Button onClick={copyAnswerToClipboard} theme="warm">
                  Copy answer to clipboard
                </Button>
              </div>
            </div>
          );
        } else {
          <div>was null</div>;
          return <div></div>;
        }
      })()}
    </div>
  );
});
