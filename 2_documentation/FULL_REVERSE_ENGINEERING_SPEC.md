# ĐẶC TẢ DỊCH NGƯỢC TOÀN DIỆN — PREHISTORIC TRIBES (WEB PORT VERCEL & BẢN CLONE 1:1)

Tài liệu này được tổng hợp trực tiếp bằng phân tích mã nguồn JS ([`index-BHVz0EiT.js`](../4_prehistoric_tribes_clone/assets/index-BHVz0EiT.js) khôi phục nguyên bản `1:1` từ `index-BHVz0EiT.orig.js`), [`res/data/game-data.json`](../4_prehistoric_tribes_clone/res/data/game-data.json) (292 bảng dữ liệu: `288 tables` + `4 shortTables`), [`res/data/sprites.json`](../4_prehistoric_tribes_clone/res/data/sprites.json) (`11 shorts` + `25 bytes`), [`res/text/en.json`](../4_prehistoric_tribes_clone/res/text/en.json) (`menu`, `pages`, `labels` [10 nhóm], `messages` [4 nhóm], `dialogue` [235 câu thoại]), và [`res/maps/map-0..9.bin`](../4_prehistoric_tribes_clone/res/maps/map-0.bin) dịch ngược từ phiên bản web `https://prehistoric-tribes.vercel.app/` (lưu cục bộ tại [`4_prehistoric_tribes_clone/`](../4_prehistoric_tribes_clone/), kiến trúc chi tiết xem [`CLONE_ARCHITECTURE.md`](../4_prehistoric_tribes_clone/CLONE_ARCHITECTURE.md)).

---

## MỤC LỤC

