//@ts-check
(() => {

  const noop = () => {};

  class MyPromise {

    static RESOLVED = "resolved";
    static REJECTED = "rejected";
    static PENDING = "pending";

    constructor(promiseFn) {
      this.promiseFn = promiseFn;
      this.state = {
        status: MyPromise.PENDING,
        value: null,
      };
      this.promiseCallback = noop;
      this.rejectCallback = noop;
      setTimeout(() => {
        this.promiseFn(this.resolveFn, this.rejectFn);
      }, 0);
    }

    static resolve = (resolvedValue) => {
      return new MyPromise(resolve => resolve(resolvedValue));
    }

    static reject = (rejection) => {
      return new MyPromise((resolve, reject) => reject(rejection));
    }

    static race = (arrayOfPromises) => {
      return new MyPromise((resolve, reject) => {
        let rejectedValues = [];
        let alreadyResolved = false;
        arrayOfPromises.forEach((promise, index) => {
          promise.then((value) => {
            if (!alreadyResolved) {
              resolve(value);
              alreadyResolved = true;
            }
          }, (rejection) => {
            rejectedValues.push(rejection);
            if (rejectedValues.length === arrayOfPromises.length) {
              if (!alreadyResolved) {
                reject(rejectedValues);
              }
            }
          });
        });
      });
    }

    static all = (arrayOfPromises) => {
      return new MyPromise((resolve, reject) => {
        let resolvedValues = [];
        arrayOfPromises.forEach((promise, index) => {
          promise.then((value) => {
            resolvedValues[index] = value;
            
            if (resolvedValues.length === arrayOfPromises.length) {
              resolve(resolvedValues);
            }
          }, (rejection) => {
            reject(rejection);
          });
        });
      });
    }

    then = (promiseCallback, rejectCallback) => {
      this.promiseCallback = promiseCallback || noop;
      this.rejectCallback = rejectCallback || noop;
      this.resolveResult();
    }

    resolveResult = () => {
      if (this.state.status === MyPromise.RESOLVED) {
        this.promiseCallback(this.state.value);
      } else if (this.state.status === MyPromise.REJECTED) {
        this.rejectCallback(this.state.value);
      }
    }

    resolveFn = (resolvedValue) => {
      this.state = {
        status: MyPromise.RESOLVED,
        value: resolvedValue,
      };
      this.resolveResult();
    }

    rejectFn = (rejection) => {
      this.state = {
        status: MyPromise.REJECTED,
        value: rejection,
      };
      this.resolveResult();
    }
    
  }

  //@ts-ignore
  window.MyPromise = MyPromise;

})();
