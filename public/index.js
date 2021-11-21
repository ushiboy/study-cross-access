(async function() {

  const site = location.hostname.slice(0, location.hostname.indexOf('.'));
  document.title = site;
  document.querySelector('#site-title').textContent = site;

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
  Array.from(r.headers.keys()).forEach(k => {
    console.log(k, r.headers.get(k));
  });

})();
