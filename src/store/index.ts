import { ItemType, PlayStatus } from '../player/interface';
import { isNumber, isString } from '../utils';
import Item from './item';
import Layer from './layer';
import { Timer } from './timer';
import { Transition, TransitionZoomIn } from './transition';

export class Store {
  layers = [] as Layer[];

  /** 当前活动的层级 */
  activeLayer = 0;

  /** 当前活动的元素 */
  activeItemId = '';

  /** 播放状态 */
  playStatus: PlayStatus = PlayStatus.PAUSE;

  /** 当前播放指针时间 */
  currentTime: number = 0;

  /** 标准播放内容更新 */
  updateFlag = Symbol(1);

  /** 播放时间器 */
  timerHandler: Timer;

  /** 时间缩放 1s使用刻度标识数量 */
  timerScale = 10;

  size = {
    width: 9,
    height: 16
  }

  constructor() {
    this.timerHandler = new Timer();
  }

  getActiveItem() {
    const layer = this.getActiveLayer();
    if (layer && isString(this.activeItemId)) {
      return layer.items.find((it) => it.id === this.activeItemId);
    }
    return null;
  }

  getActiveLayer() {
    return this.layers[this.activeLayer];
  }

  addLayer() {
    const layer = new Layer();
    this.layers.push(layer);
    this.activeLayer = this.layers.length - 1;
    return layer;
  }

  getTotalTime() {
    let result = 0;
    for (let i = 0; i < this.layers.length; i += 1) {
      const { items } = this.layers[i];
      const last = items[items.length - 1];
      if (last) { result = Math.max(result, last.start + last.duration); }
    }
    return result;
  }

  /** 探测是否播放结束 */
  detectEnd() {
    const total = this.getTotalTime();
    if (this.currentTime > total) {
      this.playStatus = PlayStatus.PAUSE;
      return true;
    }
    return false;
  }

  play() {
    this.playStatus = PlayStatus.PLAYING;
    this.timerHandler.start();
  }

  update = (time: number) => {
    this.currentTime = time;
    if (this.detectEnd()) {
      this.stop();
    }
  };

  pause() {
    this.playStatus = PlayStatus.PAUSE;
    this.timerHandler.stop();
  }

  setUpdateCallback(cb: any) {
    this.timerHandler.setUpdateCallback((time: number) => {
      cb();
      this.update(time);
    });
  }

  setCurrentTime(num: number) {
    this.currentTime = num > 0 ? num : 0;
    this.timerHandler.resetCurrentTime(num);
    this.updateFlag = Symbol(1);
  }

  /** 分割元素 */
  splitItem() {
    const layer = this.getActiveLayer();
    const itemIdx = layer.items.findIndex((it) => it.id === this.activeItemId);
    const item = layer.items[itemIdx];
    const minDuration = 1000;
    if (item) {
      const { start, duration } = item;
      if (this.currentTime < start) return false;
      const beforeDuration = this.currentTime - start;

      // 片段时长不得小于1s
      if (duration < minDuration
        || beforeDuration < minDuration
        || (duration - beforeDuration) < minDuration
      ) return false;

      item.duration = beforeDuration;

      const nextItem = item.copy();
      nextItem.duration = duration - beforeDuration;
      nextItem.start = this.currentTime;
      layer.insertItem(nextItem, itemIdx + 1);

      if (item.type === ItemType.VIDEO) {
        nextItem.playStart = item.duration;
      } else if (item.type === ItemType.MUSIC) {
        nextItem.playStart = item.duration;
      }
      return true;
    }
    return false;
  }

  getLayer(id: string) {
    return this.layers.find((it) => it.id === id) || this.getActiveLayer();
  }

  exchangeItem(source: {index: number; layer: Layer}, destination: {index: number; layer: Layer}) {
    if (source.layer === destination.layer) {
      // 同层级元素移动
      const { items } = source.layer;
      const sourceItem = items[source.index];
      let moveStart = destination.index;
      let moveEnd = source.index;
      if (source.index < destination.index) {
        // 向后移动
        moveStart = source.index;
        moveEnd = destination.index;
        for (let i = moveStart; i < moveEnd; i += 1) {
          items[i] = items[i + 1];
          items[i].start -= sourceItem.duration;
        }
      } else {
        // 向前移动
        for (let i = moveEnd; i > moveStart; i -= 1) {
          items[i] = items[i - 1];
          items[i].start += sourceItem.duration;
        }
      }
      items[destination.index] = sourceItem;
      const sourceItemBefore = items[destination.index - 1];
      items[destination.index].start = sourceItemBefore
        ? sourceItemBefore.start + sourceItemBefore.duration : 0;
    } else {
      // 不同层级元素移动
      const sourceItems = source.layer.items;
      const sourceItem = sourceItems[source.index];
      const destinationItems = destination.layer.items;

      for (let i = destination.layer.items.length; i > destination.index; i -= 1) {
        destinationItems[i] = destinationItems[i - 1];
        destinationItems[i].start += sourceItem.duration;
      }

      destinationItems[destination.index] = sourceItem;
      const sourceItemBefore = destinationItems[destination.index - 1];
      destinationItems[destination.index].start = sourceItemBefore
        ? sourceItemBefore.start + sourceItemBefore.duration : 0;

      for (let i = source.index + 1; i < sourceItems.length; i += 1) {
        sourceItems[i].start -= sourceItem.duration;
      }

      sourceItems.splice(source.index, 1);
    }
  }

  /**
   * 添加专场
   */
  addTransaction(id: string) {
    const item = this.getActiveItem() as Item;
    const layer = this.getActiveLayer();

    const t = new TransitionZoomIn();
    item.setTransition(t);
    // const len = t.duration
    let itemIdx = -1;
    for (let i = 0; i < layer.items.length; i += 1) {
      const it = layer.items[i];
      if (it.id === item.id) {
        itemIdx = 0;
      } else if (++itemIdx > -1) {
        it.setStart(it.start - itemIdx * t.duration);
      }
    }

    // item.addTransaction();
  }

  stop() {
    this.playStatus = PlayStatus.PAUSE;
    this.timerHandler.stop();
  }

  /** 清空 */
  clear() {
    this.layers = [];
    this.stop();
    this.currentTime = 0;
    this.addLayer();
  }

  /** 移除当前选中元素 */
  removeItem() {
    const layer = this.getActiveLayer();
    console.log(layer.id);
    const itemIdx = layer.items.findIndex((it) => it.id === this.activeItemId);
    if (itemIdx > -1) {
      layer.items.splice(itemIdx, 1);
      if (layer.items.length === 0) {
        this.layers.splice(this.layers.indexOf(layer), 1);
        this.activeLayer = this.layers.length - 1;
      }
    }
  }

  save() {
    return JSON.stringify(this.layers);
  }

  initValue(val: Layer[]) {
    this.clear();
    this.layers = [];
    val.forEach((item) => {
      const newLayer = this.addLayer();
      item.items.forEach((it) => {
        const newItem = new Item(it.duration, it.title);
        newItem.type = it.type;
        newItem.start = it.start;
        newItem.duration = it.duration;
        newItem.url = it.url;
        newItem.content = it.content;
        newItem.playStart = it.playStart;
        newItem.transition = it.transition;
        newItem.volume = it.volume;
        newLayer.addItem(newItem);
      });
    });
  }

  setActvieItemId(id: string) {
    this.activeItemId = id;
    this.activeLayer = this.layers.findIndex((l) => !!l.items.find((item) => item.id === id));
  }
}

const store = new Store();
window.lzStore = store;
export default store;

export function addLayer() {
  const layer = new Layer();
  store.layers.push(layer);
  return layer;
}
