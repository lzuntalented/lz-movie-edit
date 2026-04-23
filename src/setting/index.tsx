import { Button, Form, Input } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { Resizable } from 're-resizable';
import Context from '../context';
import { ItemType } from '../player/interface';
import store from '../store';
import Item from '../store/item';

interface Props {
  data: Item
}

interface ConfigItem {
  key: string;
  label: string,
  type?: number
}

function getConfig(type: number) {
  const result = [] as ConfigItem[];
  switch (type) {
    case ItemType.IMAGE: {
      result.push({ key: 'url', label: '图片地址' });
      break;
    }
    case ItemType.VIDEO: {
      result.push({ key: 'url', label: '视频地址' });
      result.push({ key: 'volume', type: 1, label: '音量' });
      break;
    }
    case ItemType.MUSIC: {
      result.push({ key: 'url', label: '音频地址' });
      result.push({ key: 'volume', type: 1, label: '音量' });
      break;
    }
    case ItemType.TEXT: {
      result.push({ key: 'content', label: '内容' });
      break;
    }
    default:
      break;
  }
  result.push({ key: 'duration', type: 1, label: '时长' });
  result.push({ key: 'x', type: 1, label: 'x' });
  result.push({ key: 'y', type: 1, label: 'y' });
  result.push({ key: 'scale', type: 1, label: 'scale' });
  return result;
}

function Setting(props: Props) {
  const { data } = props;
  const list = getConfig(data.type);
  const [formRef] = Form.useForm();
  const { refresh } = useContext(Context);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [size, setSize] = useState({ width: 300, height: window.innerHeight - 24 - 300 });

  useEffect(() => {
    if (data) {
      const list = getConfig(data.type);
      const vals = {};
      list.forEach((it) => {
        vals[it.key] = data[it.key];
      });
      formRef.setFieldsValue(vals);
    }
  }, [data]);

  const onMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragging) {
        setPosition((prev) => ({
          x: prev.x - e.movementX,
          y: prev.y + e.movementY,
        }));
      }
    };
    const handleMouseUp = () => {
      setDragging(false);
    };
    if (dragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging]);

  const onValuesChange = (v: any) => {
    const keyframe = store.getActiveKeyframe();
    Object.keys(v).forEach((k) => {
      if (list.find((it) => it.type === 1)) {
        data[k] = Number(v[k]);
        if (keyframe) {
          keyframe[k] = Number(v[k]);
        }
      } else {
        data[k] = v[k];
      }
    });
    refresh();
  };

  return (
    <Resizable
      size={size}
      onResize={(e, direction, ref) => {
        setSize({ width: ref.offsetWidth, height: ref.offsetHeight });
      }}
      style={{
        position: 'fixed',
        left: window.innerWidth - 24 - size.width - position.x,
        top: 24 + position.y,
        zIndex: 1000,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#fff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          borderRadius: 4,
          overflow: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: '8px',
            cursor: 'move',
            borderBottom: '1px solid #f0f0f0',
            backgroundColor: '#fafafa',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
          onMouseDown={onMouseDown}
        >
          <span style={{ fontWeight: 'bold' }}>属性面板</span>
          <Button
            size="small"
            onClick={() => {
              store.activeItemId = 0;
              refresh();
            }}
          >
            ×
          </Button>
        </div>
        <div style={{ padding: 16 }}>
          <Button onClick={() => {
            store.addTransaction(data.id);
            refresh();
          }}
          >
            添加转场
          </Button>
          <Form form={formRef} onValuesChange={onValuesChange}>
            {
            list.map((it) => (
              <Form.Item key={it.key} label={it.label} name={it.key}>
                <Input />
              </Form.Item>
            ))
            }
          </Form>
        </div>
      </div>
    </Resizable>
  );
}

export default Setting;