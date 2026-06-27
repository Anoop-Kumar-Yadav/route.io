import { Router } from 'express';

import authRoute from '@/routes/auth';
import userRoute from '@/routes/users';
import linkRoutes from '@/routes/link';
import redirectRoutes from '@/routes/redirect';
import config from '@/config';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'API is Live',
    status: 'OK',
    version: config.API_VERSION,
    docs: config.API_DOCS_URL,
    timestamp: new Date().toISOString(),
  });
});

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Auth routes
router.use('/auth', authRoute);

// User routes
router.use('/users', userRoute);

// Link routes
router.use('/links', linkRoutes);

// Redirect routes
router.use('/', redirectRoutes);

export default router;
