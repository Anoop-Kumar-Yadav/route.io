import { Router } from 'express';

import authRoute from '@/routes/auth';
import userRoute from '@/routes/users';
import linkRoutes from '@/routes/link';
import redirectRoutes from '@/routes/redirect';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'API is Live',
    status: 'OK',
    version: '1.0.0',
    docs: 'https://github.com/Anoop-Kumar-Yadav',
    timestamp: new Date().toISOString(),
  });
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
