# 04 — Prompt tạo tài nguyên cho Gemini (Prehistoric Tribes 3D)

> ⏸ **HOÃN (D-07):** đang làm bản 2D trước — dùng `05_GEMINI_2D_ASSET_PROMPTS.md`. File này giữ cho giai đoạn 3D. Các mục 6 (texture), 8 (UI), 9 (key art) vẫn dùng được cho bản 2D.

> **Cách dùng (tiếng Việt cho người vận hành)**
> 1. Mỗi phiên chat với Gemini: **dán khối `GLOBAL STYLE` ở mục 0 trước**, sau đó dán từng prompt asset. Giữ cùng 1 cuộc hội thoại cho cùng 1 nhóm (vd. toàn bộ công trình) để phong cách đồng nhất.
> 2. Khi prompt ghi `ATTACH:` → đính kèm ảnh gốc từ `5_prehistoric_tribes_react/public/res/images/...` làm tham chiếu.
> 3. Gemini tạo **ảnh**. Ảnh nhóm 3D (mục 1–5) là *ảnh tham chiếu* để đưa qua công cụ image-to-3D (Meshy / Tripo / Hunyuan3D / Rodin) → xuất `.glb`. Ảnh nhóm 6–9 (texture, FX, UI) dùng trực tiếp.
> 4. Lưu file đúng tên ở cột **ID** (vd. `bld_hut_l1__hero.png`) vào `6_prehistoric_tribes_3d/assets/source/<nhóm>/`. Agent 3D sẽ map ID → model qua `assets/manifest.json`.
> 5. Ưu tiên: làm hết **P0** trước (đủ cho Level 0 / vertical slice), rồi P1, P2.
> 6. Nền: yêu cầu nền **trắng trơn #FFFFFF** (cho image-to-3D) hoặc **xanh chroma #00FF00** (cho icon/FX cần tách nền). Gemini thường không xuất PNG trong suốt thật.

---

## 0. GLOBAL STYLE (dán đầu mỗi phiên)

```
You are the art director for "Prehistoric Tribes 3D", a comedic Stone-Age village-builder / RTS
seen from a tilted top-down RTS camera (about 50° pitch). It remakes a 2005 mobile game whose
art is cheerful hand-drawn cartoon: chunky big-headed cavemen, warm saturated greens and earthy
browns, goofy humour (lazy pot-bellied chief, disco in a cave age, "tigerilla" drinks).

STYLE RULES for every image I ask for:
- Stylized 3D cartoon look, like a modern mobile/indie strategy game (think stylized low-poly
  with hand-painted textures; soft rounded silhouettes, chunky proportions, slightly exaggerated).
- Readability first: clear silhouette recognisable at small size from a high top-down angle.
- Palette: grass greens (#6DA83A, #3F7A2A), earth browns (#7A4E2A, #A8743F), warm stone greys
  (#9A9286), bone ivory (#E9DCC0), fire orange accent (#F2B33D), sky blue water (#4FA6D8).
- Materials: wood with visible grain and lashings of rope/vines, stones rounded and stacked,
  hides/furs stitched with sinew, bones as decoration, thatch of straw/leaves.
- Lighting: soft neutral studio light from upper-left, gentle ambient occlusion, no harsh
  shadows, no dramatic coloured lights (lighting is done in the engine).
- No text, no logos, no watermarks, no UI, no ground clutter unless asked, no cropped parts.
- Humour is gentle and family-friendly. Humans are diverse but NEVER ethnic caricatures;
  "enemy tribe" characters are distinguished by costume colour and face-paint only.
- Consistent scale reference: 1 map tile = 1 metre square; adult caveman ≈ 1.7 m tall with
  big head (head ≈ 1/4 of body height).
```

### Định dạng ảnh dùng cho image-to-3D (gọi là `HERO` và `TURNAROUND`)
```
HERO: single object, 3/4 front view from 30° above, centered, full object visible with 10% margin,
plain pure white #FFFFFF background, no shadow on the background, 2048x2048.

TURNAROUND: one image, 2048x1024, same object shown 4 times in a row on pure white background:
front, right side, back, top-down. Orthographic look, identical scale and pose in all 4 views,
no perspective distortion, no overlapping.
```
Với nhân vật: **A-pose** (tay dang ~45°), đứng thẳng, nhìn thẳng — để rig (Mixamo / AccuRig).

---

## 1. NHÂN VẬT (characters) — xuất HERO + TURNAROUND, A-pose

Ghi chú kỹ thuật cho bước 3D: ≤ 4k tris / nhân vật, 1 texture 1024², rig humanoid chuẩn. Phụ kiện (vũ khí, hàng mang) là mesh riêng gắn vào xương tay (mục 2).
Animation cần (lấy từ Mixamo hoặc tự làm): `idle, walk, run, chop, mine, gather_low, carry_walk, build_hammer, attack_melee, throw, hit, die, sleep_lying, dance, cook_stir, fish_spear, cheer, kiss, sit_eat, strike_protest (arms crossed, angry)`.

