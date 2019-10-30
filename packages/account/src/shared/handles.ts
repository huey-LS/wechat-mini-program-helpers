
declare type HandleQueue<T> = Array<Middleware<T>>;

declare interface Middleware<T> {
  (ctx: T, next?: () => void ): void|Promise<any>;
}

export default class Handles<T extends Object> {
  handleQueue:HandleQueue<T> = [];

  constructor (handleQueue?: HandleQueue<T>) {
    this.use(handleQueue);
  }

  use (handle?: Middleware<T>|HandleQueue<T>|Handles<T>) {
    let handles: HandleQueue<T>|undefined;
    if (handle) {
      if (handle instanceof Handles) {
        handles = handle.handleQueue;
      } else if (Array.isArray(handle)) {
        handles = [ ...handle ];
      } else if (typeof handle === 'function') {
        handles = [ handle ];
      }
      if (handles) {
        this.handleQueue = [...this.handleQueue, ...handles];
      }
    }

    return this;
  }

  start (ctx: T = ({} as any)) {
    let handleFns = this.handleQueue;

    return this.play(handleFns)(ctx);
  }

  play = (handleQueue: HandleQueue<T>) => (ctx: T) => {
    let _self = this;
    let index = -1;
    return dispatch(0);

    function dispatch (i: number): any {
      let fn = handleQueue[i];
      if (i <= index) {
        return Promise.reject(new Error('next() called multiple times'))
      }
      index = i;
      if (i === handleQueue.length) return Promise.resolve();
      if (!fn) return Promise.resolve();
      let value;
      try {
        value = fn.call(_self, ctx, () => {
          return dispatch(i + 1);
        });
      } catch (e) {
        return Promise.reject(e);
      }
      if (isPromise(value)) {
        return value;
      } else if (i === index) {
        return Promise.resolve(dispatch(i + 1));
      } else {
        return Promise.resolve(value);
      }
    }
  }
}

function isPromise (obj: any) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}
