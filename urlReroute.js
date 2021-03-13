/*
 * @Author: hackftz
 * @Date: 2021-03-13 23:37:05
 * @LastEditTime: 2021-03-13 23:38:57
 * @LastEditors: hackftz
 * @FilePath: /single-spa-analysis/urlReroute.js
 */
function urlReroute() {
  reroute([], arguments);
}

if (isInBrowser) {
  // We will trigger an app change for any routing events.
  //增加了两个监听，监听url的变化，如果你用的hash模式改变#后面的值或者在浏览器中后退，那么就重新执行reroute。
  window.addEventListener("hashchange", urlReroute);
  window.addEventListener("popstate", urlReroute);

  // Monkeypatch addEventListener so that we can ensure correct timing
  const originalAddEventListener = window.addEventListener;
  const originalRemoveEventListener = window.removeEventListener;
  window.addEventListener = function (eventName, fn) {
    if (typeof fn === "function") {
      export const routingEventsListeningTo = ["hashchange", "popstate"];


      if (
        routingEventsListeningTo.indexOf(eventName) >= 0 &&
          //这里检查在capturedEventListeners数组中，有没有存放和你注册过的相同的方法，没有的话就把这个方法加上去
          //那这里主要针对的是路由的事件
        !find(capturedEventListeners[eventName], (listener) => listener === fn)
      ) {
        capturedEventListeners[eventName].push(fn);
        return;
      }
    }

    return originalAddEventListener.apply(this, arguments);
  };


  window.removeEventListener = function (eventName, listenerFn) {
    if (typeof listenerFn === "function") {
      //export const routingEventsListeningTo = ["hashchange", "popstate"];
      if (routingEventsListeningTo.indexOf(eventName) >= 0) {
        capturedEventListeners[eventName] = capturedEventListeners[
          eventName
        ].filter((fn) => fn !== listenerFn);
        return;
      }
    }

    return originalRemoveEventListener.apply(this, arguments);
  };

  //利用装饰器模型，在原有window.history.pushState功能上进行增加。但是为什么要增加？原因在于我们看到这个代码开头，只是监听了hashchange和popstate的变化，但是这两个api是无法监听用户直接调用pushState方法进行url调转
  //下面的功能增加就是当用户在执行这个pushState方法的时候也能够重新reroute，下面我们来看看patchUpdateState源码
  window.history.pushState = patchedUpdateState(
    window.history.pushState,
    "pushState"
  );
  //replaceState方法和pushState方法同理
  window.history.replaceState = patchedUpdateState(
    window.history.replaceState,
    "replaceState"
  );

  if (window.singleSpaNavigate) {
    ...
  } else {
    /* For convenience in `onclick` attributes, we expose a global function for navigating to
     * whatever an <a> tag's href is.
     */
    window.singleSpaNavigate = navigateToUrl;
  }
}