| ID | P | Prompt (dán sau GLOBAL STYLE) |
|---|---|---|
| `chr_villager_m` | P0 | `Adult male caveman villager, A-pose. Stocky, big round head, messy dark hair and short scruffy beard, thick eyebrows, friendly goofy grin. Wears a simple one-shoulder brown fur tunic tied with a rope belt, bare feet with leather wraps. Generic worker, no weapon. ATTACH: sprites/02.png (male heads) as face reference.` |
| `chr_villager_f` | P0 | `Adult female cavewoman villager, A-pose. Big round head, voluminous wavy dark hair tied with a bone clip, cheerful expression. Wears a light-brown spotted fur dress (one shoulder) and a small necklace of teeth beads, bare feet with leather wraps. No weapon. ATTACH: sprites/03.png (female heads).` |
| `chr_child` | P0 | `Cave child (around 6 years old), A-pose, very big head relative to body (head ≈ 1/3 height), height ≈ 1.0 m, tiny fur loincloth, messy hair, mischievous smile, holding nothing.` |
| `chr_chief` | P0 | `Tribal Chief, A-pose. Comically fat pot belly, lazy smug expression, big bushy beard, wears a large headdress of mammoth fur with two curved tusks and colourful feathers, a striped sabre-tooth tiger pelt cape, a bone necklace. Clearly the most important (and laziest) person in the village. ATTACH: icon.png (chief holding a tiger) for character reference.` |
| `chr_shaman` | P1 | `Tribal Shaman, A-pose. Thin old man, long white beard, wild eyes, wears a skull-like bird mask pushed up on his forehead, robe of leaves and feathers, carries a gnarled wooden staff topped with a glowing crystal and dangling bones, small pouches of herbs on belt, a cactus slice sticking out of one pouch.` |
| `chr_scout` | P1 | `PIA scout ("Prehistoric Intelligence Agency"), A-pose. Lean athletic caveman, camouflage outfit of leaves and twigs, face paint in green stripes, a leaf headband, crouched-ready posture but still A-pose arms, looks sneaky and a bit self-important like a stone-age secret agent.` |
| `chr_warrior` | P1 | `Tribe warrior, A-pose. Muscular caveman, leather chest strap with bone shoulder pads, red ochre war paint stripes on cheeks, determined frown. Hands empty (weapons are separate props).` |
| `chr_cook` | P2 | `Tribe cook variant of the male villager: chubby, wears a leaf apron with stains and a tall rolled-leaf chef hat. A-pose.` |
| `chr_dj` | P2 | `Tribe DJ variant: cool caveman with sunglasses carved from dark stone, a fur scarf, bone headphones (two shells joined with a bone band). A-pose.` |
| `chr_armourer` | P2 | `Tribe armourer variant: burly, singed fur apron, thick leather gloves, soot on face. A-pose.` |
| `chr_elder` | P2 | `Tribe elder (Mumbo the advisor): thin, bald with grey side hair, long thin moustache, holds nothing, wears a dignified fur robe with bead tassels, slightly nervous expression. A-pose.` |
| `chr_enemy_m` | P1 | `Enemy "cannibal" tribe warrior (cartoon villain, family friendly). Same body base as the villagers but: dark grey-purple fur clothing, white chalk face paint pattern like a grinning skull, a bone tied in the hair topknot, necklace of small bones, menacing but funny grin. A-pose, empty hands. Must NOT resemble any real-world ethnic group.` |
| `chr_enemy_chief` | P1 | `Enemy cannibal chief, A-pose: tall and skinny (contrast with our fat chief), huge feathered headdress in black and red, cape of dark fur, white skull face paint, holds nothing, comically evil look.` |
| `chr_jafar` | P2 | `"Jafar", a scheming wandering trickster of the desert tribe: tall, thin, pointy goatee, sly smile, wears a long sand-coloured woven cloak and a wrapped cloth head-covering made of hide and woven grass (prehistoric, not modern), carries a curled wooden staff. Villain but comedic. Avoid any real-world ethnic or religious costume. A-pose.` |

### 1b. Chân dung UI (portraits) — dùng trực tiếp, không cần 3D
| ID | P | Prompt |
|---|---|---|
| `ui_portrait_m_01..16` | P1 | `Circular character portrait icon, 512x512, head and shoulders, of a cartoon caveman villager in the game style, plain #00FF00 background. Make 16 different men (variety of hair, beards, ages, skin tones, expressions) on a 4x4 grid, each in its own equal cell, no borders. ATTACH: sprites/02.png` |
| `ui_portrait_f_01..12` | P1 | `Same as above but 12 different cavewomen on a 4x3 grid. ATTACH: sprites/03.png` |
| `ui_portrait_child_01..06` | P2 | `Same style, 6 cave children on a 3x2 grid.` |
| `ui_portrait_roles` | P1 | `Same style, 6 portraits on a 3x2 grid: our fat Chief, the Shaman, a PIA Scout, the Elder advisor, the Cannibal chief, Jafar.` |

---

## 2. ĐẠO CỤ, VŨ KHÍ, HÀNG MANG (props) — HERO, nền trắng, 1024²

