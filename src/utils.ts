/**
 * 创建随机字符
 * @param {*} type 类型
 * @param {*} len 长度
 */
export function createRandom(len = 6) {
  const pool = '1234567890qwertyuiiopasdfghjklzxcvbnm';
  const poolSize = pool.length;
  let result = '';
  for (let i = 0; i < len; i += 1) {
    result += pool[Math.floor(Math.random() * poolSize)];
  }
  return result;
}

const idMap = [] as string[];
// 创建唯一id
export function createId() {
  while (true) {
    const unique = createRandom();
    if (idMap.indexOf(unique) === -1) {
      idMap.push(unique);
      return unique;
    }
  }
}

export function formatTime(time: number) {
  const sconed = Math.ceil(time / 1000);
  const minutes = Math.floor(sconed / 60);
  const s = sconed - (minutes * 60);
  return `${minutes < 10 ? `0${minutes}` : minutes}: ${s < 10 ? `0${s}` : s}`;
}

const isType = (type: string) => (obj: any) => Object.prototype.toString.call(obj) === `[object ${type}]`;
export const isNumber = isType('Number');
export const isString = isType('String');
export const isBoolean = isType('Boolean');

// DataURL转Blob对象
function dataURLToBlob(dataurl: string) {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

export function getImageFormVideo(url: string, width: number, height: number, spaces : number[]) {
  const canvas = document.createElement('canvas');

  // document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  canvas.width = width;
  canvas.height = height;
  const video = document.createElement('video');
  video.crossOrigin = 'anonymous';
  // video.setAttribute('crossOrigin', 'anonymous');
  const ret = new Promise<string[]>((resolve, reject) => {
    let i = 0;
    const imgs = [] as string[];
    video.addEventListener('canplay', () => {
      if (i >= spaces.length) {
        return resolve(imgs);
      }
      const h = (video.videoHeight / video.videoWidth) * canvas.width;
      canvas.height = h;
      video.pause();
      video.currentTime = spaces[i++];
      ctx.drawImage(video, 0, 0, width, h);
      const imgData = canvas.toDataURL('image/jpeg');
      const localImage = URL.createObjectURL(dataURLToBlob(imgData));
      imgs.push(localImage);
      return localImage;
    });

    // video.addEventListener('loadeddata', () => {
    //   const h = (video.videoHeight / video.videoWidth) * canvas.width;
    //   canvas.height = h;
    //   video.pause();
    //   const imgList = spaces.map((it) => {
    //     video.currentTime = it;
    //     // console.log(video.videoWidth, video.videoHeight, h, it);
    //     ctx.drawImage(video, 0, 0, width, h);
    //     const imgData = canvas.toDataURL('image/jpeg');
    //     const localImage = URL.createObjectURL(dataURLToBlob(imgData));
    //     return localImage;
    //   });
    //   resolve(imgList);
    // });
    video.addEventListener('error', () => {
      reject();
    });

    video.src = url;
    video.volume = 0;
    video.play();
  });

  return ret;
  // const imgData = canvas.toDataURL('image/jpeg');
  // const img = document.createElement('img');
  // img.src = imgData;
  // document.body.appendChild(img);
  // console.log(url);

  // return URL.createObjectURL(dataURLToBlob(imgData));
}

export function setupCanvas(canvas: HTMLCanvasElement) {
  // Get the device pixel ratio, falling back to 1.
  const dpr = window.devicePixelRatio || 1;
  // Get the size of the canvas in CSS pixels.
  const rect = canvas.getBoundingClientRect();
  // Give the canvas pixel dimensions of their CSS
  // size * the device pixel ratio.
  // eslint-disable-next-line no-param-reassign
  canvas.width = rect.width * dpr;
  // eslint-disable-next-line no-param-reassign
  canvas.height = rect.height * dpr;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  // Scale all drawing operations by the dpr, so you
  // don't have to worry about the difference.
  ctx.scale(dpr, dpr);
  return ctx;
}

export const isUndefined = (v: any) => typeof v === 'undefined';
