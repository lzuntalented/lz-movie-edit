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
  const [activeMenu, setActiveMenu] = useState('1');
  useEffect(() => {
    store.setUpdateCallback(() => {
      refresh();
    });
    if (palyDom.current) {
      palyDom.current.style.height = '100%';
      palyDom.current.style.width = 'initial';
      const { height } = palyDom.current.getBoundingClientRect();
      // console.log(height);
      const { size } = store;
      setShowWidth(size.width / size.height * height);
    }
  }, []);

  const onChangeDp = (e: {key: string}) => {
    if (palyDom.current) {
      if (e.key === '2') {
        palyDom.current.style.width = '100%';
        palyDom.current.style.height = 'initial';
        const { width } = palyDom.current.getBoundingClientRect();
        const { size } = store;
        setShowHeight(size.width / size.height * width);
      } else {
        palyDom.current.style.height = '100%';
        palyDom.current.style.width = 'initial';
        const { height } = palyDom.current.getBoundingClientRect();
        const { size } = store;
        setShowWidth(size.width / size.height * height);
      }
    }
    setActiveMenu(e.key);
  };

  // console.log('refresh active-----------');

  return (
    <div className="area-center">
      <div className="area-player" ref={palyDom} style={activeMenu === '1' ? { width: showWidth } : { height: showHeight }}>
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
            />
          </div>
        ))
      }
      </div>
      <Dropdown
        menu={{
          items: [{
            key: '1',
            label: '9:16',
          }, {
            key: '2',
            label: '16:9',
          }],
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
