import { Neo4jAPI } from "./neo4j_api";
import { Queries } from "./queries";
import { Knowledge } from "./knowledge";

import { h, $ } from "./dom";

export class EventsEngine {
    private events = [
        {
            conditions: [Queries.isLightOn],
            effects: [Queries.createSafe, Queries.createCupboard, Queries.updateLightSwitchDesc],
            effectText: "You turn the light on, the room is nasty",
            knowledge: [Knowledge.lightSwitch],
            cypher: ["SET"]
        }
    ]

    private api: Neo4jAPI

    constructor(api: Neo4jAPI) {
        this.api = api
    }

    public async checkConditions(){
        const notRunEvents=[]

        for(const event of this.events){
            if(await this.runConditions(event.conditions)){
                await this.runEffects(event.effects);
                await this.addKnowledge(event.knowledge);
                await this.addCypherKnowledge(event.cypher);
                console.log(event.effectText);

            } else {
                notRunEvents.push(event)
            }
        }
        this.events=notRunEvents;
    }


    public async runConditions(conditions:Array<string>): Promise<boolean>{
        const results=await Promise.all(conditions.map(async (query)=>{
            const result=await this.api.runCypher(query)
            return result[0][0] as boolean
        }))
        return results.every((c)=>{
            return c===true
        })
    }

    public async runEffects(effects:Array<string>): Promise<void>{
        await Promise.all(effects.map(async (query)=>{
            await this.api.runCypher(query)
        }))
    }

    public async addKnowledge(knowledge:Array<string>): Promise<void>{
        await Promise.all(knowledge.map(async (knowledge)=>{
            console.log(knowledge)
        }))
    }

    public async addCypherKnowledge(cypher:Array<string>): Promise<void>{
        await Promise.all(cypher.map(async (cypher)=>{
            console.log(cypher)
            const learned = $(".learned");
            learned.append(
                h("p", null, cypher)
              );

        }))
    }
}
