import 'whatwg-fetch';
import "regenerator-runtime/runtime";

(async function() {

  const site = location.hostname.slice(0, location.hostname.indexOf('.'));
  document.title = site;
  document.querySelector('#site-title').textContent = site;

  if (site === 'test1') {
    localStorage.setItem('my-token', 'abcdefg12345');

    if (window !== window.parent) {
      window.parent.postMessage(JSON.stringify({
        type: 'loaded'
      }), 'https://test2.foobar.jp:8080');
    }

    window.addEventListener('message', (e) => {
      if (e.origin !== 'https://test2.foobar.jp:8080') return;
      const o = JSON.parse(e.data);

      if (o.type === 'getToken') {
        e.source.postMessage(JSON.stringify({
          type: 'sendToken',
          myToken: localStorage.getItem('my-token')
        }), e.origin);
      }
    }, false);

  } else if (site === 'test2') {
    if (!localStorage.getItem('my-token')) {
      const iframe = document.createElement('iframe');
      iframe.src = 'https://test1.foobar.jp:8080/';
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      window.addEventListener('message', (e) => {
        if (e.origin !== 'https://test1.foobar.jp:8080') return;
        const o = JSON.parse(e.data);
        console.log(o);
        if (o.type === 'loaded') {
          iframe.contentWindow.postMessage(JSON.stringify({
            type: 'getToken'
          }), 'https://test1.foobar.jp:8080');
        } else if(o.type === 'sendToken') {
          localStorage.setItem('my-token', o.myToken);
        }
      }, false);
    }
  }

  const storageLog = document.querySelector('#storage-log');
  for (let i = 0; i <localStorage.length; i++) {
    const k = localStorage.key(i);
    const v = localStorage.getItem(k);
    const li = document.createElement('li');
    li.textContent = `${k}:${v}`;
    storageLog.appendChild(li);
  }

  const cookieLog = document.querySelector('#cookie-log');
  cookieLog.textContent = document.cookie;

  const r = await fetch('./greet');
  const headerLogs = document.querySelector('#response-headers');
  Array.from(r.headers.keys()).forEach(k => {
    const li = document.createElement('li');
    li.textContent = `${k}:${r.headers.get(k)}`;
    headerLogs.appendChild(li);
  });
  const text = await r.text();
  const log = document.querySelector('#log');
  log.textContent = text;

})();
