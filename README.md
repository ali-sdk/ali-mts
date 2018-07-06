ali-mts
=======

aliyun mts sdk

## Install

```bash
$ tnpm install ali-mts --save
```

## Usage

```js
var co = require('co');
var oss = require('ali-oss');
var AliyunClient = require('../lib/aliyun_client');

co(function* () {
  var client = new AliyunClient({
    accessKeyId: 'your accessKeyId',
    accessKeySecret: 'your accessKeySecret',
    // set the request timeout,default is 3000
    timeout: 6000
  });

  var result = yield * client.addMedia({
    inputFileUrl: 'http://gxc.oss.aliyuncs.com/ossdemo/VTS_01_1.mp4',
    title: 'VTS_01_1.mp4',
    description: 'xxx',
    tags: 'xxx, yyy, zzz'
  });

  console.log(result);
}).catch(function (err) {
  console.log(err.stack);
});
```

## API




## License

(The MIT License)

Copyright (c) 2014 Alibaba Group Holding Limited.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
