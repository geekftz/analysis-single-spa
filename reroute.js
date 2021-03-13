/**
 * 负责改变app.status。和执行在子应用中注册的生命周期函数。
 * @param {*} pendingPromises 
 * @param {*} eventArguments 
 * @returns 
 */
export function reroute(pendingPromises = [], eventArguments) {　
  //appChangeUnderway定义在了本文件的开头，默认是置为false。所以在registerApplication方法使用的时候，是不会出发的if的逻辑　//在start之后就会被置为true。意味着在start重新调用reroute的时候就会进入这段if逻辑
  if (appChangeUnderway) {
    return new Promise((resolve, reject) => {
      peopleWaitingOnAppChange.push({
        resolve,
        reject,
        eventArguments,
      });
    });
  }

  const {
    appsToUnload,
    appsToUnmount,
    appsToLoad,
    appsToMount,
  } = getAppChanges();
  let appsThatChanged,
    navigationIsCanceled = false,
      //oldUrl在文件开头获取
    oldUrl = currentUrl,
      //新的url在本文件中获取
    newUrl = (currentUrl = window.location.href);

  //isStarted判断是否执行start方法，start方法开头把started置为true，就会走入这个分支
  if (isStarted()) {
    appChangeUnderway = true;
    appsThatChanged = appsToUnload.concat(
      appsToLoad,
      appsToUnmount,
      appsToMount
    );
    return performAppChanges();
  } else {
    appsThatChanged = appsToLoad;
    return loadApps();
  }

  function cancelNavigation() {
    navigationIsCanceled = true;
  }

  function loadApps() {
    ...
  }

  function performAppChanges() {
    ...
  }

  function finishUpAndReturn() {
    ...
  }
}