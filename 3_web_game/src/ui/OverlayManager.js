/**
 * OverlayManager.js — Toàn bộ giao diện đồ họa mới bằng tài nguyên gốc & HD của Prehistoric Tribes:
 * Khung da thú + gỗ (`ui_dialogue_panel.png`), Biểu ngữ đá (`ui_resource_banner.png`),
 * Tranh minh họa chủ đạo (`l2.png`, `portrait_chief.jpg`, `portrait_mumbo.jpg`, `building_hut.jpg`,
 * `nature_fruit_bush.jpg`, `animal_mammoth.jpg`) & Bộ bách khoa Codex trực quan.
 */
import { CAMPAIGN_LEVELS, CUTSCENES } from '../data/GameData.js';
import { SaveManager } from '../simulation/SaveManager.js';

const CHAPTER_ART = {
  0: './assets/images/l2.png',
  1: './assets/images/building_hut.jpg',
  2: './assets/images/nature_fruit_bush.jpg',
  3: './assets/images/sample_pack/dino_dinosaurs_trex_adult_01.png',
  4: './assets/images/sample_pack/dino_rocks_volcanic_small_smoking_volcano_01.png',
  5: './assets/images/animal_mammoth.jpg',
  6: './assets/images/portrait_chief.jpg',
  7: './assets/images/sample_pack/dino_water_swamp_lily_pad_pond_01.png',
  8: './assets/images/sample_pack/dino_rocks_volcanic_small_smoking_volcano_01.png',
  9: './assets/images/sample_pack/dino_trees_prehistoric_palm_tree_01.png',
  10: './assets/images/sample_pack/dino_dinosaurs_trex_adult_01.png',
  11: './assets/images/l2.png'
};

export class OverlayManager {
  constructor(app) {
    this.app = app;
    this.backdrop = document.getElementById('overlay-backdrop');
    this.card = document.getElementById('overlay-card');
    this.activeCutscene = null;
    this.cutsceneLineIdx = 0;
  }

  hide() {
    if (this.backdrop) this.backdrop.classList.add('hidden');
  }

  show() {
    if (this.backdrop) this.backdrop.classList.remove('hidden');
  }

  isOpen() {
    return this.backdrop && !this.backdrop.classList.contains('hidden');
  }

  renderMainMenu() {
    this.app.isPaused = true;
    this.app.sound?.setTheme('menu');
    const settings = SaveManager.loadSettings();
    const hasCamp = SaveManager.hasSave(false);
    const hasCustom = SaveManager.hasSave(true);

    this.card.innerHTML = `<div class="modal-inner">
      <div class="modal-banner-title">PREHISTORIC TRIBES</div>
      <div class="modal-sub">HD Graphical Edition • Bộ Lạc Avnotaklu &amp; Đế Chế Tiền Sử (12 Màn RLE &amp; MIDI Gốc)</div>

      <div class="hero-menu-split">
        <div class="splash-art-box">
          <img class="key-art" src="./assets/images/l2.png" alt="Prehistoric Tribes Key Art" />
          <div class="splash-caption">
            <img src="./assets/images/portrait_chief.jpg" style="width:36px;height:36px;border-radius:50%;border:1.5px solid #facc15;object-fit:cover;" alt="Chief" />
            <div><b style="color:#fde047;">Chiến dịch Avnotaklu</b><br/>Nhạc MIDI gốc + 208+ sprites HD 8 hướng Isometric</div>
          </div>
        </div>

        <div class="menu-grid">
          <button class="menu-btn" data-menu="start_campaign">
            <img class="card-thumb" src="./assets/images/building_hut.jpg" alt="New" />
            <div>Chơi Mới (Chiến Dịch)<span class="small-desc">Từ Màn 0 Tutorial khám phá cốt truyện 12 màn gốc.</span></div>
          </button>

          <button class="menu-btn" data-menu="continue_campaign" ${hasCamp ? '' : 'disabled'}>
            <img class="card-thumb" src="./assets/images/sprites_hd/bld_chiefs_hut.png" alt="Continue" />
            <div>Tiếp Tục Chiến Dịch<span class="small-desc">${hasCamp ? 'Tải bản lưu Campaign gần nhất.' : 'Chưa có bản lưu Campaign.'}</span></div>
          </button>

          <button class="menu-btn" data-menu="select_chapter">
            <img class="card-thumb" src="./assets/images/portrait_mumbo.jpg" alt="Chapters" />
            <div>Chọn Chương (0–6)<span class="small-desc">Đã mở tới Chương ${settings.unlockedLevel}/6 trên bản đồ gốc.</span></div>
          </button>

          <button class="menu-btn" data-menu="select_custom">
            <img class="card-thumb" src="./assets/images/animal_mammoth.jpg" alt="Custom" />
            <div>Bản Đồ Tự Do (1–5)<span class="small-desc">${hasCustom ? 'Có bản lưu • ' : ''}5 chiến trường T-Rex &amp; Barbarian.</span></div>
          </button>

          <button class="menu-btn" data-menu="options">
            <img class="card-thumb" src="./assets/images/sprites_hd/icon_tools_axe_hammer.png" alt="Opt" />
            <div>Tùy Chọn &amp; MIDI<span class="small-desc">Độ khó: <b>${settings.difficulty.toUpperCase()}</b> | MIDI: ${settings.musicEnabled ? 'BẬT' : 'TẮT'}</span></div>
          </button>

          <button class="menu-btn" data-menu="help">
            <img class="card-thumb" src="./assets/images/sprites_hd/bld_sanctuary.png" alt="Codex" />
            <div>Bách Khoa Toàn Thư<span class="small-desc">Xem trọn bộ Nhà cửa, Vũ khí, Phép &amp; Thú tiền sử.</span></div>
          </button>

          <button class="menu-btn" data-menu="about">
            <img class="card-thumb" src="./assets/images/icon.png" alt="About" />
            <div>Giới Thiệu Tác Phẩm<span class="small-desc">THQ / Gear Games 2008 • Dữ liệu dịch ngược &amp; Web Port.</span></div>
          </button>
        </div>
      </div>
    </div>`;
    this.show();
    this.bindMenuClicks();
  }

