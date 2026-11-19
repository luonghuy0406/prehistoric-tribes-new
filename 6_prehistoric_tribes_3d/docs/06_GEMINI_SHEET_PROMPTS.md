# 06 — Bộ prompt GOM SHEET cho Antigravity/Gemini (10 ảnh = toàn bộ đồ hoạ)

Thay cho `05_GEMINI_2D_ASSET_PROMPTS.md` (hàng chục ảnh lẻ). Ở đây mỗi ảnh là **một sprite sheet lớn**; mình sẽ viết tool tự cắt từng ô (connected-components trên nền #00FF00) và đưa vào `assets/hd/manifest.json`.

## Cách dùng (đọc 1 lần)
1. **Thứ tự bắt buộc:** S01 → S02 → S03 → … Ảnh đầu tiên đặt chuẩn phong cách; mỗi ảnh sau **đính kèm** (a) 3 ảnh mẫu đã duyệt trong `assets/hd/source/` (`chr_villager_m.png`, `bld_hut_l1.png`, `ter_grass.png`) và (b) kết quả S01 (nhân vật) hoặc S03 (công trình/thiên nhiên).
2. Mỗi ảnh: dán **GLOBAL STYLE** (mục 0) rồi dán prompt của ảnh đó, **trong cùng một cuộc hội thoại** với các ảnh cùng nhóm.
3. Chọn **độ phân giải lớn nhất** model cho phép (≥ 2048 px cạnh dài, càng cao càng tốt) và đúng **tỉ lệ khung** ghi ở từng ảnh. Chữ "Output" trong prompt chỉ là gợi ý; nếu UI có ô chọn tỉ lệ/độ phân giải thì chọn ở đó.
4. Lưu file: `assets/hd/source/sheets/S01_characters_civil.png`, `S02_...` (đúng tên ở từng mục).
5. **Nếu model bỏ sót/vẽ sai ô:** đừng tạo lại cả ảnh. Gửi tiếp: *"Keep everything exactly as is. Only redraw cell R?C? (…). Output the full sheet again."* hoặc đính kèm ảnh vừa tạo và yêu cầu *"add the missing items in the empty cells, do not change the others"*.
6. **Ưu tiên khi hết quota:** P0 = S01, S03, S06, S08 (nhìn thấy khác biệt ngay). P1 = S02, S04, S07, S09. P2 = S05, S10.

> **Không đặt chữ/logo/số trên bất kỳ ảnh nào** — toàn bộ chữ do game vẽ (hỗ trợ tiếng Việt có dấu).
> Kẻ địch, lều địch, nhân vật khác màu: **mình đổi màu bằng code** (hue shift) nên không tốn ảnh.

---

## 0. GLOBAL STYLE (dán đầu MỌI lượt)

```
You are the lead 2D artist for "Prehistoric Tribes Remastered", a comedic Stone-Age village
builder / RTS (remaster of a 2005 mobile game). Art direction: cheerful hand-painted HD 2D
cartoon, chunky big-headed cavemen, warm saturated greens and earthy browns, goofy humour.

STRICT STYLE (identical in every image of the project):
- Match the attached approved reference images EXACTLY: same clean dark-brown outline
  (#2B2014, ~3 px at 256 px object height), same cel shading with 2-3 tones plus soft highlight,
  same colour palette, same lighting (light from upper-left), same level of detail.
- Camera for characters/animals/buildings/nature: slight three-quarter FRONT view, camera
  almost at eye level looking at the object, the object's front faces the viewer squarely;
  vertical edges stay vertical. NOT isometric, NOT rotated 45 degrees.
- Palette: grass greens #6DA83A / #3F7A2A, earth browns #7A4E2A / #A8743F, stone grey #9A9286,
  bone ivory #E9DCC0, fire orange #F2B33D, water blue #4FA6D8. Materials: wood with grain and
  rope lashings, rounded stacked stones, stitched hides and furs, bone decorations, thatch.
- Family friendly; people diverse but never ethnic caricatures.
- NO cast shadows on the ground (the engine adds them), NO text, NO letters, NO numbers,
  NO logos, NO watermark, NO frames, NO labels, NO grid lines drawn in the image.

SPRITE-SHEET RULES (very important, my tool cuts the sheet automatically):
- Background everywhere: ONE perfectly flat pure chroma green #00FF00. No gradient, no vignette,
  no noise, no texture, no shadow. Never use #00FF00-like green on the objects themselves
  (leaves must be a darker/yellower green than the background).
- Arrange the items on an invisible strict grid. Equal cell size. Each item centred
  horizontally in its cell, its BASE/FEET resting on the same baseline near the bottom of the
  cell, with generous empty green gutters (at least 6% of the cell size) on all sides so
  neighbouring items never touch or overlap and nothing is cropped.
- Same scale for all items of the same kind (stated per sheet). Same drawing style across
  all cells. Read order: left to right, then top to bottom.
```

Câu thêm khi đính kèm ảnh đã duyệt: *"Match the style, outline thickness, lighting, camera angle and colours of the attached approved images exactly."*

---

## S01 — Nhân vật dân thường (P0) · `S01_characters_civil.png`
Output: tỉ lệ 5:4, ~2560×2048. Lưới **5 cột × 4 hàng**. Mỗi hàng = 1 nhân vật, 5 cột = 5 hướng.
Đính kèm: `chr_villager_m.png` (đã duyệt) + `assets/original/res/images/sprites/02.png`, `03.png` (đầu nhân vật gốc).

```
[Attach approved references.] Draw a character turnaround sprite sheet: 4 rows (characters)
x 5 columns (directions). In EVERY row the same character is drawn 5 times, same scale, same
standing pose (relaxed idle, arms down, empty hands), in this exact column order:
col1 facing SOUTH (toward the viewer), col2 SOUTH-EAST (3/4 turn to the right),
col3 EAST (full profile facing right), col4 NORTH-EAST (3/4 back view turned right),
col5 NORTH (back to the viewer). West-facing views are mirrored by code, do not draw them.
Every figure is full body, head-to-feet visible, feet on the baseline of the cell.
Adult characters stand ~70% of the cell height; the child ~45%; the chief ~75% and wider.

Row 1: Adult male caveman villager — EXACTLY the approved chr_villager_m design (stocky, big
round head, messy dark hair, short scruffy beard, thick eyebrows, friendly goofy grin,
one-shoulder brown fur tunic with rope belt, bare feet with leather wraps).
Row 2: Adult cavewoman villager — big round head, voluminous wavy dark hair with a bone clip,
cheerful, light-brown spotted fur dress, necklace of teeth beads, bare feet. Same body
proportions and style as row 1.
Row 3: Cave child about 6 years old — head about 1/3 of body height, tiny fur loincloth, messy
hair, mischievous smile.
Row 4: The tribe Chief — comically fat pot belly, lazy smug face, big bushy beard, large
headdress of mammoth fur with two small curved tusks and colourful feathers, sabre-tooth tiger
pelt cape, bone necklace, bare feet.
Flat #00FF00 background, 5x4 invisible grid, no text.
```

## S02 — Nhân vật vai trò + kẻ địch (P1) · `S02_characters_roles.png`
Output: tỉ lệ 5:6 (dọc), ~2048×2458. Lưới **5 cột × 6 hàng**, cùng quy tắc 5 hướng như S01 (đính kèm kết quả S01 + ảnh mẫu).

```
[Attach S01 result and the approved references.] Same sprite-sheet format and same 5 direction
columns (SOUTH, SOUTH-EAST, EAST, NORTH-EAST, NORTH) as the attached S01 sheet; same scale as
the adult villagers of S01; same drawing style, outline and lighting. 6 rows = 6 characters,
standing idle pose, empty hands (weapons are drawn separately):
Row 1: Tribe warrior — muscular, leather chest strap with bone shoulder pads, red ochre
war-paint stripes, determined frown.
Row 2: Shaman — thin old man, long white beard, bird-skull mask pushed up on the forehead,
robe of leaves and feathers, gnarled staff topped with a glowing crystal and dangling bones.
Row 3: PIA scout (Prehistoric Intelligence Agency) — lean, camouflage of leaves and twigs, green
face-paint stripes, leaf headband, sneaky self-important look.
Row 4: Enemy "cannibal" tribe warrior (cartoon villain, family friendly) — same body type as the
villagers but dark grey-purple furs, white chalk skull-like face paint, bone in a hair topknot,
necklace of small bones, funny menacing grin. Must not resemble any real ethnic group.
Row 5: Enemy cannibal chief — tall and skinny, huge black-and-red feathered headdress, dark fur
cape, white skull face paint, comically evil.
Row 6: "Jafar", scheming desert trickster — tall, thin, pointy goatee, sly smile, long
sand-coloured woven grass-and-hide cloak and wrapped hide head covering (prehistoric; avoid any
real ethnic or religious costume), curled wooden staff.
Flat #00FF00 background, 5x6 invisible grid, no text.
```

## S03 — Công trình A: nhà ở & kinh tế (P0) · `S03_buildings_core.png`
Output: tỉ lệ 3:2, ~3072×2048. Lưới **3 cột × 2 hàng**. Cửa vào luôn ở **mặt trước (hướng Nam)**.
Đính kèm: `bld_hut_l1.png` (đã duyệt) + `assets/original/res/images/sprites/` các sheet công trình gốc (nếu có).

```
[Attach the approved bld_hut_l1 reference.] Draw 6 caveman buildings, one per cell, on a 3 columns
x 2 rows grid, all in the SAME style, camera and lighting as the reference hut, front door facing
the viewer, base resting on the baseline of the cell. IMPORTANT relative scale (ground footprint
width as fraction of cell width): small hut 40%, armoury 60%, store 60%, kitchen 80%, chief hut 85%.
Row 1:
 1) Small round sleeping hut, level 1 — EXACTLY the approved bld_hut_l1 design.
 2) Same hut upgraded (level 2): low ring of stacked stones at the base, thicker thatch-and-hide
    roof, a skull flower-pot by the door, a cute heart carved on the door post.
 3) The Chief's hut, the most pompous building: large oval longhouse of thick logs and mammoth
    hides, entrance arch made of two huge mammoth tusks, a totem pole with the fat chief's face
    beside it, tiger-skin rug at the door, a stone throne under a small porch.
Row 2:
 4) Tribe storehouse: open-sided shed of wooden posts with a sloped thatch roof; visible piles of
    logs, stacked stones, bone heaps, berry baskets and a rack of spears and clubs.
 5) Tribe kitchen: open-air cooking area under a lean-to leaf roof, big stone fire pit with a
    spit roast (no flames drawn, flames are an engine effect), large clay pot on stones, long
    log table with stone plates and stump stools, firewood pile.
 6) Armoury workshop: small log-frame shed with a hide roof, big flat stone work table with
    flint chips, racks of clubs and spears.
Flat #00FF00 background, 3x2 invisible grid, no text.
```

## S04 — Công trình B: huấn luyện & đặc biệt (P1) · `S04_buildings_special.png`
Output: tỉ lệ 16:9, ~3072×1728. Lưới **4 cột × 2 hàng**. Đính kèm: S03 + ảnh mẫu.

```
[Attach S03 result + approved references.] Draw 8 more buildings with EXACTLY the style, camera,
lighting and outline of the attached S03 buildings, on a 4 columns x 2 rows grid, front facing
the viewer, bases on the cell baseline. Relative ground footprint width (fraction of cell width):
gym 90%, throwing range 90%, disco 85%, sanctuary 60%, PIA centre 75%, nursery 75%, tower 25%
(very tall and narrow), campfire 30%.
Row 1:
 1) Stone-age gym: open training yard fenced with logs, rock dumbbells, a hanging log punching
    bag, a sparring circle in the dirt, a straw training dummy.
 2) Throwing range: long fenced dirt lane, wooden thrower platform with a spear rack and a stone
    pile at the front, three straw targets shaped like a boar, a tiger and a cartoon enemy.
 3) Stone-age disco: partly open cave-like structure of stacked rocks and logs, checkered dance
    floor of polished flat stones, DJ booth of a hollow log with drums and bone percussion,
    glowing fire bowls in amber, red and green as party lights, a log bar with coconut cups.
 4) Shaman's sanctuary: small circle of standing stones with spiral carvings around a central
    altar, totem with an animal skull, smoking incense bowls, feather and bone charms, soft
    purple glow.
Row 2:
 5) PIA Centre: a hut entirely disguised as a big bush of leaves and branches, bamboo periscope
    poking out of the roof, a log obstacle course, camouflage net, a stone with an eye carving
    (no text). Funny.
 6) Nursery play pen: round fence of short logs, sandpit, a rocking toy baby mammoth carved from a
    log, a smooth stone slide, small leaf shade roof.
 7) Wooden watch tower, very tall and narrow: four lashed log legs with cross-bracing, small
    top platform with log railing and hide canopy, rope ladder.
 8) Village campfire: ring of stones and crossed logs, NO flames, three log seats around it.
Flat #00FF00 background, 4x2 invisible grid, no text.
```

## S05 — Nâng cấp công trình + công trường (P2) · `S05_buildings_upgrades.png`
Output: tỉ lệ 5:3, ~3200×1920. Lưới **5 cột × 3 hàng** (15 ô). Đính kèm: S03 + S04.

```
[Attach S03 and S04 results.] Same style, camera and lighting. 5 columns x 3 rows.
Row 1 — UPGRADED (level 2) versions of the attached buildings, same footprint and shape but
richer and sturdier, in this order: 1) kitchen: stone oven with chimney, two tables, hanging
dried meat and fish, herb bundles, bigger roof. 2) armoury: stone back wall, bone decorations,
racks with stone axes and bone maces, a net trap on the wall. 3) gym: roofed corner with a giant
boulder bench-press, climbing rope on a tall post, more dummies, a trophy skull. 4) throwing
range: roofed throwing platform, moving target on a rope, more targets. 5) disco: shiny shell
disco ball hanging from a mammoth tusk, bigger drums, fur sofa, glowing mushrooms.
Row 2 — UPGRADED (level 2): 1) sanctuary: taller stones, a small hide-roofed shaman hut behind
the altar, crystals, potted cacti. 2) PIA centre: small lookout platform, more camouflage, a map
painted on a stretched hide. 3) nursery: bigger shelter, a swing on a branch, toy dinosaur bones.
4) tower: stone-reinforced base, spiked logs, thicker roof, stone pile on the platform.
5) hut level 3: stone walls, bigger roof, two skull lanterns, flower garden.
Row 3 — CONSTRUCTION STATES for a generic building plot, three plot sizes of increasing size
(small, medium, large), each cell shows ONE state: 1) levelled dirt rectangle with rope and
corner stakes, a pile of logs and stones (small plot); 2) bare wooden frame of lashed poles with
half-built walls and a ladder (medium plot); 3) destroyed rubble: collapsed charred logs,
scattered stones, torn hides, a little smoke (large plot); 4) the same as 1 but medium plot;
5) the same as 2 but large plot.
Flat #00FF00 background, 5x3 invisible grid, no text.
```

## S06 — Thiên nhiên: cây, tài nguyên, đồ trang trí (P0) · `S06_nature.png`
Output: tỉ lệ 1:1, ~3072×3072 (hoặc lớn nhất có thể). Lưới **6 cột × 6 hàng** = 36 ô (ô có thể để trống nếu hết). Đính kèm: `bld_hut_l1.png` + ảnh mẫu.

```
[Attach approved references.] Nature sprite sheet, same style, outline, lighting and camera as
the references, 6 columns x 6 rows, each item standing on the baseline of its cell.
Row 1 (trees, broadleaf, 4 different heights) c1-c4: stylized prehistoric broadleaf trees with a
chunky twisted trunk with vines and a round fluffy canopy in two greens. c5-c6: 2 states of
a chopped tree: fresh stump with wood chips; a felled trunk lying on the ground.
Row 2 (conifers): c1-c4: 4 prehistoric pine/conifer trees with layered canopy, different heights.
c5-c6: 2 tall mossy boulders.
Row 3 (jungle and desert): c1-c3: 3 giant fern-palm (cycad) trees with scaly trunk and long
fronds. c4: dry flat-canopy acacia-like tree. c5: a dead bare tree. c6: a thorny shrub.
Row 4 (food): c1-c3 a round berry bush in 3 states: full of red berries / half picked / fully
picked (leaves only). c4-c6 a patch of edible plants (leafy greens, wild onions, roots) in 3
states: full / half / almost empty.
Row 5 (stone and bones): c1-c3 a grey stone outcrop that villagers quarry in 3 states: full
boulder cluster / partly chipped / small remains with rubble. c4-c6 a pile of big animal bones
(ribs, skull, femurs) in 3 states: big / half / a few bones.
Row 6 (decor): c1 tall impassable rock pillar, weathered with moss. c2-c3 two cartoon desert
cacti. c4-c5 two clumps of reeds and cattails for lake shores. c6 a soft pile of leaves and
flowers under a small heart-shaped bush (cute, family friendly).
Flat #00FF00 background, 6x6 invisible grid, no text.
```

## S07 — Động vật (P1) · `S07_animals.png`
Output: tỉ lệ 16:9, ~3072×1728. Lưới **5 cột × 3 hàng**, hai hàng đầu là 5 hướng. Đính kèm: ảnh mẫu + `assets/original/res/images/sprites/14.png`, `story/00.png`.

```
[Attach approved references and the original tiger/mammoth art.] Same style, outline and
lighting. Row 1: prehistoric wild boar (bristly dark-brown fur with a lighter mane ridge, big
curved tusks, small angry eyes, chunky cartoon body, short legs) drawn 5 times, standing, same
scale, in the column order SOUTH, SOUTH-EAST, EAST, NORTH-EAST, NORTH.
Row 2: sabre-tooth tiger (muscular, orange with dark stripes, cream belly, two huge curved sabre
fangs, cartoon but dangerous), same 5 directions, same scale (about 1.4x longer than the boar).
Row 3 (c1-c5): 1) dead boar lying on its side with cartoon X eyes, no blood; 2) the same boar
partly butchered, mostly bones; 3) a small pile of bones; 4) the dead tiger on its side with
cartoon X eyes, no blood; 5) a woolly mammoth standing, shaggy reddish-brown fur, big curved
tusks, gentle face (decorative; drawn at about 2.2x the boar size, so it may fill its cell).
Flat #00FF00 background, 5x3 invisible grid, no text.
```

## S08 — Địa hình (P0) · `S08_terrain.png`
**Khác** các ảnh còn lại: KHÔNG cần nền #00FF00, mỗi ô là một texture phủ kín ô. Output: tỉ lệ 1:1, ~3072×3072. Lưới **3 cột × 3 hàng** (ô ~1024 px). Đính kèm: `ter_grass.png`.
(Mình sẽ tự làm texture liền mạch bằng mirror-blend nếu model chưa liền; vì vậy hãy yêu cầu độ tương phản thấp, không có vật thể to ở giữa ô.)

```
[Attach the approved ter_grass reference.] Draw 9 ground texture swatches on a 3x3 grid, each
swatch filling its whole cell edge to edge (square, NO gutters, NO borders, NO background colour,
NO objects bigger than a pebble, no shadows). Hand-painted cartoon, same style as the reference,
seen from above with very slight perspective, even soft lighting, low contrast so it tiles well,
colour and pattern continuous up to every edge of each swatch.
Row 1: 1) lush short grass with subtle colour variation and a few tiny flowers (like the
reference), 2) dry yellow-green grass, 3) packed brown dirt with small pebbles.
Row 2: 4) forest floor: dark soil, fallen leaves, moss, twigs, 5) desert sand with soft ripples,
6) cracked dry wasteland earth, grey-brown.
Row 3: 7) flat rocky ground of grey stone slabs with cracks, 8) wet muddy sand of a lake shore
with small pebbles, 9) stylized shallow lake water, turquoise to blue, light caustic pattern.
```

## S09 — Khung & thành phần giao diện (P2) · `S09_ui_chrome.png`
Output: tỉ lệ 16:9, ~3072×1728. Lưới tự do nhưng **mỗi phần tử tách rời, cách nhau ≥ 6%**, nền #00FF00. KHÔNG chữ.
Dùng cho giao diện React: nút, panel 9-slice, thanh máu…

```
[Attach approved references; UI in the same hand-painted stone-age style: carved stone, wood,
lashed rope, bone, stitched hide, parchment. No text, no numbers, no icons inside, panels empty.]
Draw a game UI kit, every element separate on flat #00FF00 with wide gutters:
Row 1: (a) large parchment/hide menu panel with rough torn edges and a darker border, 1200x900
proportion, empty; (b) wide wooden title plank 1000x180 with lashed rope corners, empty;
(c) square stone dialog panel with carved corners 700x700, empty.
Row 2: THREE wide button plates, each in a different state, same shape, empty (no label):
normal (warm brown wood), hover (lighter and slightly glowing orange edge), pressed (darker,
inset); plus a small round stone button in the same 3 states; plus a small wooden square button
in 3 states.
Row 3: (a) horizontal progress bar frame with an empty groove 800x72 and three separate fill
strips of the same size: green (health), orange (hunger), blue (energy); (b) a speech-bubble
panel of stitched hide with a small tail to the lower-left, empty, 900x420; (c) a tooltip panel
small dark hide with a thin bone border, 420x220, empty.
Row 4: portrait frames: a round bone-ringed frame 360x360 and a square carved stone frame
360x360 (empty centres, drawn on #00FF00 there too); a selection ring (thin ellipse in white-gold,
transparent centre drawn as #00FF00) 400x200; a corner-ornament pair (bone/vine) 300x300.
Row 5: 6 mouse-cursor graphics 128x128 each: normal arrow made of a bone pointing up-left;
command cursor (green arrow); attack cursor (red crossed clubs); gather cursor (open hand);
build cursor (hammer); forbidden cursor (red circle with slash).
```

## S10 — Icon tài nguyên / kỹ năng / lệnh / vũ khí / hàng mang (P2) · `S10_icons_items.png`
Output: tỉ lệ 4:3, ~3072×2304. Lưới **8 cột × 6 hàng** = 48 ô icon vuông (mỗi icon ~256 px, hiển thị 32-64 px nên **hình đơn giản, viền dày, dễ đọc**). KHÔNG chữ.

```
[Attach approved references.] Icon sheet, 8 columns x 6 rows of square icons on flat #00FF00,
each icon centred in its cell, bold simple silhouette, thick dark-brown outline (#2B2014),
2-tone cel shading, readable at 32 px, same style as the references. No text or numbers.
Row 1 (resources + stats, c1-c8): food (roast meat on a bone), wood (3 logs), stone (grey rock),
bone (crossed bones), population (two small cavemen heads), living space (small hut), happiness
(smiley face), hit points (red heart).
Row 2 (skills, c1-c8): melee skill (club), throwing skill (spear in flight), scouting (eye),
harvesting (basket of berries), building (hammer on log), weaponsmithing (anvil-stone with spark),
cooking (clay pot), witchcraft (glowing crystal).
Row 3 (skills/status, c1-c8): DJ skill (drum), healing (green leaf cross), hunger (growling
stomach), tiredness (sleepy Z-less moon), speed (running footprints), guard (shield of hide),
idle (hourglass of sand), carrying (small bundle).
Row 4 (weapons, c1-c6 shown at item size) wooden club, round throwing stone, flint-tipped spear,
stone axe, bone mace, bone tomahawk with red feather; c7 net trap (armed), c8 spring trap (armed).
Row 5 (cargo, c1-c8): bundle of 3 logs, block of stone, leg of meat on the bone, basket of berries,
armful of green plants, two fish on a string, bundle of bones, steaming meal on a stone plate.
Row 6 (commands + effects, c1-c8): build (hammer+log), call to arms (horn), form up (flag),
upgrade (up arrow of stones), repair (patch/rope), demolish (crossed pick and crack), pit trap
(armed), rally flag (hide banner on a pole with a painted hand print).
```

---

## Sau khi bạn có ảnh
1. Lưu vào `assets/hd/source/sheets/` (tạo thư mục nếu chưa có), đúng tên file ở từng mục.
2. Chạy (cần `pip install pillow`):
   ```
   python3 tools/slice_sheets.py S01 --dry-run   # xem phát hiện được gì, ghi ảnh khung vào sheets/_debug/S01.png
   python3 tools/slice_sheets.py S01             # cắt + ghi assets/hd/source/<nhóm>/<ID>.png + thêm mục optional vào manifest.json
   ```
   Bỏ tên sheet để xử lý tất cả. Tool **không ghi đè** file đã có (ba ảnh mẫu đã duyệt được bảo vệ); thêm `--force` nếu muốn thay.
3. Mở game (`npm run dev`): ID nào renderer đã hỗ trợ (`chr_*`, `ani_boar/tiger`, `nat_tree_*`, `bld_*`, `ter_*`) sẽ tự hiện; các ID mới (`nat_berrybush`, `nat_rock_quarry`, icon UI…) cần thêm code render ở các bước sau.
4. Nếu tool báo số vật thể không khớp: mở `_debug/Sxx.png` (khung tím + số thứ tự). Nguyên nhân thường gặp: model vẽ hai vật thể dính nhau, hoặc quên một ô → nhờ Gemini vẽ lại ô đó với khoảng cách rộng hơn (xem mục 5 phần "Cách dùng"). Riêng hàng nhân vật 5 hướng dính nhau là bình thường: loader tự tách theo cột.
5. S09 (khung UI) tách với `gap=0` thành 30 thành phần có tên cố định (xem `UI_CHROME_NAMES` trong tool). S08 (địa hình): tool tự làm texture liền mạch (trộn với bản dịch nửa ô) và bỏ 1.5% mép mỗi ô. S09/S10 (UI): tool tách nền xanh sẵn thành PNG trong suốt vào `assets/hd/source/ui/` để React dùng như `<img>`.

> **Lưu ý kỹ thuật:** đồ hoạ HD chạy trên renderer 2D PixiJS của thư mục này. Bản `5_prehistoric_tribes_react` dùng engine gốc vẽ sprite 240×320 theo bảng composite nên không thay trực tiếp được.
> Hoạt ảnh (đi, chặt cây, đánh…) không có trong 10 ảnh: renderer tạo bằng code (nhún, nghiêng, thở). Nếu còn quota, ảnh thứ 11 nên là sheet walk-cycle của dân làng.
