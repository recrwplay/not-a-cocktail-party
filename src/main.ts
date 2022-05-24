import "./style.css";
import { h, $ } from "./dom";
import {Neo4jAPI} from "./neo4j_api";


$(".login-button").addEventListener("click", ()=>{
    $(".login").style.display="none";
    loadGame();
})

function loadGame(){
    $(".game-grid").style.display="grid";
    const input = h<HTMLInputElement>("input", "main-input");
    input.placeholder = "match N return N";
    const queryButton = h("button", null, "Run Query");


    $(".cypher-input").append(input, queryButton);

    const resetDatabaseButton = h("button", null, "Reset Database");
    const clueButton = h("button", null, "Give me a clue");

    $(".bottom-controls").append(resetDatabaseButton, clueButton);

    // const url = "neo4j+s://bc90915d.databases.neo4j.io:7687";
    // const username = "neo4j";
    // const password = "qK6qOvIBbp6ZI1uXNtiK96l6zirs5VXGMcFJSrrSdrk";
    //
    // const api = new Neo4jAPI(url, username, password)
    // api.runCypher("MATCH (n) RETURN n");
    //
    //
    // const runQuery = () => {
    //   const query = input.value;
    //   alert(query);
    //   input.value = "";
    // };
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

}
