# 05 — Prompt tạo đồ hoạ 2D HD cho Gemini (Prehistoric Tribes 2D Remaster)

> **Cách dùng (cho người vận hành)**
> 1. Mỗi phiên chat với Gemini: **dán khối `GLOBAL STYLE 2D` (mục 0) trước**, sau đó dán từng prompt. Làm cùng một nhóm (vd. toàn bộ công trình) trong **cùng một cuộc hội thoại** để giữ phong cách đồng nhất. Khi có ảnh đầu tiên ưng ý, đính kèm nó vào các prompt sau với câu: *"Match the style, outline thickness, lighting and colours of the attached image exactly."*
> 2. `ATTACH:` = đính kèm ảnh gốc từ `6_prehistoric_tribes_3d/assets/original/res/images/...` làm tham chiếu.
> 3. **Nền:** luôn là **xanh chroma thuần #00FF00** (Gemini không xuất PNG trong suốt). Pipeline sẽ tự tách nền. Không dùng màu #00FF00 trên chính vật thể.
> 4. Lưu file đúng tên ID: `assets/hd/source/<nhóm>/<ID>.png`. Agent sẽ cắt nền, cắt khung và đưa vào `assets/hd/manifest.json`.
> 5. Ưu tiên: **P0** trước (đủ để kiểm thử Level 0–1), sau đó P1, P2.
> 6. Thiếu asset nào thì game dùng tạm sprite gốc phóng to, nên có thể giao dần.

---

## 0. GLOBAL STYLE 2D (dán đầu mỗi phiên)

```
You are the lead 2D artist for "Prehistoric Tribes Remastered", a comedic Stone-Age village
builder / RTS. It remasters a 2005 mobile game whose art is a cheerful hand-drawn cartoon:
chunky big-headed cavemen, warm saturated greens and earthy browns, gentle goofy humour
(a lazy pot-bellied chief, a stone-age disco, "tigerilla" drinks).

CAMERA / PROJECTION — follow strictly for every image:
- "Three-quarter top-down" view (like classic top-down RPGs/RTS on a square grid): the camera
  looks from the SOUTH toward the north, tilted down about 55°. You see the TOP of objects and
  their FRONT (south-facing) side. NOT isometric: no 45° diagonal rotation. The front of buildings
  faces the viewer squarely; vertical edges stay vertical; ground edges stay horizontal.
- The ground is a square grid; one ground tile appears as a rectangle 88 px wide × 64 px tall
  (foreshortened). Object footprints are given in tiles (W × H) and must fill exactly
  W×88 px by H×64 px at the base; height may rise above.
- Light comes from the upper-left (north-west). Do not paint a cast shadow on the ground
  (the engine adds a soft shadow); only self-shading on the object.

STYLE:
- Hand-painted HD 2D cartoon, clean dark-brown outline (#2B2014, about 3 px at the given size),
  cel shading with 2–3 tones plus a soft highlight. Crisp, readable at 50% zoom.
- Palette: grass greens #6DA83A / #3F7A2A, earth browns #7A4E2A / #A8743F, stone greys #9A9286,
  bone ivory #E9DCC0, fire-orange accent #F2B33D, water blue #4FA6D8. Avoid pure #00FF00.
- Materials: wood with grain and rope/vine lashings, rounded stacked stones, stitched hides
  and furs, bone decorations, straw/leaf thatch.
- Family friendly. People are diverse but NEVER ethnic caricatures; the enemy tribe differs
  only by costume colour and face paint.
- Background: flat pure chroma green #00FF00 everywhere around the object. No text, no logo,
  no watermark, no frame, no ground patch unless asked. Nothing cropped.
```

### Khuôn định dạng (agent tham chiếu bằng tên)
```
[SPRITE] one object, centred horizontally, its base footprint touching the bottom margin
(16 px margin), canvas size as stated, pure #00FF00 background.

[DIR5] 5 views of the SAME character/animal in one row, equal cells, same scale and pose,
in this exact order left→right: facing SOUTH (toward viewer), SOUTH-EAST, EAST (profile
facing right), NORTH-EAST, NORTH (back to viewer). (West-facing views are mirrored in code.)

[ANIM] a sprite sheet: rows = the 5 directions in [DIR5] order (top→bottom), columns = animation
frames left→right. Every cell exactly the stated size, character feet on the same baseline in
every cell, no motion blur, consistent proportions in every frame.

[STATES] the same object shown in N states side by side in equal cells, left→right as listed,
identical position and scale; only the described parts change.
```

