import "./vars.css";
import "./style.css";
import { h, $, svg } from "./dom";
import {Neo4jAPI} from "./neo4j_api";
import {GameSetup} from "./gameSetup";
import { EventsEngine } from "./eventsEngine";
import {config} from "../config"
import { Node, Relationship } from "./graph";
import {GameText} from "./gameText"
import { Level2Checker } from "./level2Checker";
import {map} from "./map";
import {ShowResults} from "./showResults"
import { renderGraph } from "./render/graph-renderer";
import { despawnPopup } from "./popup";

const loginMap=$("#login-map")
loginMap.innerHTML=map;

$(".login-button").addEventListener("click", ()=>{
    $(".login").style.display="none";

    const url=$<HTMLInputElement>("#login-url").value || config.url
    const username=$<HTMLInputElement>("#login-username").value || config.username
    const password=$<HTMLInputElement>("#login-password").value || config.password


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

    const handleRunQueryEvent = async () => {
      if (gameState.loading) return;

      despawnPopup();
      const query = input.value;
      const success = await runQuery(query);

      if (success) input.value = "";
    };

    const copyToInput = async (query: string) => {
        input.value = query;

        // var textarea = document.createElement('textarea')
        // textarea.value = query
        // textarea.setAttribute('readonly', '')
        // textarea.style.position = 'absolute'
        // textarea.style.left = '-9999px'

        // document.body.appendChild(textarea)
        // textarea.select()

        // document.execCommand('copy')
        // document.body.removeChild(textarea)

    }


    const runQuery = async (query: string) => {
      let success = true;
      try {
        setLoading(true);
        let result: Object[][]
        if(!eventsEngine.level1Finished){
            result=await api.runCypher(query);
        } else {
            let fullQuery = query;
            if(query.includes("solution")){
                fullQuery=Level2Checker.getFullQuery(query)
                result=await api.runReadOnlyCypher(fullQuery);
                console.log(result)
                if(result.every((s)=>s[0]===true) && result.length > 0) {
                    const price = result[0][1]
                    const time = result[0][2]
                    addMessageToSidebar("You get to the airport in " + time + " minutes and spending " + price + " Kronor. Well done!");
                } else {
                    addMessageToSidebar("You get lost and find yourself back at the hotel");
                }
            } else {
                result=await api.runReadOnlyCypher(fullQuery);
            }
        }

        const display = $(".game-display");
        while (display.firstChild) display.firstChild.remove();

        if (result.length > 0) {
          const { nodes, relationships, rawStrings } = parseNeo4jResponse(result);
          display.append(svg("svg", "graph", ...renderGraph(nodes, relationships, 700, 500)));

          // for (const node of nodes) display.append(renderNode(node));
          // for (const rel of relationships) display.append(renderRelationship(rel));

          // This is the ascii table stuff
          const showResults = new ShowResults()
          if (nodes.length)         display.append(h("pre", null, showResults.makeTableFrom(nodes)));
          // if (relationships.length) display.append(h("pre", null, showResults.makeTableFrom(relationships)));
          if (rawStrings.length)    display.append(h("pre", null, JSON.stringify(rawStrings, null, '  ')));
        }


        let messages:string[]=[]

        if(!eventsEngine.level1Finished){
            // LEVEL 1
            messages=await eventsEngine.checkConditions();
            if(eventsEngine.level1Finished) {
                await gameSetup.setupLevel2();
            }
        }

        addQueryToSidebar(query);

        for (const message of messages) {
          display.prepend(
            h("p", "message", message)
          )

          addMessageToSidebar(message);
        }

        if (result.length === 0 && messages.length === 0) {
          display.append(
            h("p", "message", "Nothing happened")
          );
        }
      } catch (error) {
        addErrorToSidebar(error as Error);
        console.error(error);
        success = false;
      } finally {
        setLoading(false);
      }
      return success;
    };

    const gameSetup = new GameSetup(api)
    const eventsEngine = new EventsEngine(api)
    await gameSetup.setupLevel1()

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
      const rerunButton = h("i", "fa", "");
      rerunButton.classList.add("fa-play");
      rerunButton.addEventListener("click", () => {
        runQuery(query);
      });

      const copyButton = h("i", "fa", "");
      copyButton.classList.add("fa-copy");
      copyButton.addEventListener("click", () => {
        copyToInput(query);
      });

      sidebar.prepend(
        h("div", "query",
          h("p", null, query),
          copyButton,
          rerunButton,
        ),
      );
    };

    const addMessageToSidebar = (message: string) => {
        const messageElement=h("p", "message")
        messageElement.innerHTML=message
      sidebar.prepend(messageElement);
    };

    const addErrorToSidebar = (error: Error) => {
      sidebar.prepend(h("p", "error", String(error)));
    }

    addMessageToSidebar(GameText.initialState);

    const renderFullGraphButton = $("#render-full-graph-button")
    const resetDatabaseButton = $("#reset-button")
    const clueButton = $("#clue-button")

    renderFullGraphButton.addEventListener("click", () => {
      runQuery(`MATCH(n) OPTIONAL MATCH(n)-[r]->() RETURN *`);
    });

    clueButton.addEventListener("click", ()=>{
        addMessageToSidebar(eventsEngine.clueText)
    })

    resetDatabaseButton.addEventListener('click', async () => {
      const yes = confirm("This will reset the entire database state. Are you sure?");
      if (yes) {
        setLoading(true);
        await gameSetup.setupLevel1();
        eventsEngine.reset();
        addMessageToSidebar(GameText.resetDatabase);
        addMessageToSidebar("The game state has been reset.");
        setLoading(false);
      }
    });
}

