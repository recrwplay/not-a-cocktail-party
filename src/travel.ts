export const TravelQueries =
    {
        //Solution
        travelSolution : `MATCH p=(n:Hotel)-[*1..3]->(:Airport) 
                        WHERE reduce(totalTime = 0, r IN relationships(p) | totalTime + r.time) < 30
                        AND reduce(totalCost = 0, r IN relationships(p) | totalCost + r.cost) < 500
                        RETURN p`,

        validateSolution: `CALL { $subquery }
                    WITH p, head(nodes(p)) as start, head(reverse(nodes(p))) as end
                    RETURN reduce(totalTime = 0, r IN relationships(p) | totalTime + r.time) < 30 AND 
                           reduce(totalCost = 0, r IN relationships(p) | totalCost + r.cost) < 500 AND
                           start.name = "Overlook" AND 
                           end.name = "Copenhagen Airport" as result`
    }