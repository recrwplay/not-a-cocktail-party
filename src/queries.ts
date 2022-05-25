export const Queries =
{
    //Conditions
    isLightOn: `MATCH (l:LightSwitch) RETURN l.on AS result`,
    isBottomDrawerOpen: `MATCH (d: BottomDrawer) RETURN d.open AS result`,
    isTopDrawerOpen: `MATCH (d: TopDrawer) RETURN d.open AS result`,
    isMiddleDrawerOpen: `MATCH (d: MiddleDrawer) RETURN d.open AS result`,
    isBoxOpen: `MATCH (b: Box) RETURN b.open AS result`,
    isKeyInSafe:
        `MATCH (key:Key)
        MATCH (safe:Safe)
        MATCH (box:Box)
        WHERE (key)-[:IN]->(safe) AND NOT (key)-[:IN]->(box) RETURN count(*) =1`,
    isKeyStillInBox:
        `
        MATCH (key:Key)-[:IN]->(:Box)
        MATCH (key)-[:IN]->(:Safe)
        RETURN COUNT (*) = 1`,
    keyOutBox:
        `MATCH (key:Key)
         MATCH (b:Box)
         WHERE NOT (key)-[:IN]->(b)
         RETURN count(key)>0`,

    //Misc
    resetSetup: `MATCH (n) DETACH DELETE n`,

    //Create objects
    createLightSwitch : `CREATE (lightSwitch:LightSwitch {on: false, description: "Looks like a common light switch. Also works like one."})`,
    createSafe: `CREATE (:Safe {description:"A safe where you keep your valuables."})`,
    createCupboard:
        `CREATE (cupboard:Cupboard {description:"A wooden cupboard. It matches the bed."})
        CREATE (:TopDrawer {open:false, description: "Top drawer"})-[:IN]->(cupboard)
        CREATE (:MiddleDrawer {open:false, description: "Middle drawer"})-[:IN]->(cupboard)
        CREATE (:BottomDrawer {open:false, description: "Bottom drawer"})-[:IN]->(cupboard)`,
    createBox:
        `MATCH (d:BottomDrawer)
        CREATE (:Box {open:false, description: "Just a box. Nothing special about it at first glance."})-[:IN]->(d)`,
    putPebblesInBox:
        `
        MATCH (b:Box)
        UNWIND range(1,1000) as iterator
        CREATE (p:Pebble {description:"Another man's treasure"})-[:IN]->(b)
        RETURN *`,
    putKeyInBox:
    `
    MATCH (b:Box) CREATE (:Key {description:"A key that looks like it would open a safe"})-[:IN]->(b)
    `,

    //Update objects
    updateLightSwitchDesc: `MATCH (l:LightSwitch) SET l.description = 'A functioning light switch that turns the room light on or off. This much you have figured out...'`,
    removeKeyFromSafe: `MATCH (k:Key)-[r:IN]->(:Safe) DELETE r`,
}
