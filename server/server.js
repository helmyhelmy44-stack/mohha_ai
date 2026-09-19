const http = require("http");

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, {
    "Content-Type": "application/json; charset=utf-8"
  });

  res.end(
    JSON.stringify({
      app: "MOHHA",
      name: "عين ترى أكثر",
      version: "1.0.0",
      status: "online"
    })
  );
});

server.listen(PORT, () => {
  console.log(`MOHHA server running on port ${PORT}`);
});
