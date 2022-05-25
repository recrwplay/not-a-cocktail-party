import * as neo4j from "neo4j-driver"

export class Neo4jAPI {
    private driver: neo4j.Driver

    constructor(url: string, username: string, password: string) {
        const auth = neo4j.auth.basic(username, password)
        this.driver = neo4j.driver(url, auth)
    }

    public async runCypher(query: string) {
        const session = this.driver.session()
        const result = await session.run(query)

        await session.close()

        return result.records.map((record) => {
            return Array.from(record.values())
        })
    }

    public async runReadOnlyCypher(query:string){
        if(!this.isReadOnly(query)) throw new Error("You are not powerful enough to do this");
        return this.runCypher(query)
    }

    private isReadOnly(query: string){
        const invalidRegex=/CREATE|MERGE|SET|DELETE|REMOVE|apoc/ig;
        return query.match(invalidRegex)===null;
    }
}
