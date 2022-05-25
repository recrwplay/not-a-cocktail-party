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
    const password="Uy1mtVLz8LeAMGfaSqZW0K66yqJO3ynjbpQoFo0iqpY"
    const url="neo4j+s://b6472746.databases.neo4j.io:7687"

    const api = new Neo4jAPI(url, username, password)
    loadGame(api);
})

const gameState = {
  loading: false,
};

async function loadGame(api: Neo4jAPI){
    $(".game-grid").style.display="grid";
    const input = h<HTMLInputElement>("textarea", "main-input");
    input.value = "match (n) return n";
    const queryButton = h<HTMLButtonElement>("button", null, "Run Query");
    $(".cypher-input").append(input, queryButton);

    setLoading(true);

    const resetDatabaseButton = h("button", null, "Reset Database");
    const clueButton = h("button", null, "Give me a clue");

    $(".bottom-controls").append(resetDatabaseButton, clueButton);

    const handleRunQueryEvent = () => {
      if (gameState.loading) return;

      const query = input.value;
      input.value = "";
      runQuery(query);
    };

    const runQuery = async (query: string) => {
      try {
        setLoading(true);
        const result=await api.runCypher(query);

        const display = $(".game-display");
        while (display.firstChild) display.firstChild.remove();

        if (result.length > 0) {
          const { nodes, relationships, rawStrings } = parseNeo4jResponse(result);

          const showResults = new ShowResults()

          if (nodes.length)         display.append(h("pre", null, showResults.makeTableFrom(nodes)));
          if (relationships.length) display.append(h("pre", null, showResults.makeTableFrom(relationships)));
          if (rawStrings.length)    display.append(h("pre", null, JSON.stringify(rawStrings, null, '  ')));
        }

        const messages=await eventsEngine.checkConditions();
        addQueryToSidebar(query);

        for (const message of messages) {
          display.prepend(
            h("pre", null, message)
          )

          addMessageToSidebar(message);
        }

        if (result.length === 0 && messages.length === 0) {
          display.append(
            h("pre", null, "Nothing happened")
          );
        }
      } catch (error) {
        addErrorToSidebar(error as Error);
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const eventsEngine = new EventsEngine(api)
    const gameSetup = new GameSetup(api)
    await gameSetup.lightSetup()

    // Now we can run queries
    setLoading(false);

    queryButton.addEventListener('click', handleRunQueryEvent);

    input.addEventListener('keydown', (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            handleRunQueryEvent();
        }
    });

    const sidebar = $(".sidebar");

    const addQueryToSidebar = (query: string) => {
      const rerunButton = h("button", "rerun", "Rerun");
      rerunButton.addEventListener("click", () => {
        runQuery(query);
      });

      sidebar.prepend(
        h("div", "query",
          h("p", null, query),
          rerunButton,
        ),
      );
    };

    const addMessageToSidebar = (message: string) => {
      sidebar.prepend(h("p", "message", message));
    };

    const addErrorToSidebar = (error: Error) => {
      sidebar.prepend(h("p", "error", String(error)));
    }

    addMessageToSidebar("Hello, world!");
    addQueryToSidebar("MATCH (l:LightSwitch) SET l.on = true");
}

const setLoading = (loading: boolean) => {
  for (const button of document.querySelectorAll<HTMLButtonElement>('button')) {
    button.disabled = loading;
  }

  gameState.loading = loading;
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
