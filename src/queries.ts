export const Queries =
{
    //Conditions
    isLightOn: `MATCH (l:LightSwitch) RETURN l.on AS result`,

    //Misc
    resetSetup: `MATCH (n) DETACH DELETE n`,

    //Create objects
    createLightSwitch : `CREATE (lightSwitch:LightSwitch {on: false, description: "Looks like a common light switch. Also works like one."})`,
    createSafe: `CREATE (:Safe {locked: true, description:"A wooden chest with metal structures."})`,
    createCupboard: `CREATE (cupboard:Cupboard {description:"A wooden cupboard. It matches with the bed."})`
}