## m-pull-to-refresh

一个支持下拉刷新、上拉加载的 React 移动端组件。

## 在线预览

https://lemonreds.github.io/demo/m-pull-to-refresh/index.html

## 特点

- 由于使用了 Touch Events，故仅支持移动端。
- 支持下拉刷新、上拉加载。
- 支持自定义 Header、Footer 组件。
- 支持设置触发下拉刷新操作的距离。
- 支持手动触发下拉刷新
- 刷新成功后，可以设置延迟关闭动画。
- 可以设置最大拉动距离。

## 预览

<img src="https://cdn.jsdelivr.net/gh/Lemonreds/vue2-component@master/images/pull-to-refresh.5lq152czp200.gif" 
width="370"
height="600"
/>

## 使用

```javascript
import MPullToRefresh from '../m-pull-to-refresh';

<MPullToRefresh refresh={refresh} loadMore={loadMore} hasMore={hasMore}>
  {list.map((index) => (
    <RowRender index={index} key={index} />
  ))}
</MPullToRefresh>;
```

## Props

| 属性               | 描述                   | 类型         | 默认     |
| ------------------ | ---------------------- | ------------ | -------- |
| distanceToRefresh  | 触发下拉刷新的距离     | number       | 56       |
| refresh            | 下拉刷新触发的事件回调 | ()=> Promise | -        |
| stayTime           | 刷新成功状态的停留时间 | number(ms)   | 600      |
| duration           | 动画的 duration        | number(ms)   | 300      |
| headerHeight       | 刷新 Header 的高度     | number       | 56       |
| hasMore            | 上拉加载是否有更多数据 | boolean      | true     |
| distanceToLoadMore | 触发上拉加载的距离     | number       | 50       |
| loadMore           | 上拉加载触发的事件回调 | ()=> Promise | -        |
| maxDistance        | 限制拖动的最大距离     | number       | Infinity |

## Methods

| 属性        | 描述             | 返回值 |
| ----------- | ---------------- | ------ |
| callRefresh | 手动触发下拉刷新 | void   |

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

## 更新日志

1. 2021-11-05

- 解决了 safari 下，因滚动容器橡皮筋效果导致的下拉过于灵敏问题。

2. 2022-02-25

- 支持手动触发下拉刷新

## 本地运行示例

1. yarn install

2. yarn start

3. localhost:3001/example1.html
