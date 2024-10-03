// backend/src/routes/csrfRoutes.ts

import { Router } from 'express';
import csrf from 'csurf';

const csrfProtection = csrf({ cookie: true }); // Use cookie to store CSRF token

const router = Router();

// CSRF Token Endpoint
router.get('/csrf-token', csrfProtection, (req, res) => {
  // Send the CSRF token to the client
  res.json({ csrfToken: req.csrfToken() });
});

export { router as csrfRoutes };
