import express from 'express';
import cors from 'cors';
import { supabaseAdmin } from './config/supabase.js';
import { errorHandler } from './middleware/error.middleware.js';
import authRoutes from './routes/auth.routes.js';
import servicesRoutes from './routes/services.routes.js';
import slotsRoutes from './routes/slots.routes.js';
import appointmentsRoutes from './routes/appointments.routes.js';
import waitlistRoutes from './routes/waitlist.routes.js';
import notificationsRoutes from './routes/notifications.routes.js';
const app = express();

app.use(express.json());
app.use(
    cors({
        origin: [
            process.env.FRONTEND_URL || 'http://localhost:5173',
            'http://localhost:3000',
            'http://localhost:5173',
        ],
        credentials: true,
    }),
);

app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'PrimeraDental API is running',
        timestamp: new Date().toISOString(),
    });
});

app.use((err, req, res, next) => {
    console.error('❌ Error:', err.message);
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error',
    });
});

// Main routes
app.use('/api/auth', authRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/slots', slotsRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/waitlist', waitlistRoutes);
app.use('/api/notifications', notificationsRoutes);

// Error handler must be LAST — after all routes
app.use(errorHandler);

// TEST SUPABASE CONNECTION
// app.get('/api/test-db', async (req, res) => {
//     try {
//         const { data, error } = await supabaseAdmin.from('_test').select('*').limit(1);
//         res.json({ connected: true, message: 'Supaase connection works!', data });
//     } catch (error) {
//         res.status(500).json({ connected: false, error: err.message });
//     }
// });

// TEST GET SERVICES
// app.get('/api/test-db', async (req, res) => {
//     const { data, error } = await supabaseAdmin.from('services').select('*');

//     if (error) return res.status(500).json({ error: error.message });
//     res.json({ services: data, count: data.length });
// });

export default app;
