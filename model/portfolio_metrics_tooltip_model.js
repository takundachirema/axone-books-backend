import {sequelize} from '../api/config/db';
import DataTypes from 'sequelize';

const portfolio_metrics_tooltips = sequelize.define('portfolio_metrics_tooltips', {
    column_name: {
        primaryKey: true,
        type: DataTypes.STRING,
        field: 'column_name'
    },
    description: {
        field: 'description',
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'portfolio_metrics_tooltips',
    timestamps: false
});

export default portfolio_metrics_tooltips;
