/* @refresh reload */

import "./index.css";

console.log("HELLO WORLD", import.meta.env.VITE_API_URL);

const callApi = async () => {
  document.body.querySelector("#result")!.innerHTML = "Loading...";

  const result = await fetch(import.meta.env.VITE_API_URL);

  const data = await result.json();
  console.log(data);

  document.querySelector<HTMLPreElement>("#result")!.innerText = JSON.stringify(
    data,
    null,
    2
  );
};

callApi();

export {};
