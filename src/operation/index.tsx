import { LaptopOutlined } from '@ant-design/icons';
import React, { useContext } from 'react';
import Context from '../context';
import { ItemType, PlayStatus } from '../player/interface';
import store from '../store';
import Item from '../store/item';
import './index.scss';
import { WIDGET_TYPE } from '../common/config';

interface Props {
  onWidgetClick(e: number): void;
  activeWidgetId: number;
}
function Operation({ onWidgetClick, activeWidgetId }: Props) {
  const { refresh } = useContext(Context);
  const onAddLayer = () => {
    const layer = store.addLayer();
    const content = '我是字幕';
    const item = new Item(1000 * 1, '文字');
    item.content = content;
    item.type = ItemType.TEXT;
    layer.addItem(item);
    store.activeItemId = item.id;
    store.updateFlag = Symbol(1);
    refresh();
  };
  const menus = [
    {
      title: '图片',
      icon: <LaptopOutlined />,
      key: WIDGET_TYPE.IMAGE,
    },
    {
      title: '视频',
      icon: <LaptopOutlined />,
      key: WIDGET_TYPE.VIDEO,
    },
    {
      title: '文字',
      icon: <LaptopOutlined />,
      key: WIDGET_TYPE.TEXT,
    },
    {
      title: '音乐',
      icon: <LaptopOutlined />,
      key: WIDGET_TYPE.MUSIC,
    },
    {
      title: '轨道',
      icon: <LaptopOutlined />,
      key: WIDGET_TYPE.TRACK,
    },
  ];
  return (
    <div className="operation">
      {
        menus.map((it) => (
          <div
            key={it.title}
            className={`menu-item ${it.key === activeWidgetId ? 'menu-item-active' : ''}`}
            onClick={() => {
              onWidgetClick(it.key);
            }}
          >
            {it.icon}
            {it.title}
          </div>
        ))
      }
    </div>
  );
}

export default Operation;
