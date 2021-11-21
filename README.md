cross-access
=====

(wip)


## memo

generate keys
```
$ openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout ./keys/key.pem -out ./keys/cert.pem
```

append `/etc/hosts`
```
127.0.0.1       foobar.jp
127.0.0.1       test1.foobar.jp
127.0.0.1       test2.foobar.jp
```

https://test1.foobar.jp:8080/
https://test2.foobar.jp:8080/
