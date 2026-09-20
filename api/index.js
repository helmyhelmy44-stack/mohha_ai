function sendJson(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(data));
}

module.exports = async (req, res) => {
  const url = new URL(req.url || "/", "https://mohha.local");
  const pathname = url.pathname;

  // فحص الحالة
  if (pathname === "/api" || pathname === "/api/health") {
    return sendJson(res, 200, {
      app: "MOHHA",
      version: "1.0.0",
      status: "online"
    });
  }

  // المحادثة
  if (pathname === "/api/chat") {
    if (req.method !== "POST") {
      return sendJson(res, 405, { ok: false, error: "Method Not Allowed" });
    }

    let body = "";
    for await (const chunk of req) body += chunk;

    let message = "";
    try {
      const data = JSON.parse(body);
      message = String(data.message || "").trim();
    } catch (e) {
      message = "";
    }

    return sendJson(res, 200, {
      ok: true,
      reply: message ? "وصلت رسالتك إلى MOHHA: " + message : "مرحبًا بك في MOHHA."
    });
  }

  return sendJson(res, 404, { ok: false, error: "Not Found" });
};
