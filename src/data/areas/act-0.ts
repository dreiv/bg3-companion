import type { Area } from "../types";
import { template } from "./factory";

export const act0Areas: Area[] = [
  template(
    "nautiloid",
    "Nautiloid",
    "act-0",
    "The illithid ship tutorial area. Becomes permanently inaccessible once you reach the beach.",
    {
      quest: "Escape the Nautiloid & Defeat Commander Zhalk",
      recommendedComp: ["Tav / Origin", "Lae'zel", "Shadowheart", "Us"],
      reason:
        "Recruiting Shadowheart and Us creates a full party, making the Commander Zhalk fight significantly easier.",
      confidence: "high",
    },
    [
      {
        name: "Lae'zel",
        reason: "Joins automatically on the main deck.",
      },
      {
        name: "Shadowheart",
        reason: "Trapped in a pod in the second room.",
      },
      {
        name: "Us",
        reason: "Extracted from Myrnath in the starting room; joins as a companion.",
      },
    ],
    [
      {
        id: "nautiloid-nursery-check",
        text: "Inspect the Unstable Nursery",
        category: "lore",
        timed: false,
        note: "Located at <b>(X:51 Y:-422)</b>. Triggers an Investigation check tutorial.",
      },
      {
        id: "nautiloid-first-loot",
        text: "Loot Cartilaginous Chests & use Restoration",
        category: "loot",
        timed: false,
        note: "Chests at <b>(X:47 Y:-436)</b> contain potions and misc items.",
      },
      {
        id: "nautiloid-save-us",
        text: "Extract and spare Us (Intellect Devourer)",
        category: "companion",
        timed: false,
        note: "Interact with Myrnath at <b>(X:0 Y:-430)</b>. Succeed the skill check and spare the brain to gain Us as a follower.",
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
        note: "Loot the <b>Eldritch Rune</b> from dead Thrall at <b>(X:61 Y:-353)</b> and insert it into the console at <b>(X:-3 Y:-347)</b>.",
      },
      {
        id: "nautiloid-elaborate-chest",
        text: "Unlock Elaborate Chest & collect Brain Jars",
        category: "loot",
        timed: false,
        note: "Loot Gold Key at <b>(X:28 Y:-354)</b>. Collect <b>Dark Mind</b> <b>(X:2 Y:-346)</b> and <b>Slave Mind</b> <b>(X:30 Y:-354)</b> for the Mind-Archive Interface in Act 2.",
      },
      {
        id: "nautiloid-defeat-zhalk",
        text: "Defeat Commander Zhalk & loot Everburn Blade",
        category: "loot",
        timed: true,
        note: "Must be killed/looted before the 15-turn Helm combat limit expires. Have Shadowheart cast <i>Command: Drop</i> to disarm him early.",
      },
      {
        id: "nautiloid-connect-transponder",
        text: "Connect the transponder nerves",
        category: "quest",
        timed: true,
        note: "Point of no return for Act 0. Interacting with the transponder finishes the prologue and crashes the ship.",
      },
    ],
  ),
];
