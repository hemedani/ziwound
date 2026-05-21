import L from "leaflet";

interface NeonMarkerOptions {
  size?: number;
  showIcon?: boolean;
  priority?: "High" | "Medium" | "Low";
}

export function createNeonMarkerIcon(options: NeonMarkerOptions = {}): L.DivIcon {
  const { size = 32, showIcon = true, priority } = options;

  // Color adjustment based on priority
  let primaryColor = "#ef4444";
  let gradientStops = `
    <stop offset="0%" stop-color="#f87171"/>
    <stop offset="50%" stop-color="#ef4444"/>
    <stop offset="100%" stop-color="#991b1b"/>`;

  if (priority === "Medium") {
    primaryColor = "#f59e0b";
    gradientStops = `
    <stop offset="0%" stop-color="#fbbf24"/>
    <stop offset="50%" stop-color="#f59e0b"/>
    <stop offset="100%" stop-color="#b45309"/>`;
  } else if (priority === "Low") {
    primaryColor = "#22c55e";
    gradientStops = `
    <stop offset="0%" stop-color="#4ade80"/>
    <stop offset="50%" stop-color="#22c55e"/>
    <stop offset="100%" stop-color="#15803d"/>`;
  }

  const html = `
<div class="neon-marker neon-marker-hover" style="position:relative;width:${size}px;height:${size}px;">
  <div class="neon-marker-ring" style="position:absolute;top:42%;left:50%;width:${size * 0.6}px;height:${size * 0.6}px;transform:translate(-50%,-50%);border-radius:50%;border:2px solid ${primaryColor}80;"></div>
  <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" style="position:absolute;top:0;left:0;transform:translate(3px,-1px);">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" fill="url(#neonGrad-${priority || 'default'})" stroke="#fca5a5" stroke-width="0.5" opacity="0.95"/>
    <defs>
      <radialGradient id="neonGrad-${priority || 'default'}" cx="50%" cy="40%" r="60%">
        ${gradientStops}
      </radialGradient>
    </defs>
    ${showIcon ? `<circle cx="12" cy="10" r="4" fill="rgba(0,0,0,0.3)"/>
    <text x="12" y="13" text-anchor="middle" font-size="7" font-weight="bold" fill="#fecaca" font-family="system-ui">!</text>` : `<circle cx="12" cy="10" r="3" fill="rgba(255,255,255,0.9)"/>`}
  </svg>
</div>`;

  return L.divIcon({
    className: "neon-leaflet-marker",
    html,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
}

// Compact version for mini maps in cards
export function createNeonMiniMarkerIcon(): L.DivIcon {
  return createNeonMarkerIcon({ size: 24, showIcon: true });
}
