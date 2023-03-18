import {
  $,
  QwikChangeEvent,
  Signal,
  component$,
  useSignal,
} from "@builder.io/qwik";
import { DocumentHead, Form, useNavigate } from "@builder.io/qwik-city";

import Button from "~/components/styled/Button";
import { SelectFromObject } from "~/components/styled/SelectFromObject";

const categories = {
  "All Categories": "",
  Business: "business",
  Entertainment: "entertainment",
  General: "general",
  Health: "health",
  Science: "science",
  Sports: "sports",
  Technology: "technology",
};

const countries = {
  International: "",
  Australia: "au",
  Ukraine: "ua",
};

export default component$(() => {
  const nav = useNavigate();

  const country = useSignal<string>("");
  const category = useSignal<string>("");
  const onClick = $(() => {
    let url = `/quiz/?country=${country.value}&?category=${category.value}`;
    nav(url);
  });
  return (
    <div class="text-white flex flex-col justify-center items-center ">
      <div class="flex justify-center items-center leading-3 place-items-center pb-5">
        <img
          src="https://cdn.betterttv.net/emote/6072c12539b5010444cfd137/3x.webp"
          alt="lets go emote"
          class="h-9"
        />
        <h2 class="text-3xl font-semibold leading-3 pl-2 pr-3">
          {" "}
          Welcome To the Quiz{" "}
        </h2>
        <img
          src="https://cdn.betterttv.net/emote/5f7cd139ce8bc74a94247828/3x.webp"
          alt="dancey boi"
          class="h-9"
        />
      </div>
      <p>
        This site will take 10 random news articles utilising the filters
        specified below, then feed each article into GPT and generate questions
        for you to answer!
      </p>
      <div class="mt-10">
        <Form class="flex flex-row justify-center space-x-10">
          <div class="flex flex-col justify-center  items-center">
            <span class="text-lg font-semibold">Categories</span>
            <SelectFromObject
              object={categories}
              objectSignal={category}
            ></SelectFromObject>
          </div>
          <div class="flex flex-col max-w-xs justify-center items-center">
            <span class="text-lg font-semibold">Countries</span>
            <SelectFromObject
              object={countries}
              objectSignal={country}
            ></SelectFromObject>
          </div>
        </Form>
      </div>
      <div class="flex justify-center items-center mt-10">
        <Button text="Take me to the Quiz already" onClick={onClick}></Button>
      </div>
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
