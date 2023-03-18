import { component$, Slot } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";

import Header from "~/components/starter/header/header";
import Footer from "~/components/starter/footer/footer";

export const useServerTimeLoader = routeLoader$(() => {
  return {
    date: new Date().toISOString(),
  };
});

export default component$(() => {
  return (
    <div class="flex flex-col justify-between h-screen max-h-screen">
      <main class="w-2/3 m-auto max-w-7xl bg-neutral-800 p-10 rounded-2xl">
        <Header />
        <Slot />
      </main>
      <Footer />
    </div>
  );
});
