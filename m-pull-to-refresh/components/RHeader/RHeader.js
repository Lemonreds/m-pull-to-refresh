import React, { memo } from 'react';
import { PullDownStatus } from '../../util';

import './RHeader.less';

const RHeader = (props) => {
  const { status } = props;

  let child = null;

  switch (status) {
    case PullDownStatus.init:
    case PullDownStatus.pulling:
      child = <span>下拉可以刷新</span>;
      break;
    case PullDownStatus.loading:
      child = <span>加载中...</span>;
      break;
    case PullDownStatus.loosing:
      child = <span>松开可以刷新</span>;
      break;
    case PullDownStatus.finish:
      child = <span>刷新完成</span>;
      break;
    default:
      break;
  }

  return <div className="rheader">{child}</div>;
};

const areEqual = (prevProps, nextProps) => {
  const { status } = prevProps;
  return status === nextProps.status;
};

export default memo(RHeader, areEqual);
