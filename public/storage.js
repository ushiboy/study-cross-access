(function() {

  const TEST1_ORIGIN = location.protocol + '//test1.foobar.jp:8080';
  const TEST2_ORIGIN = location.protocol + '//test2.foobar.jp:8080';

  function dumpLocalStorage() {
    const storageLog = document.querySelector('#storage-log');
    for (let i = 0; i <localStorage.length; i++) {
      const k = localStorage.key(i);
      const v = localStorage.getItem(k);
      const li = document.createElement('li');
      li.textContent = k + ":" + v;
      storageLog.appendChild(li);
    }
  }

  const site = location.hostname.slice(0, location.hostname.indexOf('.'));
  document.title = site;
  document.querySelector('#site-title').textContent = site;

  if (site === 'test1') {
    if (!localStorage.getItem('my-token')) {
      localStorage.setItem('my-token', 'abcdefg12345');
    }

    if (window !== window.parent) {
      window.parent.postMessage(JSON.stringify({
        type: 'loaded'
      }), TEST2_ORIGIN);
    }

    window.addEventListener('message', function(e) {
      if (e.origin !== TEST2_ORIGIN) return;
      const o = JSON.parse(e.data);
      if (o.type === 'getToken') {
        e.source.postMessage(JSON.stringify({
          type: 'sendToken',
          myToken: localStorage.getItem('my-token')
        }), e.origin);
      }
    }, false);

  } else if (site === 'test2' && !localStorage.getItem('my-token')) {
    // iframe hack
    const iframe = document.createElement('iframe');
    iframe.src = TEST1_ORIGIN + '/storage.html';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    window.addEventListener('message', function(e) {
      if (e.origin !== TEST1_ORIGIN) return;
      const o = JSON.parse(e.data);
      console.log(o);
      if (o.type === 'loaded') {
        iframe.contentWindow.postMessage(JSON.stringify({
          type: 'getToken'
        }), TEST1_ORIGIN);
      } else if(o.type === 'sendToken') {
        localStorage.setItem('my-token', o.myToken);
        dumpLocalStorage();
      }
    }, false);
  }

  dumpLocalStorage();

})();
