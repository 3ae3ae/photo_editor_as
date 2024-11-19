interface Color {
  r: number;
  g: number;
  b: number;
  a?: number;
}

interface Point {
  w: number;
  i: number;
  color?: Color;
}

interface Res {
  w: number;
  h: number;
}

const imageInput = document.getElementById("imageInput") as HTMLInputElement;
const preview = document.getElementById("image-preview") as HTMLCanvasElement;
const hidden = document.getElementById("hidden") as HTMLCanvasElement;
const original = document.getElementById("original") as HTMLCanvasElement;
const grayBtn = document.getElementById("grayscaleBtn") as HTMLButtonElement;
const invertBtn = document.getElementById("invertBtn") as HTMLButtonElement;
const reset = document.getElementById("resetBtn") as HTMLButtonElement;
const image = new Image();
const reader = new FileReader();

const pctx = preview.getContext("2d");
const hctx = hidden.getContext("2d");

let gray = false;
let inverted = false;

imageInput.addEventListener("change", (e) => {
  const target = e.target! as HTMLInputElement;
  const file = target.files![0];
  reader.readAsDataURL(file);
});

reader.addEventListener("load", (ee) => {
  image.src = ee.target?.result as string;
});

image.addEventListener("load", (eee) => {
  const ratio = image.width / image.height;
  if (ratio > 1) {
    preview.width = 600;
    preview.height = 600 / ratio;
  } else {
    preview.width = 400 * ratio;
    preview.height = 400;
  }
  hidden.width = image.width;
  hidden.height = image.height;
  original.width = image.width;
  original.height = image.height;
  pctx?.drawImage(image, 0, 0, preview.width, preview.height);
  hctx?.drawImage(image, 0, 0);
});

grayBtn.addEventListener("click", (e) => {
  clickGray();
});
invertBtn.addEventListener("click", (e) => {
  clickInverted();
});
reset.addEventListener("click", (e) => {
  gray = false;
  inverted = false;
  clickButton(preview, hidden);
});

function clickGray() {
  gray = !gray;
  clickButton(preview, hidden);
}
function clickInverted() {
  inverted = !inverted;
  clickButton(preview, hidden);
}

function clickButton(pcvs: HTMLCanvasElement, hcvs: HTMLCanvasElement) {
  hctx?.drawImage(image, 0, 0);
  editImage(hcvs, hcvs.getContext("2d")!);
  pcvs.getContext("2d")?.drawImage(hcvs, 0, 0, pcvs.width, pcvs.height);
}

function editImage(cvs: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  const imageData = ctx.getImageData(0, 0, cvs.width, cvs.height);
  toGray(imageData, gray);
  toInverted(imageData, inverted);
  ctx.putImageData(imageData, 0, 0);
}

function toGray(imageData: ImageData, gray: boolean): void {
  if (!gray) return;
  const arr = imageData.data;
  const l = arr.length;
  for (
    let p = getPoint({ w: imageData.width, h: imageData.height }, 0, 0);
    p.i < l;
    p.i += 4
  )
    changeColor(arr, p, getGray(getColor(arr, p)));
}

function toInverted(imageData: ImageData, inverted: boolean): void {
  if (!inverted) return;
  const arr = imageData.data;
  const l = arr.length;
  for (
    let p = getPoint({ w: imageData.width, h: imageData.height }, 0, 0);
    p.i < l;
    p.i += 4
  )
    changeColor(arr, p, getInvert(getColor(arr, p)));
}

function getPoint(res: Res, x: number, y: number) {
  return { i: 4 * (res.w * y + x), w: res.w };
}

function getColor(arr: Uint8ClampedArray, p: Point): Color {
  if (!!p.color) return p.color;
  else
    return {
      r: arr[p.i],
      g: arr[p.i + 1],
      b: arr[p.i + 2],
      a: arr[p.i + 3],
    };
}

function changeColor(arr: Uint8ClampedArray, p: Point, c: Color): void {
  const [r, g, b, a] = Array.from({ length: 4 }, (v, k) => p.i + k);
  arr[r] = c.r;
  arr[g] = c.g;
  arr[b] = c.b;
  arr[a] = c.a ? c.a : arr[a];
}

function getGray(c: Color): Color {
  const i = Math.floor(c.r * 0.299 + c.g * 0.587 + c.b * 0.114);
  return {
    r: i,
    g: i,
    b: i,
    a: c.a,
  };
}

function getInvert(c: Color): Color {
  return {
    r: 255 - c.r,
    g: 255 - c.g,
    b: 255 - c.b,
    a: c.a,
  };
}
