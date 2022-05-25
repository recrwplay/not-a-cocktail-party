
export class Level2Checker {

    public static getFullQuery(query: string): string {
        return `
        CALL { ${query} }
        WITH solution, 
            head(nodes(solution)) as start, 
            head(reverse(nodes(solution))) as end,
            reduce(totalTime = 0, r IN relationships(solution) | totalTime + r.time) as totalTime,
            reduce(totalCost = 0, r IN relationships(solution) | totalCost + r.cost) as totalCost
        RETURN totalTime < 25 AND totalCost < 100 AND start.name = "Overlook" AND end.name = "Copenhagen Airport" as valid,
               totalCost,
               totalTime
        `
    }
}
