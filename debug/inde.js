import { createServer } from 'http';
import pColor from 'picocolors'

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(
    JSON.stringify({
      data: 'Hello World!'
    })
  );
});

console.log(pColor.green(`服务地址: https://localhost:8888`));
console.log('环境变量', process.env)
server.listen(8888);