---

## 1. NHÂN VẬT — người (P0 → P2)

**Kích thước:** ô khung 128×128 px, người lớn cao ~96 px (đầu to, ~1/4 chiều cao), trẻ em ~64 px, chân chạm đáy khung (cách 8 px).
**Thứ tự giao:**
1. **Bước A (P0) — tạo thiết kế:** `[DIR5]` tư thế đứng yên, 5 ô 128×128 → ảnh 640×128.
2. **Bước B (P1) — hoạt ảnh:** `[ANIM]` cho từng animation ở bảng 1b. Nếu Gemini vẽ các frame không đều, chỉ cần bước A; engine sẽ tạm làm hoạt ảnh bằng code (nhún, nghiêng, vung tay cầm dụng cụ).

| ID | P | Mô tả (dán sau định dạng) |
|---|---|---|
| `chr_villager_m` | P0 | `Adult male caveman villager. Stocky, big round head, messy dark hair and short scruffy beard, thick eyebrows, friendly goofy grin. One-shoulder brown fur tunic with rope belt, bare feet with leather wraps. Empty hands. ATTACH: images/sprites/02.png (original male heads) and images/sprites/05.png (original walking sprites).` |
| `chr_villager_f` | P0 | `Adult cavewoman villager. Big round head, voluminous wavy dark hair with a bone clip, cheerful. Light-brown spotted fur dress, necklace of teeth beads, bare feet. Empty hands. ATTACH: images/sprites/03.png` |
| `chr_child` | P0 | `Cave child about 6 years old, head about 1/3 of height (~64 px tall), tiny fur loincloth, messy hair, mischievous smile.` |
| `chr_chief` | P0 | `The tribe's Chief: comically fat pot belly, lazy smug face, big bushy beard, large headdress of mammoth fur with two small curved tusks and colourful feathers, sabre-tooth tiger pelt cape, bone necklace. ATTACH: icon.png` |
| `chr_warrior` | P1 | `Tribe warrior: muscular, leather chest strap with bone shoulder pads, red ochre war-paint stripes, determined frown. Empty hands (weapons drawn separately).` |
| `chr_shaman` | P1 | `Shaman: thin old man, long white beard, bird-skull mask pushed up on forehead, robe of leaves and feathers, gnarled staff topped with a glowing crystal and dangling bones.` |
| `chr_scout` | P1 | `PIA scout ("Prehistoric Intelligence Agency"): lean, camouflage of leaves and twigs, green face-paint stripes, leaf headband, sneaky self-important look.` |
| `chr_enemy_m` | P1 | `Enemy "cannibal" tribe warrior, cartoon villain, family friendly: same body type as villagers but dark grey-purple furs, white chalk skull-like face paint, bone in hair topknot, necklace of small bones, funny menacing grin. Must not resemble any real ethnic group.` |
| `chr_enemy_f` | P2 | `Enemy tribe woman: dark grey-purple fur dress, white chalk face paint dots, bone hair pins.` |
| `chr_enemy_chief` | P1 | `Enemy cannibal chief: tall and skinny, huge black-and-red feathered headdress, dark fur cape, white skull face paint, comically evil.` |
| `chr_jafar` | P2 | `"Jafar", scheming desert trickster: tall, thin, pointy goatee, sly smile, long sand-coloured woven grass-and-hide cloak and wrapped hide head covering (prehistoric, not modern; avoid any real ethnic or religious costume), curled wooden staff.` |
| `chr_elder` | P2 | `Mumbo the elder advisor: thin, bald with grey side hair, long thin moustache, dignified fur robe with bead tassels, slightly nervous.` |

