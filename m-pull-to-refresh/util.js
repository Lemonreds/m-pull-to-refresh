const PullUpStatus = {
  init: 'init', // 上拉可以加载更多
  loading: 'loading', // 加载中
  finish: 'finish', // 没有更多数据
};

const PullDownStatus = {
  init: 'init', // 未下拉状态
  pulling: 'pulling', // 下拉可以刷新
  loosing: 'loosing', // 释放可以刷新
  loading: 'loading', // 刷新中
  finish: 'finish', // 完成刷新
};

// @see: https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListene
let passiveIfSupported = false;
try {
  const opts = Object.defineProperty({}, 'passive', {
    // eslint-disable-next-line getter-return
    get() {
      passiveIfSupported = true;
    },
  });
  window.addEventListener('test', null, opts);
} catch (e) {
  // empty
}
const willPreventDefault = passiveIfSupported ? { passive: false } : false;

const bindEvents = (ele, events) => {
  Object.keys(events).forEach((event) => {
    const handle = events[event];
    ele.addEventListener(event, handle, willPreventDefault);
  });
};

const unbindEvents = (ele, events) => {
  Object.keys(events).forEach((event) => {
    const handle = events[event];
    ele.removeEventListener(event, handle, willPreventDefault);
  });
};

const setAimation = (style, { transform, transitionDuration }) => {
  style.transitionDuration = transitionDuration;
  style.webkitTransitionDuration = transitionDuration;
  style.MozTransitionDuration = transitionDuration;

  style.transform = transform;
  style.webkitTransform = transform;
  style.MozTransform = transform;
};

export { PullUpStatus, PullDownStatus, bindEvents, unbindEvents, setAimation };
