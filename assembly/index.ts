export { toGray, toInverted };

let gray = false;
let inverted = false;

function toGray(
  data: Uint8ClampedArray,
  width: i32,
  height: i32,
  gray: boolean
): Uint8ClampedArray {
  const arr = data;
  if (!gray) return arr;
  const l = arr.length;
  for (let i = 0; i < arr.length; i += 4) {
    const j = Math.floor(
      arr[i] * 0.299 + arr[i + 1] * 0.587 + arr[i + 2] * 0.114
    ) as i32;
    for (let k = i; k < i + 3; ++k) arr[k] = j;
  }
  return arr;
}

function toInverted(
  data: Uint8ClampedArray,
  width: i32,
  height: i32,
  inverted: boolean
): Uint8ClampedArray {
  const arr = data;
  if (!inverted) return arr;
  const l = arr.length;
  for (let i = 0; i < arr.length; ++i)
    for (let j = 0; j < 3; ++j) arr[i] = 255 - arr[i++];
  return arr;
}
