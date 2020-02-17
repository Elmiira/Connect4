import React from 'react';
import clsx from 'clsx';
import './disc.css';

export default function Disk(props) {
  const classes = props.className ? clsx("cell", props.className) : "cell";
  return (
    <div
      className={classes}
      onClick={props.handleOnClick(props.index)}
    />
  );
};
