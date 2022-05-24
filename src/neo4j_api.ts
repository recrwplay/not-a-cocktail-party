import * as neo4j from "neo4j-driver"

export class Neo4jAPI {
    private driver: neo4j.Driver

    constructor(url: string ,username: string, password: string) {
        const auth = neo4j.auth.basic(username, password)
        this.driver = neo4j.driver(url, auth)
    }

    /*private url: string = "neo4j+s://bc90915d.databases.neo4j.io:7687";
    private username: string = "neo4j";
    private password: string = "qK6qOvIBbp6ZI1uXNtiK96l6zirs5VXGMcFJSrrSdrk";
     */

    public async runCypher(query:string)
    {
        await this.driver.verifyConnectivity()

        const session = this.driver.session()
        const result = await session.run(query)

        console.log(result.records)
        await session.close()
        return result.records
    }
}