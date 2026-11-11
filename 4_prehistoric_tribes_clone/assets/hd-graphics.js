/**
 * hd-graphics.js — Runtime HD (4x) Canvas2D Graphics Bridge cho Prehistoric Tribes.
 * Giữ nguyên 100% logic game 1x và tọa độ cắt sprites.json, đồng thời vẽ toàn bộ tài nguyên
 * ở độ phân giải 4x sắc nét từ res/images-hd/ lên bề mặt GPU HTMLCanvasElement.
 */

export const HD_SCALE = 4;
const HD_IMAGE_MAP = new Map();
let scratchCanvas = null;
let scratchCtx = null;

function ensureScratch(w, h) {
  if (!scratchCanvas) {
    scratchCanvas = document.createElement('canvas');
    scratchCtx = scratchCanvas.getContext('2d');
  }
  if (scratchCanvas.width < w) scratchCanvas.width = w;
  if (scratchCanvas.height < h) scratchCanvas.height = h;
  return { canvas: scratchCanvas, ctx: scratchCtx };
}

export function argbToCss(argb) {
  const hex = (argb & 0xffffff) >>> 0;
  return `#${hex.toString(16).padStart(6, '0')}`;
}

export function createHdCanvas(width, height, fillCss = null) {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, width * HD_SCALE);
  canvas.height = Math.max(1, height * HD_SCALE);
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  if (fillCss) {
    ctx.fillStyle = fillCss;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  return { canvas, ctx };
}

export function resolveHdImageUrl(baseUrl, resKey) {
  const clean = resKey.startsWith('/') ? resKey.slice(1) : resKey;
  if (clean === 'icon.png') return `${baseUrl}res/images-hd/icon.png`;
  if (clean.startsWith('images/')) return `${baseUrl}res/images-hd/${clean.slice(7)}`;
  return null;
}

export async function preloadHdAsset(baseUrl, resKey) {
  const url = resolveHdImageUrl(baseUrl, resKey);
  if (!url || HD_IMAGE_MAP.has(resKey)) return;
  try {
    const img = new Image();
    img.decoding = 'async';
    img.src = url;
    await img.decode();
    HD_IMAGE_MAP.set(resKey, img);
  } catch (err) {
    console.warn(`[hd] Could not load HD asset "${resKey}" from "${url}", using fallback:`, err);
  }
}

export function getHdImage(resKey) {
  const clean = resKey.startsWith('/') ? resKey.slice(1) : resKey;
  return HD_IMAGE_MAP.get(clean) || null;
}

export function buildFallbackHdFromPixels(width, height, pixels) {
  const { canvas, ctx } = createHdCanvas(width, height);
  const srcCanvas = document.createElement('canvas');
  srcCanvas.width = width;
  srcCanvas.height = height;
  const sctx = srcCanvas.getContext('2d');
  const imgData = sctx.createImageData(width, height);
  const out = new Uint32Array(imgData.data.buffer);
  for (let i = 0; i < pixels.length; i++) {
    const p = pixels[i];
    const a = p >>> 24;
    out[i] = (a << 24) | ((p & 0xff) << 16) | (p & 0xff00) | ((p >> 16) & 0xff);
  }
  sctx.putImageData(imgData, 0, 0);
  ctx.drawImage(srcCanvas, 0, 0, canvas.width, canvas.height);
  return canvas;
}

export function hdFillDevice(target, left, top, right, bottom, argbColor) {
  if (!target.hdCtx || left >= right || top >= bottom) return;
  const ctx = target.hdCtx;
  ctx.fillStyle = argbToCss(argbColor);
  ctx.fillRect(left * HD_SCALE, top * HD_SCALE, (right - left) * HD_SCALE, (bottom - top) * HD_SCALE);
}

export function hdDrawLine(target, bounds, x1, y1, x2, y2, argbColor) {
  if (!target.hdCtx) return;
  const ctx = target.hdCtx;
  ctx.save();
  ctx.beginPath();
  ctx.rect(
    bounds.left * HD_SCALE,
    bounds.top * HD_SCALE,
    Math.max(0, bounds.right - bounds.left) * HD_SCALE,
    Math.max(0, bounds.bottom - bounds.top) * HD_SCALE
  );
  ctx.clip();
  ctx.fillStyle = argbToCss(argbColor);
  ctx.strokeStyle = argbToCss(argbColor);
  if (x1 === x2 && y1 === y2) {
    ctx.fillRect(x1 * HD_SCALE, y1 * HD_SCALE, HD_SCALE, HD_SCALE);
  } else {
    ctx.lineWidth = HD_SCALE;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo((x1 + 0.5) * HD_SCALE, (y1 + 0.5) * HD_SCALE);
    ctx.lineTo((x2 + 0.5) * HD_SCALE, (y2 + 0.5) * HD_SCALE);
    ctx.stroke();
  }
  ctx.restore();
}

