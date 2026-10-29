// A world drawn in characters: the dot of ilo's wordmark as a globe that turns, rising over hills
// that keep coming toward the viewer under a sky of a few stars, in one colour on one ground. The GPU
// works out one brightness per character cell, then draws each cell as the character for that
// brightness, so the page's main thread, which the live demo shares, only sets a few numbers a
// frame. A field draws only while it's on screen, at 30 frames a second, and holds still for reduced
// motion. Its place on the land comes from the clock, so it has moved on between visits. Where a
// mouse is, a little light falls on the characters under it.

export type Scene = {
  /** Where the horizon sits, from the top, as a share of the field's height; none for no land. */
  horizon?: number;
  /** The globe's centre and radius, in CSS pixels from the field's top left; none for no globe. */
  globe?: { x: number; y: number; r: number };
};

export type FieldOptions = {
  /** The page colour under the characters. */
  ground: string;
  /** What the field holds, worked out again whenever its size changes, in CSS pixels. */
  scene: (width: number, height: number) => Scene;
  /** How strong the brightest characters are, from 0 to 1. */
  strength?: number;
  /** The colour the brightest characters lean toward, as lit things do on a dark ground. */
  hot?: string;
  /** Whether the sky has stars. */
  stars?: boolean;
  /** Whether a light follows the mouse. */
  lamp?: boolean;
};

// From empty to full; the first is the sky.
const RAMP = " .:-=+*#%@";
// A character cell, in CSS pixels.
const CELL = [8, 14];
// The glyphs fill fixed cells, so they have to be one width.
const FONT = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"; // taste-skill-ignore
// How far the mouse's light reaches, in CSS pixels.
const LAMP = 150;

const VALUE = `#version 300 es
precision highp float;
uniform vec2 grid;
uniform vec2 cellpx;
uniform float time;
uniform float horizon;
uniform float aspect;
uniform float stars;
uniform vec3 globe;
uniform vec4 lamp;
out vec4 o;
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p), u = f * f * (3. - 2. * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float land(vec2 p) {
  float h = 0., a = .5;
  for (int i = 0; i < 5; i++) {
    h += a * noise(p);
    p = p * 2.03 + vec2(1.7, 9.2);
    a *= .5;
  }
  return h * h * 2.3;
}
float hash3(vec3 p) {
  return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
}
float noise3(vec3 p) {
  vec3 i = floor(p), f = fract(p), u = f * f * (3. - 2. * f);
  return mix(
    mix(mix(hash3(i), hash3(i + vec3(1, 0, 0)), u.x), mix(hash3(i + vec3(0, 1, 0)), hash3(i + vec3(1, 1, 0)), u.x), u.y),
    mix(mix(hash3(i + vec3(0, 0, 1)), hash3(i + vec3(1, 0, 1)), u.x), mix(hash3(i + vec3(0, 1, 1)), hash3(i + vec3(1, 1, 1)), u.x), u.y),
    u.z);
}
// The globe's land and sea, turning slowly under a light from the upper left, with a lit rim.
float world(vec2 px) {
  if (globe.z <= 0.) return -1.;
  vec2 d = (px - globe.xy) / globe.z;
  float rr = dot(d, d);
  if (rr >= 1.) return -1.;
  vec3 n = vec3(d, sqrt(1. - rr));
  float a = time * .045;
  vec3 q = vec3(n.x * cos(a) - n.z * sin(a), n.y, n.x * sin(a) + n.z * cos(a));
  float f = 0., w = .5;
  vec3 s = q * 2.1 + 4.;
  for (int i = 0; i < 4; i++) {
    f += w * noise3(s);
    s = s * 2.07 + 1.3;
    w *= .5;
  }
  float ground = smoothstep(.47, .53, f);
  float lit = clamp(dot(n, normalize(vec3(-.55, .5, .67))), 0., 1.);
  float rim = smoothstep(.82, 1., rr) * (.35 + .65 * lit);
  return clamp((.06 + .94 * lit) * mix(.34, 1., ground) + rim * .35, 0., 1.);
}
void main() {
  vec2 uv = gl_FragCoord.xy / grid;
  vec2 px = gl_FragCoord.xy * cellpx;
  float down = 1. - uv.y;
  float v = 0.;
  bool hit = false;
  if (horizon >= 0.) {
    // The eye rides above the highest hill (h stays under .97), so no hill rises past the horizon
    // into the words over it.
    vec3 ro = vec3(0., 2.3, time * .35);
    vec3 rd = normalize(vec3((uv.x - .5) * aspect, horizon - down, 1.));
    float d = .1;
    vec3 p;
    for (int i = 0; i < 96; i++) {
      p = ro + rd * d;
      float gap = p.y - land(p.xz * .35);
      if (gap < .002 * d) { hit = true; break; }
      d += max(gap * .45, .02 + d * .006);
      if (d > 64.) break;
    }
    if (hit) {
      vec2 q = p.xz * .35;
      float e = .02;
      float k = .35 / (2. * e);
      vec3 n = normalize(vec3(-(land(q + vec2(e, 0)) - land(q - vec2(e, 0))) * k, 1., -(land(q + vec2(0, e)) - land(q - vec2(0, e))) * k));
      float lit = clamp(dot(n, normalize(vec3(-.6, .7, .4))), 0., 1.);
      v = (.16 + .84 * lit) * exp(-d * .045);
    }
  }
  if (!hit) {
    float w = world(px);
    if (w >= 0.) v = w;
    else if (stars > 0. && (horizon < 0. || down < horizon)) {
      float s = hash(floor(gl_FragCoord.xy));
      v = step(.993, s) * (.12 + .1 * sin(time * 1.7 + s * 60.));
    }
  }
  if (lamp.w > 0.) {
    float l = length(px - lamp.xy) / lamp.z;
    v += lamp.w * .42 * exp(-l * l * 3.);
  }
  o = vec4(min(v, 1.), 0., 0., 1.);
}`;

