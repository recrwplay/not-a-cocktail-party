import "./style.css";
import { h, $ } from "./dom";
import {Neo4jAPI} from "./neo4j_api";

const input = h<HTMLInputElement>("input", "main-input");
input.placeholder = "match N return N";
$(".cypher-input").append(input);

const resetDatabaseButton = h("button", undefined, "Reset Database");
const clueButton = h("button", undefined, "Give me a clue");

$(".bottom-controls").append(resetDatabaseButton, clueButton);
const api = new Neo4jAPI();
api.runCypher("MATCH (n) RETURN n");