  renderChapters() {
    const settings = SaveManager.loadSettings();
    const campaignMaps = CAMPAIGN_LEVELS.filter((l) => !l.isCustom);

    this.card.innerHTML = `<div class="modal-inner">
      <div class="modal-banner-title">CHỌN CHƯƠNG CHIẾN DỊCH</div>
      <div class="modal-sub">Tất cả bản đồ sử dụng dữ liệu map-0..4.bin gốc của Prehistoric Tribes</div>
      <div class="menu-grid">
        ${campaignMaps.map((lvl) => {
          const unlocked = lvl.id <= Math.max(1, settings.unlockedLevel || 1);
          const best = settings.bestScores?.[lvl.id];
          const thumb = CHAPTER_ART[lvl.id] || './assets/images/building_hut.jpg';
          return `
            <button class="menu-btn" data-start-level="${lvl.id}" ${unlocked ? '' : 'disabled'}>
              <img class="card-thumb" src="${thumb}" alt="${lvl.name}" />
              <div>${lvl.vnName}<span class="small-desc">${lvl.playSize[0]}×${lvl.playSize[1]} tiles • ${best ? `Kỷ lục: ${best}đ` : lvl.objectiveText.slice(0, 50) + '...'}</span></div>
            </button>
          `;
        }).join('')}
      </div>
      <div class="modal-footer">
        <button class="btn-secondary" data-menu="unlock_all">Mở Khóa Tất Cả Màn</button>
        <button class="btn-secondary" data-menu="main_menu">Quay Lại</button>
      </div>
    </div>`;
    this.show();
    this.bindMenuClicks();
  }

