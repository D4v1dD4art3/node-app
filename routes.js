const fs = require('fs');

const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;
  if (url === '/') {
    res.write('<html>');
    res.write('<head><title>Enter a message</title></head>');
    res.write(
      '<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button> </form></body>'
    );
    res.write('</html>');
    return res.end();
  }
  if (url === '/message' && method === 'POST') {
    const body = [];
    req.on('data', (chunk) => {
      console.log(chunk);
      body.push(chunk);
    });
    return req.on('end', () => {
      // node store the listener to be executed later
      const parseBody = Buffer.concat(body).toString(); // this line of code will executed after line 27 immediately
      const message = parseBody.split('=')[1];
      // fs.writeFileSync('message.txt', message) sync stands for synchronously will block the code until that file is create
      fs.writeFile('message.txt', message, (err) => {
        // asynchronously method, it will wait until file is create
        res.statusCode = 302;
        res.setHeader('Location', '/');
        return res.end();
      });
    });
  }
  res.setHeader('Content-type', 'text/html');
  res.write('<html>');
  res.write('<head><title>My first Page</title></head>');
  res.write(
    '<body><h1>Hello world from my first Server! from Node.js</h1></body>'
  );
  res.write('</html>');
  res.end();
};
// module.exports = requestHandler  node registered a a functions, classes or const and then node will look for the registration
// module.exports = {
//   handle: requestHandler,
//   someText: "hard code"
// }
// module.exports.handler = requestHandler
// module.exports.someText = "some hard Coded text"
exports.handler = requestHandler;
exports.someText = 'some hard Coded text';
