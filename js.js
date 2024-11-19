"use strict";
const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("image-preview");
const hidden = document.getElementById("hidden");
const original = document.getElementById("original");
const grayBtn = document.getElementById("grayscaleBtn");
const invertBtn = document.getElementById("invertBtn");
const reset = document.getElementById("resetBtn");
const image = new Image();
const reader = new FileReader();
const pctx = preview.getContext("2d");
const hctx = hidden.getContext("2d");
let gray = false;
let inverted = false;
imageInput.addEventListener("change", (e) => {
    const target = e.target;
    const file = target.files[0];
    reader.readAsDataURL(file);
});
reader.addEventListener("load", (ee) => {
    var _a;
    image.src = (_a = ee.target) === null || _a === void 0 ? void 0 : _a.result;
});
image.addEventListener("load", (eee) => {
    const ratio = image.width / image.height;
    if (ratio > 1) {
        preview.width = 600;
        preview.height = 600 / ratio;
    }
    else {
        preview.width = 400 * ratio;
        preview.height = 400;
    }
    hidden.width = image.width;
    hidden.height = image.height;
    original.width = image.width;
    original.height = image.height;
    pctx === null || pctx === void 0 ? void 0 : pctx.drawImage(image, 0, 0, preview.width, preview.height);
    hctx === null || hctx === void 0 ? void 0 : hctx.drawImage(image, 0, 0);
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
function clickButton(pcvs, hcvs) {
    var _a;
    hctx === null || hctx === void 0 ? void 0 : hctx.drawImage(image, 0, 0);
    editImage(hcvs, hcvs.getContext("2d"));
    (_a = pcvs.getContext("2d")) === null || _a === void 0 ? void 0 : _a.drawImage(hcvs, 0, 0, pcvs.width, pcvs.height);
}
function editImage(cvs, ctx) {
    const imageData = ctx.getImageData(0, 0, cvs.width, cvs.height);
    toGray(imageData, gray);
    toInverted(imageData, inverted);
    ctx.putImageData(imageData, 0, 0);
}
function toGray(imageData, gray) {
    if (!gray)
        return;
    const arr = imageData.data;
    const l = arr.length;
    for (let p = getPoint({ w: imageData.width, h: imageData.height }, 0, 0); p.i < l; p.i += 4)
        changeColor(arr, p, getGray(getColor(arr, p)));
}
function toInverted(imageData, inverted) {
    if (!inverted)
        return;
    const arr = imageData.data;
    const l = arr.length;
    for (let p = getPoint({ w: imageData.width, h: imageData.height }, 0, 0); p.i < l; p.i += 4)
        changeColor(arr, p, getInvert(getColor(arr, p)));
}
function getPoint(res, x, y) {
    return { i: 4 * (res.w * y + x), w: res.w };
}
function getColor(arr, p) {
    if (!!p.color)
        return p.color;
    else
        return {
            r: arr[p.i],
            g: arr[p.i + 1],
            b: arr[p.i + 2],
            a: arr[p.i + 3],
        };
}
function changeColor(arr, p, c) {
    const [r, g, b, a] = Array.from({ length: 4 }, (v, k) => p.i + k);
    arr[r] = c.r;
    arr[g] = c.g;
    arr[b] = c.b;
    arr[a] = c.a ? c.a : arr[a];
}
function getGray(c) {
    const i = Math.floor(c.r * 0.299 + c.g * 0.587 + c.b * 0.114);
    return {
        r: i,
        g: i,
        b: i,
        a: c.a,
    };
}
function getInvert(c) {
    return {
        r: 255 - c.r,
        g: 255 - c.g,
        b: 255 - c.b,
        a: c.a,
    };
}
