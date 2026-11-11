# Phase 5: Gameplay Systems & Mechanics Reconstruction (Verified from Web Port RE)

All numbers, costs, combat formulas, entity states, and AI behaviors below are directly verified from `index.js`, `game-data.json` (292 tables), and `en.json` of `https://prehistoric-tribes.vercel.app/`.

---

## 1. Resource Economy & Kitchen Meal Loop

- **4 Stored Resources (Capped at 999 for Player):** `Food`, `Wood`, `Stones`, `Bones`.
- **Raw `Food` vs. Cooked `Meals`:** Workers gather raw `Berries`, `Plants`, `Fish`, and `Meat` (stored as `Food`). A **Cook** inside a **Kitchen** continuously fetches `Food` from the **Store** (`FETCH_KITCHEN_FOOD`, up to 9 per trip) and cooks **`Meals`** (max buffer 40). Hungry villagers eat `Meals` at Kitchen tables rather than eating raw storage stock.
- **Carcasses & Bones:** Hunting animals leaves a `CARCASS` object (`25 Meat` on Boar, `15 Meat` on Tiger). As meat is harvested or decays (every 128 ticks), the carcass turns into a **`BONES` node (15 units)** needed for `Bone Mace`, `Tomahawk`, and `Sanctuary`.

---

## 2. 12 Buildings, Exact Costs, Capacities & Training Lessons

| ID | Building | Grid Size | Build Cost (`W / S / B`) | Upgrade Cost | Max HP (`Lv1 / Lv2 / Lv3`) | Capacity (`Lv1 / Lv2`) | Happiness Bonus (`Lv1/Lv2`) | Primary Role & Lesson Limits |
|---:|---|---:|---:|---:|---:|---:|---:|---|
| 0 | **Armoury** | `3×2` | 20W, 10S | 10W, 5S | 40 / 55 / 70 | 1 / 1 (Armourer) | -1 / 0 *(Lv3: +1)* | Crafts weapons & traps; `craftingSkill` up to `5/7/10` |
| 1 | **Gym** | `5×4` | 40W, 30S | 15W, 15S | 70 / 100 | 2 / 4 | 0 / 0 | Melee combat training; `meleeSkill` to `5/7`, `maxHp` to `75/99`, Lv2 `stepDelay` to `5` |
| 2 | **Hut** | `2×2` | 15W, 5S | 5W, 10S | 25 / 40 | 4 / 4 beds | 0 / +2 | Houses 4 villagers, restores energy, hosts couple breeding |
| 3 | **Chief's Hut** | `4×4` | 30W, 20S | — | 120 | 2 | 0 | Chief residence & Elder council cutscene hub |
| 4 | **Kitchen** | `4×3` | 30W, 20S | 10W, 20S | 60 / 80 | 5 / 7 | 0 / +2 | Cook prepares `Meals`; `cookingSkill` up to `6/10` |
| 5 | **Range** | `6×4` | 40W, 30S | 15W, 15S | 70 / 100 | 2 / 4 | 0 / 0 | Ranged practice; `throwingSkill` to `5/7`, `viewRadius` to `5/7`, `maxHp` to `75/99` |
| 6 | **Store** | `3×3` | 25W, 20S | — | 50 | Depot | 0 | Central deposit for resources & weapon armory issue |
| 7 | **Disco** | `5×4` | 30W, 25S | 10W, 25S | 90 / 110 | 5 / 7 | +2 / +3 | DJ boosts occupants' `happiness` & `energy`; `djSkill` to `6/10` |
| 8 | **Sanctuary** | `3×3` | 20S, 10B | 10W, 10B | 50 / 60 | 2 / 2 | 0 / +1 | Shaman heals inside or casts `Healing`/`Defence` (Lv1) and `Love Potion`/`Disease` (Lv2) |
| 9 | **PIA Center** | `4×4` | 30W, 15S | 10W, 15S | 60 / 80 | 2 / 3 | 0 / 0 | Stealth scout training; `scoutingSkill` to `5/10`, `viewRadius` to `7/9`, `maxHp` to `75/99` |
| 10 | **Nursery** | `4×4` | 20W, 10S | 10W, 5S | 40 / 50 | 5 | 0 / 0 | Shelters children (`age < 11`) safely from tigers & kidnappers |
| 11 | **Tower** | `1×1` | 10W, 10S | 10W, 10S | 50 / 70 | 2 / 2 guards | 0 / +1 | Elevated ranged sentry (+2 throw range, +3 view radius) |

*Note: All buildings unlock upgrades gradually via scripted level unlocks across Outside, Revenge, and Wastelands.*

---

## 3. Weapons, Traps, Combat & Spells

- **Arsenal Recipes & Stats:**
  - `Club` (Lv1): 5W | Melee **+1 dmg**
  - `Stone` (Store): 5 Stones ammo | Thrown **+1 dmg**, spd `25`
  - `Spear` (Lv1): 5W, 2S | Thrown **+2 dmg**, spd `30` (required to `FISH`)
  - `Stone Axe` (Lv2): 4W, 4S | Melee **+3 dmg**
  - `Bone Mace` (Lv2): 5W, 3B | Melee **+5 dmg**
  - `Tomahawk` (Lv3): 4W, 4B | Thrown **+3 dmg**, spd `40`
  - `Net Trap` (Lv1): 10W | **10 dmg** | `Spring Trap` (Lv2): 10W, 5S | **20 dmg** | `Pit Trap` (Lv3): 5W, 10S | **30 dmg**
- **Damage Formula:** Melee = `meleeDamageBySkill[0..9] ([1,1,1,2,2,3,3,4,6,8]) + weaponDamage`; Ranged uses projectile arc physics with moving-target lead prediction. Player units within ±4 tiles of Chief gain **1.5× damage & skill output**; `PROTECTED` units take **50% damage**.

---

## 4. Population Lifecycle, Spells, AI & Scoring

- **Needs & Strikes:** Villagers strike (`happiness < 10`) unless mobilized by `Call to Arms!` or `Form Up!`. Births happen when a couple (`happiness >= 75`) courts, kisses at a `LOVE_NEST` / hut entrance, and enters a free `Hut` (`age = 2` newborn $\rightarrow$ adult at `age = 12`).
- **Enemy AI:** Repairs damaged base buildings, upgrades via level `campPlan`, patrols camp perimeter (`campIntruder`), upgrades scouts & warriors in training structures, manufactures traps/disease spells, and dispatches scaled raid waves along level waypoints.
- **Score Formula:** `(Born * 15 + Built * 25 + Razed * 60 + Killed * 40 + Gathered * 1) / 10`.
