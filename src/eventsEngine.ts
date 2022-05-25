import { Neo4jAPI } from "./neo4j_api";
import { Queries } from "./queries";
import { GameText } from "./gameText";
import { ClueText } from "./clueText";

interface Event {
    conditions: string[];
    effects: string[];
    effectText: string;
    clueText: string;
    money?: number;
    repeatEffects?: boolean;
    isLastEvent?: boolean
}

const gameEvents: Event[] = [
    {
        conditions: [Queries.isLightOn],
        effects: [Queries.createSafe, Queries.createCupboard],
        effectText: GameText.lightIsOn,
        clueText: ClueText.openThings
    },
    {
        conditions: [Queries.isBottomDrawerOpen],
        effects: [Queries.createBox],
        effectText: GameText.bottomDrawerIsOpen,
        clueText: ClueText.openBox,
    },
    {
        conditions: [Queries.isTopDrawerOpen],
        effects: [],
        effectText: GameText.topDrawerIsOpen,
        clueText: ClueText.otherDrawer,
    },
    {
        conditions: [Queries.isMiddleDrawerOpen],
        effects: [],
        effectText: GameText.middleDrawerIsOpen,
        clueText: ClueText.otherDrawer,
    },
    {
        conditions: [Queries.isBoxOpen],
        effects: [Queries.createPebbles, Queries.putPebblesInBox],
        effectText: GameText.boxIsOpen,
        clueText: ClueText.pebbley,
        repeatEffects: false
    },
    {
        conditions: [Queries.isKeyStillInBox],
        effects: [Queries.removeKeyFromSafe],
        effectText: GameText.removeKeyFromBoxBeforePutInSafe,
        clueText: ClueText.keyIsStillInBox,
        repeatEffects: true
    },
    {
        conditions: [Queries.isKeyInSafe],
        effects: [],
        effectText: GameText.keyInSafe,
        clueText: ClueText.keyIsInSafe,
        money: 200,
        repeatEffects: false
    }
]


export class EventsEngine {
    private api: Neo4jAPI
    private events: Event[] = [];
    public collectedMoney: number = 0

    private lastEvent: {clueText: string, isLastEvent?: boolean} = {
        clueText: ClueText.initial
    }

    constructor(api: Neo4jAPI) {
        this.api = api
        this.reset();
    }

    public async checkConditions(): Promise<string[]> {
        const messages: string[] = [];

        const newEvents = await Promise.all(this.events.map(async (event) => {
            if (await this.runConditions(event.conditions)) {
                await this.runEffects(event.effects);
                if(event.money != null)
                {
                    this.collectedMoney+=event.money
                }
                if(event.repeatEffects != null && event.repeatEffects)
                {
                    return event
                }
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

    public get clueText(): string {
        return this.lastEvent.clueText;
    }

    public get level1Finished(): boolean {
        return Boolean(this.lastEvent.isLastEvent)

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
        this.lastEvent={
            clueText: ClueText.initial
        }

    }
}
