var express = require('express')
var proxy = require('http-proxy-middleware')
var app = express()
const config = require('./config/index')
app.use(
  '/',
  proxy({
    // 代理跨域目标接口
    target: 'http://api.taoxinmei.com', // 目标服务器 host
    changeOrigin: true,
    ws: true, // 代理websocket
    pathRewrite: {
      '^/api': '/' // 重写请求，比如我们源访问的是api/old-path，那么请求会被解析为/api
    },
    // 修改响应头信息，实现跨域并允许带cookie
    onProxyRes: function(proxyRes, req, res) {
      res.header('Access-Control-Allow-Origin', 'http://localhost:8080')
      res.header('Access-Control-Allow-Credentials', 'true')
      res.header(
        'Access-Control-Allow-Headers',
        'Content-Type,Content-Length, Authorization, Accept,X-Requested-With'
      )
      res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
    },
    /*  router: {
      // 如果请求主机 == 'dev.localhost:3000',
      // 重写目标服务器 'http://www.example.org' 为 'http://localhost:8000'
      'http://localhost:8080': 'http://localhost:2333'
    }, */
    // 修改响应信息中的cookie域名
    cookieDomainRewrite: 'http://api.taoxinmei.com' // 可以为false，表示不修改
  })
)

app.listen(config.port, config.ip)
console.log(`Proxy server is listen at http://${config.ip}:${config.port}`)
