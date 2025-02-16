import React, { useContext, useEffect } from 'react';
import {
  DragDropContext, DragStart, Droppable, DroppableProvided, DropResult, ResponderProvided,
} from 'react-beautiful-dnd';
import Context from './context';
import Indicator from './indicator';
import store from './store';
import TrackDrop from './track-drop';
import TrackOperate from './track-operate';

function Track() {
  const { refresh } = useContext(Context);
  const onDragEnd = (result: DropResult) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
   
    store.exchangeItem(
      { index: result.source.index, layer: store.getLayer(result.source.droppableId) },
      { index: result.destination.index, layer: store.getLayer(result.destination.droppableId) },
    );
    store.updateFlag = Symbol(1);
    refresh();
  };
  const onDragStart = (initial: DragStart) => {
    const idx = store.layers.findIndex((it) => it.id === initial.source.droppableId);
    store.activeLayer = idx;
  };

  useEffect(() => {
    const onDelClick = (event: KeyboardEvent) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        // 删除键监听 待处理
        if (event.target && event.target?.querySelector('.fragment')) {
          store.removeItem();
          refresh();
        }
      }
    };
    window.addEventListener('keydown', onDelClick);
    return () => {
      window.removeEventListener('keydown', onDelClick);
    };
  }, []);

  return (
    <div className="area-track">
      <TrackOperate />
      <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
        <div className="track-container">
          <Indicator />
          {
        store.layers.map((it) => (
          <div className="track-layer" key={it.id}>
            <Droppable key={it.id} droppableId={it.id} direction="horizontal">
              {(provided: DroppableProvided) => (
                <div
                  {...(provided.droppableProps)}
                >
                  <TrackDrop
                    innerRef={provided.innerRef}
                    data={it}
                  />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))
      }
        </div>
      </DragDropContext>
    </div>
  );
}

export default Track;
