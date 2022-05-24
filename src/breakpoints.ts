import { Neo4jAPI } from "./neo4j_api";

interface Breakpoint {
  shouldTrigger: (api: Neo4jAPI) => Promise<boolean>;
  action: (api: Neo4jAPI) => any;
  hasTriggered: boolean;
  message: string;

  id: string;
  prerequisites: string[] /* id of breakpoints that need to trigger first */;
}

const lightSwitch: Breakpoint = {
  shouldTrigger: async (api) => {
    // match (n:LightSwitch) where n.id = XXX return n
    return false; // return n.switchedOn
  },
  action: async (api) => {
    console.log("lights turned on; we should populate db with room stuff");
  },
  message: "With the flick of a switch, a ceiling lamp is turned on.",
  hasTriggered: false,

  id: "lightSwitch",
  prerequisites: [],
};

export const breakpoints = [lightSwitch];