Ghi chú 3D: ≤ 500 tris mỗi cái, gốc (pivot) ở vị trí nắm tay.

| ID | P | Prompt |
|---|---|---|
| `prop_club` | P0 | `Prehistoric wooden club, thick gnarled branch, wider at the striking end, leather grip wrap. HERO.` |
| `prop_stone_ammo` | P1 | `Fist-sized round throwing stone, smooth grey river stone. Also show a small pile of 5 of them next to it. HERO.` |
| `prop_spear` | P0 | `Prehistoric spear: straight wooden shaft, knapped flint spearhead tied with sinew, a small feather tuft. HERO, horizontal.` |
| `prop_stone_axe` | P1 | `Stone axe: wooden handle, chipped grey stone head lashed with leather straps. HERO.` |
| `prop_bone_mace` | P1 | `Bone mace: thick wooden handle, head made of a large animal knuckle bone with bone spikes tied around it. HERO.` |
| `prop_tomahawk` | P2 | `Throwing tomahawk: short wooden handle, sharp polished bone blade, red feather decoration. HERO.` |
| `prop_cargo_wood` | P0 | `Bundle of 3 chopped logs tied with vine, carried on shoulder. HERO.` |
| `prop_cargo_stone` | P0 | `Single chunky block of grey quarried stone, carried in two hands. HERO.` |
| `prop_cargo_meat` | P0 | `Cartoon leg of raw meat on the bone ("drumstick" shape). HERO.` |
| `prop_cargo_berries` | P0 | `Small woven grass basket full of red and purple berries. HERO.` |
| `prop_cargo_plants` | P1 | `Armful of green edible leafy plants and roots tied together. HERO.` |
| `prop_cargo_fish` | P1 | `Two fish hanging from a short string. HERO.` |
| `prop_cargo_bones` | P1 | `Small bundle of animal bones tied with sinew. HERO.` |
| `prop_meal` | P1 | `Cooked meal on a flat stone plate: roasted meat, berries and leaves, steam. HERO.` |
| `prop_love_token` | P2 | `Cute love token: a flower crown made of wildflowers with a small heart-shaped stone. HERO.` |

### 2b. Bẫy (traps) — mỗi bẫy 2 trạng thái: `armed` (đặt sẵn, ngụy trang) và `sprung` (đã sập)
| ID | P | Prompt |
|---|---|---|
| `trap_net_armed` / `_sprung` | P1 | `Net trap on 1x1 m of ground: (armed) a woven vine net hidden under scattered leaves with a bent sapling trigger; (sprung) the net pulled up into a bundle hanging from the sapling. Show both versions side by side, labelled only by position (left armed, right sprung), white background.` |
| `trap_spring_armed` / `_sprung` | P1 | `Spring trap 1x1 m: (armed) a bent log held by a peg trigger, spikes facing outward, leaves on top; (sprung) the log swung down, spikes exposed. Both side by side, white background.` |
| `trap_pit_armed` / `_sprung` | P2 | `Pit trap 1x1 m: (armed) square of thin sticks covered with grass; (sprung) open dark pit with sharpened stakes visible inside and broken sticks around the rim. Both side by side, white background.` |

---

## 3. CÔNG TRÌNH (buildings) — HERO + TURNAROUND cho mỗi cấp

Kích thước nền (footprint) lấy từ dữ liệu game, **1 ô = 1 m**. Chiều cao gợi ý để đồng nhất tỷ lệ. Mỗi công trình cần thêm (sau khi có cấp 1):
- `__construct_a` (nền + cọc, 0–50%), `__construct_b` (khung gỗ, 50–99%) → có thể dùng 1 prompt chung ở mục 3b.
- `__ruin` (bị phá huỷ) → prompt chung 3b.
- Bản **địch** (`_enemy`) → cùng model, đổi texture: lông thú đen tím, sơn trắng hình đầu lâu, xương trang trí. Prompt mẫu ở cuối bảng.

Ghi chú 3D: cấp 1 ≤ 3k tris, cấp 2–3 ≤ 5k tris; mặt đáy phẳng đúng footprint, pivot ở tâm đáy; cửa vào ở **mặt trước (hướng camera, phía nam-đông)**.

