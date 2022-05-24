import "./style.css";
import { h, $ } from "./dom";
import {Neo4jAPI} from "./neo4j_api";
import {Integer} from "neo4j-driver";
// import {GameSetup} from "./gameSetup";
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
    input.value = "match (n) return n";
    const queryButton = h<HTMLButtonElement>("button", null, "Run Query");
    queryButton.disabled = true; // Disable queries until db has been set up

    $(".cypher-input").append(input, queryButton);

    const resetDatabaseButton = h("button", null, "Reset Database");
    const clueButton = h("button", null, "Give me a clue");

    $(".bottom-controls").append(resetDatabaseButton, clueButton);

    const runQuery = async () => {
      try {
        const query = input.value;
        const result=await api.runCypher(query);
        console.log(result)
        input.value = "";

        const display = $(".game-display");
        while (display.firstChild) display.firstChild.remove();

        if (result.length > 0) {
          const { nodes, relationships, rawStrings } = parseNeo4jResponse(result);

          const showResults = new ShowResults()

          if (nodes.length)         display.append(h("pre", null, showResults.makeTableFrom(nodes)));
          if (relationships.length) display.append(h("pre", null, showResults.makeTableFrom(relationships)));
          if (rawStrings.length)    display.append(h("pre", null, JSON.stringify(rawStrings, null, '  ')));
        } else {
          display.append(
              h("p", null, "There seems to be nothing here")
          );
        }
          
        // TODO: Display event messages
        await eventsEngine.checkConditions()
        addQueryToSidebar(query);
      } catch (error) {
        addErrorToSidebar(error as Error);
        console.error(error);
      }
    };

    const eventsEngine = new EventsEngine(api)
    // const gameSetup = new GameSetup(api)
    // await gameSetup.lightSetup()

    // Now we can run queries
    queryButton.disabled = false;

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
    addQueryToSidebar("MATCH (l:LightSwitch) SET l.on = true");
}


const parseNeo4jResponse = (result: any[][]) => {
  const nodes = [];
  const relationships = [];
  const rawStrings = [];

  for (const group of result) {
      for (const item of group) {
          if (typeof item === 'string') {
              rawStrings.push(item);
          } else {
            // Assume it's either a node or relationship
            if (item.__isRelationship__) {
              relationships.push({
                  type: item.type,
                  ...item.properties,
                  id: item.identity.low,
                  start: item.start.low,
                  end: item.end.low,
              })
            } else if (item.__isNode__) {
              nodes.push({
                  labels: item.labels.join(', '),
                  ...item.properties,
                  id: item.identity.low,
              });
            }
          }
      }
  }

  return {
    nodes,
    relationships,
    rawStrings,
  }
}