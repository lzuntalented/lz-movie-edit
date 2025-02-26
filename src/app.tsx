import React, {
  useCallback, useContext, useEffect, useState,
} from 'react';
import {
  DragDropContext, Draggable, DraggableProvided, Droppable, DroppableProvided, DropResult,
} from 'react-beautiful-dnd';
import { useImmer } from 'use-immer';
import { Col, Layout, Row } from 'antd';
import Sider from 'antd/lib/layout/Sider';
import Context, { Consumer, Provider } from './context';
import Operation from './operation';
import Player from './player';
import store, { addLayer } from './store';
import Item from './store/item';
import Layer from './store/layer';
import Track from './track';
import './app.scss';
import Setting from './setting';
import Widget from './widget';
import { defaultDemoValue } from './store/cache';
import { isDev } from './common/env';

const { Content, Footer, Header } = Layout;

export default function App() {
  const [state, setDraft] = useImmer({
    refreshFlag: Symbol(1),
    activeWidgetId: 0,
  });

  const refresh = useCallback(
    () => {
      setDraft((d) => {
        d.refreshFlag = Symbol(1);
      });
    },
    [],
  );

  useEffect(() => {
    if (isDev) {
      store.addLayer();
    } else {
      store.initValue(JSON.parse(defaultDemoValue) as Layer[]);
    }
    refresh();
    // const onExitSystem = (e: any) => {
    //   e.preventDefault();
    //   alert('还未保存，确定退出？');
    // };
    // window.addEventListener('beforeunload', onExitSystem);
    // return () => {
    //   window.removeEventListener('beforeunload', onExitSystem);
    // };
  }, []);

  const activeTtem = store.getActiveItem();
  return (
    <Provider value={{ state, refresh }}>
      <Row itemType="flex">
        <Col>
          <Operation
            activeWidgetId={state.activeWidgetId}
            onWidgetClick={(e) => {
              setDraft((d) => {
                d.activeWidgetId = e === state.activeWidgetId ? 0 : e;
              });
            }}
          />
        </Col>
        <Col style={{ flex: 1 }}>
          <Row itemType="flex" justify="space-between">
            {state.activeWidgetId > 0 && (
            <Col>
              <Widget activeWidgetId={state.activeWidgetId} />
            </Col>
            )}
            <Col span={12}>
              <Player layers={store.layers} refresh={state.refreshFlag} />
            </Col>
            <Col span={6}>
              {
                  activeTtem && <Setting key={activeTtem?.id} data={activeTtem} />
                }
            </Col>
          </Row>
        </Col>
      </Row>
      <Track />
    </Provider>
  );
}
