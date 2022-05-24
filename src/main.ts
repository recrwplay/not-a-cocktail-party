import "./style.css";
import { h, $ } from "./dom";

const input = h<HTMLInputElement>("input", "main-input");
input.placeholder = "match N return N";
const queryButton = h("button", null, "Run Query");


$(".cypher-input").append(input, queryButton);

const resetDatabaseButton = h("button", null, "Reset Database");
const clueButton = h("button", null, "Give me a clue");

$(".bottom-controls").append(resetDatabaseButton, clueButton);


const runQuery = () => {
  const query = input.value;
  alert(query);
  input.value = "";  
};


queryButton.addEventListener('click', runQuery);
input.addEventListener('keydown', (e) => {
  if (e.key === "Enter") {
    runQuery();
  }
});
