import { createId } from '../utils';
import { Transition } from './transition';

export default class Item {
  type: number = 1;

  start: number = 0;

  duration: number = 0;

  x: number = 0;

  y: number = 0;

  scale: number = 1;

  title: string = '';

  url: string = '';

  content: string = '';

  playStart: number = 0;

  // playDuration: number = 0;
  volume: number = 1;

  readonly id: string = '';

  transition?: Transition;

  constructor(duration: number, title: string) {
    this.start = 0;
    this.id = createId();
    this.duration = duration;
    // this.playDuration = this.duration;
    this.title = title;
  }

  setStart(start: number = 0) {
    this.start = start;
  }

  setTransition(t: Transition) {
    this.transition = t;
  }

  copy() {
    const item = new Item(this.duration, this.title);
    Object.keys(this).forEach((key) => {
      const k = key as keyof Item;
      if (k !== 'id') { item[k] = this[k]; }
    });
    return item;
  }
}
