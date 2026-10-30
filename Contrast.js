.pragma library

// WCAG contrast for a panel drawn from one ink.
//
// Everything in this plugin is the theme foreground, dimmed with Qt.darker or
// an opacity. That reads on a dark theme, but on a light one the same recipe
// lands at 3:1 or less, and a theme's own colours (urgent, a profile's
// yellow) can sit closer still. Each colour is computed here as it will
// actually appear, composited over the surface it is drawn on, and pushed
// away from that surface only as far as it must go: text to 4.5:1, icons and
// state marks to 3:1. A colour that already passes comes back unchanged, so
// a theme that was fine looks the same. Adapted from omarcal's Logic.js.

function parseColor(value) {
  var text = String(value || "").trim()
  var six = /^#([0-9a-fA-F]{6})$/.exec(text)
  if (six) {
    return { r: parseInt(six[1].substr(0, 2), 16),
             g: parseInt(six[1].substr(2, 2), 16),
             b: parseInt(six[1].substr(4, 2), 16) }
  }
  // QML stringifies a colour with alpha as #AARRGGBB; the alpha is dropped
  // here because contrast is measured on the composited result.
  var eight = /^#([0-9a-fA-F]{8})$/.exec(text)
  if (eight) {
    return { r: parseInt(eight[1].substr(2, 2), 16),
             g: parseInt(eight[1].substr(4, 2), 16),
             b: parseInt(eight[1].substr(6, 2), 16) }
  }
  return null
}

function hexOf(rgb) {
  function part(v) {
    var clamped = Math.max(0, Math.min(255, Math.round(v)))
    var s = clamped.toString(16)
    return s.length < 2 ? "0" + s : s
  }
  return "#" + part(rgb.r) + part(rgb.g) + part(rgb.b)
}

function channelLuminance(value) {
  var v = value / 255
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
}

function relativeLuminance(color) {
  var rgb = parseColor(color)
  if (!rgb) return 0
  return 0.2126 * channelLuminance(rgb.r)
       + 0.7152 * channelLuminance(rgb.g)
       + 0.0722 * channelLuminance(rgb.b)
}

function contrastRatio(a, b) {
  var first = relativeLuminance(a), second = relativeLuminance(b)
  var lighter = Math.max(first, second), darker = Math.min(first, second)
  return (lighter + 0.05) / (darker + 0.05)
}

function mixColor(from, to, amount) {
  return { r: from.r + (to.r - from.r) * amount,
           g: from.g + (to.g - from.g) * amount,
           b: from.b + (to.b - from.b) * amount }
}

// `top` painted at `alpha` over the opaque `bottom`, as one hex colour: what
// a translucent fill or an opacity really shows. Returns `bottom` unchanged
// when either side can't be parsed.
function over(top, alpha, bottom) {
  var t = parseColor(top), b = parseColor(bottom)
  if (!t || !b) return String(bottom)
  return hexOf(mixColor(b, t, Math.max(0, Math.min(1, alpha))))
}

// Whichever of white and black stands out more against `background`. Not
// "luminance below 0.5": the crossover is about 0.18, and a mid-grey surface
// picked by the 0.5 rule gets pushed toward the weaker end and never passes.
function farthestFrom(background) {
  var white = { r: 255, g: 255, b: 255 }, black = { r: 0, g: 0, b: 0 }
  return contrastRatio(hexOf(white), background) >= contrastRatio(hexOf(black), background) ? white : black
}

// `foreground` lightened or darkened just enough to reach `minRatio` against
// every one of `surfaces` (the panel, a hovered row, a boxed section). The
// direction is fixed once, away from the first surface, and one bisection
// checks them all, so a pass for one surface can never undo another.
// Returns a hex string: the input when it already passes or can't be parsed,
// the white or black limit when even that falls short.
function ensureContrastOn(foreground, surfaces, minRatio) {
  var target = minRatio || 4.5
  var fg = parseColor(foreground)
  var list = []
  for (var i = 0; i < surfaces.length; i++) {
    var rgb = parseColor(surfaces[i])
    if (rgb) list.push(hexOf(rgb))
  }
  if (!fg || list.length === 0) return String(foreground)
  function worst(color) {
    var hex = hexOf(color), low = Infinity
    for (var j = 0; j < list.length; j++) low = Math.min(low, contrastRatio(hex, list[j]))
    return low
  }
  if (worst(fg) >= target) return hexOf(fg)

  var limit = farthestFrom(list[0])
  if (worst(limit) < target) return hexOf(limit)

  var lo = 0, hi = 1
  for (var step = 0; step < 24; step++) {
    var mid = (lo + hi) / 2
    if (worst(mixColor(fg, limit, mid)) >= target) hi = mid
    else lo = mid
  }
  return hexOf(mixColor(fg, limit, hi))
}

// The single-surface form.
function ensureContrast(foreground, background, minRatio) {
  return ensureContrastOn(foreground, [background], minRatio)
}
