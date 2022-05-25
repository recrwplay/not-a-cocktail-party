import { Neo4jAPI } from "./neo4j_api";
import { Queries } from "./queries";
import { GameText } from "./gameText";

interface Event {
    conditions: string[];
    effects: string[];
    effectText: string;
    clue: string;
}

const gameEvents: Event[] = [
    {
        conditions: [Queries.isLightOn],
        effects: [Queries.createSafe, Queries.createCupboard],
        effectText: GameText.lightIsOn,
        clue: "Look for things in the room",
    },
    {
        conditions: [Queries.isBottomDrawerOpen],
        effects: [Queries.createBox],
        effectText: GameText.bottomDrawerIsOpen,
        clue: "Look for things in the room",
    },
    {
        conditions: [Queries.isTopDrawerOpen],
        effects: [],
        effectText: GameText.topDrawerIsOpen,
        clue: "Look for things in the room",
    },
    {
        conditions: [Queries.isMiddleDrawerOpen],
        effects: [],
        effectText: GameText.middleDrawerIsOpen,
        clue: "Look for things in the room",
    },
    {
        conditions: [Queries.isBoxOpen],
        effects: [Queries.createPebbles, Queries.putPebblesInBox],
        effectText: GameText.boxIsOpen,
        clue: "That's rockin'",
    }
]


export class EventsEngine {
    private api: Neo4jAPI
    private events: Event[];

    private lastEvent = {
        clue: "Look the only thing there is, dummy"
    }

    constructor(api: Neo4jAPI) {
        this.api = api
        this.events = [...gameEvents];
    }

    public async checkConditions(): Promise<string[]> {
        const messages: string[] = [];

        const newEvents=await Promise.all(this.events.map(async (event) => {
            if (await this.runConditions(event.conditions)) {
                await this.runEffects(event.effects);
                messages.push(event.effectText);
                this.lastEvent = event

                return null
            } else {
                return event
            }
        }))

        this.events = newEvents.filter(Boolean) as Event[];
        return messages
    }

    public get clue(): string {
        return this.lastEvent.clue;
    }


    public async runConditions(conditions: Array<string>): Promise<boolean> {
        const results = await Promise.all(conditions.map(async (query) => {
            const result = await this.api.runCypher(query);
            if (result.length === 0) return false;
            return result[0][0] as boolean
        }))
        return results.every((c) => {
            return c === true
        })
    }

    public async runEffects(effects: Array<string>): Promise<void> {
        await Promise.all(effects.map(async (query) => {
            await this.api.runCypher(query)
        }))

    }

    public reset() {
        this.events = [...gameEvents];
    }
}
