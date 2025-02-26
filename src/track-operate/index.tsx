import React, { useContext } from 'react';
import { SplitCellsOutlined } from '@ant-design/icons';
import './index.scss';
import {
  Button, Col, message, Row,
  Slider,
} from 'antd';
import moment from 'moment';
import { PlayStatus } from '../player/interface';
import store from '../store';
import Context from '../context';
import { formatTime } from '../utils';
import Layer from '../store/layer';
import { isDev } from '../common/env';
import { defaultDemoValue } from '../store/cache';

function TrackOperate() {
  const { refresh } = useContext(Context);
  const onChange = () => {
    if (store.playStatus !== PlayStatus.PLAYING) {
      store.play();
    } else {
      store.pause();
      refresh();
    }
  };

  const onSplit = () => {
    const success = store.splitItem();
    if (success) {
      refresh();
    } else {
      message.error('片段时间不得小于1s');
    }
  };
  const onClear = () => {
    store.clear();
    refresh();
  };
  const onInit = () => {
    store.initValue(JSON.parse(defaultDemoValue) as Layer[]);
    refresh();
  };
  const onAddKeyFrame = () => {
    const activeItem = store.getActiveItem();
    if (activeItem) {
      activeItem.addKeyframe({
        x: activeItem.x,
        y: activeItem.y,
        scale: activeItem.scale,
        pos: store.currentTime - activeItem.start,
      });
      refresh();
    }
  };
  const onRemoveKeyFrame = () => {

  };

  const onSave = () => {
    console.log('current-value---------------------', store.save());
  };
  return (
    <div className="track-operate">
      <Row style={{ width: '100%' }} align="middle">
        <Col span={8}>
          <Row gutter={24} align="middle">
            <Col>
              添加片段
            </Col>
            <Col>
              <Button icon={<SplitCellsOutlined />} size="small" onClick={onSplit}>
                分割
              </Button>
            </Col>
            <Col>
              <Slider
                min={0}
                max={20}
                value={store.timerScale}
                style={{ width: 100 }}
                step={2}
                onChange={(v) => {
                  store.timerScale = v;
                  refresh();
                }}
              />
            </Col>
          </Row>
        </Col>
        <Col span={8}>
          {
            formatTime(store.currentTime)
          }
          /
          {
            formatTime(store.getTotalTime())
          }
          <Button size="small" onClick={onChange} type="primary">
            {store.playStatus === PlayStatus.PLAYING ? '暂停' : '播放'}
          </Button>
        </Col>
        <Col span={8}>
          <Row gutter={12}>
            <Col>
              <Button size="small" onClick={onClear}>
                清空
              </Button>
            </Col>
            <Col>
              <Button size="small" onClick={onInit}>
                初始化
              </Button>
            </Col>
            <Col>
              <Button size="small" onClick={onSave}>
                保存
              </Button>
            </Col>
            {store.getActiveItem() && (
            <Col>
              <Button size="small" onClick={onAddKeyFrame}>
                关键帧+
              </Button>
            </Col>
            )}
            {store.getActiveItem() && (
            <Col>
              <Button size="small" onClick={onRemoveKeyFrame}>
                关键帧-
              </Button>
            </Col>
            )}
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default TrackOperate;
