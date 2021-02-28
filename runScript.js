/**
 *  用户自定义加载函数的执行
 * @param {*} url 
 * @returns 
 */
const runScript = async (url) => {
  return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.onload = resolve;
      script.onerror = reject;
      const firstScript = document.getElementsByTagName('script')[0];
      firstScript.parentNode.insertBefore(script, firstScript);
  });
};

singleSpa.registerApplication({ //注册微前端服务
  name: 'singleDemo',
  app: async () => {
      await runScript('http://127.0.0.1:8081/static/js/chunk-vendors.js');
      await runScript('http://127.0.0.1:8081/static/js/app.js');
      console.log(window)
      return window['singleDemo'];
  },
  activeWhen: () => location.pathname.startsWith('/vue') // 配置微前端模块前
});