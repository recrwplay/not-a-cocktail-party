import * as neo4j from "neo4j-driver"

export class Neo4jAPI {
    private driver: neo4j.Driver

    constructor(url: string ,username: string, password: string) {
        const auth = neo4j.auth.basic(username, password)
        this.driver = neo4j.driver(url, auth)
    }

    public async runCypher(query:string)
    {
        await this.driver.verifyConnectivity()

        const session = this.driver.session()
        const result = await session.run(query)

        await session.close()

        return result.records.map((record)=>{
            return Array.from(record.values())
        })
    }
}
