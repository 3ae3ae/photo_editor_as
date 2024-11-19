// import * as as from './build/release.js';

async function main(){
  const as = await import('./build/release.js');
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
    imageData.data.set(as.toGray(imageData.data, imageData.width, imageData.height, gray));
    imageData.data.set(as.toInverted(imageData.data, imageData.width, imageData.height, inverted));
    ctx.putImageData(imageData, 0, 0);
  }
}

main();