| ID | Footprint | P | Prompt |
|---|---|---|---|
| `bld_hut_l1` | 2×2, cao ~2.2 m | P0 | `Small round caveman hut for sleeping, 2x2 m footprint: dome frame of curved branches covered with brown animal hides stitched together, a few large bones holding the hides down, low door opening covered by a hanging fur flap, a smoke hole on top. Cosy and humble. Houses 4 people. HERO and TURNAROUND.` |
| `bld_hut_l2` | 2×2 | P1 | `Upgraded version of the same hut: walls now have a low ring of stacked stones at the base, thicker thatch-and-hide roof, a little flower pot made from a skull by the door, a heart carved in the door post (it's where couples have babies, keep it cute and family friendly). HERO and TURNAROUND.` |
| `bld_chief_hut` | 4×4, cao ~4 m | P0 | `The Chief's hut, 4x4 m: the biggest and most pompous building in the village. Large oval longhouse of thick logs and mammoth hides, entrance framed by two huge mammoth tusks forming an arch, a totem pole beside it with a carving of the fat chief's face, tiger-skin rug at the door, a comfy stone throne visible under a small porch. Elders meet here. HERO and TURNAROUND.` |
| `bld_store_l1` | 3×3, cao ~3 m | P0 | `Tribe storehouse, 3x3 m: open-sided shed of wooden posts with a sloped thatch roof; inside and around are visible piles of logs, stacked stones, bone heaps, berry baskets and a wooden rack holding spears and clubs. All resources and weapons are stored here. HERO and TURNAROUND.` |
| `bld_kitchen_l1` | 4×3, cao ~2.5 m | P0 | `Tribe kitchen, 4x3 m: open-air cooking area under a lean-to roof of leaves on wooden posts, a big stone fire pit with a spit-roast, a large clay pot on stones, a long log table with stone plates and tree-stump stools for eating, a pile of firewood. HERO and TURNAROUND.` |
| `bld_kitchen_l2` | 4×3 | P1 | `Upgraded kitchen: stone-walled oven with chimney, two tables, hanging dried meats and fish, herb bundles, bigger roof. HERO and TURNAROUND.` |
| `bld_armoury_l1` | 3×2, cao ~2.5 m | P0 | `Armoury workshop, 3x2 m: a small workshop shed with a sturdy log frame and hide roof, a large flat stone anvil/work table with flint chips, wooden racks holding clubs and spears, a bundle of sticks. HERO and TURNAROUND.` |
| `bld_armoury_l2` | 3×2 | P1 | `Upgraded armoury: added stone back wall, bone decorations, racks with stone axes and bone maces, a net trap hanging on the wall. HERO and TURNAROUND.` |
| `bld_armoury_l3` | 3×2 | P2 | `Fully upgraded armoury: stone and timber building, a small furnace-like fire pit for hardening wood, tomahawks and spring-trap parts displayed proudly, a carved crossed-weapons emblem above the door. HERO and TURNAROUND.` |
| `bld_gym_l1` | 5×4, cao ~2.5 m | P1 | `Stone-age gym ("for muscles"), 5x4 m open training yard fenced with logs: stone dumbbells (two rocks on a stick), a hanging log punching bag, a sparring circle drawn in the dirt, a wooden dummy with a straw head. HERO and TURNAROUND.` |
| `bld_gym_l2` | 5×4 | P2 | `Upgraded gym: added roofed corner with a giant boulder bench-press, climbing rope on a tall post, more dummies, a trophy skull. HERO and TURNAROUND.` |
| `bld_range_l1` | 6×4, cao ~2 m | P1 | `Throwing practice range, 6x4 m: long fenced lane of packed dirt, at one end a wooden platform for throwers with a rack of spears and a pile of stones, at the other end 3 straw targets shaped like a boar, a tiger and a cartoon enemy. HERO and TURNAROUND.` |
| `bld_range_l2` | 6×4 | P2 | `Upgraded range: raised throwing platform with roof, moving target on a rope, more targets. HERO and TURNAROUND.` |
| `bld_disco_l1` | 5×4, cao ~3.5 m | P1 | `Stone-age disco club, 5x4 m: a large partly open cave-like structure of stacked rocks and logs, a dance floor of polished flat stones in a checker pattern, a DJ booth made of a hollow log with drums and bone percussion, glowing fire bowls in different coloured stones (amber, red, green) as party lights, a bar counter made from a log with coconut cups ("tigerilla" drinks). Funny and lively. HERO and TURNAROUND.` |
| `bld_disco_l2` | 5×4 | P2 | `Upgraded disco: a big mirrored disco ball made of shiny shell pieces hanging from a mammoth tusk, bigger drums, fur sofa, neon-like glowing mushrooms. HERO and TURNAROUND.` |
| `bld_sanctuary_l1` | 3×3, cao ~3.5 m | P1 | `Shaman's sanctuary, 3x3 m: a small circle of standing stones with spiral carvings around a central altar stone, a totem with an animal skull, smoking incense bowls, hanging feather and bone charms, a mysterious soft purple glow. HERO and TURNAROUND.` |
| `bld_sanctuary_l2` | 3×3 | P2 | `Upgraded sanctuary: taller stones, a hide-roofed hut for the shaman behind the altar, crystals, potted cacti. HERO and TURNAROUND.` |
| `bld_pia_l1` | 4×4, cao ~3 m | P1 | `PIA Centre (Prehistoric Intelligence Agency), 4x4 m: secret-agent HQ disguised as a bush: a hut completely covered in leaves and branches, a lookout periscope made of a hollow bamboo tube sticking out of the roof, an obstacle course of logs and a camouflage net, a sign-like stone with an eye carving (no text). Humorous. HERO and TURNAROUND.` |
| `bld_pia_l2` | 4×4 | P2 | `Upgraded PIA centre: added a small watch platform, more camouflage, a map painted on a hide stretched on a frame. HERO and TURNAROUND.` |
| `bld_nursery_l1` | 4×4, cao ~2 m | P1 | `Nursery play pen for cave kids, 4x4 m: a round fence of short logs, inside a sandpit, a rocking toy shaped like a baby mammoth carved from a log, a slide made of a smooth tilted stone, a small shade roof of leaves. Cute. HERO and TURNAROUND.` |
| `bld_nursery_l2` | 4×4 | P2 | `Upgraded nursery: bigger shelter, swing hanging from a branch, toy dinosaur bones. HERO and TURNAROUND.` |
| `bld_tower_l1` | 1×1, cao ~5 m | P1 | `Wooden watch tower, 1x1 m base, ~5 m tall: four lashed log legs with cross-bracing, a small platform on top with a log railing and a hide canopy, a rope ladder. Room for 2 guards. HERO and TURNAROUND.` |
| `bld_tower_l2` | 1×1 | P2 | `Upgraded tower: stone-reinforced base, spiked logs around, thicker roof, a pile of stones for throwing on the platform. HERO and TURNAROUND.` |
| `bld_love_nest` | 1×1 | P2 | `Tiny romantic spot: a soft pile of leaves and flowers under a small bush shaped like a heart, family friendly. HERO.` |
| `bld_campfire` | 1×1 | P1 | `Village campfire: ring of stones, crossed logs, (fire itself is a separate FX) with 3 log seats around. HERO.` |
| `bld_cave_entrance` | 6×4 | P1 | `Large icy cave mouth in a rocky cliff, icicles melting at the top, the cave where the tribe lived during the ice age, used at the start of the story. HERO.` |

