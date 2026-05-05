import React, { useEffect, useRef } from 'react';
import store from '../store';
import { PlayStatus, TextProps } from './interface';

export default function Text(props: TextProps) {
  const {
    content, bg = 'transparent', color = '#000',
    fontSize = 16, textAlign = 'center',
  } = props;
  const ref = useRef<HTMLVideoElement>(null);
  return (
    <div
      style={{
        backgroundColor: bg,
        color,
        padding: '4px 8px',
        fontSize,
        textAlign: textAlign as any,
      }}
    >
      {content}
    </div>
  );
}
