
export class Level2Checker {

    public static getFullQuery(query: string): string {
        if(!query.includes("solution")){
            return query
        }
        return `
        CALL { ${query} }
        WITH solution, head(nodes(solution)) as start, head(reverse(nodes(solution))) as end
        RETURN reduce(totalTime = 0, r IN relationships(solution) | totalTime + r.time) < 30 AND
               reduce(totalCost = 0, r IN relationships(solution) | totalCost + r.cost) < 500 AND
               start.name = "Overlook" AND
               end.name = "Copenhagen Airport" as result
        `
    }
}
