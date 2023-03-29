import { component$ } from "@builder.io/qwik";

const mapIntToAlphabet = (num: number) => {
  return String.fromCharCode(97 + num).toLocaleUpperCase();
};

interface AnswerComponentProps {
  isCorrect: boolean | null;
  userAnswer: number;
  correctAnswerNumber: number;
  // summary: string // todo add support for this
}
export const AnswerComponent = component$((props: AnswerComponentProps) => {
  return (
    <div class="bg-zinc-700	w-auto max-w-3xl mx-auto p-3 rounded-md mt-4">
      {(() => {
        console.log("lala", props.correctAnswerNumber);
        if (props.isCorrect !== null && props.isCorrect) {
          return <div class="font-bold"> Correct!</div>;
        } else if (props.isCorrect !== null && !props.isCorrect) {
          return (
            <div>
              <div class="font-bold"> False</div>
              <div>
                The correct Answer was:{" "}
                {mapIntToAlphabet(props.correctAnswerNumber)}
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
