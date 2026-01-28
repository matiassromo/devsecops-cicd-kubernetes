const http = require("http");
const fs = require("fs");
const path = require("path");
const { Calculator } = require("./calculator");

const port = process.env.PORT || 3000;
const calculator = new Calculator();

const server = http.createServer((req, res) => {
  // Health check endpoint
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ ok: true, status: "healthy" }));
  }

  // API endpoints
  if (req.url.startsWith("/api/")) {
    return handleAPI(req, res);
  }

  // Serve static files
  if (req.url === "/" || req.url === "/index.html") {
    const filePath = path.join(__dirname, "public", "index.html");
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Error loading page");
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
      }
    });
    return;
  }

  if (req.url === "/css/style.css") {
    const filePath = path.join(__dirname, "public", "css", "style.css");
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end();
      } else {
        res.writeHead(200, { "Content-Type": "text/css" });
        res.end(data);
      }
    });
    return;
  }

  if (req.url === "/js/app.js") {
    const filePath = path.join(__dirname, "public", "js", "app.js");
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end();
      } else {
        res.writeHead(200, { "Content-Type": "application/javascript" });
        res.end(data);
      }
    });
    return;
  }

  // 404
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found");
});

function handleAPI(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const operation = url.searchParams.get("op");
  const a = parseFloat(url.searchParams.get("a"));
  const b = parseFloat(url.searchParams.get("b"));

  res.writeHead(200, { "Content-Type": "application/json" });

  if (!operation || isNaN(a) || isNaN(b)) {
    res.end(JSON.stringify({ error: "Missing or invalid parameters" }));
    return;
  }

  try {
    let result;
    switch (operation) {
      case "add":
        result = calculator.add(a, b);
        break;
      case "subtract":
        result = calculator.subtract(a, b);
        break;
      case "multiply":
        result = calculator.multiply(a, b);
        break;
      case "divide":
        result = calculator.divide(a, b);
        break;
      default:
        res.end(JSON.stringify({ error: "Invalid operation" }));
        return;
    }
    res.end(JSON.stringify({ result, operation, a, b }));
  } catch (error) {
    res.end(JSON.stringify({ error: error.message }));
  }
}

server.listen(port, () => {
  console.log(`✓ Server running on http://localhost:${port}`);
  console.log(`✓ Health check: http://localhost:${port}/health`);
});

module.exports = { server };
