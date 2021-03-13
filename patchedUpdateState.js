/*
 * @Author: hackftz
 * @Date: 2021-03-14 00:01:08
 * @LastEditTime: 2021-03-14 00:01:09
 * @LastEditors: hackftz
 * @FilePath: /single-spa-analysis/patchedUpdateState.js
 */
function patchedUpdateState(updateState, methodName) {
  //下面是在调用的时候传入的两个参数
  // window.history.pushState,
  // "pushState"
  return function () {
    //获得跳转之前的页面url
    const urlBefore = window.location.href;
    //劫持使用原生pushState方法，这里就保证了原来的pushState功能不会丢失
    const result = updateState.apply(this, arguments);
    //获得跳转之后的页面url
    const urlAfter = window.location.href;

    //假如原来的url和新的url是不同的或者urlRerouteOnly为false的话那么都会执行if里面的逻辑。
　　 //这个urlRerouteOnly是官方文档上可以传入start( urlRerouteOnly: true)函数的参数
    //如果说你在start时候传入了这个参数，那么如果当你调用pushState的时候，但是你调用pushState
    //并不想改变url，只是想达到你某个目的，那么此时，前后url没发生改变那么就不会重新reroute，从一定
    //程度上提升了性能。
    //假如你不传入这个参数，那么只要你调用pushState就会重新reroute。
    //下面看看createPopStateEvent看看它是通过什么方式执行reroute

    if (!urlRerouteOnly || urlBefore !== urlAfter) {
      //这里本质上执行了自定义个popstate事件，回调之后就执行了reroute
      window.dispatchEvent(
        createPopStateEvent(window.history.state, methodName)
      );
    }

    return result;
  };
}

function createPopStateEvent(state, originalMethodName) {
  let evt;
  try {
    //这里自定义了一个popstate事件，并且返回，那么在上层的window.dispatch去触发·这个事件的时候本质上就是
    //触发popstate事件，那么我们在上面源码的开头就已经监听了popstate事件，监听到了的回调函数就是执行reroute
    //所以说pushState执行reroute的手段本质上就是通过触发popstate事件，从而触发reroute。

    evt = new PopStateEvent("popstate", { state });
  } catch (err) {
    // IE 11 compatibility https://github.com/single-spa/single-spa/issues/299
    // https://docs.microsoft.com/en-us/openspecs/ie_standards/ms-html5e/bd560f47-b349-4d2c-baa8-f1560fb489dd
    evt = document.createEvent("PopStateEvent");
    evt.initPopStateEvent("popstate", false, false, state);
  }
  evt.singleSpa = true;
  evt.singleSpaTrigger = originalMethodName;
  return evt;
}