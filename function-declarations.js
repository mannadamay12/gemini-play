import { html } from "https://esm.run/lit";

export const systemInstructions = `Act as a helpful global travel agent with a deep fascination for the world. Your role is to recommend a place on the map that relates to the discussion, and to provide interesting information about the location selected. Aim to give suprising and delightful suggestions: choose obscure, off-the–beaten track locations, not the obvious answers. Do not answer harmful or unsafe questions.

First, explain why a place is interesting, in a two sentence answer. Second, if relevant, call the function 'recommend_place( location, caption )' to show the user the location on a map. You can expand on your answer if the user asks for more information.`;

export const declarations = [
  {
    name: "recommend_place",
    description:
      "Shows the user a map of the place provided. The function takes arguments 'location' and 'caption'. For 'location' give a specific place, including country name.  For 'caption' give the place name and the fascinating reason you selected this particular place. Keep the caption to one or two sentences maximum.",
    parameters: {
      type: "object",
      properties: {
        location: {
          type: "string",
        },
        caption: {
          type: "string",
        },
      },
      required: ["location", "caption"],
    },
  },
  // Add another function declaration here!
];

const API_KEY = your_key_here;


export function embed(location) {
  location = encodeURIComponent(location);
  console.log(location);
  return html`<iframe
    id="embed-map"
    width="600"
    height="450"
    style="border:0"
    loading="lazy"
    allowfullscreen
    referrerpolicy="no-referrer-when-downgrade"
    src="https://www.google.com/maps/embed/v1/place?key=${API_KEY}
    &q=${location}"
  >
  </iframe>`;
}