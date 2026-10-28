// A landscape drawn in characters that keeps going: hills coming toward the viewer under a sky of
// a few stars, in one colour on one ground. The GPU works out one brightness per character cell,
// then draws each cell as the character for that brightness, so the page's main thread, which the
// live demo shares, only sets a few numbers a frame. A field draws only while it's on screen, at
// 30 frames a second, and holds still for reduced motion. Its place on the land comes from the
// clock, so it has moved on between visits.

export type FieldOptions = {
  /** The page colour under the characters. */
  ground: string;
  /** Where the horizon sits, from the top, as a share of the field's height. */
  horizon: number;
  /** How strong the brightest characters are, from 0 to 1. */
  strength?: number;
};

// From empty to full; the first is the sky.
const RAMP = " .:-=+*#%@";
// A character cell, in CSS pixels.
const CELL = [9, 16];
const FONT = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

const VALUE = `#version 300 es
precision highp float;
uniform vec2 grid;
uniform float time;
uniform float horizon;
uniform float aspect;
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
  return h * h * 3.4;
}
void main() {
  vec2 uv = gl_FragCoord.xy / grid;
  float down = 1. - uv.y;
  vec3 ro = vec3(0., 1.6, time * .35);
  vec3 rd = normalize(vec3((uv.x - .5) * aspect, horizon - down, 1.));
  float d = .1;
  bool hit = false;
  vec3 p;
  for (int i = 0; i < 72; i++) {
    p = ro + rd * d;
    float gap = p.y - land(p.xz * .35);
    if (gap < .002 * d) { hit = true; break; }
    d += max(gap * .45, .02 + d * .006);
    if (d > 40.) break;
  }
  float v = 0.;
  if (hit) {
    vec2 q = p.xz * .35;
    float e = .02;
    float k = .35 / (2. * e);
    vec3 n = normalize(vec3(-(land(q + vec2(e, 0)) - land(q - vec2(e, 0))) * k, 1., -(land(q + vec2(0, e)) - land(q - vec2(0, e))) * k));
    float lit = clamp(dot(n, normalize(vec3(-.6, .7, .4))), 0., 1.);
    v = (.12 + .88 * lit) * exp(-d * .085);
  } else if (down < horizon) {
    float s = hash(floor(gl_FragCoord.xy));
    v = step(.993, s) * (.12 + .1 * sin(time * 1.7 + s * 60.));
  }
  o = vec4(v, 0., 0., 1.);
}`;

const DRAW = `#version 300 es
precision highp float;
uniform sampler2D value;
uniform sampler2D atlas;
uniform ivec2 cell;
uniform int glyphs;
uniform float cols;
uniform vec3 ground, from, to;
uniform float wipe, dir, frame, strength;
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

/** Draws the land on `canvas`, in the colour last painted. Returns a stop. */
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

  let cw = 0;
  let ch = 0;
  let cols = 0;
  let rows = 0;
  function size() {
    const scale = Math.min(devicePixelRatio || 1, 2);
    const width = Math.round(canvas.clientWidth * scale);
    const height = Math.round(canvas.clientHeight * scale);
    if (!width || !height) return false;
    canvas.width = width;
    canvas.height = height;
    cw = Math.round(CELL[0] * scale);
    ch = Math.round(CELL[1] * scale);
    cols = Math.ceil(width / cw);
    rows = Math.ceil(height / ch);

    const glyphs = document.createElement("canvas");
    glyphs.width = cw * RAMP.length;
    glyphs.height = ch;
    const g = glyphs.getContext("2d")!;
    g.font = `${Math.round(13 * scale)}px ${FONT}`;
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
  let from = rgb(current.ink);
  let to = from;
  let dir = 1;
  let wipeStart = -1;
  const WIPE = 700;
  let frame = 0;

  function render(now: number) {
    if (!cols) return;
    const time = (Date.now() / 1000) % 3600;
    gl!.bindFramebuffer(gl!.FRAMEBUFFER, target);
    gl!.viewport(0, 0, cols, rows);
    gl!.useProgram(value.p);
    gl!.uniform2f(value.u.grid, cols, rows);
    gl!.uniform1f(value.u.time, time);
    gl!.uniform1f(value.u.horizon, options.horizon);
    gl!.uniform1f(value.u.aspect, (cols * cw) / (rows * ch));
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
    document.removeEventListener("visibilitychange", wake);
    cancelAnimationFrame(raf);
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  };
}
