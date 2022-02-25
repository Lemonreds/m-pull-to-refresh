import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import RHeader from './components/RHeader';
import RFooter from './components/RFooter';
import StaticRenderer from './components/StaticRenderer';
import {
  PullDownStatus,
  PullUpStatus,
  bindEvents,
  unbindEvents,
  setAimation,
  isShallowEqual,
  isIOS,
} from './util';
import './m-pull-to-refresh.less';

class MPullToRefresh extends React.Component {
  wrapRef;

  bodyRef;

  startX = 0;

  startY = 0;

  diffX = 0;

  diffY = 0;

  wrapRefEvents;

  bodyRefEvents;

  duration = 0;

  isEdge = false;

  state = {
    ptRfresh: PullDownStatus.init,
    ptMore: PullUpStatus.init,
  };

  componentDidMount() {
    this.init();
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { children } = this.props;
    this.shouldUpdateChildren = children !== nextProps.children;
    return !isShallowEqual(nextState, this.state) || !isShallowEqual(nextProps, this.props);
  }

  componentWillUnmount() {
    this.destroy();
  }

  init = () => {
    const { loadMore } = this.props;

    this.wrapRefEvents = {};
    if (loadMore) {
      this.wrapRefEvents.scroll = this.onScroll;
    }

    this.bodyRefEvents = {
      touchstart: this.onTouchStart,
      touchmove: this.onTouchMove,
      touchend: this.onTouchEnd,
      touchcancel: this.onTouchEnd,
    };

    bindEvents(this.wrapRef, this.wrapRefEvents);
    bindEvents(this.bodyRef, this.bodyRefEvents);
  };

  destroy = () => {
    unbindEvents(this.wrapRef, this.wrapRefEvents);
    unbindEvents(this.bodyRef, this.bodyRefEvents);
  };

  onScroll = (e) => {
    const { hasMore } = this.props;
    const { ptMore } = this.state;
    if (!hasMore || ptMore === PullUpStatus.loading) {
      return;
    }

    const { distanceToLoadMore } = this.props;
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const isReachBottom = scrollTop + clientHeight >= scrollHeight - distanceToLoadMore;
    if (isReachBottom) {
      this.invokeLoadMore();
    }
  };

  invokeLoadMore = () => {
    const { loadMore, hasMore } = this.props;
    if (loadMore && hasMore) {
      this.setState({ ptMore: PullUpStatus.loading });
      loadMore().then(() => {
        this.setState({ ptMore: PullUpStatus.init });
      });
    } else {
      this.setState({ ptMore: PullUpStatus.init });
    }
  };

  invokeRefresh = () => {
    const { headerHeight, stayTime, refresh } = this.props;
    refresh().then(() => {
      this.update(headerHeight, PullDownStatus.finish);
      setTimeout(() => {
        this.update(0);
      }, stayTime);
    });
  };

  canRefresh = () => {
    const { ptRfresh } = this.state;
    return ptRfresh !== PullDownStatus.loading && ptRfresh !== PullDownStatus.finish;
  };

  checkIsEdge = () => {
    // iOS下 scrollTop 会出现bounce，导致出现负值
    this.isEdge = Math.max(this.wrapRef.scrollTop, 0) === 0;

    return this.isEdge;
  };

  startAt = (e) => {
    const { clientX, clientY } = e.touches[0];
    this.duration = 0;
    this.diffX = 0;
    this.diffY = 0;
    this.startX = clientX;
    this.startY = clientY;
  };

  moveTo = (e) => {
    const { clientX, clientY } = e.touches[0];

    this.diffX = clientX - this.startX;
    this.diffY = clientY - this.startY;
  };

  onTouchStart = (e) => {
    if (!this.canRefresh()) {
      return;
    }

    if (this.checkIsEdge()) {
      this.startAt(e);
    }
  };

  onTouchMove = (e) => {
    if (!this.canRefresh()) {
      return;
    }

    if (!this.isEdge) {
      if (this.checkIsEdge()) {
        this.startAt(e);
      }
    }

    this.moveTo(e);
    if (Math.abs(this.diffX) > 20 * window.devicePixelRatio) {
      return;
    }

    if (this.isEdge && this.diffY >= 0) {
      if (e.cancelable) {
        e.preventDefault();
      }
      const dy = this.easing(this.diffY);
      this.update(dy);
    }
  };

