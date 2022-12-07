import documentRoutes from './api/document/document-routes'
import xummRoutes from './api/xumm/xumm-routes'

export function registerRoutes(app) {
    app.use('/api', documentRoutes);
    app.use('/api', xummRoutes);
}
