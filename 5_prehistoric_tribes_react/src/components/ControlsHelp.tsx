import React from 'react';

interface ControlsHelpProps {
  open: boolean;
  onClose: () => void;
}

const MOUSE: Array<[string, string]> = [
  ['Click trái', 'Chọn dân / nhà / xác nhận'],
  ['Kéo chuột trái', 'Vẽ khung chọn nhóm'],
  ['Kéo chuột phải / giữa', 'Di chuyển camera'],
  ['Click phải', 'Ra lệnh cho dân đang chọn (đi/thu thập/tấn công); không chọn ai = Hủy'],
  ['Cuộn chuột', 'Cuộn bản đồ (Shift = ngang)'],
  ['Ctrl + cuộn · - / =', 'Thu phóng'],
  ['Chạm mép màn hình', 'Cuộn bản đồ'],
];

const KEYS: Array<[string, string]> = [
  ['W A S D', 'Di chuyển camera (trong menu: điều hướng)'],
  ['Mũi tên · Enter', 'Di chuyển con trỏ · Xác nhận'],
  ['Space / H', 'Về Tộc trưởng'],
  ['Tab / Shift+Tab', 'Chọn dân kế tiếp / trước đó'],
  ['B', 'Menu xây dựng'],
  ['M', 'Bản đồ nhỏ'],
  ['C · F · X', 'Call to Arms · Form Up · Về làm việc'],
  ['V', 'Danh sách dân'],
  ['P', 'Tạm dừng / Tiếp tục'],
  ['Q · E · R', 'Menu nhanh · Phím * · Phím #'],
  ['1', 'Nhảy tới cảnh báo'],
  ['Ctrl+7 / Ctrl+9', 'Gán nhóm đang chọn (phím 7 / 9 để gọi lại)'],
  ['Esc', 'Hủy / Quay lại'],
  ['?', 'Bảng phím tắt này'],
];

export const ControlsHelp: React.FC<ControlsHelpProps> = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div className="pt-modal-backdrop" onMouseDown={onClose}>
      <section
        className="pt-modal-card pt-help"
        role="dialog"
        aria-label="Điều khiển"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <header className="pt-modal-header">
          <h2>Điều khiển bàn phím &amp; chuột</h2>
          <button type="button" className="pt-btn" onClick={onClose}>
            Đóng [Esc]
          </button>
        </header>
        <div className="pt-help-grid">
          <dl>
            <h3>Chuột</h3>
            {MOUSE.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <dl>
            <h3>Bàn phím</h3>
            {KEYS.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </div>
  );
};