**Prompt mẫu biến thể địch** (dán sau khi đã có ảnh bản người chơi, đính kèm ảnh đó):
```
ATTACH: <our building image>. Recreate exactly the same building (same shape, same footprint and
proportions) but for the enemy cannibal tribe: replace brown hides with dark grey-purple furs,
add white chalk skull-like paint marks, small bone and skull decorations, red ochre stripes on
the wood. Keep it cartoon and family friendly. HERO and TURNAROUND.
```

### 3b. Trạng thái xây dựng & đổ nát (dùng chung, scale theo footprint)
| ID | P | Prompt |
|---|---|---|
| `bld_site_a_{WxH}` | P0 | `Construction site stage 1 on a {W}x{H} m plot: levelled dirt square marked with a rope and wooden stakes at the corners, a pile of logs and stones beside it, a stone hammer lying on the ground. HERO.` (tạo cho 1×1, 2×2, 3×2, 3×3, 4×3, 4×4, 5×4, 6×4) |
| `bld_site_b_{WxH}` | P0 | `Construction site stage 2 on a {W}x{H} m plot: bare wooden frame of lashed poles rising, half-built walls, a ladder, scattered tools. HERO.` |
| `bld_ruin_{WxH}` | P1 | `Destroyed building rubble on a {W}x{H} m plot: collapsed charred logs, scattered stones and torn hides, a little smoke. HERO.` |

---

## 4. ĐỘNG VẬT (animals) — HERO + TURNAROUND, tư thế đứng trung tính

Ghi chú 3D: ≤ 4k tris, rig 4 chân. Animation: `idle, walk, run, attack, hit, die, eat_graze`; lợn thêm `flee`; chim `fly_loop`.

| ID | P | Prompt |
|---|---|---|
| `ani_boar` | P0 | `Prehistoric wild boar, about 1.6 m long: bristly dark brown fur with a lighter mane ridge, big curved tusks, small angry eyes, cartoon chunky body, short legs. Neutral standing pose. HERO and TURNAROUND.` |
| `ani_tiger` | P0 | `Sabre-tooth tiger (Smilodon), about 2.2 m long: muscular, orange fur with dark stripes, cream belly, two huge curved sabre fangs, cartoon but dangerous expression. Neutral standing pose. HERO and TURNAROUND. ATTACH: sprites/14.png and story/00.png for the original look.` |
| `ani_mammoth` | P1 | `Woolly mammoth, about 4 m tall: shaggy reddish-brown fur, big curved tusks, small ears, domed head, gentle cartoon expression. Neutral standing pose. HERO and TURNAROUND. ATTACH: story/00.png` |
| `ani_bird_giant` | P2 | `Giant prehistoric bird (pterosaur-like, ambient flying creature), wings spread in flight pose, 6 m wingspan, earthy colours. HERO (top view and side view).` |
| `ani_fish` | P1 | `Small cartoon river fish, 30 cm, silver-blue with orange fins, side view and top view, white background.` |
| `obj_carcass_boar` | P0 | `Hunted boar lying on its side, cartoon (not gory): eyes as X marks, some meat cuts visible as simple shapes, no blood. HERO.` |
| `obj_carcass_tiger` | P1 | `Same idea for a sabre-tooth tiger lying on its side, cartoon X eyes, no blood. HERO.` |

---

## 5. THIÊN NHIÊN & TÀI NGUYÊN (nature / resource nodes) — HERO