export function hdDrawRegion(target, bounds, srcImg, sx, sy, sw, sh, transform, dx, dy) {
  if (!target.hdCtx || !srcImg.hd || sw <= 0 || sh <= 0) return;
  if (bounds.right <= bounds.left || bounds.bottom <= bounds.top) return;

  const ctx = target.hdCtx;
  const S = HD_SCALE;
  const Ssx = sx * S;
  const Ssy = sy * S;
  const Ssw = sw * S;
  const Ssh = sh * S;

  ctx.save();
  ctx.beginPath();
  ctx.rect(
    bounds.left * S,
    bounds.top * S,
    (bounds.right - bounds.left) * S,
    (bounds.bottom - bounds.top) * S
  );
  ctx.clip();
  ctx.translate(dx * S, dy * S);

  switch (transform) {
    case 1: ctx.transform(1, 0, 0, -1, 0, Ssh); break;
    case 2: ctx.transform(-1, 0, 0, 1, Ssw, 0); break;
    case 3: ctx.transform(-1, 0, 0, -1, Ssw, Ssh); break;
    case 4: ctx.transform(0, 1, 1, 0, 0, 0); break;
    case 5: ctx.transform(0, 1, -1, 0, Ssh, 0); break;
    case 6: ctx.transform(0, -1, 1, 0, 0, Ssw); break;
    case 7: ctx.transform(0, -1, -1, 0, Ssh, Ssw); break;
    default: break;
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(srcImg.hd, Ssx, Ssy, Ssw, Ssh, 0, 0, Ssw, Ssh);
  ctx.restore();
}

export function hdCopyArea(target, bounds, srcX, srcY, w, h, dstX, dstY) {
  if (!target.hdCtx || !target.hd || w <= 0 || h <= 0) return;
  const S = HD_SCALE;
  const sw = w * S;
  const sh = h * S;
  const { canvas: tmp, ctx: tctx } = ensureScratch(sw, sh);
  tctx.clearRect(0, 0, sw, sh);
  tctx.drawImage(target.hd, srcX * S, srcY * S, sw, sh, 0, 0, sw, sh);

  const ctx = target.hdCtx;
  ctx.save();
  ctx.beginPath();
  ctx.rect(
    bounds.left * S,
    bounds.top * S,
    Math.max(0, bounds.right - bounds.left) * S,
    Math.max(0, bounds.bottom - bounds.top) * S
  );
  ctx.clip();
  ctx.drawImage(tmp, 0, 0, sw, sh, dstX * S, dstY * S, sw, sh);
  ctx.restore();
}

export function hdCopyRowPattern(target, rowY, srcX, dstStart, dstEnd, period) {
  if (!target.hdCtx || !target.hd || dstStart >= dstEnd || period <= 0) return;
  const S = HD_SCALE;
  const ctx = target.hdCtx;
  const { canvas: tmp, ctx: tctx } = ensureScratch(period * S, S);
  tctx.clearRect(0, 0, period * S, S);
  tctx.drawImage(target.hd, srcX * S, rowY * S, period * S, S, 0, 0, period * S, S);

  let x = dstStart;
  while (x < dstEnd) {
    const chunk = Math.min(period, dstEnd - x);
    ctx.drawImage(tmp, 0, 0, chunk * S, S, x * S, rowY * S, chunk * S, S);
    x += chunk;
  }
}

export function hdCopyRowSlice(target, srcRowY, dstRowY, startX, endX) {
  if (!target.hdCtx || !target.hd || startX >= endX) return;
  const S = HD_SCALE;
  target.hdCtx.drawImage(
    target.hd,
    startX * S, srcRowY * S, (endX - startX) * S, S,
    startX * S, dstRowY * S, (endX - startX) * S, S
  );
}

export function hdCapturePanelBg(bufferObj, panelHeight) {
  const { canvas, ctx } = createHdCanvas(240, panelHeight);
  if (bufferObj.hd) {
    const S = HD_SCALE;
    ctx.drawImage(bufferObj.hd, 11 * S, 8 * S, 240 * S, panelHeight * S, 0, 0, 240 * S, panelHeight * S);
  }
  return canvas;
}

function getMirrorStrip(bgHdCanvas, windowLeft, tileSpan = 32) {
  const S = HD_SCALE;
  if (!bgHdCanvas._mirrorCache) bgHdCanvas._mirrorCache = new Map();
  const key = `${windowLeft}:${tileSpan}`;
  let strip = bgHdCanvas._mirrorCache.get(key);
  if (strip) return strip;

  const h = bgHdCanvas.height;
  strip = document.createElement('canvas');
  strip.width = tileSpan * 2 * S;
  strip.height = h;
  const sctx = strip.getContext('2d');
  sctx.imageSmoothingEnabled = false;
  // Half 1: [0 .. tileSpan)
  sctx.drawImage(bgHdCanvas, windowLeft * S, 0, tileSpan * S, h, 0, 0, tileSpan * S, h);
  // Half 2: mirrored [tileSpan .. 2*tileSpan)
  sctx.save();
  sctx.translate(tileSpan * 2 * S, 0);
  sctx.scale(-1, 1);
  sctx.drawImage(bgHdCanvas, windowLeft * S, 0, tileSpan * S, h, 0, 0, tileSpan * S, h);
  sctx.restore();
  bgHdCanvas._mirrorCache.set(key, strip);
  return strip;
}

export function hdMirrorBgRow(target, dstRowY, bgHdCanvas, bgRowY, windowLeft, contentX, startX, endX, tileSpan = 32) {
  if (!target.hdCtx || !bgHdCanvas || startX >= endX) return;
  const S = HD_SCALE;
  const ctx = target.hdCtx;
  const period = tileSpan * 2;
  const strip = getMirrorStrip(bgHdCanvas, windowLeft, tileSpan);

  if (startX >= contentX) {
    let x = startX;
    while (x < endX) {
      const mod = ((x - contentX) % period + period) % period;
      const chunk = Math.min(period - mod, endX - x);
      ctx.drawImage(strip, mod * S, bgRowY * S, chunk * S, S, x * S, dstRowY * S, chunk * S, S);
      x += chunk;
    }
  } else {
    // Left of contentX goes backwards: contentX - 1 - x increases as x decreases;
    // simply step per tileSpan chunk cleanly or mirror via flipped strip draw!
    let x = startX;
    while (x < endX) {
      const d = contentX - 1 - x;
      const mod = ((d % period) + period) % period;
      // Moving +1 in x decreases d by 1 -> decreases mod by 1 down to 0
      const chunk = Math.min(mod + 1, endX - x);
      const stripStart = mod - chunk + 1;
      ctx.save();
      ctx.translate((x + chunk) * S, dstRowY * S);
      ctx.scale(-1, 1);
      ctx.drawImage(strip, stripStart * S, bgRowY * S, chunk * S, S, 0, 0, chunk * S, S);
      ctx.restore();
      x += chunk;
    }
  }
}

export function hdExtendBottomSlice(target, rows, topY, srcX, dstX, sampleX) {
  if (!target.hdCtx || !target.hd) return;
  const S = HD_SCALE;
  const { canvas: tmp, ctx: tctx } = ensureScratch(20 * S, rows * S);
  tctx.save();
  tctx.imageSmoothingEnabled = false;
  tctx.clearRect(0, 0, 20 * S, rows * S);
  tctx.drawImage(target.hd, srcX * S, topY * S, 20 * S, rows * S, 0, 0, 20 * S, rows * S);
  tctx.restore();
  const ctx = target.hdCtx;
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  // Copy sampleX column per-row across the cleared [srcX .. srcX + 20) slot (mirrors row-by-row 1x fill)
  ctx.drawImage(target.hd, sampleX * S, topY * S, 1, rows * S, srcX * S, topY * S, 20 * S, rows * S);
  ctx.drawImage(tmp, 0, 0, 20 * S, rows * S, dstX * S, topY * S, 20 * S, rows * S);
  ctx.restore();
}

export function hdExtendMenuBackground(bufferObj, n, menuY, headerRows, screenHeight) {
  const ctx = bufferObj.hdCtx;
  const hd = bufferObj.hd;
  if (!ctx || !hd) return;
  const S = HD_SCALE;
  const w = hd.width;
  const rY = n + 320 - 1;
  const bottomLimit = Math.min(bufferObj.height, 8 + screenHeight);
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  if (n + 320 < bottomLimit) {
    ctx.drawImage(
      hd,
      0, rY * S, w, S,
      0, (n + 320) * S, w, (bottomLimit - (n + 320)) * S
    );
  }
  if (menuY > 0) {
    const hdrH = headerRows * S;
    const { canvas: tmp, ctx: tctx } = ensureScratch(w, hdrH);
    tctx.save();
    tctx.imageSmoothingEnabled = false;
    tctx.clearRect(0, 0, w, hdrH);
    tctx.drawImage(hd, 0, n * S, w, hdrH, 0, 0, w, hdrH);
    tctx.restore();
    const fillRowY = n + headerRows + 2;
    if (8 < n + headerRows) {
      ctx.drawImage(
        hd,
        0, fillRowY * S, w, S,
        0, 8 * S, w, (n + headerRows - 8) * S
      );
    }
    ctx.drawImage(tmp, 0, 0, w, hdrH, 0, 8 * S, w, hdrH);
  }
  ctx.restore();
}
