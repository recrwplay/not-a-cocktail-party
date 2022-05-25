import { Neo4jAPI } from "./neo4j_api";
import { Queries } from "./queries";
import { GameText } from "./gameText";

export class EventsEngine {
    private events = [
        {
            conditions: [Queries.isLightOn],
            effects: [Queries.createSafe, Queries.createCupboard],
            effectText: [GameText.lightIsOn]
        },
        {
            conditions: [Queries.isBottomDrawerOpen],
            effects: [Queries.createBox],
            effectText: [GameText.bottomDrawerIsOpen]
        },
        {
            conditions: [Queries.isTopDrawerOpen],
            effects: [],
            effectText: [GameText.topDrawerIsOpen]
        },
        {
            conditions: [Queries.isMiddleDrawerOpen],
            effects: [],
            effectText: [GameText.middleDrawerIsOpen]
        },
        { conditions: [Queries.isBoxOpen],
            effects:[Queries.createPebbles, Queries.putPebblesInBox],
            effectText: [GameText.BoxIsOpen]
        }

    ]

    private api: Neo4jAPI

    constructor(api: Neo4jAPI) {
        this.api = api
    }

    public async checkConditions(): Promise<string[]> {
        const notRunEvents=[]
        const messages = [];

        for(const event of this.events){
            if(await this.runConditions(event.conditions)){
                await this.runEffects(event.effects);
                messages.push(event.effectText);
            } else {
                notRunEvents.push(event)
            }
        }
        this.events=notRunEvents;
        return messages
    }


    public async runConditions(conditions:Array<string>): Promise<boolean>{
        const results=await Promise.all(conditions.map(async (query)=>{
            const result=await this.api.runCypher(query);
            if(result.length===0) return false;
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