Mỗi nút tài nguyên cần **3 giai đoạn** cạn dần (`_s0` đầy, `_s1` vơi, `_s2` gần hết / gốc cây). Ghi chú 3D: cây ≤ 1.5k tris (sẽ instancing hàng nghìn cây), đá ≤ 800 tris.

| ID | P | Prompt |
|---|---|---|
| `nat_tree_broadleaf_{a,b,c}` | P0 | `Stylized prehistoric broadleaf tree, 5–7 m tall, chunky twisted trunk with vines, round fluffy canopy clumps in two greens. Make 3 variations side by side (different heights and canopy shapes), white background. ATTACH: sprites/07.png` |
| `nat_tree_conifer_{a,b}` | P0 | `Stylized prehistoric conifer / pine tree, 6–8 m tall, layered triangular canopy. 2 variations side by side, white background.` |
| `nat_tree_jungle_{a,b}` | P1 | `Prehistoric jungle tree: giant fern-palm (cycad-like) with a scaly trunk and long fronds; 2 variations side by side, white background.` |
| `nat_tree_desert_{a,b}` | P1 | `Dry desert tree (acacia-like flat canopy) and a dead bare tree, side by side, white background.` |
| `nat_tree_stump` | P0 | `Chopped tree stump with a few wood chips and an axe mark, 0.6 m wide. HERO.` |
| `nat_berrybush_s0/s1/s2` | P0 | `Round berry bush 1.2 m wide loaded with red berries; show 3 states side by side: full of berries, half picked, completely picked (only green leaves). White background.` |
| `nat_plants_s0/s1/s2` | P1 | `Patch of wild edible plants (big leafy greens, wild onions, roots) on 1x1 m; 3 states side by side: full, half, almost empty. White background.` |
| `nat_rock_quarry_s0/s1/s2` | P0 | `Grey stone outcrop that villagers quarry for stones, 1.5 m tall; 3 states side by side: full boulder cluster, partly chipped, small remains with rubble. White background.` |
| `nat_bones_s0/s1/s2` | P1 | `Pile of large animal bones (ribs, skull, femurs), 1.2 m wide; 3 states side by side: big pile, half, a few bones. White background.` |
| `nat_tall_rock` | P1 | `Tall impassable rock pillar / boulder, 3 m tall, weathered with moss. HERO.` |
| `nat_boulder_{a,b,c}` | P1 | `3 decorative boulders of different shapes, mossy, side by side, white background.` |
| `nat_fish_shoal` | P1 | `Top-down view of a circular patch of water surface with ripples and a few fish shadows and small splashes, 2 m wide, on #00FF00 background (water itself rendered in engine; this is a decal).` |
| `nat_grass_tufts` | P0 | `Sheet of 12 small grass tufts, flowers, and tiny bushes for ground scatter, each separate, arranged on a 4x3 grid, #00FF00 background.` |
| `nat_reeds` | P1 | `Sheet of 6 clumps of reeds and cattails for shores, 3x2 grid, #00FF00 background.` |
| `nat_cactus_{a,b}` | P2 | `2 cartoon desert cacti (saguaro-like and round barrel), side by side, white background.` |
| `nat_cliff_kit` | P2 | `Modular rocky cliff pieces for terrain edges: straight wall, outer corner, inner corner, ramp; 4 pieces side by side, consistent height 3 m, white background.` |
| `nat_waterfall` | P2 | `Small rocky waterfall feature (cliff with falling water and a pool at the base), like the illustration attached. HERO. ATTACH: story/00.png` |

---

## 6. TEXTURE ĐỊA HÌNH (dùng trực tiếp) — seamless, 1024×1024, nhìn từ trên xuống

Prompt chung: `Seamless tileable top-down ground texture, 1024x1024, stylized hand-painted game texture matching the game style, even lighting, no shadows from objects, no perspective, tiles perfectly on all edges.`
| ID | P | Thêm vào prompt |
|---|---|---|
| `tex_grass` | P0 | `lush short grass with subtle variation and a few tiny flowers` |
| `tex_grass_dry` | P1 | `dry yellow-green grass` |
| `tex_dirt` | P0 | `packed brown dirt path with small pebbles` |
| `tex_forest_floor` | P0 | `forest floor: dark soil, fallen leaves, moss, twigs` |
| `tex_sand` | P1 | `desert sand with soft ripples` |
| `tex_wasteland` | P1 | `cracked dry wasteland earth, grey-brown` |
| `tex_rock_ground` | P1 | `flat rocky ground, grey stone slabs with cracks` |
| `tex_shore` | P0 | `wet muddy sand of a lake shore with small pebbles` |
| `tex_mud` | P2 | `dark wet mud with puddles` |
| `tex_snow` | P2 | `old melting snow with patches of grass showing (end of ice age)` |
| `tex_water_color` | P0 | `clear stylized shallow lake water seen from above, turquoise to blue, light caustic pattern` |
| `tex_water_normal` | P1 | `Seamless tileable water normal map (purple-blue tangent-space normal map) of gentle small ripples, 1024x1024` |
| `tex_cliff_side` | P2 | `vertical rock cliff face texture, layered sediment, seamless horizontally` |

