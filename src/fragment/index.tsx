import { Resizable } from 're-resizable';
import React, { useContext, useEffect, useState } from 'react';
import { DraggableProvided } from 'react-beautiful-dnd';
import { StarFilled, StarTwoTone } from '@ant-design/icons';
import Context from '../context';
import { ItemType } from '../player/interface';
import store from '../store';
import Item from '../store/item';
import { getImageFormVideo } from '../utils';

import './index.scss';
import { SCALE_DOM_SPACE } from '../common/config';

function Fragment({ data, p }: {data: Item, p: DraggableProvided}) {
  const { start, duration, id } = data;
  // const timerScale = store.timerScale * 1000;
  const len = duration / 1000 * store.timerScale * SCALE_DOM_SPACE;
  const { refresh } = useContext(Context);
  const imgLen = Math.ceil(duration / 1000);
  // const imgData = new Array(imgLen).fill(data.url);
  const [imgData, setImgData] = useState<string[]>([]);

  const getImageData = async () => {
    const videoData = new Array(imgLen).fill(data.url);
    const videoWidth = Math.floor(100 / videoData.length);
    const space = [];
    for (let i = 0; i < videoData.length; i += 1) {
      space.push(i * Math.floor(imgLen / videoData.length) + 1);
    }
    const list = await getImageFormVideo(
      data.url,
      videoWidth * 10,
      50 * 10,
      space,
    );
    setImgData(list);
  };

  useEffect(() => {
    if (data.type === ItemType.IMAGE) {
      setImgData(new Array(imgLen).fill(data.url));
    } else if (data.type === ItemType.VIDEO) {
      // const videoData = new Array(imgLen).fill(data.url);
      // const videoWidth = Math.floor(100 / videoData.length);
      getImageData();
      // setImgData(videoData.map((it, i) => getImageFormVideo(
      //   it,
      //   500,
      //   // videoWidth * 10,
      //   50 * 10,
      //   i * Math.floor(imgLen / videoData.length),
      // )));
    }
    return () => {
    };
  }, [data.url, duration]);

  return (
    <div
      className="fragment"
      onClick={() => {
        store.setActvieItemId(id);
        refresh();
      }}
      ref={p.innerRef}
      {...(p.draggableProps)}
      {...(p.dragHandleProps)}
    >
      <div
        className={`fragment-drag  ${id === store.activeItemId ? 'active' : ''}`}
        style={{
          width: len,
          height: 50,
        }}
      >
        <div style={{ width: '100%', position: 'relative' }}>
          {
            imgData.map((it, i) => (
              <div
                key={`${it}${i}`}
                className="fragment-preview"
                style={{
                  backgroundImage: `url(${it})`,
                  width: `${Math.floor(100 / imgData.length)}%`,
                }}
              />
            ))
          }
          {
            data?.keyFrames?.map((it) => (
              <StarTwoTone
                twoToneColor={it.id === store.activeKeyframeId && store.activeKeyframeId ? 'red' : undefined}
                key={it.pos}
                style={{
                  left: it.pos / 1000 * store.timerScale * SCALE_DOM_SPACE,
                }}
                className="fragment-key-frame "
                onClick={() => { store.activeKeyframeId = it.id; }}
              />
            ))
          }
          {/* {data.title} */}
        </div>
      </div>
    </div>
  );
}

export default Fragment;
