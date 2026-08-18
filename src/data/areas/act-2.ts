import type { Area } from "../types";
import { template } from "./factory";

export const act2Areas: Area[] = [
  template("ruined-battlefield", "Ruined Battlefield", "act-2", undefined),
  template("house-in-deep-shadows", "House in Deep Shadows", "act-2", undefined),
  template(
    "last-light-inn",
    "Last Light Inn",
    "act-2",
    "A warded sanctuary in the Shadow-Cursed Lands, held by Harpers and Flaming Fist.",
    undefined,
    undefined,
    [
      {
        id: "isobel-nightsong-ritual",
        text: "Isobel / Nightsong ritual events",
        category: "quest",
        timed: true,
        note: "Long-resting at the wrong moments during the Last Light siege sequence — can fail defenders or push the Shadow-Cursed Lands questline down an unintended path.",
      },
    ],
  ),
  template("reithwin-town", "Reithwin Town", "act-2", undefined),
  template("house-of-healing", "House of Healing", "act-2", undefined),
  template("reithwin-graveyard", "Reithwin Graveyard", "act-2", undefined),
  template("sharran-sanctuary", "Sharran Sanctuary", "act-2", undefined),
  template("grand-mausoleum", "Grand Mausoleum", "act-2", undefined),
  template("gauntlet-of-shar", "Gauntlet of Shar", "act-2", undefined, {
    quest: "Trials of Shar",
    recommendedComp: [
      "Shadowheart strongly recommended",
      "a Persuasion/Insight-capable Tav for the trial dialogues",
    ],
    reason: "Shadowheart has unique reactions and stakes in this dungeon",
    confidence: "high",
  }),
  template(
    "moonrise-towers",
    "Moonrise Towers",
    "act-2",
    "Seat of the Absolute's cult and a major story hub for Act 2.",
    {
      quest: "Infiltrate / confront the cult",
      recommendedComp: [
        "Balanced comp with strong AC front line — several forced fights",
        "a Disguise Self / high-Deception member for the infiltration approach",
      ],
      reason: "Multiple forced encounters plus a social infiltration path",
      confidence: "low",
    },
  ),
  template("mind-flayer-colony", "Mind Flayer Colony", "act-2", undefined),
  template("oubliette", "Oubliette", "act-2", undefined),
  template("moonrise-towers-prison", "Moonrise Towers Prison", "act-2", undefined),
  template("moonrise-towers-rooftop", "Moonrise Towers Rooftop", "act-2", undefined),
  template("shadowfell", "Shadowfell", "act-2", undefined),
];