---

## 7. HIỆU ỨNG (FX sprites) — #00FF00 nền, dạng sprite sheet

| ID | P | Prompt |
|---|---|---|
| `fx_fire_sheet` | P0 | `Stylized cartoon campfire flame animation, 8 frames in a 4x2 grid, each 256x256, loopable, #00FF00 background.` |
| `fx_smoke_sheet` | P0 | `Soft cartoon smoke puff animation, 8 frames 4x2 grid, grey-white, #00FF00 background.` |
| `fx_dust_sheet` | P0 | `Cartoon dust cloud puff (for building and footsteps), 8 frames 4x2 grid, #00FF00 background.` |
| `fx_hit_star` | P0 | `Cartoon comic impact burst ("pow" star shape, no text) in yellow-orange, 4 variations, #00FF00 background.` |
| `fx_heal_sparkles` | P1 | `Green-gold healing sparkles and small plus-shaped glints rising, 8 frames 4x2, #00FF00 background.` |
| `fx_defence_shield` | P1 | `Translucent blue magical dome shield with tribal rune pattern, top and side view, #00FF00 background.` |
| `fx_love_hearts` | P1 | `Floating pink cartoon hearts (love potion effect), 8 frames 4x2, #00FF00 background.` |
| `fx_disease_cloud` | P1 | `Sickly green swirling cartoon plague cloud with tiny skull-shaped bubbles (cute, not scary), 8 frames 4x2, #00FF00 background.` |
| `fx_splash` | P1 | `Water splash animation (stone or spear hitting water), 8 frames 4x2, #00FF00 background.` |
| `fx_wood_chips`, `fx_stone_chips` | P1 | `Small flying wood chips / stone chips particles sheet, 12 different pieces on a grid, #00FF00 background.` |
| `fx_clouds` | P2 | `6 fluffy cartoon clouds seen from above for cloud shadows/overlay, white on #00FF00 background. ATTACH: sprites/16.png` |
| `fx_build_complete` | P2 | `Celebration burst with confetti-like leaves and flower petals, 8 frames 4x2, #00FF00 background.` |

---

## 8. GIAO DIỆN (UI) — dùng trực tiếp

**Phong cách UI chung** (dán thêm sau GLOBAL STYLE):
```
UI style: modern clean game UI with a Stone-Age theme. Panels look like smooth polished slate
or light parchment-coloured hide stretched in a thin wooden frame with rope corners; flat, crisp,
readable at small sizes, subtle inner shadow, no heavy 3D bevels. Accent colour fire orange #F2B33D.
Icons: bold simple shapes, thick dark-brown outline (#2B2014), cel-shaded, readable at 32x32.
```
| ID | P | Prompt |
|---|---|---|
| `ui_logo` | P0 | `Game logo "PREHISTORIC TRIBES" made of chunky carved stone letters with moss and a small bone, two lines (PREHISTORIC / TRIBES), transparent-ready #00FF00 background, 2048x1024. ATTACH: sprites/18.png (original logo)` (*chữ trong logo là ngoại lệ được phép*) |
| `ui_icons_resources` | P0 | `Icon sheet, 8 icons on a 4x2 grid, each 256x256, #00FF00 background: raw food (meat + berries), cooked meal (steaming plate), wood (logs), stones, bones, population (two caveman heads), living space (hut), happiness (smiling face). ATTACH: sprites/00.png` |
| `ui_icons_weapons` | P0 | `Icon sheet 3x3 grid, 256x256 each, #00FF00 background: club, throwing stone, spear, stone axe, bone mace, tomahawk, net trap, spring trap, pit trap.` |
| `ui_icons_buildings` | P0 | `Icon sheet 4x3 grid, 256x256 each, #00FF00 background, each a small isometric view of: armoury, gym, hut, chief's hut, kitchen, throwing range, store, disco, sanctuary, PIA centre, nursery, watch tower. Same designs as the 3D buildings.` |
| `ui_icons_commands` | P0 | `Icon sheet 5x4 grid, 256x256 each, #00FF00 background, for commands: build (hammer), form up (three figures in a row), call to arms (horn), villagers list (group), dismiss (waving hand), back to work (pickaxe), upgrade (up arrow on stone), demolish (broken wall), get out (running figure leaving door), healing spell (green leaf cross), defence spell (shield), love potion (pink potion with heart), disease spell (green skull cloud), info all (eye), info selected (eye with dot), info none (closed eye), repair (hammer and log), cancel upgrade (crossed up arrow), cancel repair (crossed hammer), unload (basket tipping).` |
| `ui_icons_jobs` | P1 | `Icon sheet 6x3 grid, 256x256 each, #00FF00 background, for villager jobs: berry picker, woodcutter, butcher, fisher, stonecutter, plant gatherer, bone collector, armourer, cook, DJ, shaman, builder, scout, melee fighter, thrower, guard, child, chief.` |
| `ui_icons_status` | P0 | `Icon sheet 5x2 grid, 256x256 each, #00FF00 background: hungry (empty bowl), tired (zzz), happy, sad, angry/on strike (crossed arms), in love (heart), sick (green face), injured (bandage), enemy sighted (eye with red), under attack (crossed weapons red).` |
| `ui_emotes` | P1 | `Speech-bubble emote sheet 4x3 grid, 256x256 each, #00FF00 background: heart, zzz, angry scribble, question mark, exclamation mark, food, music note, skull, star, sweat drop, tear, laugh.` |
| `ui_panel_kit` | P0 | `UI kit sheet on #00FF00 background: 9-slice panel (slate with wooden frame, rope corners) 512x512, smaller tooltip panel, primary button in 3 states (normal, hover, pressed) wide 512x128, round icon button in 3 states 128x128, progress bar frame + fills in green/yellow/red/blue, tab, close (X carved in stone) button, checkbox, slider knob shaped like a pebble.` |
| `ui_cursor_kit` | P1 | `Cursor sheet 128x128 each on #00FF00: pointer (stone arrowhead), select, attack (spear), gather (hand), build (hammer), cannot (red crossed circle).` |
| `ui_minimap_frame` | P1 | `Round minimap frame made of a carved stone ring with a small compass rose of bones, 1024x1024, center transparent area filled #00FF00.` |

