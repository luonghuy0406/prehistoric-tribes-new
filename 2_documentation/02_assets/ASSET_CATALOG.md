# Phase 2: Game Asset Catalog & Binary Formats

This catalog details all visual, auditory, and structural assets reverse-engineered from `Prehistoric_Tribes_240x320-84398-mobiles24.jar`.

---

## 1. Visual Assets (Images & Sprite Sheets)

| File Name | Disk Path | Native Format | Dimensions | Description |
|---|---|---|---|---|
| `icon.png` | `02_assets/icon.png` | 8-bit PNG | 48 x 48 | Game launcher icon (Chief holding a saber-toothed cat) |
| `l0.png` | `02_assets/l0.png` | 8-bit PNG | 240 x 71 | THQ Wireless publisher logo banner |
| `l1.png` | `02_assets/l1.png` | 8-bit PNG | 192 x 114 | Gear Games developer studio logo |
| `l2.png` | `02_assets/l2.png` | 8-bit PNG | 240 x 321 | Full-screen illustrated title screen |
| `l3.png` | `02_assets/l3.png` | 8-bit PNG | 240 x 320 | Promotional splash screen (Orange World mobile store) |
| `pi0.png` | `02_assets/pi0.png` | 8-bit PNG | 128 x 136 | **UI & Gameplay Atlas**: Icons for resources, weapons, traps, emotions, cursors, checkmarks, mini-bars |
| `pi8.png` | `02_assets/pi8.png` | 8-bit PNG | 240 x 130 | **Environment Art Banner**: Mammoth, prehistoric tiger, waterfall, lush valley |
| `pi9.png` | `02_assets/pi9.png` | 8-bit PNG | 76 x 111 | **Unit Spritesheet**: Male and female tribesmen walking/working in 8 isometric directions |

### Binary Packaging Nuance of `pi0`, `pi8`, `pi9`:
In the original JAR, these files are prefixed by a 2-byte header:
- `pi0`: `0x22, 0xA0` followed immediately by PNG signature `\x89PNG\r\n\x1a\n`
- `pi8`: `0x2A, 0x9E` followed immediately by PNG signature `\x89PNG\r\n\x1a\n`
- `pi9`: `0x0A, 0xFE` followed immediately by PNG signature `\x89PNG\r\n\x1a\n`

The 2-byte prefix defines internal tile subdivision constants (cell dimensions and tile pitch) used by `e.class` during runtime texture sub-image slicing.

---

## 2. Audio Assets (Soundtrack & Music)

The original file `/sa` (26,616 bytes) contains **5 concatenated Standard MIDI files** (SMF Format 1, 6 tracks, 480 PPQ). These were unpacked using table offsets in `e.java` (`f.f` and `f.e`):

| Track # | Target File | File Size | Musical Role in Game |
|---|---|---|---|
| Track 0 | `02_assets/music_track_0_8014b.mid` | 8,014 bytes | **Main Gameplay BGM** (ambient primitive rhythm, flute & percussion) |
| Track 1 | `02_assets/music_track_1_6315b.mid` | 6,315 bytes | **Main Title / Menu BGM** (upbeat prehistoric tribal theme) |
| Track 2 | `02_assets/music_track_2_5648b.mid` | 5,648 bytes | **Combat & Raid BGM** (tense driving drumbeats and alarms) |
| Track 3 | `02_assets/music_track_3_3405b.mid` | 3,405 bytes | **Victory Fanfare** (triumphant brass & drum resolution) |
| Track 4 | `02_assets/music_track_4_3234b.mid` | 3,234 bytes | **Defeat / Game Over Stinger** (somber minor theme) |

---

## 3. World Maps (`/ma` Partition)

The file `/ma` (42,381 bytes) contains compressed terrain and level data for all 10 campaign scenarios, indexed by offset array `h` in `e.java`:

| Scenario ID | Name (from `0/s`) | Byte Range in `/ma` | Size | Description |
|---|---|---|---|---|
| Level 0 | `outside` | 0 – 2,545 | 2,545 B | Initial exodus from the cave into the thawed valley |
| Level 1 | `revenge` | 2,545 – 6,965 | 4,420 B | Counter-attack against cannibal scouts |
| Level 2 | `escape` | 6,965 – 10,649 | 3,684 B | Tactical retreat through hostile predator territory |
| Level 3 | `wastelands` | 10,649 – 15,487 | 4,838 B | Arid tundra with scarce resources and wandering beasts |
| Level 4 | `a new home` | 15,487 – 22,633 | 7,146 B | Establishing a fortified tribal settlement |
| Level 5 | `great lake` | 22,633 – 27,261 | 4,628 B | Aquatic landscape requiring fishing and spear usage |
| Level 6 | `desert pass` | 27,261 – 31,708 | 4,447 B | Narrow canyon bottleneck fraught with barbarian traps |
| Level 7 | `forest belt` | 31,708 – 35,466 | 3,758 B | Dense primeval forest requiring heavy lumber gathering |
| Level 8 | `slaughter` | 35,466 – 39,214 | 3,748 B | Major offensive assault on the barbarian stronghold |
| Level 9 | `plot of land` | 39,214 – 42,381 | 3,167 B | Final campaign sanctuary and custom sandbox map |

### Map Compression Format:
- **Run-Length Encoding (RLE):** Bytes with values $\ge 250$ indicate repeated runs of base tiles defined in the header table.
- **Isometric Grid:** Diamond tiles with $44 \times 32$ pixels ($dx = 22, dy = 16$).
- **Multi-layer Composition:**
  1. Base terrain index (grass, dirt, rock, water, mud).
  2. Collision map (`0` = passable, `-126` = impassable wall/water).
  3. Interactive nodes (IDs 175–179 = resource spawns for trees, rock clusters, mammoths/game).

---

## 4. Custom Binary Resource Formats

### 4.1. Sprite Layout Table (`/pd0`)
- **Size:** 96,990 bytes.
- **Header:** 1 byte category count, followed by 11 `short[]` index tables (48,493 16-bit values) and 25 `byte[]` lookup tables.
- **Function:** Serves as the UV coordinate lookup table. Translates higher-level sprite frame IDs (e.g., "Villager walking SE frame 2", "Kitchen level 1", "Stone axe icon") into exact pixel clipping rectangles `(x, y, w, h)` within `pi0.png` and `pi9.png`.

### 4.2. Animation and Collision Shapes (`/a`)
- **Size:** 18,842 bytes.
- **Structure:**
  - 32 distinct sprite/animation types.
  - Frame index sequence tables for directional movement.
  - Scanline diamond collision envelopes: Scanline widths defined as pairs of signed bytes around an isometric anchor point, allowing pixel-accurate mouse/cursor tile picking without expensive trigonometrical calculations.

---

## 5. Localization & String Databases

Five sub-directories (`0/`, `1/`, `2/`, `3/`, `4/`) represent:
- `0/`: English
- `1/`: French
- `2/`: Italian
- `3/`: German
- `4/`: Spanish

### Three Files per Locale:
1. `s`: Pipe-delimited (`|`) UI labels, menu options, building names, weapon names, status messages, level titles, and 121 character names (60 male, 61 female).
2. `t`: Pipe-delimited contextual descriptions for buildings, needs warnings, villager refusal lines, and gameplay instructions.
3. `d0`: Full campaign script containing 236 narrative segments, tutorial walk-throughs, comedic character banter, mission briefings, and victory/defeat epilogues.
