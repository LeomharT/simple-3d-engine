import "./index.css";
import { fs, vs } from "./penger";
/**
 * Coordinate
 * (x, y, z)
 *
 * Projection Coordinate
 * x' = x / z
 * y' = y / z
 */

type Vector2 = {
  x: number;
  y: number;
};

type Vector3 = Vector2 & {
  z: number;
};

const size = {
  width: window.innerWidth,
  height: window.innerHeight,
  pixelRatio: Math.min(2, window.devicePixelRatio),
};
const aspect = size.width / size.height;

const canvas = document.createElement("canvas");
canvas.style.width = size.width + "px";
canvas.style.height = size.height + "px";
canvas.width = size.width * size.pixelRatio;
canvas.height = size.height * size.pixelRatio;

const app = document.querySelector("#app");
app?.append(canvas);

const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;
ctx.scale(size.pixelRatio, size.pixelRatio);

function clean() {
  ctx.save();
  ctx.fillStyle = "#1e1e1e";
  ctx.fillRect(0, 0, size.width, size.height);
  ctx.restore();
}

function point(coord: Vector2, z: number) {
  ctx.save();
  const s = 20;
  ctx.fillStyle = "#FFA0CF";
  ctx.fillRect(coord.x - s / 2, coord.y - s / 2, s / z, s / z);
  ctx.restore();
}

function line(from: Vector2, to: Vector2) {
  ctx.save();
  ctx.beginPath();
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#d4380d";
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
  ctx.restore();
}

function screen(p: Vector2) {
  const x = ((p.x + 1.0) / 2.0) * size.width;
  const y = -((p.y - 1.0) / 2.0) * size.height;
  return {
    x,
    y,
  };
}

function project(p: Vector3) {
  return {
    x: p.x / p.z,
    y: p.y / p.z,
  };
}

function rotate(p: Vector3, angle: number) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);

  const x = p.x * c - p.z * s;
  const z = p.x * s + p.z * c;

  return {
    x,
    y: p.y,
    z,
  };
}

let prevTime = 0;
let dz = 1.5;
let angle = 0;

const _vs = vs ?? [
  { x: 0.5 / 2.0, y: 0.5 / 2.0, z: 0.5 / 2.0 },
  { x: -0.5 / 2.0, y: 0.5 / 2.0, z: 0.5 / 2.0 },
  { x: -0.5 / 2.0, y: -0.5 / 2.0, z: 0.5 / 2.0 },
  { x: 0.5 / 2.0, y: -0.5 / 2.0, z: 0.5 / 2.0 },

  { x: 0.5 / 2.0, y: 0.5 / 2.0, z: -0.5 / 2.0 },
  { x: -0.5 / 2.0, y: 0.5 / 2.0, z: -0.5 / 2.0 },
  { x: -0.5 / 2.0, y: -0.5 / 2.0, z: -0.5 / 2.0 },
  { x: 0.5 / 2.0, y: -0.5 / 2.0, z: -0.5 / 2.0 },
];

const _fs = fs ?? [
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7],
];

function translateZ(p: Vector3, dz: number) {
  return {
    x: p.x,
    y: p.y * aspect,
    z: p.z + dz,
  };
}

function render(time: number = 0) {
  // Time
  const dt = (time - prevTime) / 1000;
  prevTime = time;

  //   dz += dt;
  angle += Math.PI * dt * 0.22;

  // World
  clean();
  // Move to 灭点(Vanishing point)
  for (const v of vs) {
    // point(screen(project(translateZ(rotate(v, angle), dz))), dz);
  }
  for (const f of fs) {
    for (let i = 0; i < f.length; i++) {
      const a = vs[f[i]];
      const b = vs[f[(i + 1) % f.length]];

      line(
        screen(project(translateZ(rotate(a, angle), dz))),
        screen(project(translateZ(rotate(b, angle), dz)))
      );
    }
  }

  // Animation
  requestAnimationFrame(render);
}

render();
