import { ActionFunction, json } from "@remix-run/node"; // or cloudflare/deno
import { createExcel } from "./post.ts";

export const action: ActionFunction = async ({ request }) => {
  // console.log(json(request.body));
  const data = await request.json();
  console.log(data);
  switch (request.method) {
    case "POST": {
      /* handle "POST" */
      let stream = await createExcel(data);
      let headers = new Headers({ "Content-Type": "blob" });
      let end = new Response(stream, { status: 200, headers });
      return end;
    }
  }
};
