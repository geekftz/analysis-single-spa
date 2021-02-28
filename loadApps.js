function loadApps() {　　//这里注册了一个微任务，注意是微任务说明并不会马上执行then之后的逻辑
  return Promise.resolve().then(() => {　　　 //appsToLoad是通过activeWhen规则分析当前用户所在url，得到需要加载的子应用的数组。下面就开始通过map对需要激活的子应用进行遍历　　　 //toLoadPromise的作用比较重要，是我执行我们调用registerApplication方法参数中的加载函数选项执行的地方,toLoadPromise源代码在下面
    const loadPromises = appsToLoad.map(toLoadPromise);

    return (
      Promise.all(loadPromises)
        .then(callAllEventListeners)
        // there are no mounted apps, before start() is called, so we always return []
          //在start之前生命周期函数都已经准备就绪，但是不会被触发。直到start才会开始触发，从上面的注释就可以知道
        .then(() => [])
        .catch((err) => {
          callAllEventListeners();
          throw err;
        })
    );
  });
}