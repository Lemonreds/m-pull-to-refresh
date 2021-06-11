import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import RHeader from './components/RHeader';
import RFooter from './components/RFooter';
import StaticRenderer from './components/StaticRenderer';
import { PullDownStatus, PullUpStatus } from './util';
import './m-pull-to-refresh.less';

class MPullToRefresh extends React.Component {
  wrapRef;

  bodyRef;

  startX = 0;

  startY = 0;

  diffX = 0;

  diffY = 0;

  events;

  state = {
    ptRfresh: PullDownStatus.init,
    duration: 0,
    dy: 0,

    ptMore: PullUpStatus.init,
  };

  componentDidMount() {
    this.init();
  }

  shouldComponentUpdate(nextProps) {
    const { children } = this.props;
    this.shouldUpdateChildren = children !== nextProps.children;
    return true;
  }

  componentWillUnmount() {
    this.destroy();
  }

  init = () => {
    const { loadMore } = this.props;
    const ele = this.wrapRef;
    if (loadMore) {
      this.events = {
        scroll: this.onScroll,
      };

      Object.keys(this.events).forEach((key) => {
        const handle = this.events[key];
        ele.addEventListener(key, handle);
      });
    }
  };

  destroy = () => {
    const ele = this.wrapRef;
    Object.keys(this.events).forEach((key) => {
      const handle = this.events[key];
      ele.removeEventListener(key, handle);
    });
  };

  onScroll = (e) => {
    const { hasMore } = this.props;
    const { ptMore } = this.state;
    if (!hasMore || ptMore === PullUpStatus.loading) {
      return;
    }

    const { distanceToLoadMore } = this.props;
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const isReachBottom =
      scrollTop + clientHeight >= scrollHeight - distanceToLoadMore;
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
    return (
      ptRfresh !== PullDownStatus.loading && ptRfresh !== PullDownStatus.finish
    );
  };

  isEdge = () => this.wrapRef.scrollTop === 0;

  onTouchStart = (e) => {
    if (!this.canRefresh()) {
      return;
    }

    if (this.isEdge()) {
      const { clientX, clientY } = e.touches[0];
      this.setState({ duration: 0 });
      this.startX = clientX;
      this.startY = clientY;
      this.diffX = 0;
      this.diffY = 0;
    }
  };

  onTouchMove = (e) => {
    if (!this.canRefresh()) {
      return;
    }

    const isEdge = this.isEdge();
    const { clientX, clientY } = e.touches[0];
    if (!isEdge) {
      this.startX = clientX;
      this.startY = clientY;
    }
    this.diffX = clientX - this.startX;
    this.diffY = clientY - this.startY;

    //  TODO:
    // if (Math.abs(this.diffX) > 20 * window.devicePixelRatio) {
    //   return;
    // }

    if (isEdge && this.diffY) {
      const dy = this.easing();
      this.update(dy);
    }
  };

  onTouchEnd = () => {
    if (!this.canRefresh()) {
      return;
    }

    if (this.isEdge() && this.diffY) {
      const { duration, headerHeight } = this.props;
      const { ptRfresh } = this.state;

      if (ptRfresh === PullDownStatus.loosing) {
        this.update(headerHeight, PullDownStatus.loading);
        this.invokeRefresh();
      } else {
        this.update(0);
      }

      this.setState({ duration });
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
    this.setState({ ptRfresh: t, dy });
  };

  easing = () => {
    const { distanceToRefresh } = this.props;
    let _dy = this.diffY;

    if (_dy > distanceToRefresh) {
      if (_dy < distanceToRefresh * 2) {
        _dy = distanceToRefresh + (_dy - distanceToRefresh) / 2;
      } else {
        _dy = distanceToRefresh * 1.5 + (_dy - distanceToRefresh * 2) / 4;
      }
    }

    return Math.round(_dy);
  };

  render() {
    const { className, children, style, headerHeight, hasMore } = this.props;
    const { ptRfresh, ptMore, duration, dy } = this.state;

    const renderChildren = (
      <StaticRenderer
        shouldUpdate={this.shouldUpdateChildren}
        render={() => children}
      />
    );

    const bodyStyle = {
      transitionDuration: `${duration}ms`,
      transform: dy ? `translate3d(0,${dy}px, 0)` : '',
    };

    return (
      <div
        className={classnames(className, 'm-pull-to-refresh-container')}
        ref={(_ref) => {
          this.wrapRef = _ref;
        }}
        style={style}
      >
        <div
          className={classnames(
            'm-pull-to-refresh-body',
            `m-pull-to-refresh-${ptRfresh}`
          )}
          style={bodyStyle}
          ref={(_ref) => {
            this.bodyRef = _ref;
          }}
          onTouchStart={this.onTouchStart}
          onTouchMove={this.onTouchMove}
          onTouchEnd={this.onTouchEnd}
          onTouchCancel={this.onTouchEnd}
        >
          <div
            className="m-pull-to-refresh-header"
            style={{ height: headerHeight }}
          >
            <RHeader status={ptRfresh} />
          </div>

          <div className="m-pull-to-refresh-children">{renderChildren}</div>

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
};

export default MPullToRefresh;
