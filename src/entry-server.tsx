import { renderToString } from "react-dom/server";
import { App } from "./App";
import { pages } from "./routes";

export { pages };

export function render(page: (typeof pages)[number]["id"]) {
  return renderToString(<App page={page} />);
}
