# MAP_FORMAT — `res/maps/map-<chapter>.bin`

Đã kiểm chứng bit-for-bit với engine gốc cho cả 12 level (`packages/data/test/maps.test.ts`, fixture `oracle-maps.json` dump bằng `tools/oracle-probe/dump-maps.js`). Code: `packages/data/src/maps.ts`.

## 1. Level → file
- 12 level dùng 10 file. File = `chapterOfLevel[level]` (`[0,0,1,2,3,4,4,5,6,7,8,9]`): tutorial và Outside dùng chung `map-0`, NEW_HOME và NEW_HOME_FINALE dùng chung `map-4`.
- Kích thước stream: `levelSizes[level*2]` × `levelSizes[level*2+1]`.
- Vùng chơi (crop): tutorial (level 0) = 40×32; NEW_HOME (level 5) bớt 32 cột; level khác = kích thước stream.
- Vị trí camera đầu: `levelStartPositions[level*2 .. +1]`.

| level | tên | file | stream | vùng chơi | object |
|---:|---|---:|---|---|---:|
| 0 | tutorial | 0 | 64×48 | 40×32 | 20 |
| 1 | outside | 0 | 64×48 | 64×48 | 20 |
| 2 | revenge | 1 | 64×80 | 64×80 | 34 |
| 3 | escape | 2 | 64×64 | 64×64 | 0 (không đặt object/nước/rừng) |
| 4 | wastelands | 3 | 64×96 | 64×96 | 24 |
| 5 | a new home | 4 | 96×96 | 64×96 | 35 |
| 6 | new home finale | 4 | 96×96 | 96×96 | 35 |
| 7–11 | custom maps | 5–9 | xem test | | 32/32/29/24/28 |

## 2. Giải nén RLE
`mapRunLengths` (12 byte) = 6 độ dài run `[4,4,2,2,2,2]` + 6 tile id tương ứng `[3,0,43,6,3,0]`.
```
tile=0, run=0, pos=10
for mỗi ô theo hàng (y rồi x):
  if pos >= runLen[run]:
     b = next byte (unsigned)
     if b >= 250: run = b-250; pos = 0; tile = runTile[run]
     else tile = b                     # literal 1 ô (pos vẫn >= runLen nên ô sau lại đọc byte mới)
  pos++; đặt tile
```

## 3. Tile → ô lưới (`placeMapTile`)
1. **Biến thể cỏ:** tile ≤ 8 → `tile + rng.randomInt(3,3)` (0..2). **Tiêu thụ RNG của game**, 1 lần/ô. Renderer 3D có thể bỏ qua (dùng base tile), sim thì phải gọi đúng để giữ tất định.
2. **Occupancy** (Int8):
   - `BLOCKED (-126)` nếu tile ≥ 175 hoặc bit 13 của `sprites.compositeFirstClip[tile]` bật.
   - `WATER (-125)` nếu `(sprites.compositeClipCount[tile] >> 6) & 3 == 2`.
   - `FOREST (-124)` nếu 180 ≤ tile ≤ 231 (cây chặt được).
   - 175..179 → **object** kind = tile-174 (5 = FISH_SHOAL), lượng ban đầu `objectStartVariant[kind]` = 20/20/20/15/25; ô lưới lưu `-61 - slot` (slot 0..49).
   - Hàng đầu, hàng cuối, cột cuối → `BLOCKED`.
   - Level ESCAPE bỏ qua bước nước/rừng/object.
3. **Bờ cá:** với mỗi ô có FISH_SHOAL trong vùng chơi, ô trái/phải có tile ∈ {33,34,37,38} → `SHORE (-127)`.

## 4. Lưu ý cho renderer 3D
- Engine lưu terrain dạng Int8 có dấu, `DecodedLevel.tiles` trả về 0..255.
- Ý nghĩa đồ hoạ của từng tile id (cỏ/đất/cát/nước/đá…) chưa đặt tên: lấy từ sprite composite (`compositeFirstClip`, `compositeClipCount`). Việc phân loại tile → material 3D thuộc **T7**.
- Tile 243 = `TALL_ROCK`. Tên của object kind 1–4 chưa xác định (TODO T5).
