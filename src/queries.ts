export const Queries =
{
    //Conditions
    isLightOn: `MATCH (l:LightSwitch) RETURN l.on AS result`,
    isBottomDrawerOpen: `MATCH (d: BottomDrawer) RETURN d.open AS result`,
    isTopDrawerOpen: `MATCH (d: TopDrawer) RETURN d.open AS result`,
    isMiddleDrawerOpen: `MATCH (d: MiddleDrawer) RETURN d.open AS result`,
    isBoxOpen: `MATCH (b: Box) RETURN b.open AS result`,
    //Misc
    resetSetup: `MATCH (n) DETACH DELETE n`,

    //Create objects
    createLightSwitch : `CREATE (lightSwitch:LightSwitch {on: false, description: "Looks like a common light switch. Also works like one."})`,
    createSafe: `CREATE (:Safe {locked: true, description:"A wooden chest with metal structures."})`,
    createCupboard:
        `CREATE (cupboard:Cupboard {description:"A wooden cupboard. It matches with the bed."})
        CREATE (:TopDrawer {open:false, description: "Top drawer"})-[:IN]->(cupboard)
        CREATE (:MiddleDrawer {open:false, description: "Middle drawer"})-[:IN]->(cupboard)
        CREATE (:BottomDrawer {open:false, description: "Bottom drawer"})-[:IN]->(cupboard)`,
    createBox:
        `MATCH (d:BottomDrawer)
        CREATE (:Box {open:false, description: "A random box"})-[:IN]->(d)`,
    createPebbles:
        `UNWIND range(1,1000) as iterator
        CREATE(:Pebble {description:"Another man's treasure"})`,
    putPebblesInBox:
        `MATCH (p:Pebble)
        MATCH (b:Box)
        CREATE (p)-[:IN]->(b)
        RETURN *`

        /*RETURN *
        MATCH (b:Box)
        MERGE (:KEY {description:"This man's treasure. Opens the safe"})-[:IN]->(b)`,
         */
    ,

    //Update objects
    updateLightSwitchDesc: `MATCH (l:LightSwitch) SET l.description = 'A light switch to turn the room light on or off. This much you have figured out...'`,

    // Level 2 setup
    createLevel2: `CREATE (n:Airport)`
}