---

## 9. TRANH CỐT TRUYỆN & MÀN HÌNH (key art) — dùng trực tiếp, 16:9 1920×1080

| ID | P | Prompt |
|---|---|---|
| `art_title` | P0 | `Title screen key art: a lush prehistoric valley after the ice age thaws, waterfall, woolly mammoth, a sabre-tooth tiger, our goofy fat chief standing proudly on a rock with his tribe behind him, warm morning light, space at top centre for the logo. ATTACH: story/00.png, icon.png` |
| `art_loading_{level}` | P1 | `Loading screen background for level "{NAME}": {DESC}. Wide landscape, no characters in the foreground centre (UI goes there), game style.` — các level: `outside` (a green valley in front of the icy cave the tribe left), `revenge` (dense forest near the cannibal camp at dusk), `escape` (rocky predator canyon with tiger eyes in the shadows), `wastelands` (arid cracked tundra with sparse dry trees and giant bones), `a_new_home` (gentle hills with a river, perfect village site), `great_lake` (big blue lake with islands and fish jumping), `desert_pass` (narrow sandstone canyon with hidden traps), `forest_belt` (huge primeval forest with ferns), `slaughter` (fortified enemy stronghold of logs and skulls on a hill, stormy sky), `plot_of_land` (peaceful sunny meadow, sandbox). |
| `art_story_00..11` | P1 | `Recreate this story illustration as modern high-resolution cartoon key art in the game style, same composition and characters, 16:9. ATTACH: story/NN.png` (làm 12 lần, NN = 00..11) |
| `art_win` / `art_lose` | P2 | `Victory: tribe celebrating around a bonfire with the chief carried on shoulders. / Defeat: empty burned village at dusk, the chief sitting sadly on a rock.` |

---

## 10. Checklist giao nhận (tick khi xong)

**P0 — Vertical slice Level 0 (bắt buộc trước):**
- [ ] chr_villager_m, chr_villager_f, chr_child, chr_chief
- [ ] prop_club, prop_spear, prop_cargo_wood/stone/meat/berries
- [ ] bld_hut_l1, bld_chief_hut, bld_store_l1, bld_kitchen_l1, bld_armoury_l1, bld_site_a/b (2×2, 3×2, 3×3, 4×3, 4×4)
- [ ] ani_boar, ani_tiger, obj_carcass_boar
- [ ] nat_tree_broadleaf, nat_tree_conifer, nat_tree_stump, nat_berrybush, nat_rock_quarry, nat_grass_tufts
- [ ] tex_grass, tex_dirt, tex_forest_floor, tex_shore, tex_water_color
- [ ] fx_fire, fx_smoke, fx_dust, fx_hit_star
- [ ] ui_logo, ui_icons_resources/weapons/buildings/commands/status, ui_panel_kit, art_title

**P1, P2:** phần còn lại theo bảng.

## 11. Gợi ý quy trình chuyển ảnh → 3D (cho người vận hành)
1. Ảnh `HERO` (nền trắng) → Meshy / Tripo / Hunyuan3D "image to 3D" (bật *low-poly / game-ready*, texture 1024).
2. Nhân vật: đưa model qua Mixamo (auto-rig) → tải animation ở mục 1 → xuất `.glb` gộp animation.
3. Mở Blender kiểm tra: scale đúng (1 ô = 1 m), pivot ở tâm đáy, mặt trước hướng +Z, giảm tris theo ngân sách, đặt tên `ID.glb`.
4. Lưu vào `6_prehistoric_tribes_3d/assets/models/<nhóm>/ID.glb`. Nếu bước 3D chưa làm kịp, game sẽ tạm dùng sprite gốc (billboard) cho ID đó.
