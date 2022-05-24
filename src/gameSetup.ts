import {Neo4jAPI} from "./neo4j_api";
import {Queries} from "./queries";

export class GameSetup
{
    private api: Neo4jAPI

    constructor(api: Neo4jAPI) {
        this.api = api
    }

    public async lightSetup() {
        await this.api.runCypher(Queries.resetSetup)
        await this.api.runCypher(Queries.createLightSwitch)
    }

    public async roomSetup(){
        if(await this.isLightOn())
        {
            await this.api.runCypher(Queries.createSafe)
            await this.api.runCypher(Queries.createCupboard)
        }
    }

    public async isLightOn(){
        const isLightOnQuery = await this.api.runCypher(Queries.isLightOn)
        return isLightOnQuery[0][0]
    }

    public async generate()
    {
        await this.roomSetup()
    }

}