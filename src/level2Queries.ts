export const Level2Queries =
    {
        //Solution
        initialSetup: `CREATE (hotel:Hotel {name:"Overlook"}),
       (malmöC:TrainStation {name:"Malmö C"}),
       (triangeln:TrainStation {name:"Malmö Triangeln"}),
       (hyllie:TrainStation {name:"Malmö Hyllie"}),
       (malmöAirport:Airport {name: "Malmö Airport"}),
       (copenhagenAirport:Airport {name:"Copenhagen Airport"}),
       (hotel)-[:WALK {cost:0, currency:"SEK", time:3}]->(malmöC),
       (hotel)-[:WALK {cost:0, currency:"SEK", time:10}]->(triangeln),
       (hotel)-[:WALK {cost:0, currency:"SEK", time:25}]->(hyllie),
       (hotel)-[:WALK {cost:0, currency:"SEK", time:360}]->(malmöAirport),
       (malmöC)-[:TRAIN {cost:123, currency:"SEK", time:21}]->(copenhagenAirport),
       (triangeln)-[:TRAIN {cost:98, currency:"SEK", time:12}]->(copenhagenAirport),
       (hyllie)-[:TRAIN {cost:89, currency:"SEK", time:8}]->(copenhagenAirport),
       (malmöC)-[:TRAIN {cost:123, currency:"SEK", time:21}]->(malmöAirport),
       (triangeln)-[:TRAIN {cost:98, currency:"SEK", time:12}]->(copenhagenAirport),
       (hyllie)-[:TRAIN {cost:89, currency:"SEK", time:8}]->(copenhagenAirport),
       (hotel)-[:TAXI {cost:500, currency:"SEK",time:15}]->(copenhagenAirport),
       (malmöC)-[:TAXI {cost:510, currency:"SEK", time:16}]->(copenhagenAirport),
       (triangeln)-[:TAXI {cost:400, currency:"SEK", time:10}]->(copenhagenAirport),
       (hotel)-[:TAXI {cost:0, currency:"SEK", time:360}]->(malmöAirport),
       (hyllie)-[:TAXI {cost:380, currency:"SEK", time:7}]->(copenhagenAirport)`,

        travelSolution : `MATCH solution=(n:Hotel)-[*1..3]->(:Airport {name:"Copenhagen Airport"})
                        WHERE reduce(totalTime = 0, r IN relationships(solution) | totalTime + r.time) < 25
                        AND reduce(totalCost = 0, r IN relationships(solution) | totalCost + r.cost) < 100
                        RETURN solution`,

    }
