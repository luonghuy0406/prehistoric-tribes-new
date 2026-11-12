/** Vietnamese UI labels (full locale file comes with T1b). Indexes follow the engine enums. */
export const BUILDING_NAMES = [
  'Xưởng vũ khí',
  'Phòng tập',
  'Lều',
  'Lều tù trưởng',
  'Bếp',
  'Trường ném',
  'Kho',
  'Vũ trường',
  'Đền thờ',
  'Trung tâm PIA',
  'Nhà trẻ',
  'Tháp canh',
];
export const BUILDING_ICONS = ['⚒️', '💪', '🛖', '👑', '🍖', '🎯', '📦', '🪩', '🔮', '🕵️', '🧸', '🗼'];
export const BUILDING_HINTS = [
  'Chế tạo vũ khí và bẫy',
  'Luyện cận chiến',
  'Chỗ ngủ cho 4 người, nơi sinh con',
  'Nơi ở của tù trưởng',
  'Đầu bếp nấu bữa ăn',
  'Luyện ném',
  'Cất tài nguyên và vũ khí',
  'Giải trí, tăng vui vẻ',
  'Pháp sư chữa bệnh, làm phép',
  'Huấn luyện trinh sát',
  'Giữ trẻ an toàn',
  'Lính gác bắn xa',
];
/** Items 0..8 (engine enum `v`). */
export const ITEM_NAMES = ['Chuỳ gỗ', 'Đá ném', 'Giáo', 'Rìu đá', 'Chuỳ xương', 'Rìu ném', 'Bẫy lưới', 'Bẫy lò xo', 'Bẫy hố'];
/** Command ids 10..29 (engine enum `y`), index = id - 10. */
export const COMMAND_NAMES = [
  'Xây',
  'Tập hợp',
  'Báo động',
  'Dân làng',
  'Giải tán',
  'Về làm việc',
  'Nâng cấp',
  'Phá bỏ',
  'Ra ngoài',
  'Phép: chữa lành',
  'Phép: phòng thủ',
  'Phép: bùa yêu',
  'Phép: dịch bệnh',
  'Hiện: tất cả',
  'Hiện: đang chọn',
  'Hiện: tắt',
  'Sửa chữa',
  'Huỷ nâng cấp',
  'Huỷ sửa',
  'Dỡ hàng',
];
/** Jobs (engine enum `ec`). */
export const JOB_NAMES = [
  'Rảnh',
  'Hái quả',
  'Tiều phu',
  'Đồ tể',
  'Câu cá',
  'Thợ đá',
  'Hái rau',
  'Nhặt xương',
  'Thợ rèn',
  'Đầu bếp',
  'DJ',
  'Pháp sư',
  'Thợ xây',
  'Trinh sát',
  'Cận chiến',
  'Ném',
  'Lính gác',
];
export const LEVEL_NAMES = [
  'Hướng dẫn',
  'Ra khỏi hang',
  'Báo thù',
  'Đào thoát',
  'Đất hoang',
  'Ngôi nhà mới',
  'Ngôi nhà mới (kết)',
  'Tự do: Hồ lớn',
  'Tự do: Đèo sa mạc',
  'Tự do: Rừng già',
  'Tự do: Tàn sát',
  'Tự do: Mảnh đất',
];

export function commandName(id: number): string {
  if (id >= 0 && id <= 8) return ITEM_NAMES[id] ?? `#${id}`;
  return COMMAND_NAMES[id - 10] ?? `#${id}`;
}

export function capitalize(s: string): string {
  return s.replace(/(^|\s)\S/g, (c) => c.toUpperCase());
}