### 1b. Hoạt ảnh nhân vật (bước B, `[ANIM]`, ô 128×128)
| Animation | Số frame | Áp dụng | Mô tả thêm vào prompt |
|---|---:|---|---|
| `walk` | 6 | mọi nhân vật | `walk cycle, arms swinging` |
| `carry_walk` | 6 | villager m/f | `walking while carrying a bundle on the shoulder (bundle drawn as a simple brown shape that will be replaced)` |
| `work_chop` | 4 | villager m/f, warrior | `two-handed overhead swing of a tool down to the ground in front (tool drawn separately, keep hands closed as if holding a handle)` |
| `work_gather` | 4 | villager m/f | `bending down picking berries from a bush in front, hands reaching low` |
| `build` | 4 | villager m/f | `hammering in front at waist height` |
| `attack_melee` | 4 | warrior, villager m, enemy | `swinging a club from behind the shoulder to the front` |
| `throw` | 4 | warrior, villager m, enemy, scout | `overarm throw: wind-up, release, follow-through` |
| `die` | 4 | mọi nhân vật | `falls backward and lies flat with cartoon X eyes, no blood` (chỉ hướng SOUTH, 1 hàng) |
| `sleep` | 2 | villager m/f, child, chief | `lying on the ground asleep, little Zzz not drawn` (chỉ SOUTH) |
| `dance` | 4 | villager m/f, chief | `goofy disco dance` (chỉ SOUTH) |
| `idle` | 2 | mọi nhân vật | `breathing idle` |

### 1c. Chân dung UI (P1) — ảnh vuông, nền #00FF00
| ID | Prompt |
|---|---|
| `ui_portrait_m` | `Sheet of 16 head-and-shoulder portraits of different cartoon cavemen (hair, beards, ages, skin tones, expressions), 4×4 grid, each cell 256×256, same style. ATTACH: images/sprites/02.png` |
| `ui_portrait_f` | `Sheet of 12 different cavewomen portraits, 4×3 grid, 256×256 cells. ATTACH: images/sprites/03.png` |
| `ui_portrait_roles` | `Sheet of 6 portraits, 3×2 grid, 256×256: our fat Chief, the Shaman, a PIA Scout, the Elder advisor, the Cannibal chief, Jafar.` |

---

## 2. ĐỘNG VẬT (`[DIR5]` bước A, `[ANIM]` bước B; ô 192×128, lợn dài ~110 px, hổ ~150 px)

| ID | P | Mô tả | Animation (bước B) |
|---|---|---|---|
| `ani_boar` | P0 | `Prehistoric wild boar: bristly dark-brown fur with a lighter mane ridge, big curved tusks, small angry eyes, chunky cartoon body, short legs.` | walk 6, run 6, attack 4, die 4 (SOUTH) |
| `ani_tiger` | P0 | `Sabre-tooth tiger: muscular, orange with dark stripes, cream belly, two huge curved sabre fangs, cartoon but dangerous. ATTACH: images/sprites/14.png, images/story/00.png` | walk 6, run 6, attack 4, die 4 (SOUTH) |
| `ani_mammoth` | P2 | `Woolly mammoth (decorative), cell 256×256: shaggy reddish-brown fur, big curved tusks, gentle face. ATTACH: images/story/00.png` | walk 6 |
| `ani_bird` | P2 | `Giant prehistoric bird flying, seen from above at the camera angle, wings spread, 4-frame flap cycle, cell 256×128.` | fly 4 (1 hướng) |
| `obj_carcass` | P0 | `[STATES] 4 states, cells 192×128: dead boar lying on its side (cartoon X eyes, no blood), the same boar partly butchered, mostly bones, a small pile of bones.` | — |
| `obj_carcass_tiger` | P1 | `Same as obj_carcass but for the sabre-tooth tiger.` | — |

---

## 3. CÔNG TRÌNH (`[SPRITE]`)

**Kích thước canvas** = (W×88 + 32) × (H×64 + chiều cao nhô lên + 32) px; nền của công trình phủ đúng W×88 × H×64 ở đáy. Cửa ra vào ở **mặt trước (hướng Nam, nhìn về người xem)**.
**Mỗi công trình cần:** cấp 1 (và cấp 2/3 nếu có); bản địch dùng prompt chung ở cuối mục.

