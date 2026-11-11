# Phase 1: Initial JAR Inspection Report

**Target Archive:** `Prehistoric_Tribes_240x320-84398-mobiles24.jar`  
**MD5 / File Size:** 498,387 bytes (487 KB)  
**Format:** Standard ZIP Archive (v2.0, Deflate compression)  
**Target Profile:** J2ME MIDP-2.0 / CLDC-1.0  
**Resolution:** 240 x 320 pixels  
**Vendor:** THQ Wireless Inc.  
**Developer:** Gear Games Ltd.  
**Release Year:** 2007 - 2008  
**Confidence:** Confirmed  

---

## 1. Archive Manifest (`META-INF/MANIFEST.MF`)

```properties
Manifest-Version: 1.0
MIDlet-Name: Prehistoric Tribes
MIDlet-Version: 0.1.28
MIDlet-Vendor: THQ
MIDlet-1: Prehistoric Tribes, icon.png, tribes
MicroEdition-Profile: MIDP-2.0
MicroEdition-Configuration: CLDC-1.0
MIDlet-Icon: /icon.png
MIDlet-Info-URL: http://www.thqwireless.com
Created-By: Metaflow
Cheat-Support: off
Content-Folder: Games
GameUrl-en: http://wap.thqwireless.com
GameUrl-de: http://wap.thqwireless.com
GameUrl-fr: http://wap.thqwireless.com
GameUrl-es: http://wap.thqwireless.com
GameUrl-it: http://wap.thqwireless.com
GameLinkEnabled: false
```

### Key Manifest Insights:
- **Java Entry Class:** `tribes` (`tribes.class`), extending `javax.microedition.midlet.MIDlet`.
- **Packaging/Obfuscation Tool:** `Created-By: Metaflow` (bytecode obfuscator and optimizer used for mobile Java games in the 2000s).
- **Supported Locales:** 5 language URLs specified: English (`en`), German (`de`), French (`fr`), Spanish (`es`), Italian (`it`).
- **Configuration Flags:** `Cheat-Support: off`, `GameLinkEnabled: false`.

---

## 2. Inventory of Archive Entries

| Entry Name | Size (Bytes) | Category | Description |
|---|---|---|---|
| `META-INF/MANIFEST.MF` | 578 | Metadata | Application manifest and MIDlet definitions |
| `tribes.class` | 1,268 | Bytecode | Application entry point (`MIDlet` lifecycle) |
| `a.class` | 2,184 | Bytecode | Audio subsystem (MIDI player via `javax.microedition.media`) |
| `b.class` | 123,810 | Bytecode | Core game simulation logic, entity states, AI, economy |
| `c.class` | 8,872 | Bytecode | Bitmap text rendering engine, string table loader |
| `d.class` | 1,362 | Bytecode | Splash screen and boot progress display canvas |
| `e.class` | 5,780 | Bytecode | Binary resource loader, atlas unpacker, data unpacker |
| `f.class` | 100,293 | Bytecode | Main game canvas (`Canvas`), 20 FPS loop, UI, input, rendering |
| `icon.png` | 2,168 | Graphic | Application icon (48x48, 8-bit indexed PNG) |
| `l0` | 1,955 | Graphic | THQ Wireless publisher splash logo (240x71 PNG) |
| `l1` | 1,897 | Graphic | Gear Games developer splash logo (192x114 PNG) |
| `l2` | 29,290 | Graphic | Main title splash screen (240x321 PNG) |
| `l3` | 4,420 | Graphic | Carrier promotional screen (Orange World, 240x320 PNG) |
| `pi0` | 62,502 | Graphic/Data | UI & Item sprite sheet (128x136 PNG + 2-byte header) |
| `pi8` | 129,809 | Graphic/Data | Story background illustration (240x130 PNG + 2-byte header) |
| `pi9` | 8,597 | Graphic/Data | Isometric character spritesheet (76x111 PNG + 2-byte header) |
| `a` | 18,842 | Binary Data | Unit animation frames & isometric diamond collision masks |
| `ma` | 42,381 | Binary Data | Map tile arrays for all 10 campaign levels (indexed in `e.java`) |
| `pd0` | 96,990 | Binary Data | Sprite coordinates & layout tables (11 short arrays + 25 byte arrays) |
| `sa` | 26,616 | Audio Data | 5 concatenated Standard MIDI tracks (8014, 6315, 5648, 3405, 3234 bytes) |
| `0/s`, `0/t`, `0/d0` | 1.7K / 2.5K / 28.9K | Localization | English UI strings, descriptions, and campaign dialogues |
| `1/s`, `1/t`, `1/d0` | 1.7K / 2.9K / 32.2K | Localization | French UI strings, descriptions, and campaign dialogues |
| `2/s`, `2/t`, `2/d0` | 1.8K / 3.2K / 34.3K | Localization | Italian UI strings, descriptions, and campaign dialogues |
| `3/s`, `3/t`, `3/d0` | 1.8K / 3.0K / 32.9K | Localization | German UI strings, descriptions, and campaign dialogues |
| `4/s`, `4/t`, `4/d0` | 1.8K / 3.0K / 32.0K | Localization | Spanish UI strings, descriptions, and campaign dialogues |
| `Nowy Dokument tekstowy.txt` | 77 | Non-asset | Artifact from distributor/ripper containing download URL |
| `Zakupione przez PaStUcH.txt`| 123 | Non-asset | Polish community credit note ("Zakupione przez PaStUcH...") |

