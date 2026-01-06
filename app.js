const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const pool = require("./db/db");
const contactoRoute = require("./routes/contactoRoute");
const authRoutes = require("./routes/authRoutes");

const app = express();

const allowedOrigins = process.env.FRONTEND_URLS
  ? process.env.FRONTEND_URLS.split(",").map((url) => url.trim()).filter(Boolean)
  : ["http://localhost:5173", "http://localhost:5175"];

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // Postman/server-to-server
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("CORS bloqueado"));
    },
    credentials: true,
  })
);

app.use(express.json());

// Health
app.get("/", (_req, res) => res.status(200).send("API OK"));
app.get("/api/_ping", (_req, res) => res.send("pong"));

// Routes
app.use("/api", authRoutes);
app.use("/api/contacto", contactoRoute);
app.use("/api/familias", require("./routes/familiasRoutes"));
app.use("/api/usuarios", require("./routes/usuariosRoutes"));
app.use("/api/productos", require("./routes/productosRoutes"));
app.use("/api/precios", require("./routes/preciosRoutes"));
app.use("/api/ideas", require("./routes/ideasRoutes"));

// DB test (para debug)
app.get("/api/_dbtest", async (_req, res) => {
  try {
    const r = await pool.query("select now() as now");
    res.json({ ok: true, now: r.rows[0].now });
  } catch (e) {
    console.error("DBTEST ERROR:", e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

module.exports = app;


