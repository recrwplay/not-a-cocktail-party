export const ClueText =
{

    // initial game state

    initial: "There's not much to see. If only there was more <b>light</b> in here...",

    // look around
    look: "Look around you. Just look around you. Not that there's much to see in this darkness...",

    // open things
    openThings: "You vaguely remember that rooms often contain furniture, including items that you can put things inside. But how to see what's in here...?",

    // look elsewhere
    otherDrawer: "Maybe there's something in one of the other drawers?",

    // too many pebbles
    pebbley: `If there's anything else in here, you can't see it for all these pesky, pebbley pebbles.
    [Try to filter and take things out by removing the IN relationship to the box.]`,


    keyIsStillInBox: "You cannot open the safe while the key is still in the box.",
    keyIsInSafe: `The key fits :) You quickly retrieve your passport and 200SEK. You take a moment to compose yourself before heading to the airport.
    [For matching paths, use: MATCH p=(a)-[b]-(c)]. Also the functions reduce and relationships might be useful.`,

    openBox: "Maybe the box contains something interesting or useful...",
    keyOutBox: `You have a key, and you have a safe. Key. Safe.
    [Create an IN relationship from the key to the safe.]`
}