const DRAW = `#version 300 es
precision highp float;
uniform sampler2D value;
uniform sampler2D atlas;
uniform ivec2 cell;
uniform int glyphs;
uniform float cols;
uniform vec3 ground, from, to, hot;
uniform float wipe, dir, frame, strength, heat;
out vec4 o;
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
void main() {
  ivec2 px = ivec2(gl_FragCoord.xy);
  ivec2 c = px / cell;
  float v = texelFetch(value, c, 0).r;
  int g = clamp(int(v * float(glyphs)), 0, glyphs - 1);
  // A new colour sweeps across from the side the Spaces moved toward, scrambling as it goes.
  float x = (float(c.x) + .5) / cols;
  float edge = dir > 0. ? x : 1. - x;
  float front = wipe * 1.12 - .06;
  vec3 ink = edge < front ? to : from;
  ink = mix(ink, hot, smoothstep(.62, 1., v) * heat);
  float near = (wipe > 0. && wipe < 1.) ? 1. - smoothstep(0., .06, abs(edge - front)) : 0.;
  float r = hash(vec2(c) + frame);
  if (r < near) g = 1 + int(r * 997.) % (glyphs - 1);
  float cover = texelFetch(atlas, ivec2(g * cell.x + px.x % cell.x, cell.y - 1 - px.y % cell.y), 0).a;
  o = vec4(mix(ground, ink, cover * mix(.4, 1., v) * strength), 1.);
}`;

const SQUARE = `#version 300 es
in vec2 at;
void main() { gl_Position = vec4(at, 0., 1.); }`;

type Live = { colour(ink: string, dir: number): void };
const fields = new Set<Live>();
let current = { ink: "#0e9f55", dir: 1 };

/** Gives every field on the page a new colour, sweeping in from `dir`'s side. */
export function paint(ink: string, dir = 1) {
  current = { ink, dir };
  for (const field of fields) field.colour(ink, dir);
}

