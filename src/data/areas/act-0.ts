import type { Area } from "../types";
import { template, wiki, wikiItem, wikiSpell } from "./factory";

export const act0Areas: Area[] = [
  template(
    "nautiloid",
    "Nautiloid",
    "act-0",
    `The crashing ${wiki("Nautiloid", "Nautiloid_Wreck")} — a tutorial dungeon aboard the illithid ship carrying you to Baldur's Gate. Everything here becomes permanently inaccessible the moment you reach the Ravaged Beach in Act 1, so this is a one-shot chance at its loot and companions.`,
    {
      quest: `Escape the ${wiki("Nautiloid", "Nautiloid_Wreck")} & Defeat ${wiki("Commander Zhalk")}`,
      recommendedComp: ["Tav / Origin", "Lae'zel", "Shadowheart", "Us"],
      reason:
        `Recruiting ${wiki("Shadowheart")} and ${wiki("Us")} creates a full party, making the ${wiki("Commander Zhalk")} fight significantly easier.`,
      confidence: "high",
    },
    [
      {
        name: "Lae'zel",
        reason: `Joins automatically on the main deck after you free her from an illithid pod. She's openly hostile to the parasite talk and to Shadowheart — expect blunt, combative dialogue from the start; this is also your only chance to recruit her before the ship crashes.`,
      },
      {
        name: "Shadowheart",
        reason: `Trapped in a pod in the second room; freeing her interrupts a Mind Flayer about to extract her tadpole. She's guarded and won't reveal she's a Sharran cleric yet — approval is easiest here if you avoid pressing her on the sealed box she's protecting.`,
      },
      {
        name: "Us",
        reason: `Extracted from ${wiki("Myrnath")} in the starting room; joins as a companion if you pass the check and choose to spare it rather than crush it. Reappears later in the Act 2 ${wiki("Mind Flayer Colony")} if spared here — worth remembering that far ahead, since it's the only way to unlock the "Summon Us" item.`,
      },
    ],
    [
      {
        id: "nautiloid-nursery-check",
        text: "Inspect the Unstable Nursery",
        category: "lore",
        timed: false,
        note: "Located at <b>(X:51 Y:-422)</b>. Triggers an Investigation check tutorial and is easy to walk straight past on a first playthrough.",
      },
      {
        id: "nautiloid-first-loot",
        text: `Loot ${wikiItem("Cartilaginous Chest", "Cartilaginous_Chest")}s & use ${wikiSpell("Restoration")}`,
        category: "loot",
        timed: false,
        note: "Chests at <b>(X:47 Y:-436)</b> contain potions and misc items.",
      },
      {
        id: "nautiloid-save-us",
        text: `Extract and spare ${wiki("Us")} (Intellect Devourer)`,
        category: "companion",
        timed: false,
        note: `Interact with ${wiki("Myrnath")} at <b>(X:0 Y:-430)</b>. Succeed the skill check and spare the brain to gain Us as a follower.`,
      },
      {
        id: "nautiloid-recruit-laezel",
        text: "Recruit Lae'zel",
        category: "companion",
        timed: false,
        note: "Encountered at <b>(X:-39 Y:-430)</b> after leaving the starting room.",
      },
      {
        id: "nautiloid-console-buttons",
        text: "Inspect slate control panel",
        category: "lore",
        timed: false,
        note: "Panel at <b>(X:-11 Y:-354)</b>. DC 15 Arcana check reveals button functions (left: visual effect, middle: aggro thralls, right: kill thralls).",
      },
      {
        id: "nautiloid-rescue-shadowheart",
        text: "Rescue Shadowheart from the pod",
        category: "companion",
        timed: false,
        note: `Loot the ${wikiItem("Eldritch Rune")} from dead Thrall at <b>(X:61 Y:-353)</b> and insert it into the console at <b>(X:-3 Y:-347)</b>.`,
      },
      {
        id: "nautiloid-elaborate-chest",
        text: "Unlock Elaborate Chest & collect Brain Jars",
        category: "loot",
        timed: false,
        note: `Loot Gold Key at <b>(X:28 Y:-354)</b>. Collect ${wikiItem("Dark Mind")} <b>(X:2 Y:-346)</b> and ${wikiItem("Slave Mind")} <b>(X:30 Y:-354)</b> for the Mind-Archive Interface in Act 2. Easy to miss since the chest is tucked in a side room most players rush past on the way to the console.`,
      },
      {
        id: "nautiloid-emperor-voice",
        text: `Secret: notice the "helpful voice"`,
        category: "lore",
        timed: false,
        note: `The disembodied voice guiding you through the ship is your first (unlabeled) contact with ${wiki("The Emperor", "Emperor")}, a Mind Flayer who has been secretly using you. Nothing to do here but worth remembering — every "helpful" nudge on this ship is him.`,
      },
      {
        id: "nautiloid-defeat-zhalk",
        text: `Defeat ${wiki("Commander Zhalk")} & loot ${wikiItem("Everburn Blade")}`,
        category: "loot",
        timed: true,
        note: `Must be killed/looted before the 15-turn Helm combat limit expires. Have Shadowheart cast ${wikiSpell("Command", "Command_(spell)")}: Drop to disarm him early. The <b>Everburn Blade</b> is entirely missable if you flee to the transponder instead of finishing the fight — it does not appear again anywhere else in the game.`,
      },
      {
        id: "nautiloid-connect-transponder",
        text: "Connect the transponder nerves",
        category: "quest",
        timed: true,
        note: "Point of no return for Act 0. Interacting with the transponder finishes the prologue and crashes the ship — any unlooted chests or unspoken NPCs here (including Zhalk's loot, if you haven't grabbed it) are lost for good. This is the single hardest reset point in the game: nothing from the Nautiloid can ever be revisited.",
      },
    ],
  ),
];
