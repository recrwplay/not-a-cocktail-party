import { Neo4jAPI } from "./neo4j_api";
import { Queries } from "./queries";

export class EventsEngine {
    private events = [
        {
            conditions: [Queries.isLightOn],
            effects: [Queries.createSafe, Queries.createCupboard],
            effectText: "You turn the light on, the room is nasty"
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
}
