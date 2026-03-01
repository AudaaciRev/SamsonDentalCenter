import dotenv from 'dotenv';
import app from './app.js';
import { startScheduledTasks } from './utils/scheduled-tasks.js';
import testRoutes from './routes/test.routes.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🦷 PrimeraDental API running on http://localhost:${PORT}`);
    console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
    startScheduledTasks(); // Start cron jobs (no-show detection)
});

if (process.env.NODE_ENV !== 'production') {
    app.use('/api/test', testRoutes);
}
