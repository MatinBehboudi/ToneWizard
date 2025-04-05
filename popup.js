function hexToRgb(hex) {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
  const num = parseInt(hex, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}
function rgbToHex([r, g, b]) {
  return "#" + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  const d = max - min;
  if (d === 0) h = s = 0;
  else {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
      case g: h = ((b - r) / d + 2); break;
      case b: h = ((r - g) / d + 4); break;
    }
    h *= 60;
  }
  return [h % 360, s, l];
}
function hslToRgb(h, s, l) {
  h = (h % 360 + 360) % 360;
  h /= 360;
  if (s === 0) {
    const gray = Math.round(l * 255);
    return [gray, gray, gray];
  }
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const r = hue2rgb(p, q, h + 1 / 3);
  const g = hue2rgb(p, q, h);
  const b = hue2rgb(p, q, h - 1 / 3);
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
function generateColorHarmony(baseHex) {
  const baseRgb = hexToRgb(baseHex);
  const [h, s, l] = rgbToHsl(...baseRgb);
  const rotate = deg => (h + deg + 360) % 360;
  return {
    base: baseHex.toLowerCase(),
    complementary: rgbToHex(hslToRgb(rotate(180), s, l)),
    analogous: [
      rgbToHex(hslToRgb(rotate(-30), s, l)),
      rgbToHex(hslToRgb(rotate(30), s, l))
    ],
    splitComplementary: [
      rgbToHex(hslToRgb(rotate(150), s, l)),
      rgbToHex(hslToRgb(rotate(210), s, l))
    ],
    triadic: [
      rgbToHex(hslToRgb(rotate(120), s, l)),
      rgbToHex(hslToRgb(rotate(240), s, l))
    ],
    tetradic: [
      rgbToHex(hslToRgb(rotate(90), s, l)),
      rgbToHex(hslToRgb(rotate(180), s, l)),
      rgbToHex(hslToRgb(rotate(270), s, l))
    ]
  };
}
document.getElementById('generateBtn').addEventListener('click', () => {
  const hex = document.getElementById('hexInput').value.trim();
  const results = document.getElementById('results');
  results.innerHTML = '';
  try {
    const palette = generateColorHarmony(hex);
    for (const [type, values] of Object.entries(palette)) {
      const title = document.createElement('h3');
      title.textContent = type.toUpperCase();
      results.appendChild(title);
      const colors = Array.isArray(values) ? values : [values];
      const row = document.createElement('div');
      row.className = 'color-row';
      for (const color of colors) {
        const box = document.createElement('div');
        box.className = 'color-box';
        box.style.backgroundColor = color;
        box.textContent = color;
        row.appendChild(box);
      }
      results.appendChild(row);
    }
  } catch {
    results.textContent = "⚠️ً: #ff0000)";
  }
});