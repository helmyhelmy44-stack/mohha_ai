const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;

// الواجهة موجودة داخل server/public
const publicDir = path.join(__dirname, "public");

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp"
};

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*"
  });

  res.end(JSON.stringify(data));
}

function serveFile(res, filePath) {
  fs.readFile(filePath, (error, data) => {
    if (error) {
      sendJson(res, 404, {
        error: "File not found"
      });
      return;
    }

    const extension = path.extname(filePath).toLowerCase();

    res.writeHead(200, {
      "Content-Type":
        mimeTypes[extension] ||
        "application/octet-stream"
    });

    res.end(data);
  });
}

const server = http.createServer((req, res) => {

  // فحص حالة MOHHA
  if (req.url === "/api/health") {
    sendJson(res, 200, {
      app: "MOHHA",
      version: "1.0.0",
      status: "online"
    });
    return;
  }

  // واجهة المحادثة
  if (req.url === "/api/chat" && req.method === "POST") {

    let body = "";

    req.on("data", chunk => {
      body += chunk;
    });

    req.on("end", () => {

      let message = "";

      try {
        const data = JSON.parse(body);
        message = String(data.message || "").trim();
      } catch (error) {
        message = "";
      }

      sendJson(res, 200, {
        ok: true,
        reply: message
          ? `وصلت رسالتك إلى MOHHA: ${message}`
          : "مرحبًا بك في MOHHA."
      });
    });

    return;
  }

  // السماح بـ GET فقط للملفات
  if (req.method !== "GET" && req.method !== "HEAD") {
    sendJson(res, 405, {
      error: "Method Not Allowed"
    });
    return;
  }

  let requestedPath = req.url || "/";

  if (requestedPath === "/") {
    requestedPath = "/index.html";
  }

  const cleanPath = decodeURIComponent(
    requestedPath.split("?")[0]
  );

  const filePath = path.normalize(
    path.join(publicDir, cleanPath)
  );

  // حماية من الخروج خارج مجلد public
  if (
    filePath !== publicDir &&
    !filePath.startsWith(publicDir + path.sep)
  ) {
    sendJson(res, 403, {
      error: "Forbidden"
    });
    return;
  }

  serveFile(res, filePath);
});

server.listen(PORT, () => {
  console.log(
    `MOHHA server running on port ${PORT}`
  );
});