| ID | Ô (W×H) | Canvas | P | Mô tả |
|---|---|---|---|---|
| `bld_hut_l1` | 2×2 | 208×288 | P0 | `Small round caveman sleeping hut: dome of curved branches covered with stitched brown hides held down by big bones, low front door with a hanging fur flap, smoke hole on top. Cosy, houses 4.` |
| `bld_hut_l2` | 2×2 | 208×288 | P1 | `Upgraded hut: low ring of stacked stones at the base, thicker thatch-and-hide roof, a skull flower-pot by the door, a heart carved on the door post (cute, family friendly).` |
| `bld_chief_hut` | 4×4 | 384×448 | P0 | `The Chief's hut, the most pompous building: large oval longhouse of thick logs and mammoth hides, entrance arch of two huge mammoth tusks, totem pole with the fat chief's face beside it, tiger-skin rug at the door, stone throne under a small porch.` |
| `bld_store` | 3×3 | 296×352 | P0 | `Tribe storehouse: open-sided shed of wooden posts with sloped thatch roof; visible piles of logs, stacked stones, bone heaps, berry baskets and a wooden rack of spears and clubs.` |
| `bld_kitchen_l1` | 4×3 | 384×320 | P0 | `Tribe kitchen: open-air cooking area under a lean-to leaf roof, big stone fire pit with a spit-roast, large clay pot on stones, long log table with stone plates and stump stools, firewood pile.` |
| `bld_kitchen_l2` | 4×3 | 384×320 | P1 | `Upgraded kitchen: stone oven with chimney, two tables, hanging dried meat and fish, herb bundles, bigger roof.` |
| `bld_armoury_l1` | 3×2 | 296×256 | P0 | `Armoury workshop: small log-frame shed with hide roof, big flat stone work table with flint chips, racks of clubs and spears.` |
| `bld_armoury_l2` | 3×2 | 296×256 | P1 | `Upgraded armoury: stone back wall, bone decorations, racks with stone axes and bone maces, a net trap hanging on the wall.` |
| `bld_armoury_l3` | 3×2 | 296×256 | P2 | `Fully upgraded armoury: stone-and-timber building, fire pit for hardening wood, tomahawks and spring-trap parts on display, carved crossed-weapons emblem over the door.` |
| `bld_gym_l1` | 5×4 | 472×384 | P1 | `Stone-age gym: open training yard fenced with logs, rock dumbbells, hanging log punching bag, sparring circle in the dirt, straw training dummy.` |
| `bld_gym_l2` | 5×4 | 472×384 | P2 | `Upgraded gym: roofed corner with a giant boulder bench-press, climbing rope on a tall post, more dummies, a trophy skull.` |
| `bld_range_l1` | 6×4 | 560×352 | P1 | `Throwing range: long fenced dirt lane, wooden thrower platform with spear rack and stone pile at the front, three straw targets shaped like a boar, a tiger and a cartoon enemy at the back.` |
| `bld_range_l2` | 6×4 | 560×352 | P2 | `Upgraded range: roofed throwing platform, moving target on a rope, more targets.` |
| `bld_disco_l1` | 5×4 | 472×416 | P1 | `Stone-age disco: partly open cave-like structure of stacked rocks and logs, checkered dance floor of polished flat stones, DJ booth of a hollow log with drums and bone percussion, glowing fire bowls (amber, red, green) as party lights, log bar with coconut cups.` |
| `bld_disco_l2` | 5×4 | 472×416 | P2 | `Upgraded disco: shiny shell disco ball hanging from a mammoth tusk, bigger drums, fur sofa, glowing mushrooms.` |
| `bld_sanctuary_l1` | 3×3 | 296×384 | P1 | `Shaman's sanctuary: small circle of standing stones with spiral carvings around a central altar, totem with an animal skull, smoking incense bowls, feather and bone charms, soft purple glow.` |
| `bld_sanctuary_l2` | 3×3 | 296×384 | P2 | `Upgraded sanctuary: taller stones, small hide-roofed shaman hut behind the altar, crystals, potted cacti.` |
| `bld_pia_l1` | 4×4 | 384×416 | P1 | `PIA Centre (Prehistoric Intelligence Agency): a hut entirely disguised as a big bush of leaves and branches, bamboo periscope poking out of the roof, log obstacle course, camouflage net, stone with an eye carving (no text). Funny.` |
| `bld_pia_l2` | 4×4 | 384×416 | P2 | `Upgraded PIA centre: small lookout platform, more camouflage, a map painted on a stretched hide.` |
| `bld_nursery_l1` | 4×4 | 384×352 | P1 | `Nursery play pen: round fence of short logs, sandpit, rocking toy baby mammoth carved from a log, smooth stone slide, small leaf shade roof.` |
| `bld_nursery_l2` | 4×4 | 384×352 | P2 | `Upgraded nursery: bigger shelter, swing on a branch, toy dinosaur bones.` |
| `bld_tower_l1` | 1×1 | 120×384 | P1 | `Wooden watch tower, very tall and narrow: four lashed log legs with cross-bracing, small top platform with log railing and hide canopy, rope ladder.` |
| `bld_tower_l2` | 1×1 | 120×384 | P2 | `Upgraded tower: stone-reinforced base, spiked logs, thicker roof, stone pile on the platform.` |
| `bld_campfire` | 1×1 | 120×128 | P1 | `Village campfire: ring of stones and crossed logs (no flames; flames are an effect), three log seats.` |

