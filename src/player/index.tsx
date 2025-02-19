import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import Layer from '../store/layer';
import Video from './video';
import { ItemType, PlayStatus } from './interface';
import PlayControl from './control';
import Context from '../context';
import store from '../store';
import Indicator from '../indicator';
import './index.scss';
import { Dropdown, Menu } from 'antd';
import { getPanelSizeOptions, PLAY_PANEL_SIZE } from './config';

// interface EventProps {

// }
// interface VideoProps {
//   start = 0;

//   url = '';

//   end = 0;
// }

interface PlayerProps {
  layers: Layer[];
  refresh: Symbol

  // private currentTime = 0;

  // run() {

  // }

  // playVideo() {

  // }
}

export default function Player(props: PlayerProps) {
  // const [currentTime, setCurrentTime] = useState(0);
  const { layers } = props;
  const { refresh } = useContext(Context);
  const palyDom = useRef<HTMLDivElement>(null);
  const [showWidth, setShowWidth] = useState(0);
  const [showHeight, setShowHeight] = useState(0);
  const [activeMenu, setActiveMenu] = useState(PLAY_PANEL_SIZE.H);
  const panelOptions = getPanelSizeOptions();
  const [playSize, setPlaySize] = useState({
    width: 0,
    height: 0,
  });
  const [showSize, setShowSize] = useState({
    width: 0,
    height: 0,
  });

  const getPlaySize = () => {
    if (palyDom.current) {
      const { height, width } = palyDom.current.getBoundingClientRect();
      // console.log(height);
      const playSizeWidth = width - (64 * 2);
      const playSizeHeight = height - (64 * 2);
      setPlaySize({
        width: playSizeWidth,
        height: playSizeHeight,
      });
      return {
        width: playSizeWidth,
        height: playSizeHeight,
      };
    }
  };

  useEffect(() => {
    store.setUpdateCallback(() => {
      refresh();
    });
    if (palyDom.current) {
      // palyDom.current.style.height = '100%';
      // palyDom.current.style.width = 'initial';
      const playSizeObj = getPlaySize();
      if (playSizeObj) {
        const { height, width } = playSizeObj;
        // 判断宽高比是否与9:16的关系，以短边为基准，重新计算宽高
        if (width / height > 9 / 16) {
          setShowSize({
            height,
            width: height * (9 / 16),
          });
        } else {
          setShowSize({
            width,
            height: width * (9 / 16),
          });
        }
      }
    }
  }, []);

  const onChangeDp = (e: {key: PLAY_PANEL_SIZE.H}) => {
    const playSizeObj = getPlaySize();
    if (playSizeObj) {
      const { height, width } = playSizeObj;
      if (e.key === PLAY_PANEL_SIZE.H) {
        setShowSize({
          height,
          width: height * (9 / 16),
        });
      } else {
        setShowSize({
          width,
          height: width * (9 / 16),
        });
      }
      const obj = panelOptions.find((o) => o.value === e.key);
      if (obj) {
        store.size.width = obj?.width;
        store.size.height = obj?.height;
      }
    }
    setActiveMenu(e.key);
  };

  // console.log('refresh active-----------');

  return (
    <div className="area-center" ref={palyDom}>
      <div
        className="area-player"
        style={{
          width: showSize.width,
          height: showSize.height,
        }}
      >
        {/* <div>{store.currentTime}</div> */}
        {
        layers.map((item) => (
          <div className="player-container" key={item.id}>
            <PlayControl
              updateFlag={store.updateFlag}
              key={item.id}
              playStatus={store.playStatus}
              list={item.items}
              currentTime={store.currentTime}
              playSize={{
                width: showSize.width,
                height: showSize.height,
              }}
            />
          </div>
        ))
      }
      </div>
      <Dropdown
        menu={{
          items: panelOptions.map((item) => ({
            key: item.value,
            label: item.label,
          })),
          onClick: onChangeDp,
        }}
      >
        <div className="area-center-dp">
          分辨率：
          {store.size.width}
          :
          {store.size.height}
        </div>
      </Dropdown>
    </div>
  );
}