  renderCustomMaps() {
    const settings = SaveManager.loadSettings();
    const customMaps = CAMPAIGN_LEVELS.filter((l) => l.isCustom);
    const hasCustom = SaveManager.hasSave(true);

    this.card.innerHTML = `<div class="modal-inner">
      <div class="modal-banner-title">BẢN ĐỒ TỰ DO (CUSTOM MAPS)</div>
      <div class="modal-sub">5 chiến trường đối kháng cổ điển từ map-5.bin đến map-9.bin</div>
      <div class="menu-grid">
        ${customMaps.map((lvl) => {
          const best = settings.bestScores?.[lvl.id];
          const thumb = CHAPTER_ART[lvl.id] || './assets/images/animal_mammoth.jpg';
          return `
            <button class="menu-btn" data-start-level="${lvl.id}">
              <img class="card-thumb" src="${thumb}" alt="${lvl.name}" />
              <div>${lvl.vnName}<span class="small-desc">${lvl.playSize[0]}×${lvl.playSize[1]} • ${best ? `Kỷ lục: ${best}đ` : 'Tiêu diệt toàn bộ trại địch'}</span></div>
            </button>
          `;
        }).join('')}
        <button class="menu-btn" data-menu="continue_custom" ${hasCustom ? '' : 'disabled'}>
          <img class="card-thumb" src="./assets/images/sprites_hd/bld_storehouse.png" alt="Load" />
          <div>Tiếp Tục Custom Đã Lưu<span class="small-desc">${hasCustom ? 'Khôi phục trận Custom gần nhất.' : 'Chưa có bản lưu Custom.'}</span></div>
        </button>
      </div>
      <div class="modal-footer">
        <button class="btn-secondary" data-menu="main_menu">Quay Lại</button>
      </div>
    </div>`;
    this.show();
    this.bindMenuClicks();
  }

  renderOptions() {
    const s = SaveManager.loadSettings();
    this.card.innerHTML = `<div class="modal-inner">
      <div class="modal-banner-title">TÙY CHỌN HỆ THỐNG</div>
      <div class="modal-sub">Độ khó AI, Nhạc MIDI Nguyên Bản &amp; Sương mù chiến tranh</div>
      <div class="menu-grid">
        <button class="menu-btn" data-opt="difficulty">
          <img class="card-thumb" src="./assets/images/sprites_hd/icon_portrait_warrior.png" alt="Diff" />
          <div>Độ Khó: <span style="color:#fde047;">${s.difficulty === 'hard' ? 'HARD (Khó)' : 'EASY (Dễ)'}</span>
          <span class="small-desc">Hard: Địch đông hơn, tập kích nhanh gấp đôi &amp; mạnh hơn.</span></div>
        </button>
        <button class="menu-btn" data-opt="music">
          <img class="card-thumb" src="./assets/images/sprites_hd/bld_disco.png" alt="MIDI" />
          <div>Nhạc MIDI Gốc (0–4): <span style="color:#fde047;">${s.musicEnabled ? 'BẬT (ON)' : 'TẮT (OFF)'}</span>
          <span class="small-desc">Giải mã trực tiếp 5 track MIDI gốc (Title, Calm, Combat, Victory, Defeat).</span></div>
        </button>
        <button class="menu-btn" data-opt="fog">
          <img class="card-thumb" src="./assets/images/sprites_hd/bld_watchtower.png" alt="Fog" />
          <div>Sương Mù Chiến Tranh: <span style="color:#fde047;">${s.fogEnabled ? 'BẬT (ON)' : 'TẮT (OFF)'}</span>
          <span class="small-desc">Trinh sát PIA &amp; Tháp Canh mở rộng tầm nhìn xuyên bóng tối.</span></div>
        </button>
      </div>
      <div class="modal-footer">
        <button class="btn-secondary" data-menu="main_menu">Lưu &amp; Quay Lại</button>
      </div>
    </div>`;
    this.show();
    this.bindMenuClicks();
  }

