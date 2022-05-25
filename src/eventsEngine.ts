import { Neo4jAPI } from "./neo4j_api";
import { Queries } from "./queries";
import { GameText } from "./gameText";

export class EventsEngine {
    private lastEvent = {
        clue: "Look the only thing there is, dummy"
    }

    private events = [
        {
            conditions: [Queries.isLightOn],
            effects: [Queries.createSafe, Queries.createCupboard],
            effectText: [GameText.lightIsOn],
            clue: "Look for things in the room",
        },
        {
            conditions: [Queries.isBottomDrawerOpen],
            effects: [Queries.createBox],
            effectText: [GameText.bottomDrawerIsOpen],
            clue: "Look for things in the room",
        },
        {
            conditions: [Queries.isTopDrawerOpen],
            effects: [],
            effectText: [GameText.topDrawerIsOpen],
            clue: "Look for things in the room",
        },
        {
            conditions: [Queries.isMiddleDrawerOpen],
            effects: [],
            effectText: [GameText.middleDrawerIsOpen],
            clue: "Look for things in the room",
        },
        { conditions: [Queries.isBoxOpen],
            effects:[Queries.createPebbles, Queries.putPebblesInBox],
            effectText: [GameText.BoxIsOpen],
            clue: "That's rockin'",
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
                this.lastEvent=event
            } else {
                notRunEvents.push(event)
            }
        }
        this.events=notRunEvents;
        return messages
    }

    public get clue(): string{
        return this.lastEvent.clue;
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
