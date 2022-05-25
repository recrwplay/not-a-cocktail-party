import {Neo4jAPI} from "./neo4j_api";
import {Queries} from "./queries";

export class GameSetup
{
    private api: Neo4jAPI

    constructor(api: Neo4jAPI) {
        this.api = api
    }

    public async setupLevel1() {
        await this.api.runCypher(Queries.resetSetup)
        await this.api.runCypher(Queries.createLightSwitch)
    }


    public async setupLevel2(){
        await this.api.runCypher(Queries.resetSetup)
        await this.api.runCypher(Queries.createLevel2)
    }
}
