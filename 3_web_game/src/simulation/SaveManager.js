/**
 * SaveManager.js — Quản lý lưu trữ tiến trình Campaign, Custom Map, Cài đặt & Công thức tính điểm gốc.
 */

const KEYS = {
  SETTINGS: 'pt_web_remake_settings_v1',
  CAMPAIGN_SAVE: 'pt_web_remake_campaign_save_v1',
  CUSTOM_SAVE: 'pt_web_remake_custom_save_v1'
};

function getStorage() {
  try {
    if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
      return globalThis.localStorage;
    }
  } catch {
    return null;
  }
  return null;
}

export class SaveManager {
  static getDefaultSettings() {
    return {
      musicEnabled: true,
      difficulty: 'easy', // 'easy' | 'hard'
      tutorialEnabled: true,
      fogEnabled: true,
      unlockedLevel: 1, // Tutorial (0) & Lv 1 (Outside) open; Lv 0->6 unlock progression
      bestScores: {}
    };
  }

  static loadSettings() {
    const store = getStorage();
    const defaults = SaveManager.getDefaultSettings();
    if (!store) return defaults;
    try {
      const raw = store.getItem(KEYS.SETTINGS);
      if (!raw) return defaults;
      return { ...defaults, ...JSON.parse(raw) };
    } catch {
      return defaults;
    }
  }

  static saveSettings(settings) {
    const store = getStorage();
    if (!store) return false;
    try {
      store.setItem(KEYS.SETTINGS, JSON.stringify(settings));
      return true;
    } catch {
      return false;
    }
  }

  static unlockNextCampaignLevel(completedLevelId) {
    const settings = SaveManager.loadSettings();
    const nextId = Math.min(6, completedLevelId + 1);
    if (nextId > (settings.unlockedLevel || 1)) {
      settings.unlockedLevel = nextId;
    }
    SaveManager.saveSettings(settings);
    return settings;
  }

  static recordBestScore(levelId, score) {
    const settings = SaveManager.loadSettings();
    settings.bestScores = settings.bestScores || {};
    if (!settings.bestScores[levelId] || score > settings.bestScores[levelId]) {
      settings.bestScores[levelId] = score;
      SaveManager.saveSettings(settings);
    }
  }

  /**
   * Công thức tính điểm chuẩn dịch ngược từ engine gốc:
   * Score = floor((Born * 15 + Built * 25 + Razed * 60 + Killed * 40 + Gathered) / 10)
   */
  static calculateScore({ born = 0, built = 0, razed = 0, killed = 0, gathered = 0 } = {}) {
    return Math.max(0, Math.floor((born * 15 + built * 25 + razed * 60 + killed * 40 + gathered) / 10));
  }

  static saveMatch(snapshot) {
    const store = getStorage();
    if (!store || !snapshot) return false;
    const key = snapshot.isCustom ? KEYS.CUSTOM_SAVE : KEYS.CAMPAIGN_SAVE;
    try {
      store.setItem(key, JSON.stringify({ ...snapshot, savedAt: Date.now() }));
      return true;
    } catch {
      return false;
    }
  }

  static loadMatch(isCustom = false) {
    const store = getStorage();
    if (!store) return null;
    const key = isCustom ? KEYS.CUSTOM_SAVE : KEYS.CAMPAIGN_SAVE;
    try {
      const raw = store.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  static hasSave(isCustom = false) {
    return Boolean(SaveManager.loadMatch(isCustom));
  }

  static clearSave(isCustom = false) {
    const store = getStorage();
    if (!store) return;
    store.removeItem(isCustom ? KEYS.CUSTOM_SAVE : KEYS.CAMPAIGN_SAVE);
  }
}
