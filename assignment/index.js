const http = require('http')
const serve = http.createServer((req, res) => {
  const url = req.url
  const method = req.method
  if (url === '/') {
    res.setHeader('Content-type', 'text/html')
    res.write('<html>')
    res.write('<body><h1>Hello world from my Assignment Node.js! from Node.js</h1></body>')
    res.write('<form action="/create-user" method="POST"><input type="text" name="username"><button type="submit">Send</button></form>')
    res.write('</html>')
    return res.end()
  }
  if (url == "/create-user" && method == "POST") {
    res.setHeader('Location', '/create-user')
    const body = []
    req.on('data', (chunk) => {
      body.push(chunk)
    })
    return req.on('end', () => {
      const parseBody = Buffer.concat(body).toString()
      const message = parseBody.split('=')[1]
      console.log(message);
      res.write('<html>')
      res.write('<head><title>My first Page</title></head>')
      res.write('<body><h1>Check the console</h1></body>')
      res.write('</html>')
      return res.end()
    })
  }
  if (url === '/users') {
    res.write('<html>')
    res.write('<ul>')
    res.write('<li>User1</li>')
    res.write('<li>User2</li>')
    res.write('<li>User3</li>')
    res.write('<li>User4</li>')
    res.write('<li>User5</li>')
    res.write('</ul>')
    res.write('</html>')
    return res.end()
  }
})
serve.listen(3000)