1. [Toàn bộ Cốt truyện, 12 Màn chơi & 63 Cutscene](#1-toàn-bộ-cốt-truyện-12-màn-chơi--63-cutscene)
2. [Hệ thống Nhân vật & Động vật hoang dã](#2-hệ-thống-nhân-vật--động-vật-hoang-dã)
3. [Hệ thống 12 Nhà cửa, 8 Công trường, Nâng cấp & Huấn luyện](#3-hệ-thống-12-nhà-cửa-8-công-trường-nâng-cấp--huấn-luyện)
4. [Hệ thống Vũ khí, Bẫy, Phép Thuật Shaman & Chiến đấu](#4-hệ-thống-vũ-khí-bẫy-phép-thuật-shaman--chiến-đấu)
5. [Hệ thống Gameplay: Kinh tế, Đời sống, Hôn nhân, AI Địch & Điểm số](#5-hệ-thống-gameplay-kinh-tế-đời-sống-hôn-nhân-ai-địch--điểm-số)
6. [Toàn bộ Các Trạng thái Hệ thống (Screens, Modes, 112 Tasks, 17 Jobs, Flags, Alerts, Emotes)](#6-toàn-bộ-các-trạng-thái-hệ-thống)

---

## 1. Toàn bộ Cốt truyện, 12 Màn chơi & 63 Cutscene

### 1.1. Tổng quan Cấu trúc Chiến dịch & Chơi tự do

Khác với phỏng đoán ban đầu coi 10 tên bản đồ là 10 chương nối tiếp, game thực tế chia **12 màn chơi (level `0..11`)** dựa trên **10 tệp bản đồ nhị phân (`map-0.bin`..`map-9.bin`)**:

| Level ID | Tên màn | Chế độ | Chapter Map (`map-*.bin`) | Kích thước bản đồ / Playable | Điều kiện kết thúc (`levelEndConditions`) | Thời gian miễn đói/mệt (`needsGraceTicks`) |
|---:|---|---|---:|---|---|---:|
| **0** | **Tutorial (`Outside`)** | Campaign | `0` (`map-0.bin`) | `64×48` $\rightarrow$ cắt `40×32` | `2` (`CHIEFS_HUT_LOST` hoặc dân = 0; hết tutorial chuyển sang Lv1 qua `WARRIOR_PARADE`) | `5000` ticks |
| **1** | **Outside** | Campaign | `0` (`map-0.bin`) | `64×48` | `3` (`ENEMY_CAMP_DESTROYED \| CHIEFS_HUT_LOST`) | `0` ticks |
| **2** | **Revenge** | Campaign | `1` (`map-1.bin`) | `64×80` | `2` (`CHIEFS_HUT_LOST`; giai đoạn cuối địch cướp phụ nữ/trẻ em kích hoạt qua `ENEMY_CAMP_RAZED`) | `4000` ticks |
| **3** | **Escape** | Campaign | `2` (`map-2.bin`) | `64×64` | `4` (Giải cứu con tin tại túp lều khóa của Cannibals; thua nếu toàn quân chết) | `12000` ticks |
| **4** | **Wastelands** | Campaign | `3` (`map-3.bin`) | `64×96` | `3` (`ENEMY_CAMP_DESTROYED \| CHIEFS_HUT_LOST` — bắt buộc sống sót bảo vệ Chief) | `6000` ticks |
| **5** | **A New Home** | Campaign | `4` (`map-4.bin`) | `96×96` $\rightarrow$ cắt `64×96` | `2` (Đánh bại đợt đầu quân man rợ $\rightarrow$ mở khóa bản đồ sang Lv6) | `4000` ticks |
| **6** | **A New Home (Finale)** | Campaign | `4` (`map-4.bin`) | `96×96` | `3` (Phá hủy hoàn toàn trại chính Barbarians phía Đông $\rightarrow$ `ENDING`) | `0` ticks |
| **7** | **Great Lake** | Custom Game | `5` (`map-5.bin`) | `96×64` | `3` (`ENEMY_CAMP_DESTROYED \| CHIEFS_HUT_LOST`) | `6000` ticks |
| **8** | **Desert Pass** | Custom Game | `6` (`map-6.bin`) | `80×80` | `3` (`ENEMY_CAMP_DESTROYED \| CHIEFS_HUT_LOST`) | `6000` ticks |
| **9** | **Forest Belt** | Custom Game | `7` (`map-7.bin`) | `96×48` | `3` (`ENEMY_CAMP_DESTROYED \| CHIEFS_HUT_LOST`) | `6000` ticks |
| **10** | **Slaughter** | Custom Game | `8` (`map-8.bin`) | `48×96` | `3` (`ENEMY_CAMP_DESTROYED \| CHIEFS_HUT_LOST`) | `6000` ticks |
| **11** | **Plot of Land** | Custom Game | `9` (`map-9.bin`) | `64×64` | `3` (`ENEMY_CAMP_DESTROYED \| CHIEFS_HUT_LOST`) | `6000` ticks |

> [!NOTE]
> Trong `game-data.json`, **Tutorial (Lv0)** và **Outside (Lv1)** dùng chung tệp bản đồ `map-0.bin`, còn **A New Home (Lv5)** và **Finale (Lv6)** dùng chung tệp bản đồ `map-4.bin` (giai đoạn đầu khóa chiều rộng còn 64 cột, sang Finale mở toàn bộ 96 cột).

---

### 1.2. Diễn biến Cốt truyện Chi tiết qua Từng Chương & Cutscene

Bối cảnh mở đầu: Xưa kia thế giới là vùng đất xanh tươi với ma mút khổng lồ, chim che kín mặt trời và quái thú dưới sông hồ. Kỷ Băng Hà ập tới tiêu diệt gần như mọi thứ; loài người nguyên thủy sống sót lay lắt trong hang tối quanh đống lửa tàn, trong đó có bộ lạc **Avnotaklu**.

#### CHƯƠNG 0 & 1: TUTORIAL & OUTSIDE (`Cutscene 0..31`)
1. **`[0] INTRO` (Truyện dẫn mở đầu):** Băng tan kết thúc Kỷ Băng Hà.
2. **`[1] INTRO_STORY` (Trong hang động):** **Mumbo** chạy hớt hải vào báo cho **Chief** (Tộc trưởng) rằng băng đã tan, mặt trời đã chiếu sáng. Tộc trưởng ban đầu mắng Mumbo điên rồi cuối cùng hạ lệnh cả bộ lạc ra khỏi hang.
3. **`[2] TUTORIAL_INTRO` & `[3] GUIDE_GREETING` & `[4] CHIEFS_HUT_TOUR`:** Bước ra ngoài, Tộc trưởng lập tức than đói và lạnh, đòi chỗ trú ẩn và đồ ăn. Mumbo giới thiệu Nhà Tộc trưởng (`Chief's Hut` — nơi các trưởng lão họp... hoặc ngủ gật) và hướng dẫn người chơi từng bước trong 23 mục tiêu Tutorial (`obj[0..22]`):
   - Xây `Store` (`Cutscene 4` $\rightarrow$ `5`), mở Quick Menu (`Cutscene 6`), cử thợ xây (`Cutscene 7`), khai thác Gỗ (`Cutscene 8`), khai thác Đá (`Cutscene 9`), xây `Hut` & `Kitchen` & hái Dâu (`Cutscene 10`), giải thích cơ chế Hạnh phúc & "Tent-time", khoanh vùng chọn nhóm & gán phím tắt `7`/`9` (`Cutscene 11`), mở danh sách `Villagers` (`Cutscene 12`), cử Đầu bếp vào `Kitchen` (`Cutscene 13` $\rightarrow$ `14`).
4. **`[15] RAIDERS_APPROACH`:** Bầy người hoang dã (`Cannibals`) lao về phía làng. Tộc trưởng tưởng là hàng xóm tới chúc mừng hoặc nhân viên tiếp thị gõ cửa, ra lệnh Mumbo ra đón và Mumbo bị đánh tơi tả!
5. **`[16..18] CALL TO ARMS & RAID_REPELLED`:** Học lệnh `Call to Arms!` để dẹp toán cướp. Tộc trưởng bị cắn nên tưởng chúng là... Zombie! Sau trận chiến, Tộc trưởng và Trưởng lão quyết định xây **`Gym`** (Tộc trưởng đòi có cả quầy nước ép và lễ tân tên 'Kim'), **`Armoury`** chế tạo vũ khí và **`Range`** tập ném.
6. **`[19..25] Training & Economy Guides`:** Mumbo giải thích hào quang hỗ trợ của **Chief**, thanh Hạnh phúc (ảnh hưởng bởi ăn/ngủ/"tent-time"/cái chết/nâng cấp lều 5 sao), quy trình **rèn vũ khí tại Armoury $\rightarrow$ lấy vũ khí ở Store $\rightarrow$ tập luyện ở Gym**.
7. **`[26] WARRIOR_PARADE` (Chuyển tiếp sang Lv1 Outside):** Đội chiến binh xuất kích. Tộc trưởng quyết định cử sứ giả qua làng địch để "giảng hòa".
8. **`[27..31] MESSAGE_TO_CANNIBALS`:** Sứ giả của bộ lạc Avnotaklu tiến sát trại địch nói: *"Gửi những kẻ tâm thần ăn thịt người, chúng tôi đến trong hòa bình!"*. Đám Cannibals chỉ gầm gừ *"Grrrr! Woof! Woof!"* và đuổi đánh khiến sứ giả chạy bán sống bán chết về báo rằng chúng đông gấp 10 lần. Mumbo bổ sung hướng dẫn câu cá (`Fishing` cần Giáo `Spear`) và săn thú lấy thịt + xương (`Bones`).
   - **Thắng Lv1:** Tiêu diệt toàn bộ quân và phá hủy trại Cannibals.

#### CHƯƠNG 2: REVENGE (`Lv2`, `Cutscene 32..38`)
1. **`[32] REVENGE_INTRO` & `[33]`:** Bộ lạc Avnotaklu chiếm luôn ngôi làng cũ trù phú của lũ ăn thịt người ("thích bộ rèm cửa" và bàn cách khử mùi thịt người khỏi thảm). Trưởng lão phát hiện công nghệ mới: **`Tower`** (tháp canh), thành lập **`PIA` (Prehistoric Intelligence Agency — Cơ quan Tình báo Tiền sử)** chuyên ẩn thân và trinh sát, vũ khí/bẫy xịn hơn trong Armoury, và xây **`Sanctuary`** thờ thần mưa nắng (mâu thuẫn hài hước giữa thuyết "thần linh" của Chief và thuyết "hơi nước ngưng tụ" của Mumbo).
2. **`[34] CANNIBALS_REPLY`:** Cannibal Chief quay lại đòi đất (*"You take we land! We take land back!"*), cãi nhau qua lại rồi tuyên chiến *"No more mister nice-savage!"*.
3. **`[35] CALL_FOR_REVENGE`:** Tộc trưởng hỏi ý **Shaman** (Pháp sư). Shaman giả vờ hỏi thần linh: *"Chờ tí... ừm... rồi, thần bảo đánh đi."*
4. **Scripted Unlocks trong Lv2:** Sau `4000` ticks mở Armoury Lv2 (`Cutscene 64`), `5000` ticks mở Kitchen Lv2 (`Cutscene 63`), `6000` ticks mở Gym Lv2 & Range Lv2 (`Cutscene 65`).
5. **`[36] REVENGE_RAID` $\rightarrow$ `[37] CAPTIVES_TAKEN` $\rightarrow$ `[38] REVENGE_AFTERMATH`:** Khi người chơi phá hủy phần lớn căn cứ địch (`BUILDINGS < 5`), địch tung đòn phản công đánh lạc hướng và **bắt cóc toàn bộ phụ nữ và trẻ em** của bộ lạc Avnotaklu! Lúc đầu một người đàn ông còn ăn mừng *"Hoan hô! Thoát khỏi ách áp bức của phụ nữ!"* cho đến khi đồng đội nhắc: *"Vậy ai sinh con cho bộ lạc chúng ta?!"*. Cả đội đàn ông Avnotaklu lập tức lên đường giải cứu.

#### CHƯƠNG 3: ESCAPE (`Lv3`, `Cutscene 39..48`)
*Đây là màn giải cứu chiến thuật đặc biệt: Không xây nhà (`BUILD` bị khóa), không có Chief's Hut, chỉ điều khiển nhóm nam chiến binh và một đặc vụ PIA.*
1. **`[40]`:** Mùi thịt nướng thơm phức bay ra — hóa ra lũ ăn thịt người đang chuẩn bị nấu gia đình mình!
2. **`[41]`:** Chạm trán bầy **Hổ răng kiếm (`Sabretooth Tigers`)** canh lối đi — phải lẻn vòng qua.
3. **`[42] & [43] SETTLEMENT_FOUND`:** Phát hiện trại giam của Cannibals. Đội cử đặc vụ **PIA Scout** (`speakerSlot=4`) đi thám thính về báo bọn lính gác đều già yếu, cả bọn đang nhảy quanh lửa. Một người đề xuất kế "Ngựa thành Troy" (làm voi Ma mút gỗ khổng lồ), nhưng trưởng lão khác hiến kế táo bạo hơn: **Dụ đàn Hổ răng kiếm đói khát xông thẳng vào trại Cannibals!**
4. **`[44] CANNIBAL_FEAST`:** Một chiến binh làm mồi nhử (*"Mi mi mi mèo con!"*) dụ bầy hổ chạy thẳng vào doanh trại Cannibals, để hổ cắn xé sạch lũ ăn thịt người.
5. **`[45] RESCUE_CAPTIVES` $\rightarrow$ `[46] CAPTIVES_SAVED`:** Chiến binh Avnotaklu phá sập túp lều khóa cửa giải cứu phụ nữ và trẻ em thành công.
6. **`[47] JOURNEY_HOME` & `[48] HOMECOMING`:** Đoàn người trở về quê hương nhưng kinh hoàng thấy **toàn bộ làng đã bị san phẳng**. Tại đống đổ nát xuất hiện kẻ lạ mặt tên **Jafar** tự xưng đến để dẫn họ tới **"Vùng đất hứa"** đầy hoa thơm trái ngọt và phụ nữ nhảy múa dưới trăng. Tộc trưởng mê mẩn lao đi ngay lập tức theo lời chỉ đường mù mờ của Jafar (*"Đi về hướng Nam cho đến khi mặt trăng tự quay ngược lại..."*), bỏ mặc sự nghi ngờ của Mumbo.

#### CHƯƠNG 4: WASTELANDS (`Lv4`, `Cutscene 49..54`)
1. **`[49] WASTELANDS_INTRO` & `[50] RESTING_PLACE`:** Bộ lạc kiệt sức giữa sa mạc hoang vu, dừng chân ở một ốc đảo dưới chân núi. Trận động đất bít kín đường về (`shakeOffset`). Shaman (do ăn xương rồng ảo giác) tiên tri rằng bọn man rợ sẽ phục kích giữa sa mạc và giết Tộc trưởng — cả bộ lạc phải bảo vệ Tộc trưởng bằng mọi giá!
2. **`[51] CAVE_FOUND`:** Nếu mở tầm nhìn tới hang đá ở `(8, 67)`, Mumbo đề nghị chui vào hang trú, nhưng Tộc trưởng thà chết không quay lại sống trong hang.
3. **`[52]` (Jafar lật mặt):** **Jafar** xuất hiện lộ rõ bản chất là thủ lĩnh tộc Man rợ (*Barbarian Warlord*), cười nhạo Tộc trưởng: *"Ngươi mới chính là kẻ phải nhảy múa làm trò cho bọn ta! Bắt phụ nữ trẻ em, giết sạch người già và tên Tộc trưởng béo ị kia!"*
4. **`[53] WASTELANDS_MUTINY` & `[54] TIGERS_WATERING_HOLE`:** Con đường thoát duy nhất là **đánh xuyên qua trại chính của quân Barbarians**. Đàn hổ quanh hồ nước cũng lao tới tấn công. Qua các mốc thời gian (`5000..11000` ticks), lần lượt mở nâng cấp Sanctuary Lv2 (học phép **Disease** và **Niagra Love Potion**), Disco Lv2 (quầy bar + bể sục Jacuzzi), PIA Center Lv2, Armoury Lv3 (Tomahawk + Pit Trap), Tower Lv2.

#### CHƯƠNG 5 & FINALE: A NEW HOME (`Lv5` & `Lv6`, `Cutscene 55..59`)
1. **`[55] NEW_HOME_INTRO` & `[56]`:** Sau khi thoát khỏi sa mạc, Avnotaklu tìm thấy một thung lũng xanh tươi trù phú, quyết định dựng quê hương vĩnh viễn. Vừa ổn định, làn sóng tấn công đầu tiên ập tới.
2. **`[57]` & Chuyển sang Finale (`Lv6`):** Sau khi dẹp xong tiền trạm, bản đồ mở rộng toàn bộ `96×96`, lộ nguyên đại bản doanh khổng lồ với 3 Gym, 3 Range, 2 Armoury Lv3, 5 Tower Lv2 của quân Barbarians.
3. **`[58]`:** Tộc trưởng hô *"Chiến đấu vì hòa bình!"* — Mumbo thắc mắc *"Đánh nhau vì hòa bình nghe hơi mâu thuẫn?"* — *"Câm mồm và chém đi!"*
4. **`[59] ENDING`:** Tiêu diệt toàn bộ trại địch $\rightarrow$ Chiến thắng toàn chiến dịch, mở ra lời kết lịch sử bộ lạc Avnotaklu.

#### 3 BÍ KÍP CHUYÊN NGÀNH (`Cutscene 60..62`) & HƯỚNG DẪN ĐỜI MỚI (`63..69`)
- **`[60] KEEPER_TIP`:** Shaman tự giới thiệu Sanctuary Lv1 với phép **Healing** và **Defence** (hỗ trợ dùng trực tiếp hoặc xếp hàng chờ).
- **`[61] SCOUT_TIP`:** Đặc vụ PIA đầu tiên xuất hiện khi đạt `scoutingSkill > 3`, giải thích khả năng ẩn mình trong bụi cây, tầm nhìn xa và phát hiện trinh sát/bẫy địch.
- **`[62] UPGRADED_KEEPER_TIP`:** Shaman ở Sanctuary Lv2 giới thiệu **Niagra Love Potion** (kích thích lãng mạn để vào lều sinh con) và **Disease** (gây dịch bệnh lan cả bạn lẫn thù).

---

## 2. Hệ thống Nhân vật & Động vật hoang dã

### 2.1. Bể Thực thể SoA (`101` Unit Slots) & Phân chia Phe
- **Tổng số nhân vật tối đa cùng lúc:** `100` (index `1..50` thuộc **Player Avnotaklu**; `51..100` thuộc **Enemy Cannibals/Barbarians**, trong đó `51` = Enemy Chief / Jafar, `52` = Enemy Shaman).
- **Kho tên (`120` tên trong `en.json`):** `60` tên Nam (`jumbo`, `juju`, `mumbo`, `jafar`, `konan`, `fred`, `barney`...) và `60` tên Nữ (`kazza`, `tazza`, `loula`, `treena`, `dorris`, `flora`, `fauna`...).
- **Cấu trúc 82 trường dữ liệu mỗi nhân vật (`units`):**
  - Vị trí & chuyển động: `x, y, offsetX, offsetY, direction (0..7), running, stepDelay, stepTimer, stepProgress, pathStep, pathLength, pathFailures`.
  - Sinh tồn & tuổi tác: `hp, maxHp, age, ageTicks, gender (0=Male, 1=Female), food (0..100), energy (0..100), happiness (0..99), infection (0..30), protectionTimer (0..120)`.
  - Kỹ năng chiến đấu: `meleeSkill (0..9), throwingSkill (0..9), scoutingSkill (1..10), throwRange (3..7), viewRadius (4..9), weapon (0..5 hoặc 9 = Tay không)`.
  - Kỹ năng dân sự: `gatheringSkill, craftingSkill, cookingSkill, djSkill, healingSkill, buildingSkill` (mỗi chỉ số 1..10).
  - Xếp hạng tự động (`rankJobs`): `job, bestCivilJob, secondCivilJob, bestCombatJob, secondCombatJob`.
  - Giao việc & nhà: `task, savedTask, lastTask, orderState, actionPhase, taskTime, taskSubject, targetX, targetY, homeX, homeY, bedHut, partner, cargoType, cargoAmount, cargoCapacity`.

### 2.2. Vai trò Nhân vật & Chỉ số Đặc trưng

| Vai trò | Điều kiện / Slot | Máu & Tốc độ gốc | Cơ chế Đặc biệt từ Mã nguồn |
|---|---|---|---|
| **Chief (Tộc trưởng)** | Unit đầu tiên phe Player (`tribeStats[B.CHIEF]`); nếu chết phải bầu người mới | Adult `40–55 HP` (nam), `stepDelay` chuẩn `8` (tốc độ cao dần khi rèn lên `stepDelay = 5`) | **Hào quang lãnh đạo (bán kính 4 ô)**: Tăng **1.5× sát thương chiến đấu** (`N(dmg*3, 2)`) và tăng **1.5× hiệu suất/tốc độ mọi kỹ năng dân sự** xung quanh. **Cấm làm công trình thường** (trừ `Chief's Hut` — dân khác bén mảng vào bị cảnh báo *"the chief will hit me!"*). Nếu Chief chết: mọi người lớn giảm **-25 Happiness** và bật màn hình chọn Chief mới. |
| **Mumbo** | Nhân vật nam xuất hiện ngay Tutorial (`Cutscene 1..31`) | Dân thường (`age ~20..25`) | Nhân vật dẫn chuyện, phát ngôn viên của Tộc trưởng, xuất hiện nhiều nhất trong 31 đoạn thoại Tutorial & suốt chiến dịch. |
| **Shaman (Pháp sư)** | Dân làm việc tại **Sanctuary** (`job=SHAMAN`, slot `0`) | Tự hồi máu thụ động nếu `healingSkill > 1` (`heal(2)` mỗi `46 - healingSkill*3` tick) | Tự trị thương & giải độc cho bệnh nhân tới Sanctuary; nhận lệnh thi triển **4 phép Voodoo** (`Healing`, `Defence`, `Love Potion`, `Disease`) bằng cách đọc hàng đợi `spellCasts`. |
| **PIA Agent / Scout** | Dân được huấn luyện tại **PIA Center** (`scoutingSkill > 3`, tối đa `10`) | HP có thể rèn lên tới `75` (Lv1) / `99` (Lv2), tốc độ tối đa `stepDelay = 5` | **Tàng hình (`q.HIDDEN`)** tự động kích hoạt khi đứng `IDLE` và không bị phát hiện (`UNOBSERVED`). Công thức bị phát hiện đối xứng: đối thủ phát hiện được nếu khoảng cách $\le 1 + \lfloor\frac{10 - scout}{3}\rfloor + \lfloor\frac{obsScout}{scout - 3}\rfloor$. Khi `scoutingSkill >= 6`, tự động **phá lộ bẫy tàng hình** trong bán kính `scoutingSkill - 4` và phát hiện **vùng dịch bệnh địch** trong bán kính `scoutingSkill - 3`! |
| **Melee / Thrower Warrior** | Dân có `weapon` và rèn tại **Gym** / **Range** | MaxHP có thể tăng tới `75 HP` (nhà Lv1) hoặc **`99 HP`** (nhà Lv2), `stepDelay` giảm xuống `5` | Cận chiến dùng `Gym` tăng `meleeSkill` (tới `5` ở Lv1, `7` ở Lv2). Ném đá/giáo/rìu dùng `Range` tăng `throwingSkill` (tới `5`/`7`) và tăng tầm nhìn `viewRadius` (`5`/`7`) + `throwRange` (`3 + throwingSkill/2`, max `7`). |
| **Armourer / Cook / DJ / Builder / Guard** | Gắn với công trình tương ứng | Khởi điểm có thể mang `gift` kỹ năng `2..6` | Cook tự hồi `food` tới 100 ở Kitchen; Guard đứng trong `Tower` được cộng `+2 throwRange` và `+3 viewRadius`; Builder được tuyển tự động khi có công trường dở. |
| **Child (Trẻ em)** | `age < 12` (sinh ra tại `Hut` với `age = 2`) | `5–15 HP`, `stepDelay = 8`, không bị phạt đói/mệt | Không thể lao động hay đánh nhau (`CHILD_LABOUR` bị từ chối). Dễ bị **Hổ ăn thịt (`CHILD_EATEN`)** và **Cannibals bắt cóc chuyển sang phe địch (`KIDNAP_CHILD`)** nếu không ở trong **Nursery**. Tự động trưởng thành ở `age = 12` (khi Player: 1 tuổi mỗi `125` sub-ticks). |
| **Cannibal / Barbarian / Jafar** | Phe địch (`51..100`), `51` là Thủ lĩnh / Jafar | Khởi điểm Tutorial yếu (`20–35 HP`), từ Lv2+ `40–55 HP`, Hard mode cộng thêm level/traits | Tự lấy vũ khí từ kho địch, tự đi luyện tại Gym/Range/PIA Camp của địch, gác chốt cố định (`guardPost`), tấn công theo tuyến raid (`raidRoutes`) và biết bắt cóc trẻ em. |

### 2.3. Hệ thống Động vật Hoang dã (`game-data.json` gốc & Mở rộng HD)

| Loài thú (ID gốc) | Tên gốc (`game-data`) | Máu (`animalHp`) | Tốc độ (`animalStepDelay`) | Độ hung hãn (`boldness`) | Sát thương cắn (`biteDamage`) | Thịt thu được (`carcassMeat`) | Vai trò Gameplay |
|---|---|---:|---:|---:|---:|---:|---|
| **`0` — Boar** | Lợn rừng (`Boar`) | **30 HP** | `6` (chậm vừa) | `5` (chủ yếu bỏ chạy, đánh trả khi bị săn) | **2** (nhân hệ số random 2..4 / 4) | **25** đơn vị | Nguồn thịt dồi dào, an toàn hơn để săn đầu game. |
| **`1` — Tiger** | Hổ răng kiếm (`Tiger`) | **50 HP** | `4` (**rất nhanh**) | `100` (**luôn chủ động tấn công người & phá nhà gần**) | **4** | **15** đơn vị | Mối nguy hiểm tự nhiên lớn nhất; ăn thịt trẻ em đi lạc; công cụ giải cứu trại địch ở màn *Escape*. |
| **`2` — Small Game** | Thú nhỏ / Con mồi (`Animal 2`) | **20 HP** | `5` (nhanh vừa) | `0` (**nhát, luôn bỏ chạy**) | **0** | **15** đơn vị | Mồi săn hiền lành không đánh trả. *(Bản clone `4_prehistoric_tribes_clone/` dùng đúng 3 loài gốc `0..2`; bản remake `3_web_game/` bổ sung thêm Woolly Mammoth).* |

> [!NOTE]
> Xác động vật (`Pl.CARCASS`) sau khi chết tự phân hủy dần mỗi `128` tick; khi hết thịt sẽ tự chuyển hóa thành **Đống Xương (`Pl.BONES`, 15 đơn vị)** để dân tiếp tục thu thập xương nâng cấp nhà/chế vũ khí!

---

## 3. Hệ thống 12 Nhà cửa, 8 Công trường, Nâng cấp & Huấn luyện

### 3.1. Bảng Thông số Chuẩn của Tất cả 12 Công trình (`buildingStats`)

| ID | Tên Công trình | Kích thước (Ô) | Chi phí Xây (Gỗ / Đá / Xương) | Chi phí Nâng cấp (Gỗ / Đá / Xương) | HP Lv1 / Lv2 | Sức chứa Lv1 / Lv2 | Vị trí thợ giữ (`Keeper`) | Hạnh phúc Lv1 / Lv2 | Mức tối đa theo Chương (Tự mở dần) |
|---:|---|---:|---:|---:|---:|---:|---:|---:|---|
| `0` | **Armoury** | `3×2` | **20W, 10S** | 10W, 5S | 40 / 55 *(Lv3: 70)* | 1 / 1 | Slot `0` (Armourer) | `-1` / `0` *(Lv3: +1)* | Ngoài: Lv1 $\rightarrow$ Revenge: Lv2 $\rightarrow$ Wastelands+: **Lv3** |
| `1` | **Gym** | `5×4` | **40W, 30S** | 15W, 15S | 70 / 100 | 2 / 4 | Không (`-1`) | `0` / `0` | Ngoài: Lv1 $\rightarrow$ Revenge+: **Lv2** |
| `2` | **Hut** | `2×2` | **15W, 5S** | 5W, 10S | 25 / 40 | 4 / 4 | Không (Chỗ ở 4) | `0` / **`+2`** | Mặc định mở sẵn **Lv2** mọi màn |
| `3` | **Chief's Hut** | `4×4` | 30W, 20S *(dựng sẵn)* | 50W, 50S *(không dùng)* | 120 | 2 | Chỉ dành cho **Chief** | `0` | **Lv1** cố định |
| `4` | **Kitchen** | `4×3` | **30W, 20S** | 10W, 20S | 60 / 80 | 5 / 7 | Slot `0` (Cook) | `0` / **`+2`** | Ngoài: Lv1 $\rightarrow$ Revenge+: **Lv2** |
| `5` | **Range** | `6×4` | **40W, 30S** | 15W, 15S | 70 / 100 | 2 / 4 | Không (`-1`) | `0` / `0` | Ngoài: Lv1 $\rightarrow$ Revenge+: **Lv2** |
| `6` | **Store** | `3×3` | **25W, 20S** | 18W, 18S | 50 | 0 (Kho) | Không | `0` | **Lv1** |
| `7` | **Disco** | `5×4` | **30W, 25S** | 10W, 25S | 90 / 110 | 5 / 7 | Slot `0` (DJ) | **`+2`** / **`+3`** | Ngoài/Revenge: Lv1 $\rightarrow$ Wastelands+: **Lv2** |
| `8` | **Sanctuary** | `3×3` | **20S, 10B** | 10W, 10B | 50 / 60 | 2 / 2 | Slot `0` (Shaman) | `0` / `+1` | Revenge: Lv1 $\rightarrow$ Wastelands+: **Lv2** |
| `9` | **PIA Center** | `4×4` | **30W, 15S** | 10W, 15S | 60 / 80 | 2 / 3 | Không (`-1`) | `0` / `0` | Revenge: Lv1 $\rightarrow$ Wastelands+: **Lv2** |
| `10` | **Nursery** | `4×4` | **20W, 10S** | 10W, 5S | 40 / 50 | 5 / 0 | Không (Giữ 5 trẻ) | `0` / `0` | **Lv1** |
| `11` | **Tower** | `1×1` | **10W, 10S** | 10W, 10S | 50 / 70 | 2 / 2 | Không (Lính gác) | `0` / `+1` | Revenge: Lv1 $\rightarrow$ Wastelands+: **Lv2** |

> [!TIP]
> **8 mẫu Công trường (`col 12..19`)** tương ứng kích thước hình khối của các nhà trên: `4×4` (`12`), `5×4` (`13`), `6×4` (`14`), `4×3` (`15`), `3×3` (`16`), `3×2` (`17`), `2×2` (`18`), `1×1` (`19`). Khi vừa đặt xuống, công trường có `5 HP`, cần `BUILDER` đi lấy từng chuyến vật liệu tại **Store** (`siteMaterialTrips` từ `2` tới `7` chuyến) và đóng búa nâng HP lên bằng `MaxHP` để hoàn thành.

### 3.2. Bảng Huấn luyện / Tăng Chỉ số trong Công trình (`lesson*` tables)

| Công trình | Cấp nhà | Chỉ số được rèn | Bước tăng / lần | Tỉ lệ thành công | Giới hạn tối đa (`limit`) |
|---|---|---|---:|---:|---:|
| **Armoury** | Lv1 / Lv2 / Lv3 | `craftingSkill` | `+1` | `30%` / `40%` / `50%` | `5` / `7` / `10` |
| **Gym** | Lv1 | `meleeSkill` & `maxHp` | `+1` melee, `+5` HP | `100%` | `5` melee, `75` HP |
| **Gym** | Lv2 | `meleeSkill`, `maxHp`, `stepDelay` | `+1` melee, `+10` HP, `-1` delay (nhanh hơn) | `100%` | `7` melee, `99` HP, `5` delay |
| **Range** | Lv1 | `throwingSkill`, `viewRadius`, `maxHp` | `+1` throw, `+1` vision, `+5` HP | `100%` | `5` throw, `5` vision, `75` HP |
| **Range** | Lv2 | `throwingSkill`, `viewRadius`, `maxHp`, `stepDelay` | `+1` throw, `+1` vision, `+10` HP, `-1` delay | `100%` | `7` throw, `7` vision, `99` HP, `5` delay |
| **PIA Center** | Lv1 | `scoutingSkill`, `viewRadius`, `maxHp`, `stepDelay` | `+1` scout, `+2` vision, `+5` HP, `-1` delay | `100%` | `5` scout, `7` vision, `75` HP, `6` delay |
| **PIA Center** | Lv2 | `scoutingSkill`, `viewRadius`, `maxHp`, `stepDelay` | `+1` scout, `+2` vision, `+10` HP, `-1` delay | `100%` | **`10` scout**, **`9` vision**, `99` HP, `5` delay |
| **Kitchen** | Lv1 / Lv2 | `cookingSkill` | `+1` | `5%` / `7%` | `6` / `10` |
| **Disco** | Lv1 / Lv2 | `djSkill` (DJ đứng bàn) | `+1` | `15%` / `20%` | `6` / `10` |
| **Sanctuary** | Lv1 / Lv2 | `healingSkill` | `+1` | `30%` / `50%` | `6` / `10` |
| **Tower** | Lv1 / Lv2 | `viewRadius` | `+1` | `2%` / `2%` | `5` / `7` |
| **Construction** | Mọi cấp | `buildingSkill` | `+1` | `8%` | `10` |

*(Ghi chú: Tốc độ UI hiển thị trong panel dân làng là `speedStat = (9 - stepDelay) * 2 + 1`, tức dân thường delay 8 = tốc 3, chiến binh delay 5 = tốc 9).*

---

## 4. Hệ thống Vũ khí, Bẫy, Phép Thuật Shaman & Chiến đấu

### 4.1. Kho Vũ khí & Bẫy (9 loại chế tạo / trang bị)

| ID | Tên Item | Cấp Armoury mở khóa | Chi phí chế tạo (`recipe`) | Loại tấn công & Tốc độ đạn | Sát thương gốc (`weaponDamage` / `trapDamage`) | Ghi chú |
|---:|---|---|---:|---|---|---|
| `0` | **Club** (Chùy gỗ) | Lv1 | `5 Wood` | Cận chiến | `+1` | Hoàn trả `1 Club` vào Store nếu đổi vũ khí |
| `1` | **Stone** (Đá ném) | Mặc định ở Store (5 đá thô = 1 đạn) | `5 Stones` (khi lấy ở Store) | Tầm xa (`spd=25`) | `+1` | Nhìn nhân vật theo dõi viên đá bay (`WATCH_THROW`) |
| `2` | **Spear** (Giáo) | Lv1 | `5 Wood, 2 Stones` | Tầm xa (`spd=30`) | `+2` | **Bắt buộc** để đứng trên bờ câu cá (`FISH`) |
| `3` | **Stone Axe** (Rìu đá) | Lv2 | `4 Wood, 4 Stones` | Cận chiến | `+3` | Quái địch mở khóa theo `enemyAxesTime` |
| `4` | **Bone Mace** (Chùy xương) | Lv2 | `5 Wood, 3 Bones` | Cận chiến mạnh nhất | **`+5`** | Ưu tiên số 1 cho chiến binh cận chiến |
| `5` | **Tomahawk** (Rìu bay) | Lv3 | `4 Wood, 4 Bones` | Tầm xa mạnh nhất (`spd=40`) | **`+3`** | Ưu tiên số 1 cho lính ném & đứng trên Tower |
| `6` | **Net Trap** (Bẫy lưới) | Lv1 | `10 Wood` | Bẫy tàng hình `1×1` | **10 dmg** + trói animation | Thợ Armourer vác ra đặt đúng ô đã chọn |
| `7` | **Spring Trap** (Bẫy lò xo) | Lv2 | `10 Wood, 5 Stones` | Bẫy tàng hình `1×1` | **20 dmg** + hất văng | Phá hiện bởi Scout `scoutingSkill >= 6` |
| `8` | **Pit Trap** (Hố chông) | Lv3 | `5 Wood, 10 Stones` | Bẫy tàng hình `1×1` | **30 dmg** | Bẫy sau khi bật sẽ chuyển trạng thái phân rã (`decay`) |
| `9` | *(Tay không)* | — | — | Cận chiến tay không | `+0` | Không thể vào Gym/Range rèn nếu chưa cầm vũ khí |

### 4.2. Công thức Tính Sát thương Chiến đấu
- **Sát thương cận chiến (`meleeStrike`):**
  $$\text{BaseDmg} = \text{meleeDamageBySkill}[\text{meleeSkill}] + \text{weaponDamage}[\text{weapon}]$$
  Trong đó bảng `meleeDamageBySkill[0..9] = [1, 1, 1, 2, 2, 3, 3, 4, 6, 8]`. (Tức kỹ năng `9` + `Bone Mace` gây tới $8 + 5 = 13$ dmg mỗi đòn, hoặc $19$ dmg dưới hào quang Chief!).
- **Sát thương tầm xa (`projectileHit`):**
  $$\text{ProjDmg} = \left\lfloor \frac{\left(\lfloor \text{throwingSkill}/3 \rfloor + \text{weaponDamage}[\text{weapon}]\right) \times \text{rand}(\text{acc}..11)}{10} \right\rfloor$$
  Đạn biết tự động đón đầu mục tiêu đang chạy (`leadMovingTarget`) và vạch quỹ đạo parabol theo `projectileHeights`.
- **Hào quang & Phép Bảo hộ:**
  - Phe Player ở trong phạm vi $\pm 4$ ô quanh Chief: **$\times 1.5$ sát thương**.
  - Đánh vào Công trình (`Building`): bị chia đôi giáp công trình (`dmg / 2`).
  - Mục tiêu đang có cờ **`q.PROTECTED` (Phép Defence)**: **giảm 50% sát thương nhận vào** (`dmg / 2`).
  - Đòn đánh mạnh (`>= FIRST_POWER_ATTACK`) làm nạn nhân choáng (`W.STAGGER`).

### 4.3. 4 Phép Thuật của Shaman tại Sanctuary
- **Lv1 (`Healing` — Chữa thương):** Khôi phục **+10 HP** mỗi nhịp và **xóa ngay trạng thái nhiễm bệnh (`q.INFECTED`)**. Có thể chỉ định trực tiếp mục tiêu trên bản đồ hoặc đưa người vào Sanctuary nằm nghỉ.
- **Lv1 (`Defence` — Giáp thần):** Gắn cờ `q.PROTECTED` cho đồng minh trong **120 chu kỳ**, giảm một nửa mọi sát thương nhận vào.
- **Lv2 (`Niagra Love Potion` — Thuốc tình yêu):** Tăng ngay `happiness = 99` cho mục tiêu và ép gọi thuật toán **ghép đôi lập tức (`tryToFormCouple`)** để dắt nhau vào lều sinh con!
- **Lv2 (`Disease` — Dịch hạch):** Tạo vùng dịch bệnh `3×3` tại tọa độ mục tiêu (tồn tại `100` chu kỳ). Bất kỳ người lớn nào đi qua (bạn lẫn thù!) đều bị dính cờ `q.INFECTED`, bị mất máu liên tục mỗi 32 tick và **lây nhiễm sang cả người ở cạnh hoặc ở chung trong cùng một tòa nhà** (biểu tượng `SICK_INSIDE`)!

---

## 5. Hệ thống Gameplay: Kinh tế, Đời sống, Hôn nhân, AI Địch & Điểm số

### 5.1. Kinh tế 4 Tài nguyên & Vòng lặp "Meals"
- **4 tài nguyên kho (`Store`, giới hạn 999 mỗi loại cho Player):** `Food` (Thực phẩm thô từ quả mọng, cây thuốc/rau, thịt thú, cá), `Wood` (Gỗ đốn từ rừng `FOREST`), `Stones` (Đá khai thác từ mỏ đá), `Bones` (Xương nhặt từ đống xương sau khi thú thối rữa).
- **Cơ chế Bếp (`Kitchen` & `Meals`):** Đầu bếp (`Cook`) ra **Store** lấy `Food` thô (tối đa 9 phần/lượt) mang về **Kitchen** nấu thành **`Meals` (Suất ăn)** trữ tối đa 40 suất. Dân làng đói sẽ chạy vào Kitchen ăn `Meals` chứ không ăn trực tiếp `Food` thô ở kho! Khi vận chuyển hoặc xây dựng, dân làng trong bản gốc & bản clone `4_prehistoric_tribes_clone/` mang hàng theo tải trọng `cargoCapacity` (`2..3` đơn vị trong bảng dữ liệu gốc; bản remake `3_web_game/` nâng lên `15`).

### 5.2. Vòng đời Nhu cầu, Hôn nhân ("Tent-time") & Sinh sản
- **Ngưỡng nhu cầu:** Khi `energy <= 20` (hoặc `50` nếu `happiness <= 5`), dân tự về giường riêng (`bedHut`) ở **Hut** để ngủ; nếu không có lều (`bedHut <= 0`) sẽ phải ngủ ngoài trời (`SLEEP_OUTSIDE`) và báo alert **`NO_LIVING_SPACE`**. Tương tự với đói $\rightarrow$ **Kitchen** (`STARVING`), tụt tinh thần (`happiness <= 30`) $\rightarrow$ **Disco** (`DEPRESSED_TRIBE`).
- **Đình công (Strike):** Khi **`happiness < 10`**, dân làng từ chối mọi mệnh lệnh lao động thông thường (*"leave me alone, tyrant! i'm depressed."*), chỉ miễn cưỡng nghe lệnh nếu đang `Call to Arms!` hoặc đang `Form Up!`.
- **Sinh sản (`updateHutBirths` & `md` Romance):**
  1. Player cần trống thời gian hồi sinh sản (`BREEDING_TIMER < 0`, hồi mỗi `750` ticks), một cặp Nam + Nữ người lớn đều có `happiness >= 75` và có ít nhất 1 `Hut` còn trống chỗ.
  2. Hai người hẹn gặp tại **`LOVE_NEST`** hoặc điểm hẹn trước lều (`LOVERS_MEETING`), trao `LOVE_TOKEN` bằng nụ hôn (`W.KISS` / `W.BE_KISSED`), rồi cùng bước vào lều (`U.MAKE_LOVE`).
  3. Sau 9 nhịp đếm trong lều, em bé `age = 2` ra đời (`W.NEWBORN`)! Trẻ lớn lên đến `age = 12` sẽ tự động chuyển sang người trưởng thành (`growUp`), nhận chân dung người lớn và sẵn sàng học nghề.

### 5.3. AI Quân Địch (`enemyCamp`)
AI địch không hề đẻ quân vô tội vạ mà mô phỏng gần như y hệt một bộ lạc hoàn chỉnh:
- Có `campPlan` cố định để **tự sửa chữa** nhà hư hỏng (`hp < maxHp/3`) và **nâng cấp** lên cấp quy định (`campPlanLevel`), thậm chí **xây lại** nhà bị phá nếu còn chỗ.
- Chia quân theo thứ hạng (`enemyRanks`): nhóm lính top đầu giữ chốt cố định quanh căn cứ/tháp canh (`guardPosts`), còn lại tự vào **Gym / Range / PIA** rèn kỹ năng cho tới khi đạt ngưỡng `enemyRecruitTraits` của độ khó **Easy** hoặc **Hard**.
- **Phản ứng xâm nhập:** Kiểm tra định kỳ xem quân Player có lọt vào `enemyCampArea` (`campIntruder`) hay không để báo động toàn trại quay về bảo vệ.
- **Tổ chức Raid:** Theo chu kỳ `raidInterval` (bị cắt ngắn đi `raidIntervalHardCut` ở chế độ Hard), tuyển nhóm quân raider (mạnh dần theo thời gian đến `raidMaxSize`) hành quân qua các tọa độ `raidWaypoints` hướng tới Chief's Hut của Player.
- **Công nghệ theo thời gian:** Ở các màn sau, qua mốc `enemyAxesTime` địch có Rìu Đá; qua `enemyHeavyWeaponsTime` địch có Bone Mace & Tomahawk; đặt bẫy tại `enemyTrapAreas` và Shaman địch thả phép **Disease** xuống khu vực Player (`enemyDiseaseAreas`).

### 5.4. Tính Điểm (`RESULTS`) & Mã Gian lận (`Cheats`)
- **Công thức tính tổng điểm (`showResults`):**
  $$\text{Score} = \frac{\text{Born}\times 15 + \text{Built}\times 25 + \text{Destroyed}\times 60 + \text{Killed}\times 40 + \text{Gathered}\times 1}{10}$$
- **Mã Cheat chuẩn (Bấm chuỗi phím `8 - 7 - 3 - 9 - 1` rồi thêm 1 phím):**
  - `87391 + 1`: Mở khóa toàn bộ 5 chương Campaign (`UNLOCK_ALL`).
  - `87391 + 3`: Chế độ bất tử đơn vị Player (`unusedCheatFlag`).
  - `87391 + 7`: Cộng ngay `+100` Meals/Food/Wood/Stones/Bones và `+3` Clubs/Stone Axes/Tomahawks (`RESOURCES`).
  - `87391 + 9`: Thắng ngay màn hiện tại (`WIN_LEVEL`).

---

## 6. Toàn bộ Các Trạng thái Hệ thống

### 6.1. Trạng thái Màn hình Game (`z` Screen IDs — 32 màn hình) & Vòng lặp Chính (`ui`)
- **Trạng thái Engine (`ui`):** `MENU (0)`, `PLAYING (1)`, `STARTING (2)`.
- **Chế độ Con trỏ & Tương tác Gameplay (`D` Interaction Mode):**
  - `FREE_CURSOR (0)`: Con trỏ tự do soi bản đồ / chọn đối tượng.
  - `COMMANDING (1)`: Đang chọn 1 hoặc 1 nhóm dân làng (`Group 7`/`Group 9`/Box Selection) để ra lệnh di chuyển/tấn công/khai thác.
  - `CONTEXT_MENU (2)`: Đang mở thanh lệnh công trình (`Context Bar`) hoặc bảng lệnh làng (`Village Commands`) hoặc bảng xây dựng (`Build Menu`).
  - `PLACING (3)`: Đang đặt bản thiết kế công trình, đặt cờ tập kết (`RALLY_POINT`), đặt bẫy, chỉ định mục tiêu phép Shaman, hoặc chọn người cầm vũ khí từ Store (`SELECT_VILLAGER`).
  - `CONFIRMING (4)`: Xác nhận phá hủy công trình (`DEMOLISH?`) hoặc hộp thoại "Không có gì làm ở đây".
- **Danh sách 32 Screen IDs (`z`):**
  - `0..1`: `MAIN_MENU` / `MAIN_MENU_WITH_MORE_GAMES`
  - `2`: `PLAY_MENU` (`Campaign`, `Custom Game`)
  - `3`: `GAME_MODE` (`Continue`, `New Game`)
  - `4..8`: Menu chọn Chương `1..5` (mở khóa dần theo tiến độ `campaignProgress`)
  - `9`: `CUSTOM_MAP_MENU` (5 bản đồ tự do)
  - `10..11`: `PAUSE_MENU_WITH_LOAD` / `PAUSE_MENU` (`Resume, Load, Save, Options, Help, Quit`)
  - `12`: `OPTIONS` (`Music`, `Hints`, `Language`)
  - `13`: `DIFFICULTY` (`Easy`, `Hard`)
  - `14`: `SLOT_MENU` / `LANGUAGE_MENU`
  - `15`: `TEXT_PAGES` (4 trang `Help` + `About` + `Contacts`/`Install`)
  - `16`: `QUESTION` (Hộp thoại Yes/No: Tutorial?, Overwrite?, Quit?, Play Again?)
  - `17`: `CUTSCENE` (Khung phim cắt cảnh 2 dải đen + chân dung + camera tự động)
  - `18`: `STORY` (Khung dẫn truyện toàn màn hình với tranh minh họa)
  - `19`: `MINIMAP` (Bản đồ thu nhỏ toàn cảnh)
  - `20`: `ALERT` (Cảnh báo khẩn kèm chân dung & nút `Go There` / `Dismiss`)
  - `21..23`: `SAVE_RESULT`, `PLEASE_WAIT_DIALOG`, `PLEASE_WAIT_PAGE`
  - `24`: `RESULTS` (`Hurrah! You've won!` / `You have lost!` + bảng điểm)
  - `25`: `QUICK_MENU` (Giải thích nhanh HUD bằng phím `0`)
  - `27`: `PAUSED_POPUP`
  - `28..29`: `GAMEPLAY` / `ENTER_GAMEPLAY`
  - `30..31`: `EXIT_PROMPT` / `LOAD_OR_CONTINUE`

### 6.2. Trạng thái Công trình (`_`), Fog of War (`ti`) & Hôn nhân (`_u` / `vu`)
- **Trạng thái Công trình (`_`):** `NORMAL (0)`, `UPGRADING (1)`, `REPAIRING (2)`, `DESTROYED (3)` — ngoài ra ô chiếm dụng `type` từ `12..19` là đang là **Công trường xây dựng (`CONSTRUCTION_SITE`)** và `20..22` là **Bẫy (`NET/SPRING/PIT_TRAP`)**.
- **Cờ Công trình (`Ar` / `jr`):** `WORK_CANCELLED (1)`, `UNDER_ATTACK (128)`, `SICK_INSIDE (2)`.
- **Trạng thái Sương mù (`ti`):** `VISIBLE (0 — thấy cả lính địch & tài nguyên)`, `EXPLORED (1 — đã mở bản đồ nhưng mờ, chỉ thấy công trình/địa hình tĩnh)`, `UNEXPLORED (2 — đen hoàn toàn)`.
- **Trạng thái Tình cảm Cặp đôi (`_u`):** `FREE (0)` $\rightarrow$ `FORMED (1)` $\rightarrow$ `MEETING (2)` $\rightarrow$ `IN_HUT (3)`; Payload của `Hut` tương ứng (`vu`): `NONE (0)` $\rightarrow$ `RESERVED (1)` $\rightarrow$ `IN_USE (2)` $\rightarrow$ `LOVE (3)` $\rightarrow$ đếm ngược sinh con.

### 6.3. Toàn bộ 17 Nghề (`ec`), 8 Bit Cờ Nhân vật (`q`), Trạng thái Lệnh (`K`) & 112 Tác vụ (`U`)

- **17 Nghề nghiệp (`ec`):**
  `0: NONE`, `1: BERRY_PICKER`, `2: WOODCUTTER`, `3: BUTCHER`, `4: FISHER`, `5: STONECUTTER`, `6: PLANT_GATHERER`, `7: BONE_COLLECTOR`, `8: ARMOURER`, `9: COOK`, `10: DJ`, `11: SHAMAN`, `12: BUILDER`, `13: SCOUT`, `14: MELEE_FIGHTER`, `15: THROWER`, `16: GUARD`.
- **8 Bit Cờ Trạng thái Nhân vật (`q`):**
  - `UNOBSERVED (1)`: Scout hiện không nằm trong tầm nhìn kẻ địch nào.
  - `HIDDEN (2)`: Scout đang ngụy trang ẩn thân trong bụi rậm.
  - `INFECTED (4)`: Bị dính phép Dịch bệnh (`Disease`), tụt máu dần và lây lan.
  - `PROTECTED (8)`: Đang có khiên phép `Defence` (-50% sát thương nhận vào trong 120 ticks).
  - `CASTING (16)`: Shaman đang niệm phép.
  - `RALLYING (32)`: Đang chạy tập hợp về điểm hẹn hoặc bảo vệ trại.
  - `MOBILIZED (64)`: Đã vào trạng thái quân ngũ (`Call to Arms` / `Form Up` / `Raid`).
  - `STOP_AFTER_PREY (128)`: Tự động ngừng lại sau khi hạ xong thú săn.
- **Trạng thái Lệnh (`K`):** `NONE (0)`, `ACTIVE (1 — đang thực thi lệnh)`, `INTERACT (2 — người chơi vừa click ra lệnh)`, `PERFORM_TASK (3 — lệnh hệ thống tự chạy task)`, `FOLLOW (4 — bám đuổi mục tiêu)`.
- **Giai đoạn Thực thi trong Nhà (`rc`):** `LEAVING (-3)`, `SETTLED (-2)`, `ENTERING (-1)`, `IDLE (0)`, `WORKING (1)`.
- **Nhóm 112 Tác vụ (`U`, `0..111`):**
  - `0..9` (Combat): `ATTACK_UNIT_ORDERED (0)`, `ATTACK_UNIT (1)`, `HUNT_ANIMAL (2)`, `ATTACK_BUILDING_ORDERED (3)`, `ATTACK_BUILDING (4)`, `THROW_AT_UNIT_ORDERED (5)`, `THROW_AT_ANIMAL (7)`, `THROW_AT_BUILDING (9)` (+ các slot cận chiến/tầm xa tương ứng).
  - `10..16` (Khai thác ngoài trời): `GATHER_BERRIES (10)`, `CHOP_WOOD (11)`, `BUTCHER_CARCASS (12)`, `FISH (13)`, `QUARRY_STONE (14)`, `GATHER_PLANTS (15)`, `COLLECT_BONES (16)`.
  - `17..18`: `CHILD_PLAY (17)`, tương tác nhỏ `(18)`.
  - `19..27` (Vận chuyển về kho / Đặt bẫy): `DELIVER_BONES..FISHER` (`19..25`), `DELIVER_WEAPON (26)`, `CARRY_TRAP (27)`.
  - `28..36`: Lấy nguyên liệu tại Store về Armoury chế tạo `club..pit_trap` (`FETCH_ARMOURY_MATERIAL`).
  - `37`: `FETCH_KITCHEN_FOOD` (Lấy `Food` thô về Kitchen nấu `Meals`).
  - `38..43`: Lấy vật liệu xây dựng (`WOOD / BONES / STONES` x5 hoặc x10) về công trường (`FETCH_BUILDING_MATERIAL`).
  - `44..50`: Lấy vũ khí trang bị từ Store (`TAKE_CLUB..TAKE_TOMAHAWK`, `ARM_FOR_BATTLE`).
  - `51..68` (Công việc bên trong nhà): `GET_HEALED (51)`, `FORGE_WEAPON/TRAP (52..53)`, `COOK_MEAL (54)`, `HEAL_PATIENT (55)`, `BUILD (56)`, `WORK_AS_SHAMAN (57)`, `WORK_AS_ARMOURER (58)`, `LEAVE_BUILDING (59)`, `WAIT_FOR_CARCASS (60)`, luyện Gym (`61..64`), `REST_IN_HUT (65)`, `WORK_AS_COOK (66)`, ăn tại Kitchen (`67..68`).
  - `69..99` (Đời sống & Phép thuật): `IDLE (69)`, `EAT_MEAL (70..71)`, `THROWING_PRACTICE (72)`, `NURSERY_PLAY (73..75)`, `REPAIR (76)`, `WORK_AS_BUILDER (77)`, `BUILDER_WAIT (78)`, `SLEEP_OUTSIDE (79)`, `WAKE_UP (80)`, gác `Tower` (`81..82`), `INTERLUDE (83..85)` (tán gẫu đứng nghỉ), `WORK_AS_DJ (86)`, `WALK_TO_TARGET (87)`, tiệc tùng/nhảy múa Disco (`88..91, 98`), tháp canh bắn (`92..93`), Shaman thi triển 4 phép (`CAST_HEALING=94, CAST_DEFENCE=95, CAST_LOVE_POTION=96, CAST_DISEASE=97`), `FETCH_EXTRA_BUILDING_WOOD (99)`.
  - `100..111`: Luyện `PIA Center` (`100..102`), họp ở `Chief's Hut` (`103..104`), diễn `CUTSCENE (105)`, tháp canh bắn thú (`106`), địch bắt cóc trẻ (`KIDNAP_CHILD=107`), animation chạy/ngạc nhiên (`108`), `WAIT_FOR_LOVER (109)`, `SEEK_LOVER (110)`, `MAKE_LOVE (111)`.

### 6.4. Toàn bộ 11 Biểu cảm trên đầu (`moodEmotes`), 21 Hộp thoại Cảnh báo (`alerts`) & 16 Thông báo Thanh dưới (`notices`)
- **11 Emotes (`moodEmotes`):** Đói (`0`, food 0..20), Tình yêu (`1`, task 109..111), Mệt (`2`, energy 0..20), Phản đối/Buồn bã (`3`, happiness 0..15), Mức vui theo 5 bậc 0..99 (`4..8`), Không nhà ở (`9`, `bedHut <= 0`), Ý tưởng khi đang nghỉ (`10`, fidget).
- **21 Alerts (`wr` — hiện popup có chân dung & nút Focus):** Đói cần Kitchen (`0`), Thiếu nhà ở (`1`), Trầm cảm cần Disco (`2`), Cần Shaman chữa bệnh (`3`), Địch tới (`4`), Bị thú ăn thịt (`5`), Cần vũ khí cận chiến cho Gym (`6`), Cần vũ khí ném cho Range (`7`), Cần Giáo để câu cá (`8`), Người lớn không được vào Nursery (`9`), Chief sẽ đánh nếu dân thường vào Chief's Hut (`10`), Cấm trẻ em lao động (`11`), Dân buồn đình công (`12`), Làm phiền riêng tư trong Hut (`13`), Đói cồn cào (`14`), Kiệt sức (`15`), **Trẻ em bị thú ăn thịt cần Nursery** (`16`), **Trẻ em bị địch bắt cóc cần Nursery** (`17`), **Chief chết cần chọn Chief mới** (`18`), Nói nhảm một mình (`19`), Mất bản đồ/Cartographer ở màn Escape (`20`).
- **16 Notices (`Dr` — chạy chữ góc dưới bấm `[1]` nhảy tới):** `SELECT_A_CHIEF (0)`, `BORN (1..2)`, `DIED (3..4)`, `BUILDING_READY (5)`, `ENEMY_SIGHTED (6)`, `UNDER_ATTACK (7)`, `BUILDING_LOST (8)`, `NEED_RESOURCES (9)`, `MAX_BUILDINGS (10)`, `MAX_VILLAGERS (11)`, `NEED_COOK (12)`, `NEED_SHAMAN (13)`, `NEED_ARMOURER (14)`, `NEED_DJ (15)`.
