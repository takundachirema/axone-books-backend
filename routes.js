// import taskRoutes from './api/task/task-route.js';
// import regRoute from './api/register/register-routes';
// import userRoutes from './api/user/user-routes';
// import authRoutes from './api/auth/auth-routes';
import constituentRoutes from './api/index_constituent/index_constituent-routes';
import indexRoutes from './api/index/index-routes';
import downloadRoutes from './api/downloadsTable/download-routes';
import tooltipRoutes from './api/tooltips/tooltip_routes'
import documentRoutes from './api/document/document-routes'

export function registerRoutes(app) {
    // app.use('/api', taskRoutes);
    // app.use('/api', regRoute);
    // app.use('/api', userRoutes);
    // app.use('/api', authRoutes);
    app.use('/api', constituentRoutes);
    app.use('/api', indexRoutes);
    app.use('/api', downloadRoutes);
    app.use('/api', tooltipRoutes);
    app.use('/api', documentRoutes);
}
