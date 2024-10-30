const express = require('express')
const cors = require('cors')
const { createProxyMiddleware } = require('http-proxy-middleware')

const app = express()

const corsOptions = {
  origin: ['https://fsm-three.vercel.app'],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
// app.use(cors())

app.use(createProxyMiddleware({
  router: (req) => new URL(req.path.substring(1)),
  pathRewrite: (path, req) => (new URL(req.path.substring(1))).pathname,
  changeOrigin: true,
  logger: console
}))

app.listen(8088, () => {
  console.info('proxy server is running on port 8088')
})

module.exports = app