  renderHelp() {
    this.card.innerHTML = `<div class="modal-inner">
      <div class="modal-banner-title">BÁCH KHOA SINH TỒN AVNOTAKLU</div>
      <div style="font-size:12.5px;line-height:1.55;color:#f1f5f9;display:grid;gap:10px;">
        <div><b style="color:#fde047;">Điều khiển RTS Hiện đại:</b> <b>Click Trái</b> chọn quân / công trình | <b>Kéo Trái</b> khoanh đội hình | <b>Click Phải</b> ra lệnh thông minh (Chặt gỗ, Đập đá quarry, Hái dâu, Câu cá, Săn thú, Xây/Nâng cấp/Vào Nhà, Công thành) | <b>WASD</b> cuộn map | <b>Space</b> về Chief | <b>[C]</b> Call to Arms | <b>[G]</b> Form Up | <b>[F]</b> Ẩn thân | <b>[Shift+7/9] &amp; [7/9]</b> Lưu &amp; gọi tổ đội | <b>[1]</b> Nhảy tới điểm báo động.</div>
        <div><b style="color:#fde047;">Hệ sinh thái &amp; Công trình Trực quan:</b></div>
        <div class="codex-grid">
          <div class="codex-item"><img src="./assets/images/sprites_hd/bld_chiefs_hut.png" /><div><b>Chief's Hut</b><br/><small>Hào quang Chief +25%</small></div></div>
          <div class="codex-item"><img src="./assets/images/sprites_hd/bld_bone_hut.png" /><div><b>Hut Lv1–Lv3</b><br/><small>+4 chỗ ở, Tent-time</small></div></div>
          <div class="codex-item"><img src="./assets/images/sprites_hd/bld_kitchen.png" /><div><b>Kitchen (Cook)</b><br/><small>Nấu Food → Meals (+HP)</small></div></div>
          <div class="codex-item"><img src="./assets/images/sprites_hd/bld_armoury.png" /><div><b>Armoury Lv1–3</b><br/><small>Rèn Vũ khí &amp; 3 loại Bẫy</small></div></div>
          <div class="codex-item"><img src="./assets/images/sprites_hd/bld_sanctuary.png" /><div><b>Sanctuary</b><br/><small>Healing, Defence, Love, Disease</small></div></div>
          <div class="codex-item"><img src="./assets/images/sprites_hd/bld_pia_shrine.png" /><div><b>PIA Centre</b><br/><small>Trinh sát Ẩn thân &amp; Soi bẫy</small></div></div>
          <div class="codex-item"><img src="./assets/images/sprites_hd/animal_mammoth.png" /><div><b>Woolly Mammoth</b><br/><small>160 HP • 120 Thịt, 40 Xương</small></div></div>
          <div class="codex-item"><img src="./assets/images/sample_pack/dino_dinosaurs_trex_adult_01.png" /><div><b>T-Rex Apex</b><br/><small>280 HP • Khủng long bạo chúa</small></div></div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-secondary" data-menu="main_menu">Đóng Bách Khoa</button>
      </div>
    </div>`;
    this.show();
    this.bindMenuClicks();
  }

  renderAbout() {
    this.card.innerHTML = `<div class="modal-inner">
      <div class="modal-banner-title">GIỚI THIỆU PREHISTORIC TRIBES</div>
      <div class="cutscene-speaker-box">
        <img src="./assets/images/l2.png" alt="Splash" />
        <div style="font-size:13px;line-height:1.6;color:#f1f5f9;">
          <p><b style="color:#fde047;">Prehistoric Tribes</b> (© 2008 THQ Wireless Inc. / Gear Games, Ltd.) — Phiên bản <b>HD Web Remake</b> tái hiện trọn vẹn 12 màn chơi giải mã từ <code>map-0..9.bin</code>, 5 bản nhạc MIDI nguyên bản, bộ UI đá-da thú vẽ tay hoàn toàn và hơn 208 tài nguyên HD Isometric.</p>
          <p style="margin-top:8px;color:#4ade80;"><b>Mã Cheat bí mật bản gốc:</b> Gõ nhanh chuỗi phím <b>87391</b> rồi nhấn <b>1</b> (Mở bản đồ), <b>3</b> (Hồi đầy máu), <b>7</b> (Thắng màn), hoặc <b>9</b> (+1000 Tài nguyên).</p>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-secondary" data-menu="main_menu">Quay Lại</button>
      </div>
    </div>`;
    this.show();
    this.bindMenuClicks();
  }

