# Prehistoric Tribes – Complete Reverse Engineering Knowledge Base & Master Index

**Game Title:** Prehistoric Tribes  
**Publisher:** THQ Wireless Inc.  
**Developer:** Gear Games Ltd.  
**Original Platform:** J2ME (MIDP-2.0 / CLDC-1.0)  
**Target Screen Resolution:** 240 x 320 pixels  
**Source Artifact:** `Prehistoric_Tribes_240x320-84398-mobiles24.jar` (498,387 bytes)  
**Decompiler Tooling:** CFR 0.152 with `--renamedupmembers true`, Python 3 custom binary decoders  

---

## 1. Executive Summary

This research repository contains a complete, evidence-backed reverse engineering analysis of *Prehistoric Tribes* (2007–2008), reconstructing the original game's internal data formats, software architecture, narrative script, economic simulation, and gameplay mechanics for the purpose of engineering an authentic modern Web-based 2D remake.

All original assets—including full-resolution sprite atlases, UI sheets, character animation frames, 5 General MIDI soundtrack themes, 10 campaign level tilemaps, and 5-language localization databases—have been extracted, cataloged, and verified without modifying or compromising the original JAR binary.

---

## 2. Research Documentation Directory

| Phase | Research Document | Focus & Content |
|---|---|---|
| **Phase 1** | [01_initial_inspection/JAR_INSPECTION.md](file:///Users/huynguyen/Documents/revert_engeneering_game/01_initial_inspection/JAR_INSPECTION.md) | Archive manifest, entry points, class inventory, obfuscator details, packaging formats. |
| **Phase 2** | [02_assets/ASSET_CATALOG.md](file:///Users/huynguyen/Documents/revert_engeneering_game/02_assets/ASSET_CATALOG.md) | Visual asset inventory, 2-byte PNG prefix specs, 5 extracted MIDI tracks, 10 map binary blocks, binary layout specs. |
| **Phase 3** | [03_code_analysis/ARCHITECTURAL_ANALYSIS.md](file:///Users/huynguyen/Documents/revert_engeneering_game/03_code_analysis/ARCHITECTURAL_ANALYSIS.md) | Deobfuscated class relationships, 20 FPS game loop, SoA 101-entity simulation, 2:1 isometric diamond rendering math. |
| **Phase 4** | [04_narrative/STORY_AND_CAMPAIGN.md](file:///Users/huynguyen/Documents/revert_engeneering_game/04_narrative/STORY_AND_CAMPAIGN.md) | Avnotaklu tribal lore, character profiles (Chief, Mumbo, Shaman, PIA Agent), comedic tropes, 10-level campaign guide. |
| **Phase 5** | [05_gameplay/GAMEPLAY_SYSTEMS.md](file:///Users/huynguyen/Documents/revert_engeneering_game/05_gameplay/GAMEPLAY_SYSTEMS.md) | 4-resource economic flow, 12 buildings & upgrade paths, autonomous villager needs loop, reproduction, weapons, combat. |
| **Phase 6** | [06_runtime_validation/WEB_PORTING_SPECIFICATION.md](file:///Users/huynguyen/Documents/revert_engeneering_game/06_runtime_validation/WEB_PORTING_SPECIFICATION.md) | Modern Web/TypeScript architecture, ECS structure, Canvas2D/PixiJS isometric pipeline, RTS mouse controls, audio synth. |

---

## 3. Evidence Matrix

| Finding / System | Source Files & Bytecode Offsets | Confidence Level | Verification Evidence |
|---|---|---|---|
| **Application Entry Point** | `tribes.class` (`startApp`, `run`) | **Confirmed** | Identified in `META-INF/MANIFEST.MF` (`MIDlet-1: Prehistoric Tribes, icon.png, tribes`) and verified in decompiled bytecode. |
| **Isometric Projection Math** | `f.java` (lines 778–820: `y * 22`, `A * 16`) | **Confirmed** | Half-tile horizontal step 22 px, vertical step 16 px ($44 \times 32$ diamond ratio). Diamond scanline lookup verified in `/a`. |
| **Entity Storage (SoA 101)** | `b.java` (`this.var_byte_arr_a[offset + unit_id]`) | **Confirmed** | All entity properties in `b.java` are strictly indexed in strides of 101 (`0, 101, 202, 303, ... 8383`). Corresponds to max 101 active entities. |
| **10 Campaign Scenarios** | `e.java` (line 248: `h = [0, 2545, ... 39214]`) & `0/s` | **Confirmed** | Byte length in `/ma` (42,381 B) matches the sum of offset deltas exactly. Names verified in `0/s` (indices 82–91). |
| **5 Extracted MIDI Themes** | `e.java` (lines 230–231: `f.e`, `f.f`), `/sa` | **Confirmed** | Byte offsets (`0, 8014, 14329, 19977, 23382`) match standard SMF `MThd` track headers. All 5 files playable. |
| **2-Byte PNG Header Hack** | `extracted/pi0`, `pi8`, `pi9` (offset 2) | **Confirmed** | Bytes 0–1 contain metadata; offset 2 holds standard `\x89PNG` signature. Sliced by `e.class` into graphics memory. |
| **Villager Needs & Mood** | `0/t`, `0/s`, `b.java` | **Confirmed** | Hunger triggers travel to Kitchen, fatigue triggers sleep in Huts, low happiness triggers strike/depression, high happiness triggers reproduction. |
| **Chief Morale Aura** | `0/d0` segment 58, `b.java` | **Confirmed** | Chief unit grants combat and gathering multipliers to all units within range. Death causes massive tribal depression. |

---

## 4. File System Artifact Tree

```
/Users/huynguyen/Documents/revert_engeneering_game/
├── plan.md
├── PREHISTORIC_TRIBES_RESEARCH.md              <-- (This master index)
├── Prehistoric_Tribes_240x320-84398-mobiles24.jar (Original untouched binary)
├── 01_initial_inspection/
│   └── JAR_INSPECTION.md
├── 02_assets/
│   ├── ASSET_CATALOG.md
│   ├── icon.png                                (Launcher icon)
│   ├── l0.png, l1.png, l2.png, l3.png          (Logos & splash art)
│   ├── pi0.png                                 (UI, icons, weapons atlas)
│   ├── pi8.png                                 (Environment banner)
│   ├── pi9.png                                 (Unit character spritesheet)
│   ├── music_track_0_8014b.mid                 (Main gameplay BGM)
│   ├── music_track_1_6315b.mid                 (Title/menu BGM)
│   ├── music_track_2_5648b.mid                 (Combat/raid BGM)
│   ├── music_track_3_3405b.mid                 (Victory fanfare)
│   ├── music_track_4_3234b.mid                 (Defeat stinger)
│   └── maps/
│       ├── 00_outside.bin ... 09_plot_of_land.bin (All 10 campaign tilemaps)
├── 03_code_analysis/
│   ├── ARCHITECTURAL_ANALYSIS.md
│   ├── decompiled/                             (CFR decompiled Java sources)
│   └── decompiled_renamed/                     (CFR with duplicate members deobfuscated)
├── 04_narrative/
│   └── STORY_AND_CAMPAIGN.md
├── 05_gameplay/
│   └── GAMEPLAY_SYSTEMS.md
└── 06_runtime_validation/
    └── WEB_PORTING_SPECIFICATION.md
```