const setLoading = (loading: boolean) => {
  for (const button of document.querySelectorAll<HTMLButtonElement>('button')) {
    button.disabled = loading;
  }

  $<HTMLTextAreaElement>('.cypher-input textarea').disabled = loading;

  gameState.loading = loading;
}

const parseNeo4jResponse = (result: any[][]) => {
  const nodes = new Map<number, Node>();
  const relationships = new Map<number, Relationship>();
  const rawStrings: string[] = [];

  for (const group of result) {
      for (const item of group) {
          if (!item) continue;
          if (typeof item === 'string') {
              rawStrings.push(item);
          } else {
            // Assume it's either a node or relationship
            if (item.__isRelationship__) {
              const id = item.identity.low;
              relationships.set(id, {
                  type: item.type,
                  properties: prettifyProperties(item.properties),
                  id,
                  start: item.start.low,
                  end: item.end.low,
              })
            } else if (item.__isNode__) {
              const id = item.identity.low;
              nodes.set(id, {
                  labels: item.labels.join(', '),
                  properties: prettifyProperties(item.properties),
                  id,
              });
            }
          }
      }
  }

  return {
    nodes: [...nodes.values()],
    relationships: [...relationships.values()],
    rawStrings,
  }
}

const prettifyProperties = (props: Record<string, any>): Record<string, any> => {
  return Object.fromEntries(
    Object.entries(props)
      .map(([key, value]) => {
        if (typeof value === "object" && typeof value.high === "number" && typeof value.low === "number") {
          return [key, value.low];
        }
        return [key, value];
      })
  );
};

// const renderNode = (node: Node) => {
//   const title = `${node.labels}  (id ${node.id})`;
//   const properties = Object.entries(node.properties).map(([key, value]) => `  ${key}:  ${value}`);
//   return renderThing(title, properties);
// };
//
// const renderRelationship = (rel: Relationship) => {
//   // TODO: Figute out how to display a relationship in a meaningful way
//   const title =  `Relationship ${rel.type}  (id ${rel.id})`;
//   const properties = Object.entries(rel.properties).map(([key, value]) => `  ${key}:  ${value}`);
//   return renderThing(title, properties);
// }


// const renderThing = (title: string, body: string[]) => {
//   const button = h("button", "toggle", "-");
//   // TODO: Figute out how to display a relationship in a meaningful way
//   const properties = h("pre", null, body.join('\n'));
//
//   let open = true;
//
//   const toggle = () => {
//     open = !open;
//     button.textContent = open ? '-' : '+';
//     properties.style.display = open ? 'block' : 'none';
//   }
//
//   button.addEventListener('click', toggle);
//
//   return h("div", "node",
//     h("div", "node-header",
//       h("pre", null, title),
//       button
//     ),
//     properties
//   );
// }