  renderPauseMenu() {
    this.app.isPaused = true;
    this.card.innerHTML = `<div class="modal-inner">
      <div class="modal-banner-title">TẠM DỪNG TRÒ CHƠI</div>
      <div class="modal-sub">${this.app.currentLevelConfig?.vnName || 'Prehistoric Tribes'}</div>
      <div class="menu-grid">
        <button class="menu-btn" data-menu="resume_game">
          <img class="card-thumb" src="./assets/images/sprites_hd/icon_portrait_warrior.png" alt="Play" />
          <div>Tiếp Tục Chơi<span class="small-desc">Quay trở lại chỉ huy bộ lạc Avnotaklu.</span></div>
        </button>
        <button class="menu-btn" data-menu="save_game">
          <img class="card-thumb" src="./assets/images/sprites_hd/bld_storehouse.png" alt="Save" />
          <div>Lưu Trò Chơi (Save)<span class="small-desc">Lưu toàn bộ dân làng, công trình &amp; tài nguyên.</span></div>
        </button>
        <button class="menu-btn" data-menu="restart_level">
          <img class="card-thumb" src="./assets/images/sprites_hd/icon_tools_axe_hammer.png" alt="Restart" />
          <div>Chơi Lại Màn Này<span class="small-desc">Khởi động lại màn hiện tại từ đầu.</span></div>
        </button>
        <button class="menu-btn" data-menu="help_ingame">
          <img class="card-thumb" src="./assets/images/sprites_hd/bld_sanctuary.png" alt="Help" />
          <div>Xem Bách Khoa Nhanh<span class="small-desc">Tra cứu công trình, vũ khí, phím tắt.</span></div>
        </button>
        <button class="menu-btn" data-menu="main_menu">
          <img class="card-thumb" src="./assets/images/l2.png" alt="Exit" />
          <div>Thoát Về Menu Chính<span class="small-desc">Nhớ lưu game trước khi thoát.</span></div>
        </button>
      </div>
    </div>`;
    this.show();
    this.bindMenuClicks();
  }

  renderCutscene(cutsceneId) {
    const cs = CUTSCENES[cutsceneId];
    if (!cs || !cs.lines || cs.lines.length === 0) return false;
    this.activeCutscene = cs;
    this.cutsceneLineIdx = 0;
    this.app.isPaused = true;
    this.renderCurrentCutsceneLine();
    return true;
  }

  renderCurrentCutsceneLine() {
    if (!this.activeCutscene) return;
    const line = this.activeCutscene.lines[this.cutsceneLineIdx];
    if (!line) {
      this.activeCutscene = null;
      this.app.isPaused = false;
      this.hide();
      return;
    }

    const portraitPath = line.speaker === 'Chief' || line.speaker === 'Jafar' || line.speaker === 'Cannibal'
      ? './assets/images/portrait_chief.jpg'
      : line.speaker === 'Narrator'
        ? './assets/images/l2.png'
        : line.speaker === 'PIA Scout'
          ? './assets/images/sprites_hd/icon_portrait_warrior.png'
          : './assets/images/portrait_mumbo.jpg';

    const isLast = this.cutsceneLineIdx >= this.activeCutscene.lines.length - 1;
    this.card.innerHTML = `<div class="modal-inner">
      <div class="modal-banner-title" style="font-size:20px;">${this.activeCutscene.title}</div>
      <div class="modal-sub">Lời thoại ${this.cutsceneLineIdx + 1} / ${this.activeCutscene.lines.length}</div>
      <div class="cutscene-speaker-box">
        <img src="${portraitPath}" alt="${line.speaker}" />
        <div>
          <div style="font-family:'Cinzel',serif;font-weight:800;color:#fde047;font-size:17px;margin-bottom:5px;">${line.speaker}</div>
          <div style="font-size:14.5px;line-height:1.58;color:#f8fafc;">"${line.text}"</div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-secondary" data-cutscene="skip">Bỏ Qua</button>
        <button class="btn-primary" data-cutscene="next">${isLast ? 'Vào Trận Chiến!' : 'Tiếp Tục &raquo;'}</button>
      </div>
    </div>`;
    this.show();
    this.card.querySelector('[data-cutscene="next"]')?.addEventListener('click', () => {
      this.app.sound?.playBeep(660, 'sine', 0.08);
      this.cutsceneLineIdx++;
      this.renderCurrentCutsceneLine();
    });
    this.card.querySelector('[data-cutscene="skip"]')?.addEventListener('click', () => {
      this.app.sound?.playBeep(520, 'sine', 0.08);
      this.activeCutscene = null;
      this.app.isPaused = false;
      this.hide();
    });
  }

