# Phase 4: Narrative & Campaign Reconstruction (Verified from Web Port RE)

Based on complete decompilation of `https://prehistoric-tribes.vercel.app/` (`res/text/en.json` — 235 dialogue strings, `res/data/game-data.json` — 292 tables, and engine scripts), this document accurately reconstructs the entire lore, character cast, 12-level structure (7 Campaign levels across 5 Chapters + Tutorial, plus 5 Custom Skirmish maps), and all scripted cutscenes.

---

## 1. Lore & Narrative Setting

*Prehistoric Tribes* is set in a comedic Stone Age just after a millennia-long Ice Age suddenly thaws. The **Avnotaklu Tribe** emerges from a dismal, freezing cave led by their narcissistic, lazy, and cowardly **Chief**, accompanied by his stuttering well-meaning advisor **Mumbo**, a cactus-eating **Shaman**, and eventually operative specialists of the **PIA (Prehistoric Intelligence Agency)**.

---

## 2. Main Character Profiles

- **The Chief**: Obsessed with his own stomach and comfort; mistook cannibal raiders for zombies ("one of them bit me!"). Provides a **1.5× combat damage and skill productivity aura** within a 4-tile radius. Cannot enter normal worker buildings (refusal: *"i would but the chief will hit me!"*). If he dies, adult tribe happiness drops by 25 and the player must appoint a new Chief (`select a chief`).
- **Mumbo**: First to discover the Ice Age has ended (`INTRO_STORY`); guides the player through all 23 tutorial objectives and 31 intro/tutorial cutscenes.
- **The Shaman**: Communes with the gods at the **Sanctuary**; casts `Healing`, `Defence` (-50% incoming damage), `Niagra Love Potion`, and `Disease` (area plague). Foresees the barbarian desert ambush in *Wastelands* after eating hallucination cacti.
- **PIA Scout / Agent**: Trained at the **PIA Center**; hides automatically (`HIDDEN`) when `scoutingSkill > 3` and stationary/idle, spots enemy traps when `scoutingSkill >= 6`, detects enemy disease zones, and leads reconnaissance in *Escape*.
- **Jafar & Cannibal Chief**: Primary antagonists. Cannibals attack the tribe in *Outside* and abduct women & children in *Revenge*. Later, **Jafar** poses as a friendly wanderer promising a land of eternal sunshine and naked moonlight dancing, luring the Avnotaklu into a desert trap to enslave them in *Wastelands*.

---

## 3. Campaign & Custom Maps Progression (All 12 Levels)

Unlike the earlier assumption that all 10 map names were sequential campaign levels, the game's `levelSizes` and `chapterOfLevel` tables define **12 playable levels**:

| Level ID | Scenario Name | Mode | Map File | Size (Crop) | Synopsis & Scripted Events |
|---:|---|---|---|---|---|
| **0** | **Tutorial (Outside)** | Campaign | `map-0.bin` | `40×32` (of `64×48`) | Ice Age thaws; 23 tutorial objectives teach building, gathering, cooking, groups (`7`/`9`), `Call to Arms!`, Armoury/Gym/Range. Transitions seamlessly via `WARRIOR_PARADE` into Level 1. |
| **1** | **Outside** | Campaign | `map-0.bin` | `64×48` | Envoy attempts peace (`"grrrr! woof! woof!"`); player expands, hunts/fishes, and drives out the Cannibal camp. |
| **2** | **Revenge** | Campaign (Ch. 1) | `map-1.bin` | `64×80` | Tribe moves into former Cannibal village. Unlocks `Tower`, `PIA Center`, `Sanctuary`, and Lv2 upgrades. After razing enemy camp (`< 5` buildings), Cannibals spring `CAPTIVES_TAKEN`, kidnapping all women & children (`REVENGE_AFTERMATH`). |
| **3** | **Escape** | Campaign (Ch. 2) | `map-2.bin` | `64×64` | Special **no-building Stealth/Rescue mission** with male warriors + PIA Scout (no Chief). Sneak past Sabertooth Tigers, recon enemy camp, lure tigers into the Cannibal feast (`CANNIBAL_FEAST`), smash locked prison hut (`CAPTIVES_SAVED`), return to flattened village & meet **Jafar** (`HOMECOMING`). |
| **4** | **Wastelands** | Campaign (Ch. 3) | `map-3.bin` | `64×96` | Trek to desert oasis; earthquake seals retreat (`RESTING_PLACE`); optional cave discovery `(8,67)` (`CAVE_FOUND`); **Jafar** springs ambush demanding Chief's death; Shaman unlocks Lv2 `Disease` & `Love Potion`; fight through Barbarian fortress. |
| **5** | **A New Home** | Campaign (Ch. 4) | `map-4.bin` | `64×96` (of `96×96`) | Tribe settles a fertile valley and repels the forward Barbarian assault. Unlocks full map width for Finale (`Lv 6`). |
| **6** | **A New Home (Finale)** | Campaign (Ch. 4) | `map-4.bin` | `96×96` | Eastern Barbarian citadel (3 Gyms, 3 Ranges, 2 Lv3 Armouries, 5 Lv2 Towers) attacks in force. Destroying the camp triggers `ENDING` (`"fighting for peace — shut up and start killing!"`). |
| **7** | **Great Lake** | Custom Game | `map-5.bin` | `96×64` | Skirmish around a central lake rich in fish shoals; Barbarian stronghold on west shore. |
| **8** | **Desert Pass** | Custom Game | `map-6.bin` | `80×80` | Arid choke-point warfare against fortified Barbarian northwest pass. |
| **9** | **Forest Belt** | Custom Game | `map-7.bin` | `96×48` | Long dense woodland corridor demanding lumber economy and ambush defense. |
| **10** | **Slaughter** | Custom Game | `map-8.bin` | `48×96` | Vertical gauntlets with heavy predator presence and close-quarters towers. |
| **11** | **Plot of Land** | Custom Game | `map-9.bin` | `64×64` | Balanced symmetrical showdown map with full tech progression. |

*For line-by-line cutscene scripts and dialogue indices (`0..234`), see [FULL_REVERSE_ENGINEERING_SPEC.md](file:///Users/huynguyen/Documents/revert_engeneering_game/2_documentation/FULL_REVERSE_ENGINEERING_SPEC.md).*
