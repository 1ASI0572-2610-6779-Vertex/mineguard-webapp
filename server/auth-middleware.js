/* eslint-disable */
/**
 * json-server middleware that fakes IAM authentication endpoints for local development.
 *
 * Implements:
 *   POST /api/v1/authentication/sign-in
 *
 * Sign-up self-service is intentionally not implemented here: in the MineGuard
 * model new supervisor accounts are created by the administrator through the
 * "Gestión de Usuarios" admin view, not via a self-service registration.
 */
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'db.json');
const SIGN_IN_PATHS = new Set([
  '/api/v1/authentication/sign-in',
  '/authentication/sign-in',
]);

function loadDb() {
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  } catch (err) {
    console.error('[auth-middleware] failed to read db.json:', err.message);
    return { users: [], userRoles: [] };
  }
}

module.exports = (req, res, next) => {
  if (req.method !== 'POST' || !SIGN_IN_PATHS.has(req.path)) {
    return next();
  }

  const body = req.body || {};
  const username = body.username;
  const password = body.password;

  if (!username || !password) {
    return res.status(400).json({ error: 'Missing username or password' });
  }

  const db = loadDb();
  const users = db.users || [];
  const roles = db.userRoles || [];

  const user = users.find((u) => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const role = roles.find((r) => r.id === user.id_role);
  return res.json({
    id: user.id,
    username: user.username,
    token: `fake-token-user-${user.id}`,
    role: role ? role.role : 'Unknown',
  });
};