  onTouchEnd = () => {
    if (!this.canRefresh()) {
      return;
    }

    if (!this.isEdge) {
      return;
    }

    if (this.diffY) {
      const { duration, headerHeight } = this.props;
      const { ptRfresh } = this.state;

      this.duration = duration;
      if (ptRfresh === PullDownStatus.loosing) {
        this.update(headerHeight, PullDownStatus.loading);
        this.invokeRefresh();
      } else {
        this.update(0);
      }
    }
  };

  callRefresh = () => {
    if (this.canRefresh()) {
      const { duration, headerHeight } = this.props;
      this.duration = duration;
      this.update(headerHeight, PullDownStatus.loading);
      this.invokeRefresh();
    }
  };

  update = (dy, status) => {
    const { distanceToRefresh } = this.props;

    let t = status;

    if (!t) {
      if (dy === 0) {
        t = PullDownStatus.init;
      } else if (dy < distanceToRefresh) {
        t = PullDownStatus.pulling;
      } else {
        t = PullDownStatus.loosing;
      }
    }

    this.setState({ ptRfresh: t }, () => {
      setAimation(this.bodyRef.style, {
        transitionDuration: `${this.duration}ms`,
        transform: `translate3d(0px,${dy}px,1px)`,
      });
    });
  };

  easing = (dy) => {
    const { distanceToRefresh, maxDistance } = this.props;
    let _dy = dy;

    if (_dy > distanceToRefresh) {
      if (_dy < distanceToRefresh * 2) {
        _dy = distanceToRefresh + (_dy - distanceToRefresh) / 2;
      } else {
        _dy = distanceToRefresh * 1.5 + (_dy - distanceToRefresh * 2) / 4;
      }
    }

    return Math.min(maxDistance, Math.round(_dy));
  };

  render() {
    const { className, children, style, headerHeight, hasMore } = this.props;
    const { ptRfresh, ptMore } = this.state;
    const isPulling = ptRfresh === PullDownStatus.pulling;
    /**
     * iOS的滚动容器会有橡皮筋效果，有时下拉刷新（与容器滚动冲突时）会变得很灵敏，
     * 所以禁止容器滚动，来处理这个问题
     */
    const iOSDebouneDisabled = isIOS && isPulling ? { overflow: 'hidden' } : {};

    return (
      <div
        className={classnames(className, 'm-pull-to-refresh-container')}
        ref={(_ref) => {
          this.wrapRef = _ref;
        }}
        style={{ ...style, ...iOSDebouneDisabled }}
      >
        <div
          className={classnames('m-pull-to-refresh-body', `m-pull-to-refresh-${ptRfresh}`)}
          ref={(_ref) => {
            this.bodyRef = _ref;
          }}
        >
          <div className="m-pull-to-refresh-header" style={{ height: headerHeight }}>
            <RHeader status={ptRfresh} />
          </div>

          <div className="m-pull-to-refresh-children">
            <StaticRenderer shouldUpdate={this.shouldUpdateChildren} render={() => children} />
          </div>

          <div className="m-pull-to-refresh-footer">
            <RFooter status={ptMore} hasMore={hasMore} />
          </div>
        </div>
      </div>
    );
  }
}

MPullToRefresh.propTypes = {
  className: PropTypes.any,
  style: PropTypes.any,
  distanceToRefresh: PropTypes.number,
  refresh: PropTypes.func, // ()=> Promise<any>
  stayTime: PropTypes.number,
  duration: PropTypes.number,
  headerHeight: PropTypes.number,
  hasMore: PropTypes.bool,
  distanceToLoadMore: PropTypes.number,
  loadMore: PropTypes.func, // ()=> Promise<any>
  maxDistance: PropTypes.number,
};

MPullToRefresh.defaultProps = {
  className: '',
  style: {},
  distanceToRefresh: 56,
  refresh: null,
  stayTime: 600,
  duration: 300,
  headerHeight: 56,
  hasMore: true,
  distanceToLoadMore: 50,
  loadMore: null,
  maxDistance: Infinity,
};

export default MPullToRefresh;
