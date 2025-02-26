import React, {
  FunctionComponent, ReactComponentElement, useContext, useEffect, useRef, useState,
} from 'react';
import Context from '../context';
import Item from '../store/item';
import { ItemType, PlayerControlProps, PlayStatus } from './interface';
import Video from './video';
import Image from './image';
import Text from './text';
import Music from './music';
import store from '../store';
import Animation from './animation';
import Move from './move';
import { isUndefined } from '../utils';

const itemRenderMap = {
  [ItemType.VIDEO]: Video,
  [ItemType.IMAGE]: Image,
  [ItemType.TEXT]: Text,
  [ItemType.MUSIC]: Music,
} as any;

export default function PlayControl(props: PlayerControlProps & {
  playSize: { width: number| string, height: number| string }
}) {
  const { playStatus, playSize } = props;
  const [currentItem, setCurrentItem] = useState<Item[]>([]);
  const { currentTime, list, updateFlag } = props;
  const { refresh } = useContext(Context);
  const curRef = useRef(null);

  useEffect(() => {
    const obj = list.filter((it) => currentTime >= it.start
    && currentTime <= it.start + it.duration);
    setCurrentItem(obj);
    // console.log('updateList------------', obj);
  }, [currentTime, updateFlag, list]);

  // useEffect(() => {
  //   let handle;
  //   if ((!currentItem || currentItem.type !== ItemType.VIDEO)
  //    && playStatus === PlayStatus.PLAYING) {
  //     handle = setInterval(() => {
  //       if (store.detectEnd()) {
  //         window.clearInterval(handle);
  //         return;
  //       }
  //       console.log(store.currentTime, 'currentTime', currentItem);
  //       store.currentTime += 1000 / 24;
  //       refresh();
  //     }, 1000 / 24);
  //   } else {
  //     window.clearInterval(handle);
  //   }
  //   return () => {
  //     console.log('destroyList------------');
  //     window.clearInterval(handle);
  //   };
  // }, [currentItem, playStatus]);

  if (currentItem.length === 0) return <div />;
  const chidlren = currentItem.map((it) => {
    const Comp = itemRenderMap[it.type];
    // const { width, height } = curRef.current?.parentNode?.getBoundingClientRect() || {};
    const timespace = store.currentTime - it.start;

    const keyframes = it.getKeyFrames();
    if (keyframes && keyframes.length > 1) {
      for (let len = keyframes?.length || 0, i = len - 1; i > 1; i--) {
        const keyframe = keyframes[i];
        if (keyframe.pos > timespace) {
          // 计算当前帧与上一帧缩放间隔，同时根据时间间隔来计算当前尺寸

        }
      }
    }
    return (
      <div
        className="player-item"
        key={it.id}
        style={{
          left: it.x,
          top: it.y,
          width: isUndefined(playSize.width) ? 'auto' : it.scale * playSize.width,
          height: isUndefined(playSize.height) ? 'auto' : it.scale * playSize.height,
        }}
        // ref={curRef}
      >
        <Comp {...props} {...it} />
      </div>
    );
  });

  if (currentItem[0].transition
     && currentTime >= (
       currentItem[0].start + currentItem[0].duration - currentItem[0].transition.duration
     )
  ) {
    // console.log(currentTime, currentItem[0].transition.duration);
    return (
      <Animation
        {...currentItem[0].transition || {}}
        currentTime={currentTime - (currentItem[0].start + currentItem[0].duration - currentItem[0].transition.duration)}
      >
        {chidlren}
      </Animation>
    );
  }
  return chidlren;
}
