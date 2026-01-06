const { Pool } = require("pg");

function mustString(name, value) {
  if (value === undefined || value === null) {
    throw new Error(`Falta variable de entorno: ${name}`);
  }
  const s = String(value);
  if (!s.length) {
    throw new Error(`Variable de entorno vacía: ${name}`);
  }
  return s;
}

const config = {
  host: mustString("DB_HOST", process.env.DB_HOST),
  port: Number(process.env.DB_PORT || 5432),
  database: mustString("DB_NAME", process.env.DB_NAME),
  user: mustString("DB_USER", process.env.DB_USER),
  password: mustString("DB_PASSWORD", process.env.DB_PASSWORD),
  ssl:
    process.env.DB_SSL === "true"
      ? { rejectUnauthorized: false }
      : undefined,
};

const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false }, // IMPORTANTE para Supabase
});

module.exports = pool;

