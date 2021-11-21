const express = require('express');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const morgan = require('morgan');

const PORT = 8080;
const app = express();
app.use(express.static('./public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(morgan('[:date[clf]] ":method :url" :status :res[content-length] ":referrer"'));

const server = require('https').createServer({
  key: fs.readFileSync('./keys/key.pem'),
  cert: fs.readFileSync('./keys/cert.pem'),
}, app);


app.get('/greet', (req, res) => {
  if (!(req.cookies.token)) {
    console.log('send token cookie');
    res.cookie('token', 'abcdefg', {
      httpOnly: true,
      secure: true,
      path: '/',
      domain: '.foobar.jp'
    });
  }
  res.cookie('v1', '1', {
    secure: true,
    path: '/'
  });
  res.status(200).send(`hello`);
});

server.listen(PORT, () => console.info('listen: ', PORT));
