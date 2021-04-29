import {sequelize} from '../api/config/db';
import DataTypes from 'sequelize';

const share_metrics_tooltips = sequelize.define('share_metrics_tooltips', {
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
    tableName: 'share_metrics_tooltips',
    timestamps: false
});

export default share_metrics_tooltips;
