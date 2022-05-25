import "./style.css";
import { h, $ } from "./dom";
import {Neo4jAPI} from "./neo4j_api";
import {GameSetup} from "./gameSetup";
import { EventsEngine } from "./eventsEngine";
import {ShowResults} from "./showResults";
import {config} from "./config"
import { Node, Relationship } from "./graph";
import {GameText} from "./gameText"
import { Level2Checker } from "./level2Checker";


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

    const handleRunQueryEvent = () => {
      if (gameState.loading) return;

      const query = input.value;
      input.value = "";
      runQuery(query);
    };

    const runQuery = async (query: string) => {
      try {
        setLoading(true);
        let result: Object[][]
        if(!eventsEngine.level1Finished){
            result=await api.runCypher(query);
        } else {
            const fullQuery=Level2Checker.getFullQuery(query)
            result=await api.runCypher(fullQuery);
        }

        const display = $(".game-display");
        while (display.firstChild) display.firstChild.remove();

        if (result.length > 0) {
          const { nodes, relationships, rawStrings } = parseNeo4jResponse(result);

          for (const node of nodes) display.append(renderNode(node));
          for (const rel of relationships) display.append(renderRelationship(rel));

          // This is the ascii table stuff
          const showResults = new ShowResults()
          if (nodes.length)         display.append(h("pre", null, showResults.makeTableFrom(nodes)));
          if (relationships.length) display.append(h("pre", null, showResults.makeTableFrom(relationships)));
          if (rawStrings.length)    display.append(h("pre", null, JSON.stringify(rawStrings, null, '  ')));
        }


        let messages:string[]=[]

        if(!eventsEngine.level1Finished){
            // LEVEL 1
            messages=await eventsEngine.checkConditions();
        }

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
        const messageElement=h("p", "message")
        messageElement.innerHTML=message
      sidebar.prepend(messageElement);
    };

    const addErrorToSidebar = (error: Error) => {
      sidebar.prepend(h("p", "error", String(error)));
    }

    addMessageToSidebar(GameText.initialState);


    const resetDatabaseButton = $("#reset-button")
    const clueButton = $("#clue-button")

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

  gameState.loading = loading;
}

const parseNeo4jResponse = (result: any[][]) => {
  const nodes: Node[] = [];
  const relationships: Relationship[] = [];
  const rawStrings: string[] = [];

  for (const group of result) {
      for (const item of group) {
          if (typeof item === 'string') {
              rawStrings.push(item);
          } else {
            // Assume it's either a node or relationship
            if (item.__isRelationship__) {
              relationships.push({
                  type: item.type,
                  properties: item.properties,
                  id: item.identity.low,
                  start: item.start.low,
                  end: item.end.low,
              })
            } else if (item.__isNode__) {
              nodes.push({
                  labels: item.labels.join(', '),
                  properties: item.properties,
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

const renderNode = (node: Node) => {
  const title = `${node.labels}  (id ${node.id})`;
  const properties = Object.entries(node.properties).map(([key, value]) => `  ${key}:  ${value}`);
  return renderThing(title, properties);
};

const renderRelationship = (rel: Relationship) => {
  // TODO: Figute out how to display a relationship in a meaningful way
  const title =  `Relationship ${rel.type}  (id ${rel.id})`;
  const properties = Object.entries(rel.properties).map(([key, value]) => `  ${key}:  ${value}`);
  return renderThing(title, properties);
}


const renderThing = (title: string, body: string[]) => {
  const button = h("button", "toggle", "-");
  // TODO: Figute out how to display a relationship in a meaningful way
  const properties = h("pre", null, body.join('\n'));

  let open = true;

  const toggle = () => {
    open = !open;
    button.textContent = open ? '-' : '+';
    properties.style.display = open ? 'block' : 'none';
  }

  button.addEventListener('click', toggle);

  return h("div", "node",
    h("div", "node-header",
      h("pre", null, title),
      button
    ),
    properties
  );
}
