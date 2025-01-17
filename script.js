import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai@0.21.0";
import * as mapsFunction from "./function-declarations.js";
import { presets } from "./presets.js";
import { html, render } from "https://esm.run/lit";

const client = new GoogleGenerativeAI("api_key");
const systemInstruction = mapsFunction.systemInstructions;

const functionDeclarations = mapsFunction.declarations.map(declaration => ({
  ...declaration,
  callback: (args) => {
    const { location, caption } = args;
    renderPage(location, caption);
  },
}));

const chat = async (userText) => {
  try {
    const temperature = 2; // High temperature for answer variety
    const {response} = await client
      .getGenerativeModel(
        {model: 'models/gemini-2.0-flash-exp', systemInstruction},
        {apiVersion: 'v1beta'}
      )
      .generateContent({
        contents: [
          {
            role: "user",
            parts: [{text: userText}],
          },
        ],
        generationConfig: {temperature},
        tools: [{functionDeclarations}]
      });

    const call = response.functionCalls()[0];

    if (call) {
      functionDeclarations[0].callback(call.args);
    }
  } catch (e) {
    console.error(e);
  }
};

async function init() {
  renderPage("%"); // Start by rendering with empty location query: shows earth
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    document.documentElement.removeAttribute("data-theme"); // Use default (dark)
  } else {
    document.documentElement.setAttribute("data-theme", "light");
  }
}

init();

function renderPage(location, caption = "") {
  const root = document.querySelector("#root");
  caption = caption.replace(/\\/g, '');
  render(
    html`
      <div id="map">${mapsFunction.embed(location)}</div>
      ${caption
        ? html`<div id="caption"><p>${caption}</p></div>`
        : ""}
      <div id="presets-container">
      <span id="take-me-somewhere">Take me somewhere...</span>
        <div id="presets">
              ${presets.map(
          ([name, message]) =>
            html`<button @click=${() => chat(message)} class="preset">
                    ${name}
                  </button>`
        )}
        </div>
      </div>
    `,
    root
  );
}
