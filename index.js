const express = require('express')
const proxy = require('http-proxy-middleware')
const app = express()
const config = require('./config/index')
app.use(
  '/',
  proxy({
    // 代理跨域目标接口
    target: 'http://api.taoxinmei.com', // 目标服务器 host
    changeOrigin: true,
    ws: true, // 代理websocket
    pathRewrite: {
      '^/api': 'http://localhost:2333' // 重写请求，比如我们源访问的是api/old-path，那么请求会被解析为/api
    },
    // 修改响应头信息，实现跨域并允许带cookie
    onProxyRes: function(proxyRes, req, res) {
      let origin = req.headers.origin
      // 设置哪个源可以访问我
      res.header('Access-Control-Allow-Origin', origin)
      // 允许携带哪个头访问我
      res.header(
        'Access-Control-Allow-Headers',
        'Content-Type,Content-Length, Authorization,authorization, Accept,X-Requested-With'
      )
      // 允许哪个方法访问我 可以设置*
      res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
      // 允许携带cookie
      res.header('Access-Control-Allow-Credentials', 'true')
      // 预检的存活时间
      res.header('Access-Control-Max-Age', 6)
    }
    /*  router: {
      // 如果请求主机 == 'dev.localhost:3000',
      // 重写目标服务器 'http://www.example.org' 为 'http://localhost:8000'
      'http://localhost:8080': 'http://localhost:2333'
    }, */
    // 修改响应信息中的cookie域名
    //  cookieDomainRewrite: 'http://api.taoxinmei.com' // 可以为false，表示不修改
  })
)
app.listen(config.port, config.ip, () => {
  console.log(`Proxy server is listen at http://${config.ip}:${config.port}`)
})
