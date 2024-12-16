node js 调试练习

## nodejs
```json
{
  // 使用 IntelliSense 了解相关属性。 
  // 悬停以查看现有属性的描述。
  // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "name": "调试 node 程序",
      "request": "launch",
      "runtimeArgs": [ // 运行时参数
        "./debug/inde.js",
      ],
      "runtimeExecutable": "node", // 执行的运行时 如 node、npm 全局可执行的命令
      "skipFiles": [ // 忽略一些文件
        "<node_internals>/**"
      ],
      // 可以设置一些调试需要的环境变量, 也可以指定一个 .env 文件  "${workspaceFolder}/.env"
      "env": {
        "testEnv": "11111"
      }, 
      "cwd": "${workspaceFolder}", // 指定工作目录：即命令执行的目录
      // "autoAttachChildProcesses": true, // 是否自动监听子进程，比如通过用 spawn 开启的子进程
      // "console": "integratedTerminal", // 日志输出的位置一般无需配置
      "stopOnEntry": true, // 是否在首行开启断点
      // 配置分组 group 相同的会放在一起显示
      "presentation":{
        "hidden": false,
        "group": "调试 node 1",
        "order": 1
      },
      "type": "node"
    },
    {
      "name": "调试 node1 程序",
      "request": "launch",
      "runtimeArgs": [ // 运行时参数
        "./debug/inde.js",
      ],
      "presentation":{
        "hidden": false,
        "group": "调试 node 2",
        "order": 1
      },
       "type": "node"
    }
  ]
}
```

## 调试 ts 应用

需要在 `tsconfig.json` 中增加 `"sourceMap": true` 生成 `*.js.map` 文件

```json
{
  "name": "调试 ts 应用",
  "request": "launch",
  "runtimeArgs": [ // 运行时参数
    "./debug/add.js",
  ],
  "runtimeExecutable": "node",
  "presentation":{ 
    "hidden": false,
    "group": "调试 node 2",
    "order": 1
  },
    "type": "node"
}
```