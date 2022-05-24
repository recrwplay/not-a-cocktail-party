import "./style.css";
import { h, $ } from "./dom";
import {Neo4jAPI} from "./neo4j_api";
import {GameSetup} from "./gameSetup";
import { EventsEngine } from "./eventsEngine";
import {ShowResults} from "./showResults";


$(".login-button").addEventListener("click", ()=>{
    $(".login").style.display="none";

    // const url=$<HTMLInputElement>("#login-url").value
    // const username=$<HTMLInputElement>("#login-username").value
    // const password=$<HTMLInputElement>("#login-password").value

    const username="neo4j"
    const password="qK6qOvIBbp6ZI1uXNtiK96l6zirs5VXGMcFJSrrSdrk"
    const url="neo4j+s://bc90915d.databases.neo4j.io:7687"

    const api = new Neo4jAPI(url, username, password)
    loadGame(api);
})

async function loadGame(api: Neo4jAPI){
    $(".game-grid").style.display="grid";
    const input = h<HTMLInputElement>("input", "main-input");
    input.placeholder = "match N return N";
    const queryButton = h("button", null, "Run Query");


    $(".cypher-input").append(input, queryButton);

    const resetDatabaseButton = h("button", null, "Reset Database");
    const clueButton = h("button", null, "Give me a clue");

    $(".bottom-controls").append(resetDatabaseButton, clueButton);

    const runQuery = async () => {
      try {
        const query = input.value;
        const result=await api.runCypher(query);
        input.value = "match (n) return n";
        console.log(result)
        const showResults = new ShowResults()
        $(".game-display").append(showResults.makeTableFrom(result));
        await eventsEngine.checkConditions()
        addQueryToSidebar(query);
      } catch (error) {
        addErrorToSidebar(error as Error);
      }
    };

    const gameSetup = new GameSetup(api)
    const eventsEngine = new EventsEngine(api)
    await gameSetup.lightSetup()

    queryButton.addEventListener('click', runQuery);

    input.addEventListener('keydown', (e) => {
        if (e.key === "Enter") {
            runQuery();
        }
    });

    const sidebar = $(".sidebar");

    const addQueryToSidebar = (query: string) => {
      const rerunButton = h("button", "rerun", "Rerun");
      rerunButton.addEventListener("click", () => {
        input.value = query;
        runQuery();
      });

      sidebar.append(
        h("div", "query", 
          h("p", null, query),
          rerunButton,
        ),
      );
    };

    const addMessageToSidebar = (message: string) => {
      sidebar.append(h("p", "message", message));
    };

    const addErrorToSidebar = (error: Error) => {
      sidebar.append(h("p", "error", String(error)));
    }

    addMessageToSidebar("Hello, world!");
}