---

## 3. Bytecode and Class Hierarchy

```
javax.microedition.midlet.MIDlet
 └── tribes (implements Runnable)
      ├── d (extends javax.microedition.lcdui.Canvas) [Boot/Splash Canvas]
      └── f (extends javax.microedition.lcdui.Canvas, implements Runnable) [Game Engine & Canvas]
           ├── a (implements javax.microedition.media.PlayerListener) [Sound/MIDI Subsystem]
           ├── b [Core Simulation & Entity Logic]
           ├── c [Text / Bitmap Font Renderer]
           └── e [Binary Resource & Asset Loader]
```

### Deobfuscation Mapping Summary:
- **`tribes.class`**: Top-level MIDlet lifecycle coordinator (`startApp`, `pauseApp`, `destroyApp`).
- **`d.class`**: Displays splash logos (`/l0`, `/l1`, `/l2`) sequentially before transferring control to `f`.
- **`a.class`**: Manages MIDI playback, volume control, track looping, and device availability events.
- **`b.class`**: High-performance Structure-of-Arrays (SoA) simulation engine managing up to 101 simultaneous units/entities, 12 building types, terrain pathfinding, and combat mechanics.
- **`c.class`**: Parses pipe-delimited text (`/s`, `/t`, `/d`) and renders proportionally-spaced bitmap fonts from sprite atlas characters.
- **`e.class`**: Decodes binary structures (`/pd0`, `/ma`, `/a`, `/sa`, `/pi0`, `/pi8`, `/pi9`) and initializes lookup tables.
- **`f.class`**: The central engine; implements 20 FPS game loop, keyboard input handling, 2.5D isometric tile rendering, double-buffered graphics, camera scrolling, HUD drawing, and save/load persistence (`javax.microedition.rms.RecordStore`).

---

## 4. Dependencies & Libraries
- **Standard J2ME CLDC-1.0 / MIDP-2.0**:
  - `javax.microedition.midlet.MIDlet`
  - `javax.microedition.lcdui.*` (`Display`, `Canvas`, `Graphics`, `Image`)
  - `javax.microedition.media.*` (`Manager`, `Player`, `VolumeControl`)
  - `javax.microedition.rms.RecordStore` (persistent flash storage)
- **External Dependencies:** None. The JAR is completely self-contained.
