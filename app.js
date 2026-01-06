const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
require("dotenv").config();


const contactoRoute = require("./routes/contactoRoute");
const authRoutes = require("./routes/authRoutes");

const app = express();

const allowedOrigins = process.env.FRONTEND_URLS
  ? process.env.FRONTEND_URLS.split(",").map((url) => url.trim()).filter(Boolean)
  : ["http://localhost:5173", "http://localhost:5175"];

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("CORS bloqueado"));
    },
    credentials: true,
  })
);

app.use(express.json());

console.log("BOOTED VERSION 2026-01-06 A");

app.get("/_ping", (_req, res) => res.send("pong"));

app.get("/", (_req, res) => {
  res.status(200).send("API OK");
});

// Debug env
app.get("/api/debug/env", (_req, res) => {
  res.json({
    NODE_ENV: process.env.NODE_ENV,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_USER_present: Boolean(process.env.DB_USER),
    DB_PASSWORD_present: Boolean(process.env.DB_PASSWORD),
    DB_NAME: process.env.DB_NAME,
  });
});

/** Routes (dejamos /api como en tu backend original) */
app.use("/api", authRoutes);
app.use("/api/contacto", contactoRoute);
app.use("/api/familias", require("./routes/familiasRoutes"));
app.use("/api/usuarios", require("./routes/usuariosRoutes"));
app.use("/api/productos", require("./routes/productosRoutes"));
app.use("/api/precios", require("./routes/preciosRoutes"));
app.use("/api/ideas", require("./routes/ideasRoutes"));

/** Static (opcional) */
function safeStatic(route, relativeDir) {
  const full = path.join(__dirname, relativeDir);
  if (fs.existsSync(full)) {
    app.use(route, express.static(full));
    console.log(`✅ Static: ${route} -> ${full}`);
  } else {
    console.log(`ℹ️ Static missing (skip): ${route} -> ${full}`);
  }
}
safeStatic("/imgCata", "public/imgCata");
safeStatic("/ideas", "public/ideas");
safeStatic("/familias", "public/assets/familias");

// 404
app.use((_req, res) => res.status(404).send("Not Found"));

module.exports = app;
