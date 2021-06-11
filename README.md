## m-pull-to-refresh

一个支持下拉刷新、上拉加载的 React 移动端组件。

## 特点

- 仅支持移动端。
- 不限制最大下拉距离，释放后可以回弹。
- 刷新完成后，可以配置延迟关闭滑动动画。
- 同时支持下拉刷新以及上拉加载。
- 支持自定义 Header、Footer 组件。

## 预览

![m-pull-to-refresh](https://cdn.jsdelivr.net/gh/Lemonreds/vue2-component@master/images/pull-to-refresh.5lq152czp200.gif)

## 使用

```javascript

import MPullToRefresh from '../m-pull-to-refresh';

<MPullToRefresh refresh={refresh} loadMore={loadMore} hasMore={hasMore}>
  {list.map((index) => (
    <RowRender index={index} key={index} />
  ))}
</MPullToRefresh>
```

## 下拉刷新的状态

```javascript
const PullDownStatus = {
  init: 'init', // 未下拉状态
  pulling: 'pulling', // 下拉可以刷新
  loosing: 'loosing', // 释放可以刷新
  loading: 'loading', // 刷新中
  finish: 'finish', // 完成刷新
};
```

## 上拉加载的状态

```javascript
const PullUpStatus = {
  init: 'init', // 上拉可以加载更多
  loading: 'loading', // 加载中
  finish: 'finish', // 没有更多数据
};
```

## 本地运行示例

1. npm run install

2. npm run start

3 localhost:3001/example1.html
