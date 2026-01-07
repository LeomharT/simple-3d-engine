import "./index.css";
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

function point(coord: Vector2) {
  ctx.save();
  const s = 20;
  ctx.fillStyle = "#FFA0CF";
  ctx.fillRect(coord.x - s / 2, coord.y - s / 2, s, s);
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

let prevTime = 0;
let dz = 0;

function render(time: number = 0) {
  // Time
  const dt = (time - prevTime) / 1000;
  prevTime = time;

  dz += dt;

  // World
  clean();
  // Move to 灭点(Vanishing point)
  point(screen(project({ x: 0.5, y: 0.0, z: 1.0 + dz })));

  // Animation
  requestAnimationFrame(render);
}

render();