**Bản địch** (P1, làm cho Hut, Chief hut, Store, Kitchen, Armoury, Tower; đính kèm ảnh bản của mình):
```
ATTACH: <our building>. Redraw exactly the same building (same shape, size, footprint and camera
angle) for the enemy cannibal tribe: dark grey-purple furs instead of brown hides, white chalk
skull-like paint marks, small bone and skull decorations, red ochre stripes on the wood.
Family friendly. Same canvas size, #00FF00 background.
```

### 3b. Xây dựng & đổ nát (P0/P1) — `[STATES]` 3 trạng thái
Làm cho mỗi footprint: **1×1, 2×2, 3×2, 3×3, 4×3, 4×4, 5×4, 6×4** (canvas theo bảng trên, ô cạnh nhau).
```
[STATES] 3 states for a {W}×{H}-tile plot: (1) levelled dirt rectangle with rope and corner stakes,
a pile of logs and stones; (2) bare wooden frame of lashed poles with half-built walls and a ladder;
(3) destroyed rubble: collapsed charred logs, scattered stones, torn hides, a little smoke.
```
ID: `bld_site_{W}x{H}` (ví dụ `bld_site_2x2`).

---

## 4. THIÊN NHIÊN & TÀI NGUYÊN (`[SPRITE]` / `[STATES]`)

| ID | Canvas | P | Mô tả |
|---|---|---|---|
| `nat_tree_broadleaf` | 4 cây, ô 176×256 | P0 | `4 variations of a stylized prehistoric broadleaf tree (chunky twisted trunk with vines, round fluffy canopy in two greens), different heights, side by side. The trunk base sits in one 88×64 tile. ATTACH: images/sprites/07.png` |
| `nat_tree_conifer` | 4 cây, ô 176×288 | P0 | `4 variations of a prehistoric pine/conifer tree with layered canopy.` |
| `nat_tree_jungle` | 3 cây, ô 176×256 | P1 | `3 variations of a giant fern-palm (cycad) with scaly trunk and long fronds.` |
| `nat_tree_desert` | 3 cây, ô 176×224 | P1 | `Dry acacia-like flat-canopy tree, a dead bare tree, a thorny shrub.` |
| `nat_tree_stump` | 2 ô 120×96 | P0 | `[STATES] a freshly chopped tree stump with wood chips; a falling tree trunk lying on the ground.` |
| `nat_berrybush` | 3 ô 120×120 | P0 | `[STATES] round berry bush: full of red berries / half picked / fully picked (green leaves only).` |
| `nat_plants` | 3 ô 120×96 | P1 | `[STATES] patch of edible plants (leafy greens, wild onions, roots): full / half / almost empty.` |
| `nat_rock_quarry` | 3 ô 176×160 | P0 | `[STATES] grey stone outcrop that villagers quarry: full boulder cluster / partly chipped / small remains with rubble.` |
| `nat_bones` | 3 ô 176×128 | P1 | `[STATES] pile of big animal bones (ribs, skull, femurs): big / half / a few bones.` |
| `nat_fish_shoal` | 4 ô 120×96 | P1 | `Animated 4 frames: fish shadows and ripples on a water surface patch with small splashes (draw only ripples and fish, the water colour itself is transparent #00FF00 around).` |
| `nat_tall_rock` | 120×224 | P1 | `Tall impassable rock pillar, weathered with moss.` |
| `nat_boulders` | 4 ô 120×120 | P1 | `4 decorative mossy boulders of different shapes.` |
| `nat_ground_deco` | 16 ô 88×64 | P0 | `Sheet of 16 small ground decorations on a 4×4 grid: grass tufts, wildflowers, pebbles, twigs, mushrooms, ferns, a small skull, footprints in mud.` |
| `nat_reeds` | 6 ô 88×96 | P1 | `6 clumps of reeds and cattails for lake shores.` |
| `nat_cactus` | 3 ô 88×128 | P2 | `3 cartoon desert cacti.` |
| `obj_love_nest` | 120×96 | P2 | `A soft pile of leaves and flowers under a small heart-shaped bush, family friendly.` |

