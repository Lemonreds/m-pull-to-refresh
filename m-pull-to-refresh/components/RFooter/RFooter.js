import React, { memo } from 'react';
import { PullUpStatus } from '../../util';
import './RFooter.less';

const RFooter = (props) => {
  const { status, hasMore } = props;

  let child = null;

  if (hasMore) {
    switch (status) {
      case PullUpStatus.init:
        child = <span>上拉加载更多</span>;
        break;
      case PullUpStatus.loading:
        child = <span>加载中....</span>;
        break;
      default:
    }
  } else {
    child = <span>已经到底部了</span>;
  }

  return <div className="rfooter">{child}</div>;
};

const areEqual = (prevProps, nextProps) => {
  const { status, hasMore } = prevProps;
  return status === nextProps.status && hasMore === nextProps.hasMore;
};

export default memo(RFooter, areEqual);
