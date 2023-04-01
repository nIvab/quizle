import { component$ } from "@builder.io/qwik";
import { link } from "fs";

export default component$(() => {
  const linkStyle: string =
    "transition italic ease-in-out delay-70 underline hover:font-bold hover:text-neutral-200";
  return (
    <footer class="rounded-b-lg">
      <div class="p-2 flex flex-row justify-around">
        <div>
          Made with{" "}
          <a
            href="https://openai.com/blog/openai-api"
            target="_blank"
            class={linkStyle}
          >
            OpenAi GPT
          </a>{" "}
          and{" "}
          <a href="https://newsapi.org/" target="_blank" class={linkStyle}>
            News API{" "}
          </a>{" "}
        </div>
        <a
          href="https://github.com/nIvab/quizle"
          target="_blank"
          class={"" + linkStyle}
        >
          <div class="flex flex-row justify-around">
            <img
              src="/square-github.svg"
              alt="github logo"
              class="max-h-6 mr-3"
            />
            Source
          </div>
        </a>
      </div>
    </footer>
  );
});