const rgb = (hex: string) => {
  const n = Number.parseInt(hex.trim().slice(1), 16);
  return [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

/** Draws the field's scene on `canvas`, in the colour last painted. Returns a stop. */
export function startField(canvas: HTMLCanvasElement, options: FieldOptions): () => void {
  const gl = canvas.getContext("webgl2", { antialias: false, alpha: false });
  if (!gl) return () => {};
  const still = matchMedia("(prefers-reduced-motion: reduce)");

  const program = (fragment: string) => {
    const p = gl.createProgram()!;
    for (const [type, source] of [
      [gl.VERTEX_SHADER, SQUARE],
      [gl.FRAGMENT_SHADER, fragment],
    ] as const) {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, source);
      gl.compileShader(s);
      gl.attachShader(p, s);
    }
    gl.bindAttribLocation(p, 0, "at");
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) ?? "");
    const uniforms = new Proxy({} as Record<string, WebGLUniformLocation | null>, {
      get: (cache, name: string) => (cache[name] ??= gl.getUniformLocation(p, name)),
    });
    return { p, u: uniforms };
  };
  let value: ReturnType<typeof program>;
  let draw: ReturnType<typeof program>;
  try {
    value = program(VALUE);
    draw = program(DRAW);
  } catch (error) {
    console.warn("The character field didn't start.", error);
    // A canvas that can't draw would cover the ground with white.
    canvas.hidden = true;
    return () => {};
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  const texture = () => {
    const t = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, t);
    for (const [k, v] of [
      [gl.TEXTURE_MIN_FILTER, gl.NEAREST],
      [gl.TEXTURE_MAG_FILTER, gl.NEAREST],
      [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE],
      [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE],
    ])
      gl.texParameteri(gl.TEXTURE_2D, k, v);
    return t;
  };
  const atlas = texture();
  const values = texture();
  const target = gl.createFramebuffer();

  let scale = 1;
  let cw = 0;
  let ch = 0;
  let cols = 0;
  let rows = 0;
  let scene: Scene = {};
  function size() {
    scale = Math.min(devicePixelRatio || 1, 2);
    const width = Math.round(canvas.clientWidth * scale);
    const height = Math.round(canvas.clientHeight * scale);
    if (!width || !height) return false;
    canvas.width = width;
    canvas.height = height;
    cw = Math.round(CELL[0] * scale);
    ch = Math.round(CELL[1] * scale);
    cols = Math.ceil(width / cw);
    rows = Math.ceil(height / ch);
    scene = options.scene(canvas.clientWidth, canvas.clientHeight);

    const glyphs = document.createElement("canvas");
    glyphs.width = cw * RAMP.length;
    glyphs.height = ch;
    const g = glyphs.getContext("2d")!;
    g.font = `${Math.round(12 * scale)}px ${FONT}`;
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillStyle = "#fff";
    RAMP.split("").forEach((c, i) => g.fillText(c, i * cw + cw / 2, ch / 2));
    gl!.bindTexture(gl!.TEXTURE_2D, atlas);
    gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, gl!.RGBA, gl!.UNSIGNED_BYTE, glyphs);

    gl!.bindTexture(gl!.TEXTURE_2D, values);
    gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, cols, rows, 0, gl!.RGBA, gl!.UNSIGNED_BYTE, null);
    gl!.bindFramebuffer(gl!.FRAMEBUFFER, target);
    gl!.framebufferTexture2D(gl!.FRAMEBUFFER, gl!.COLOR_ATTACHMENT0, gl!.TEXTURE_2D, values, 0);
    gl!.bindFramebuffer(gl!.FRAMEBUFFER, null);
    return true;
  }

  const ground = rgb(options.ground);
  const hot = rgb(options.hot ?? options.ground);
  let from = rgb(current.ink);
  let to = from;
  let dir = 1;
  let wipeStart = -1;
  const WIPE = 700;
  let frame = 0;

  // The mouse's light, in CSS pixels from the field's top left, eased toward where the mouse is.
  const lamp = { x: 0, y: 0, on: 0, toX: 0, toY: 0, toOn: 0 };

  function render(now: number) {
    if (!cols) return;
    const time = (Date.now() / 1000) % 3600;
    gl!.bindFramebuffer(gl!.FRAMEBUFFER, target);
    gl!.viewport(0, 0, cols, rows);
    gl!.useProgram(value.p);
    gl!.uniform2f(value.u.grid, cols, rows);
    // The value pass draws a pixel per cell; a cell's centre in the field's own pixels.
    gl!.uniform2f(value.u.cellpx, cw, ch);
    gl!.uniform1f(value.u.time, time);
    gl!.uniform1f(value.u.horizon, scene.horizon ?? -1);
    gl!.uniform1f(value.u.aspect, (cols * cw) / (rows * ch));
    gl!.uniform1f(value.u.stars, options.stars ? 1 : 0);
    const globe = scene.globe;
    gl!.uniform3f(
      value.u.globe,
      globe ? globe.x * scale : 0,
      globe ? canvas.height - globe.y * scale : 0,
      globe ? globe.r * scale : 0,
    );
    lamp.x += (lamp.toX - lamp.x) * 0.2;
    lamp.y += (lamp.toY - lamp.y) * 0.2;
    lamp.on += (lamp.toOn - lamp.on) * 0.12;
    gl!.uniform4f(
      value.u.lamp,
      lamp.x * scale,
      canvas.height - lamp.y * scale,
      LAMP * scale,
      lamp.on < 0.01 ? 0 : lamp.on,
    );
    gl!.drawArrays(gl!.TRIANGLES, 0, 3);

    let wipe = 0;
    if (wipeStart >= 0) {
      wipe = still.matches ? 1 : Math.min((now - wipeStart) / WIPE, 1);
      if (wipe >= 1) {
        from = to;
        wipeStart = -1;
        wipe = 0;
      }
    }
    gl!.bindFramebuffer(gl!.FRAMEBUFFER, null);
    gl!.viewport(0, 0, canvas.width, canvas.height);
    gl!.useProgram(draw.p);
    gl!.activeTexture(gl!.TEXTURE0);
    gl!.bindTexture(gl!.TEXTURE_2D, values);
    gl!.uniform1i(draw.u.value, 0);
    gl!.activeTexture(gl!.TEXTURE1);
    gl!.bindTexture(gl!.TEXTURE_2D, atlas);
    gl!.uniform1i(draw.u.atlas, 1);
    gl!.uniform2i(draw.u.cell, cw, ch);
    gl!.uniform1i(draw.u.glyphs, RAMP.length);
    gl!.uniform1f(draw.u.cols, cols);
    gl!.uniform3fv(draw.u.ground, ground);
    gl!.uniform3fv(draw.u.from, from);
    gl!.uniform3fv(draw.u.to, to);
    gl!.uniform3fv(draw.u.hot, hot);
    gl!.uniform1f(draw.u.heat, options.hot ? 0.6 : 0);
    gl!.uniform1f(draw.u.wipe, wipe);
    gl!.uniform1f(draw.u.dir, dir);
    gl!.uniform1f(draw.u.frame, frame++ % 97);
    gl!.uniform1f(draw.u.strength, options.strength ?? 1);
    gl!.drawArrays(gl!.TRIANGLES, 0, 3);
  }

  let shown = false;
  let raf = 0;
  let last = 0;
  function tick(now: number) {
    raf = 0;
    if (!shown || document.hidden) return;
    // Reduced motion keeps one frame, and draws again only to finish a change of colour.
    if (still.matches && wipeStart < 0 && last) return;
    raf = requestAnimationFrame(tick);
    if (now - last < 1000 / 30 - 2) return;
    last = now;
    render(now);
  }
  const wake = () => {
    if (!raf && shown && !document.hidden) raf = requestAnimationFrame(tick);
  };

  const live: Live = {
    colour(ink, side) {
      if (wipeStart >= 0) from = to;
      to = rgb(ink);
      dir = side;
      wipeStart = performance.now();
      wake();
    },
  };
  fields.add(live);

  // Only a mouse lights the field, and only while it moves over it; reduced motion has no light.
  function point(event: PointerEvent) {
    if (event.pointerType !== "mouse" || still.matches || !shown) return;
    const box = canvas.getBoundingClientRect();
    const x = event.clientX - box.left;
    const y = event.clientY - box.top;
    const inside = x >= 0 && y >= 0 && x <= box.width && y <= box.height;
    if (inside && !lamp.toOn) {
      lamp.x = x;
      lamp.y = y;
    }
    lamp.toX = x;
    lamp.toY = y;
    lamp.toOn = inside ? 1 : 0;
  }
  const dark = () => {
    lamp.toOn = 0;
  };
  if (options.lamp) {
    addEventListener("pointermove", point, { passive: true });
    document.documentElement.addEventListener("pointerleave", dark);
  }

  const seen = new IntersectionObserver(([entry]) => {
    shown = !!entry?.isIntersecting;
    wake();
  });
  seen.observe(canvas);
  const resized = new ResizeObserver(() => {
    if (size()) {
      last = 0;
      wake();
    }
  });
  resized.observe(canvas);
  document.addEventListener("visibilitychange", wake);

  return () => {
    fields.delete(live);
    seen.disconnect();
    resized.disconnect();
    removeEventListener("pointermove", point);
    document.documentElement.removeEventListener("pointerleave", dark);
    document.removeEventListener("visibilitychange", wake);
    cancelAnimationFrame(raf);
    // The context stays: React can start a field again on the same canvas, and a lost context
    // can't draw. It goes with the canvas.
  };
}