---

## 5. ĐỊA HÌNH (P0) — texture lát liền, nhìn từ trên xuống

Prompt chung: `Seamless tileable ground texture, 512×512, seen from the 3/4 top-down game camera (very slight vertical foreshortening), hand-painted cartoon matching the style, even lighting, tiles perfectly on all four edges, no objects, no shadows.` (texture nền đất không cần nền #00FF00)

| ID | P | Thêm vào prompt |
|---|---|---|
| `ter_grass` | P0 | `lush short grass with subtle colour variation and a few tiny flowers` |
| `ter_grass_dry` | P1 | `dry yellow-green grass` |
| `ter_dirt` | P0 | `packed brown dirt with small pebbles` |
| `ter_forest_floor` | P0 | `forest floor: dark soil, fallen leaves, moss, twigs` |
| `ter_sand` | P1 | `desert sand with soft ripples` |
| `ter_wasteland` | P1 | `cracked dry wasteland earth, grey-brown` |
| `ter_rock` | P1 | `flat rocky ground, grey stone slabs with cracks` |
| `ter_shore` | P0 | `wet muddy sand of a lake shore with small pebbles` |
| `ter_water` | P0 | `stylized shallow lake water, turquoise to blue, light caustic pattern` |
| `ter_snow` | P2 | `old melting snow with patches of grass (end of the ice age)` |

**Mép chuyển tiếp** (P1): `Sheet of 16 transition masks on a 4×4 grid, 88×64 each, for blending {A} into {B}: edges N, E, S, W, outer corners NE, SE, SW, NW, inner corners NE, SE, SW, NW, and 4 irregular patches. Same art style, #00FF00 background where {A} is absent.` (làm cho cặp: grass→dirt, grass→water(shore), grass→sand)

**Vách đá & bờ nước** (P2): `Sheet of cliff/bank pieces seen from the 3/4 camera: straight south-facing cliff (front face visible), left end, right end, inner corner, outer corner; each cell 88×128, #00FF00 background.`

---

## 6. ĐẠO CỤ, VŨ KHÍ, BẪY (`[SPRITE]`, nhỏ)

| ID | Canvas | P | Mô tả |
|---|---|---|---|
| `prop_weapons` | 6 ô 96×96 | P0 | `6 weapons laid horizontally, held-item size, side by side: wooden club; round throwing stone; flint-tipped spear; stone axe; bone mace; bone tomahawk with red feather.` |
| `prop_cargo` | 8 ô 64×64 | P0 | `8 carried items side by side: bundle of 3 logs, block of stone, leg of meat on the bone, basket of berries, armful of green plants, two fish on a string, bundle of bones, steaming meal on a stone plate.` |
| `prop_projectiles` | 4 ô 64×64 | P1 | `Flying projectiles seen from the game camera: spear (pointing right), stone, tomahawk (spinning, 2 frames).` |
| `trap_net` | 2 ô 120×96 | P1 | `[STATES] net trap: armed (vine net hidden under leaves, bent sapling trigger) / sprung (net pulled up into a hanging bundle).` |
| `trap_spring` | 2 ô 120×96 | P1 | `[STATES] spring trap: armed (bent log held by a peg, spikes, leaves on top) / sprung (log swung down, spikes exposed).` |
| `trap_pit` | 2 ô 120×96 | P2 | `[STATES] pit trap: armed (square of thin sticks with grass) / sprung (open pit with stakes inside).` |
| `prop_rally_flag` | 4 ô 64×128 | P1 | `Rally flag: a hide banner on a wooden pole with a painted hand print, 4-frame waving animation.` |

---

## 7. HIỆU ỨNG (sprite sheet, nền #00FF00)

| ID | P | Prompt |
|---|---|---|
| `fx_fire` | P0 | `Cartoon campfire flame loop, 8 frames in a row, each 96×128.` |
| `fx_smoke` | P0 | `Soft cartoon smoke puff, 8 frames, 128×128 each.` |
| `fx_dust` | P0 | `Dust puff for building and footsteps, 8 frames, 128×96 each.` |
| `fx_hit` | P0 | `4 different cartoon impact bursts (comic "pow" star shape, no text), yellow-orange, 96×96 each.` |
| `fx_heal` | P1 | `Green-gold healing sparkles rising, 8 frames, 96×128.` |
| `fx_defence` | P1 | `Translucent blue magic shield bubble around a person seen from the game camera, 4 frames shimmer, 128×128.` |
| `fx_love` | P1 | `Floating pink cartoon hearts, 8 frames, 96×128.` |
| `fx_disease` | P1 | `Sickly green swirling cloud with tiny cute skull bubbles, 8 frames, 192×128.` |
| `fx_splash` | P1 | `Water splash, 8 frames, 96×96.` |
| `fx_chips` | P1 | `12 small flying wood chips and stone chips, 32×32 each.` |
| `fx_clouds` | P2 | `6 fluffy cartoon clouds seen from above (for drifting cloud shadows), 256×160 each. ATTACH: images/sprites/16.png` |
| `fx_emotes` | P0 | `Speech-bubble emotes, 12 cells 64×64: heart, zzz, angry scribble, question mark, exclamation mark, food, music note, skull, star, sweat drop, tear, laugh.` |
| `fx_selection` | P0 | `Selection ring on the ground seen from the game camera (flattened ellipse), in 3 colours: green (ours), red (enemy), yellow (neutral); plus a move-order marker (3 animated frames of an arrow pointing down into a ring). 128×64 cells.` |

---

## 8. GIAO DIỆN (UI) — nền #00FF00

Thêm sau GLOBAL STYLE:
```
UI style: modern, clean game UI with a Stone-Age theme. Panels are smooth polished slate or light
parchment-coloured hide stretched in a thin wooden frame with rope corners; flat and crisp, subtle
inner shadow, no heavy bevels. Accent fire-orange #F2B33D. Icons: bold simple shapes, thick
dark-brown outline #2B2014, cel-shaded, readable at 32×32.
```
| ID | P | Prompt |
|---|---|---|
| `ui_logo` | P0 | `Game logo "PREHISTORIC TRIBES" in chunky carved stone letters with moss and a bone, two lines, 2048×1024. ATTACH: images/sprites/18.png` (chữ trong logo là ngoại lệ được phép) |
| `ui_icons_resources` | P0 | `8 icons on a 4×2 grid, 256×256 each: raw food (meat + berries), cooked meal (steaming plate), wood logs, stones, bones, population (two caveman heads), living space (hut), happiness (smiley). ATTACH: images/sprites/00.png` |
| `ui_icons_items` | P0 | `9 icons, 3×3 grid, 256×256: club, throwing stone, spear, stone axe, bone mace, tomahawk, net trap, spring trap, pit trap.` |
| `ui_icons_buildings` | P0 | `12 icons, 4×3 grid, 256×256, each a mini version of: armoury, gym, hut, chief's hut, kitchen, throwing range, store, disco, sanctuary, PIA centre, nursery, watch tower.` |
| `ui_icons_commands` | P0 | `20 icons, 5×4 grid, 256×256: build (hammer), form up (three figures in a row), call to arms (horn), villagers list (group), dismiss (waving hand), back to work (pickaxe), upgrade (up arrow on stone), demolish (broken wall), get out (figure leaving a door), healing (green leaf cross), defence (shield), love potion (pink potion with heart), disease (green skull cloud), info all (eye), info selected (eye with dot), info none (closed eye), repair (hammer and log), cancel upgrade (crossed up arrow), cancel repair (crossed hammer), unload (tipping basket).` |
| `ui_icons_jobs` | P1 | `18 icons, 6×3 grid, 256×256: berry picker, woodcutter, butcher, fisher, stonecutter, plant gatherer, bone collector, armourer, cook, DJ, shaman, builder, scout, melee fighter, thrower, guard, child, chief.` |
| `ui_icons_status` | P0 | `10 icons, 5×2 grid, 256×256: hungry (empty bowl), tired (zzz), happy, sad, on strike (crossed arms), in love (heart), sick (green face), injured (bandage), enemy sighted (eye, red), under attack (crossed weapons, red).` |
| `ui_panel_kit` | P0 | `UI kit: 9-slice slate panel with wooden frame and rope corners (512×512), small tooltip panel, wide button in 3 states normal/hover/pressed (512×128 each), round icon button in 3 states (128×128), progress bar frame and fills in green/yellow/red/blue, tab, stone close button with carved X, checkbox, pebble slider knob.` |
| `ui_cursors` | P1 | `6 cursors 64×64: stone arrowhead pointer, select, attack (spear), gather (hand), build (hammer), forbidden (red crossed circle).` |
| `ui_minimap_frame` | P1 | `Round minimap frame of a carved stone ring with a small bone compass rose, 1024×1024, inner area #00FF00.` |

---

## 9. MÀN HÌNH & CỐT TRUYỆN (1920×1080, không cần nền #00FF00)

| ID | P | Prompt |
|---|---|---|
| `art_title` | P0 | `Title screen key art: lush prehistoric valley after the ice age thaws, waterfall, woolly mammoth, sabre-tooth tiger, our goofy fat chief proudly on a rock with his tribe behind, warm morning light, empty space top-centre for the logo. ATTACH: images/story/00.png, icon.png` |
| `art_story_00..11` | P1 | `Recreate this story illustration as modern high-resolution cartoon art in the same style, same composition and characters, 16:9. ATTACH: images/story/NN.png` (12 lần) |
| `art_loading_*` | P2 | `Loading background for level "{NAME}": {DESC}, wide landscape, empty centre.` — outside (green valley before the icy cave), revenge (forest near the cannibal camp at dusk), escape (rocky canyon, tiger eyes in shadows), wastelands (cracked tundra, giant bones), a new home (gentle hills and river), great lake (blue lake, islands, jumping fish), desert pass (sandstone canyon), forest belt (huge primeval forest), slaughter (enemy log-and-skull stronghold, stormy sky), plot of land (sunny meadow). |
| `art_win` / `art_lose` | P2 | `Victory: tribe celebrating around a bonfire carrying the chief on shoulders. / Defeat: burned empty village at dusk, chief sitting sadly on a rock.` |

---

## 10. Checklist P0 (đủ để kiểm thử Level 0–1)
- [ ] `chr_villager_m`, `chr_villager_f`, `chr_child`, `chr_chief` (bước A: 5 hướng đứng yên)
- [ ] `ani_boar`, `ani_tiger` (5 hướng), `obj_carcass`
- [ ] `bld_hut_l1`, `bld_chief_hut`, `bld_store`, `bld_kitchen_l1`, `bld_armoury_l1`, `bld_site_*` (2×2, 3×2, 3×3, 4×3, 4×4)
- [ ] `nat_tree_broadleaf`, `nat_tree_conifer`, `nat_tree_stump`, `nat_berrybush`, `nat_rock_quarry`, `nat_ground_deco`
- [ ] `ter_grass`, `ter_dirt`, `ter_forest_floor`, `ter_shore`, `ter_water`
- [ ] `prop_weapons`, `prop_cargo`
- [ ] `fx_fire`, `fx_smoke`, `fx_dust`, `fx_hit`, `fx_emotes`, `fx_selection`
- [ ] `ui_logo`, `ui_icons_resources`, `ui_icons_items`, `ui_icons_buildings`, `ui_icons_commands`, `ui_icons_status`, `ui_panel_kit`, `art_title`

## 11. Hạn chế đã biết của ảnh AI & cách xử lý
- **Khung hoạt ảnh không đều** (nhân vật đổi dáng giữa các frame): chỉ giao bước A, engine sẽ tạm tạo chuyển động bằng code. Có thể tạo lại từng hàng (1 hướng/lần) để Gemini tập trung.
- **Sai góc nhìn** (bị vẽ thành isometric chéo): nhắc lại câu *"NOT isometric, front faces the viewer squarely, ground edges horizontal"* và đính kèm một ảnh đã đúng.
- **Sai kích thước**: không sao, pipeline sẽ scale theo footprint; quan trọng là **đúng tỷ lệ** rộng:cao của nền (88:64 mỗi ô).
- **Nền không thuần #00FF00**: yêu cầu lại hoặc tách nền thủ công; tránh màu xanh lá quá gần #00FF00 trên vật thể.
