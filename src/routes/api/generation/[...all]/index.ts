import { RequestHandler } from "@builder.io/qwik-city";

import { runCheck } from "../../../../../server/database/runCheck";

// Called with every HTTP request (regardless of method)
export const onRequest: RequestHandler = async (event) => {
  // localhost:5173/api/generation/?apiKey=...

  const key = import.meta.env.VITE_ENDPOINT_KEY as string; // very scuffed authentication but does what we need
  const params: URLSearchParams = event.query;
  if (params.get("apiKey") == key) {
    runCheck();
    event.json(200, {
      status: "ok",
      body: "quiz generation called",
    });
  } else {
    event.json(401, {
      status: "failed",
      body: "unauthorised",
      key: params.get("apiKey"),
      sKey: key,
    });
  }
};
