import {sequelize} from '../api/config/db';
import DataTypes from 'sequelize';

const industry_portfolio_tooltips = sequelize.define('industry_portfolio_tooltips', {
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
    tableName: 'industry_portfolio_tooltips',
    timestamps: false
});

export default industry_portfolio_tooltips;
