import { Form, Input } from 'antd';
import React, { useContext, useEffect } from 'react';
import Context from '../context';
import { ItemType } from '../player/interface';
import Item from '../store/item';
import { isNumber } from '../utils';

interface Props {
  // id: string;
  // list: {key: string; label: string}[]
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
      result.push({ key: 'playStart', type: 1, label: '开始时间' });
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
  return result;
}

function Setting(props: Props) {
  const { data } = props;
  const list = getConfig(data.type);
  const [formRef] = Form.useForm();
  const { refresh } = useContext(Context);

  useEffect(() => {
    if (data) {
      const list = getConfig(data.type);
      const vals = {};
      list.forEach((it) => {
        vals[it.key] = data[it.key];
      });
      // console.log(list, vals, data);
      formRef.setFieldsValue(vals);
    }
  }, [data]);

  const onValuesChange = (v) => {
    // console.log('onValuesChange', v);
    Object.keys(v).forEach((k) => {
      if (list.find((it) => it.type === 1)) {
        data[k] = Number(v[k]);
      } else {
        data[k] = v[k];
      }
    });
    refresh();
  };
  return (
    <div>
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
  );
}

export default Setting;
