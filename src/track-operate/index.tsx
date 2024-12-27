import React, { useContext } from 'react';
import { SplitCellsOutlined } from '@ant-design/icons';
import './index.scss';
import {
  Button, Col, message, Row,
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

  const onSave = () => {
    console.log('current-value---------------------', store.save());
  };
  return (
    <div className="track-operate">
      <Row style={{ width: '100%' }}>
        <Col span={8}>
          <Row gutter={24}>
            <Col>
              添加片段
            </Col>
            <Col>
              <Button icon={<SplitCellsOutlined />} size="small" onClick={onSplit}>
                分割
              </Button>
            </Col>
          </Row>
        </Col>
        <Col span={8}>
          {/* {Math.floor(store.currentTime)}
          {' '}
          /
          {moment(Math.floor(store.currentTime)).format('mm:ss')} */}
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
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default TrackOperate;