  renderChiefSelection(candidates) {
    this.app.isPaused = true;
    this.card.innerHTML = `<div class="modal-inner">
      <div class="modal-banner-title" style="color:#fca5a5;">TÙ TRƯỞNG ĐÃ TỬ TRẬN!</div>
      <div class="modal-sub">Chọn người kế vị lãnh đạo tộc Avnotaklu (+25% Aura chiến đấu &amp; sản xuất).</div>
      <div class="menu-grid">
        ${candidates.map((u) => {
          const thumb = u.isWarrior ? './assets/images/sprites_hd/icon_portrait_warrior.png' : u.gender === 'female' ? './assets/images/sprites_hd/icon_portrait_female.png' : './assets/images/portrait_mumbo.jpg';
          return `
            <button class="menu-btn" data-heir-id="${u.id}">
              <img class="card-thumb" src="${thumb}" alt="${u.name}" />
              <div>${u.name} (${u.gender === 'female' ? 'Nữ' : 'Nam'}, ${u.age}t)
              <span class="small-desc">${u.isWarrior ? `${u.warriorStars}★ Chiến Binh` : 'Dân thường'} • HP ${Math.floor(u.health)}/${u.maxHealth}</span></div>
            </button>
          `;
        }).join('')}
      </div>
    </div>`;
    this.show();
    this.card.querySelectorAll('[data-heir-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const heirId = Number(btn.getAttribute('data-heir-id'));
        this.app.appointNewChief(heirId);
        this.app.isPaused = false;
        this.hide();
      });
    });
  }

  renderRoster() {
    this.app.isPaused = true;
    const villagers = this.app.villagers.filter((v) => !v.isEnemy && v.health > 0);
    this.card.innerHTML = `<div class="modal-inner">
      <div class="modal-banner-title">DANH SÁCH BỘ LẠC (${villagers.length})</div>
      <div class="modal-sub">Click vào thành viên để chọn và nhảy camera tới vị trí hiện tại</div>
      <div style="max-height:52vh;overflow-y:auto;">
        <table class="roster-table">
          <thead>
            <tr style="color:#fde047;"><th>Tên</th><th>Vai trò</th><th>Máu</th><th>Đói / Mệt</th><th>Vũ khí</th><th>Trạng thái</th></tr>
          </thead>
          <tbody>
            ${villagers.map((v) => `
              <tr class="roster-row" data-roster-id="${v.id}">
                <td><b>${v.name}</b> ${v.isChief ? '(Chief)' : ''}</td>
                <td>${v.isChild ? 'Trẻ em' : v.isWarrior ? `${v.warriorStars}★ Warrior` : (v.role || 'Dân')}</td>
                <td style="color:#4ade80;">${Math.floor(v.health)}/${v.maxHealth}</td>
                <td>${Math.floor(v.hunger)}% / ${Math.floor(v.tiredness)}%</td>
                <td>${v.weapon !== 'none' ? v.weapon : (v.isWarrior ? v.warriorMode : '-')}</td>
                <td style="color:#38bdf8;">${v.state}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      <div class="modal-footer">
        <button class="btn-secondary" data-menu="resume_game">Đóng [V]</button>
      </div>
    </div>`;
    this.show();
    this.card.querySelectorAll('[data-roster-id]').forEach((row) => {
      row.addEventListener('click', () => {
        const vid = Number(row.getAttribute('data-roster-id'));
        this.app.focusVillagerById(vid);
        this.app.isPaused = false;
        this.hide();
      });
    });
    this.bindMenuClicks();
  }

  renderResults(isVictory, reasonText) {
    this.app.isPaused = true;
    const stats = this.app.matchStats;
    const totalScore = SaveManager.calculateScore(stats);
    const curId = this.app.currentLevelConfig?.id ?? 0;
    const hasNext = isVictory && !this.app.currentLevelConfig?.isCustom && curId < 6;

    if (isVictory) {
      SaveManager.recordBestScore(curId, totalScore);
      if (!this.app.currentLevelConfig?.isCustom) {
        SaveManager.unlockNextCampaignLevel(curId);
      }
      this.app.sound?.setTheme('victory');
    } else {
      this.app.sound?.setTheme('defeat');
    }

    this.card.innerHTML = `<div class="modal-inner">
      <div class="modal-banner-title" style="color:${isVictory ? '#4ade80' : '#fca5a5'};">
        ${isVictory ? "HURRAH! CHIẾN THẮNG VẺ VANG!" : "BỘ LẠC ĐÃ THẤT BẠI!"}
      </div>
      <div class="modal-sub">${reasonText}</div>
      <table class="results-table">
        <tr><td>Trẻ em chào đời (Born)</td><td>${stats.born} (×15)</td></tr>
        <tr><td>Công trình đã xây (Built)</td><td>${stats.built} (×25)</td></tr>
        <tr><td>Nhà địch bị phá hủy (Razed)</td><td>${stats.razed} (×60)</td></tr>
        <tr><td>Kẻ thù bị tiêu diệt (Killed)</td><td>${stats.killed} (×40)</td></tr>
        <tr><td>Tổng tài nguyên thu thập (Gathered)</td><td>${Math.floor(stats.gathered)}</td></tr>
        <tr style="font-size:18px;border-top:2px solid #f59e0b;"><td><b>TỔNG ĐIỂM CHIẾN DỊCH</b></td><td>${totalScore}</td></tr>
      </table>
      <div class="modal-footer">
        <button class="btn-secondary" data-menu="main_menu">Menu Chính</button>
        <button class="btn-secondary" data-menu="restart_level">Chơi Lại</button>
        ${hasNext ? `<button class="btn-primary" data-start-level="${curId + 1}">Chương Tiếp Theo &raquo;</button>` : ''}
      </div>
    </div>`;
    this.show();
    this.bindMenuClicks();
  }

  bindMenuClicks() {
    this.card.querySelectorAll('[data-menu]').forEach((el) => {
      el.addEventListener('click', () => {
        const action = el.getAttribute('data-menu');
        this.app.sound?.ensureContext();
        this.app.sound?.playBeep(520, 'sine', 0.08);
        if (action === 'start_campaign') {
          this.hide();
          this.app.startLevel(0);
        } else if (action === 'continue_campaign') {
          const snap = SaveManager.loadMatch(false);
          if (snap) {
            this.hide();
            this.app.loadSnapshot(snap);
          }
        } else if (action === 'continue_custom') {
          const snap = SaveManager.loadMatch(true);
          if (snap) {
            this.hide();
            this.app.loadSnapshot(snap);
          }
        } else if (action === 'select_chapter') {
          this.renderChapters();
        } else if (action === 'select_custom') {
          this.renderCustomMaps();
        } else if (action === 'unlock_all') {
          const s = SaveManager.loadSettings();
          s.unlockedLevel = 6;
          SaveManager.saveSettings(s);
          this.renderChapters();
        } else if (action === 'options') {
          this.renderOptions();
        } else if (action === 'help') {
          this.returnToPause = false;
          this.renderHelp();
        } else if (action === 'help_ingame') {
          this.returnToPause = true;
          this.renderHelp();
        } else if (action === 'about') {
          this.renderAbout();
        } else if (action === 'main_menu') {
          if (this.returnToPause) {
            this.returnToPause = false;
            this.renderPauseMenu();
          } else {
            this.renderMainMenu();
          }
        } else if (action === 'resume_game') {
          this.app.isPaused = false;
          this.hide();
        } else if (action === 'save_game') {
          this.app.saveCurrentGame();
          this.renderPauseMenu();
        } else if (action === 'restart_level') {
          this.hide();
          this.app.startLevel(this.app.currentLevelConfig?.id ?? 0);
        }
      });
    });

    this.card.querySelectorAll('[data-start-level]').forEach((el) => {
      el.addEventListener('click', () => {
        const lvl = Number(el.getAttribute('data-start-level'));
        this.app.sound?.ensureContext();
        this.app.sound?.playBeep(620, 'triangle', 0.12);
        this.hide();
        this.app.startLevel(lvl);
      });
    });

    this.card.querySelectorAll('[data-opt]').forEach((el) => {
      el.addEventListener('click', () => {
        const opt = el.getAttribute('data-opt');
        const s = SaveManager.loadSettings();
        if (opt === 'difficulty') {
          s.difficulty = s.difficulty === 'easy' ? 'hard' : 'easy';
        } else if (opt === 'music') {
          s.musicEnabled = !s.musicEnabled;
          this.app.sound?.setMusicEnabled(s.musicEnabled);
        } else if (opt === 'fog') {
          s.fogEnabled = !s.fogEnabled;
          this.app.fogEnabled = s.fogEnabled;
        }
        SaveManager.saveSettings(s);
        this.app.syncHudButtons();
        this.renderOptions();
      });
    });
  }
}
