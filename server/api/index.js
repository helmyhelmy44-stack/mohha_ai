const fs = require("fs");
const path = require("path");

function sendJson(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(data));
}

function sendFile(res, filePath, contentType) {
  fs.readFile(filePath, (error, data) => {
    if (error) {
      return sendJson(res, 404, {
        error: "File not found"
      });
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", contentType);
    res.end(data);
  });
}

module.exports = async (req, res) => {
  const pathname = new URL(
    req.url || "/",
    "https://mohha.local"
  ).pathname;

  const publicDir = path.join(process.cwd(), "public");

  if (pathname === "/") {
    return sendFile(
      res,
      path.join(publicDir, "index.html"),
      "text/html; charset=utf-8"
    );
  }

  if (pathname === "/api/health") {
    return sendJson(res, 200, {
      app: "MOHHA",
      version: "1.0.0",
      status: "online"
    });
  }

  if (pathname === "/api/chat" && req.method === "POST") {
    let body = "";

    for await (const chunk of req) {
      body += chunk;
    }

    let message = "";

    try {
      const data = JSON.parse(body);
      message = String(data.message || "").trim();
    } catch (error) {
      message = "";
    }

    return sendJson(res, 200, {
      ok: true,
      reply: message
        ? `وصلت رسالتك إلى MOHHA: ${message}`
        : "مرحبًا بك في MOHHA."
    });
  }

  if (pathname === "/public/css/style.css") {
    return sendFile(
      res,
      path.join(publicDir, "public", "css", "style.css"),
      "text/css; charset=utf-8"
    );
  }

  if (pathname === "/public/js/app.js") {
    return sendFile(
      res,
      path.join(publicDir, "public", "js", "app.js"),
      "application/javascript; charset=utf-8"
    );
  }

  return sendJson(res, 404, {
    error: "Not Found"
  });
};
