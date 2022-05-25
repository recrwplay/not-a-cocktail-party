export const TravelQueries =
    {
        //Solution
        travelSolution : `MATCH p=(n:Hotel)-[*1..3]->(:Airport)
                        WHERE reduce(totalTime = 0, r IN relationships(p) | totalTime + r.time) < 30
                        AND reduce(totalCost = 0, r IN relationships(p) | totalCost + r.cost) < 500
                        RETURN p`,

    }
