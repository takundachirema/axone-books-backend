import documentRoutes from './api/document/document-routes'

export function registerRoutes(app) {
    app.use('/api', documentRoutes);
}
