import "./style.css";
import { h, $ } from "./dom";

const input = h<HTMLInputElement>("input", "main-input");
input.placeholder = "match N return N";
$(".cypher-input").append(input);

const resetDatabaseButton = h("button", undefined, "Reset Database");
const clueButton = h("button", undefined, "Give me a clue");

$(".bottom-controls").append(resetDatabaseButton, clueButton);
