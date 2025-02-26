import { Col, Row } from 'antd';
import React, { useContext } from 'react';
import Context from '../context';
import { ItemType } from '../player/interface';
import store from '../store';
import Item from '../store/item';
import './index.scss';
import { isDev } from '../common/env';
import { WIDGET_TYPE } from '../common/config';

const picList = isDev ? [
  'http://localhost:9000/1.jpg',
  'http://localhost:9000/2.jpg',
  'http://localhost:9000/3.jpg',
] : [
  'http://static.lzuntalented.cn/movie/1.jpg',
  'http://static.lzuntalented.cn/movie/2.jpg',
  'http://static.lzuntalented.cn/movie/3.jpg',
];

const videoList = isDev ? [
  'http://localhost:9000/1.mp4',
  'http://localhost:9000/2.mp4',
] : [
  'http://static.lzuntalented.cn/movie/1.mp4',
  'http://static.lzuntalented.cn/movie/2.mp4',
];

const textList = [
  'https://js.xiudodo.com/colorful/previews/2.png?x-oss-process=image/crop,x_50,w_300,y_50,h_300/resize,w_180/interlace,1/sharpen,100/quality,q_98',
];

const audioList = isDev ? [
  'http://localhost:9000/1.mp3',
  'http://localhost:9000/2.mp3',
] : [
  'http://static.lzuntalented.cn/movie/1.mp3',
  'http://static.lzuntalented.cn/movie/2.mp3',
];

interface Props {
  activeWidgetId: number;
}
function Widget({ activeWidgetId }: Props) {
  const { refresh } = useContext(Context);
  const onAddPicture = (url: string) => {
    const layer = store.getActiveLayer();
    const item = new Item(1000 * 3, '图片');
    item.url = url;
    item.type = ItemType.IMAGE;
    layer.addItem(item);
    store.updateFlag = Symbol(1);
    store.activeItemId = item.id;
    refresh();
  };
  const onAddVideo = (url: string) => {
    const layer = store.getActiveLayer();
    const item = new Item(8 * 1000, '视频');
    item.url = url;
    item.type = ItemType.VIDEO;
    layer.addItem(item);
    // item.setStart(2 * 1000);
    store.activeItemId = item.id;
    store.updateFlag = Symbol(1);
    refresh();
  };
  const onAddText = () => {
    const content = '我是字幕';
    const layer = store.getActiveLayer();
    const item = new Item(1000 * 1, '文字');
    item.content = content;
    item.type = ItemType.TEXT;
    layer.addItem(item);
    store.activeItemId = item.id;
    store.updateFlag = Symbol(1);
    refresh();
  };
  const onAddMusic = (url: string) => {
    const layer = store.addLayer();
    const item = new Item(10 * 1000, '音乐');
    item.url = url;
    item.type = ItemType.MUSIC;
    layer.addItem(item);
    store.activeItemId = item.id;
    refresh();
  };

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
  return (
    <div className="widget">
      <Row gutter={24}>
        {activeWidgetId === WIDGET_TYPE.IMAGE
          && picList.map((it) => (
            <Col key={it} span={12} className="widget-item">
              <img
                src={it}
                alt=""
                width="100%"
                onClick={() => {
                  onAddPicture(it);
                }}
              />
            </Col>
          ))}
        {activeWidgetId === WIDGET_TYPE.VIDEO
          && videoList.map((it) => (
            <Col key={it} span={12} className="widget-item">
              <video
                src={it}
                width="100%"
                onClick={() => {
                  onAddVideo(it);
                }}
              />
            </Col>
          ))}
        {activeWidgetId === WIDGET_TYPE.TEXT
          && textList.map((it) => (
            <Col key={it} span={12} className="widget-item">
              <img
                src={it}
                alt=""
                width="100%"
                onClick={() => {
                  onAddText();
                }}
              />
            </Col>
          ))}
        {activeWidgetId === WIDGET_TYPE.MUSIC
            && audioList.map((it, i) => (
              <Col key={it} span={24} className="widget-item">
                <div
                  onClick={() => {
                    onAddMusic(it);
                  }}
                  style={{
                    width: '100%',
                    height: '40px',
                    marginBottom: 12,
                    backgroundColor: '#fff',
                    lineHeight: '40px',
                  }}
                >
                  曲目
                  {i + 1}
                  <audio
                    controls={false}
                    playsInline
                    style={{
                      width: '100%',
                    }}
                  >
                    <source src={it} type="audio/mpeg" />
                  </audio>
                </div>
              </Col>
            ))}
        {activeWidgetId === WIDGET_TYPE.TRACK
            && (
              <Col span={24} className="widget-item">
                <div
                  onClick={() => {
                    onAddLayer();
                  }}
                  style={{
                    width: '100%',
                    height: '40px',
                    marginBottom: 12,
                    backgroundColor: '#fff',
                    lineHeight: '40px',
                  }}
                >
                  添加轨道
                </div>
              </Col>
            )}
      </Row>
    </div>
  );
}

export default Widget;
