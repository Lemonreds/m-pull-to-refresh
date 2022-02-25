import React, { useState, useEffect, useRef } from 'react';
import { render } from 'react-dom';
import MPullToRefresh from '../m-pull-to-refresh';
import './app.less';

const colors = ['#8868ff', '#24cdd0', '#ffc84e', '#fe657f', '#748cfd'];

const RowRender = (props) => {
  const { index } = props;
  return (
    <div
      style={{
        height: 80,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: colors[index % colors.length],
        color: '#fff',
      }}
    >
      {index}
    </div>
  );
};

const pageSize = 10;

const App = () => {
  const [list, setList] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [pageNum, setPageNum] = useState(1);
  const ref = useRef();

  useEffect(() => {
    get(1);
  }, []);

  const get = (_pageNum) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newList = new Array(_pageNum === 4 ? 2 : 10)
          .fill(true)
          .map((_, index) => (_pageNum - 1) * pageSize + index);

        setList(_pageNum === 1 ? newList : list.concat(newList));
        setPageNum(_pageNum);
        setHasMore(_pageNum < 4); // list's total is 32

        resolve();
      }, 800);
    });
  };

  const callRefresh = () => {
    ref.current?.callRefresh();
  };

  const refresh = () => {
    return get(1);
  };

  const loadMore = () => {
    return get(pageNum + 1);
  };

  return (
    <div>
      <h3 className="title">
        m-pull-to-refresh
        <a href="https://github.com/Lemonreds/m-pull-to-refresh" target="__blank">
          @Github
        </a>
      </h3>
      <p className="desc">一个支持下拉刷新、上拉加载的 React 组件</p>

      <p className="tips">TIPS: 移动端组件，请将浏览器设置为移动设备调试模式，不支持PC端</p>

      <button type="button" onClick={callRefresh} className="button">
        手动触发下拉刷新
      </button>
      <div className="line" />
      <div
        style={{
          height: 600,
          overflow: 'auto',
          border: '1px solid #eee',
        }}
      >
        <MPullToRefresh refresh={refresh} loadMore={loadMore} hasMore={hasMore} ref={ref}>
          {list.map((index) => (
            <RowRender index={index} key={index} />
          ))}
        </MPullToRefresh>
      </div>
    </div>
  );
};

render(<App />, document.getElementById('root'));
