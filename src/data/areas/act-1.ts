import type { Area } from "../types";
import { template } from "./factory";

export const act1Areas: Area[] = [
  template(
    "ravaged-beach",
    "Ravaged Beach",
    "act-1",
    "Where you wash up after the Nautiloid crashes — the start of Act 1 proper.",
  ),
  template("overgrown-ruins", "Overgrown Ruins", "act-1", undefined),
  template("mountain-pass", "Mountain Pass", "act-1", undefined, undefined, undefined, [
    {
      id: "karlach-hunt-devil",
      text: "Karlach's 'Hunt the Devil' — kill Anders & the Paladins of Tyr",
      category: "companion",
      timed: true,
      note: "Entering Mountain Pass / Rosymorn Monastery Trail before resolving this — Karlach can leave the party permanently if unresolved.",
    },
    {
      id: "laezel-kithrak-voss",
      text: "Lae'zel — speak with Kith'rak Voss",
      category: "companion",
      timed: true,
      note: "Entering Mountain Pass before talking to Voss during the githyanki patrol encounter — companion-quest beat locks out for that patrol window.",
    },
  ]),
  template("sunlit-wetlands", "Sunlit Wetlands", "act-1", undefined),
  template("overgrown-tunnel", "Overgrown Tunnel", "act-1", undefined),
  template(
    "blighted-village",
    "Blighted Village",
    "act-1",
    "An abandoned village occupied by goblins, with a hidden cellar and a route down into the Underdark.",
  ),
  template("whispering-depths", "Whispering Depths", "act-1", undefined),
  template(
    "emerald-grove",
    "Emerald Grove",
    "act-1",
    "Druid grove sheltering tiefling refugees — an early hub for companions and quests.",
    {
      quest: "Tiefling vs. druid conflict",
      recommendedComp: [
        "Wyll or Shadowheart for faction dialogue",
        "a Persuasion/Deception-capable Tav",
      ],
      reason:
        "Multiple companions have personal reactions to the grove's outcome (Wyll cares about the tieflings, Shadowheart is neutral-suspicious)",
      confidence: "medium",
    },
    undefined,
    [
      {
        id: "grove-resolution",
        text: "Resolve the grove (save vs. let it fall)",
        category: "quest",
        timed: true,
        note: "Long-resting repeatedly, or attacking either side, pushes this toward a forced outcome. No neutral ending exists — the grove questline resolves one way or another; missing your intended outcome is permanent for that playthrough.",
      },
    ],
  ),
  template("inner-sanctum", "Inner Sanctum", "act-1", undefined),
  template("secluded-cove", "Secluded Cove", "act-1", undefined),
  template("the-hollow", "The Hollow", "act-1", undefined),
  template("forest", "Forest", "act-1", undefined),
  template("owlbear-nest", "Owlbear Nest", "act-1", undefined),
  template(
    "goblin-camp",
    "Goblin Camp",
    "act-1",
    "Cult of the Absolute stronghold occupying a ruined temple — can be approached peacefully or violently.",
    {
      quest: "Goblin camp approach (stealth or assault)",
      recommendedComp: [
        "A high-Stealth party if going covert",
        "Karlach/Lae'zel front line if going loud",
      ],
      reason:
        "Large multi-room fight if it goes loud; stealth builds can pick off leaders individually",
      confidence: "medium",
    },
    undefined,
    [
      {
        id: "rescue-halsin",
        text: "Rescue Halsin from the goblin camp cage",
        category: "quest",
        timed: true,
        note: "Progressing to Mountain Pass / Rosymorn Monastery Trail without freeing him means Halsin cannot join properly if you leave the region first.",
      },
    ],
  ),
  template("the-risen-road", "The Risen Road", "act-1", undefined),
  template("waukeens-rest", "Waukeen's Rest", "act-1", undefined, undefined, undefined, [
    {
      id: "rescue-fire-survivors",
      text: "Rescue the fire survivors (Grand Duke's man + trapped man)",
      category: "quest",
      timed: true,
      note: "Any long rest after arriving at the burning inn — both NPCs die if you rest even once before finishing the rescue.",
    },
  ]),
  template("zhentarim-basement", "Zhentarim Basement", "act-1", undefined),
  template("rosymorn-monastery-trail", "Rosymorn Monastery Trail", "act-1", undefined),
  template("rosymorn-monastery", "Rosymorn Monastery", "act-1", undefined),
  template("creche-yllek", "Crèche Y'llek", "act-1", undefined),
  template("arcane-tower", "Arcane Tower", "act-1", undefined),
  template("ebonlake-grotto", "Ebonlake Grotto", "act-1", undefined),
  template("decrepit-village", "Decrepit Village", "act-1", undefined),
  template("dread-hollow", "Dread Hollow", "act-1", undefined),
  template("festering-cove", "Festering Cove", "act-1", undefined),
  template("selunite-outpost", "Selûnite Outpost", "act-1", undefined),
  template(
    "grymforge",
    "Grymforge",
    "act-1",
    "Ancient dwarven forge deep in the Underdark, gateway to the Adamantine Forge.",
    {
      quest: "Adamantine Forge / Nere",
      recommendedComp: [
        "A caster who can handle a duergar ambush",
        "consider leaving squishy ranged units back from the initial choke point",
      ],
      reason: "Cramped Underdark spaces amplify AoE risk",
      confidence: "low",
    },
    undefined,
    [
      {
        id: "clear-rubble-nere",
        text: "Clear the rubble / resolve Nere",
        category: "quest",
        timed: true,
        note: "More than one long rest after approaching the cave-in — the trapped dwarves die and the Nere questline outcome locks in.",
      },
    ],
  ),
  template("abandoned-refuge", "Abandoned Refuge", "act-1", undefined),
  template("astral-plane-act1", "Astral Plane", "act-1", undefined),
];
