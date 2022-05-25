import {Neo4jAPI} from "./neo4j_api";
import {Queries} from "./queries";
import {GameText} from "./gameText";

interface Event {
    conditions: string[];
    effects: string[];
    effectText: string;
    clue: string;
    money: number;
    repeatEffects: boolean;
}

const gameEvents: Event[] = [
    {
        conditions: [Queries.isLightOn],
        effects: [Queries.createSafe, Queries.createCupboard],
        effectText: GameText.lightIsOn,
        clue: "Look for things in the room",
        money: 0,
        repeatEffects: false
    },
    {
        conditions: [Queries.isBottomDrawerOpen],
        effects: [Queries.createBox],
        effectText: GameText.bottomDrawerIsOpen,
        clue: "Look for things in the room",
        money: 0,
        repeatEffects: false
    },
    {
        conditions: [Queries.isTopDrawerOpen],
        effects: [],
        effectText: GameText.topDrawerIsOpen,
        clue: "Look for things in the room",
        money: 0,
        repeatEffects: false
    },
    {
        conditions: [Queries.isMiddleDrawerOpen],
        effects: [],
        effectText: GameText.middleDrawerIsOpen,
        clue: "Look for things in the room",
        money: 100,
        repeatEffects: false
    },
    {
        conditions: [Queries.isBoxOpen],
        effects: [Queries.putKeyInBox, Queries.createPebbles, Queries.putPebblesInBox ],
        effectText: GameText.boxIsOpen,
        clue: "That's rockin'",
        money: 0,
        repeatEffects: false
    },
    {
        conditions: [Queries.isKeyStillInBox],
        effects: [Queries.removeKeyFromSafe],
        effectText: GameText.removeKeyFromBoxBeforePutInSafe,
        clue: "You have to remove the key from the box in order to put it in the safe",
        money: 0,
        repeatEffects: true
    },
    {
        conditions: [Queries.isKeyInSafe],
        effects: [],
        effectText: GameText.keyInSafe,
        clue: "",
        money: 200,
        repeatEffects: false
    }
]


export class EventsEngine {
    private api: Neo4jAPI
    private events: Event[];
    public collectedMoney = 0

    private lastEvent = {
        clue: "Look the only thing there is, dummy"
    }

    constructor(api: Neo4jAPI) {
        this.api = api
        this.events = [...gameEvents];
    }

    public async checkConditions(): Promise<string[]> {
        const notRunEvents = []
        const messages = [];

        for (const event of this.events) {
            if (await this.runConditions(event.conditions)) {
                await this.runEffects(event.effects);
                this.collectedMoney+=event.money
                messages.push(event.effectText);
                this.lastEvent = event
                if(event.repeatEffects)
                {
                    notRunEvents.push(event)
                }
            } else {
                notRunEvents.push(event)
            }
        }
        this.events = notRunEvents;
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
