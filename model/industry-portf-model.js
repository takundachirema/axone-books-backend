import {sequelize} from '../api/config/db';
import DataTypes from 'sequelize';
import moment from 'moment';

const IndustryPortfolioMetrics = sequelize.define('IndustryPortfolioMetrics', {
    Date: {
        primaryKey: true,
        type: DataTypes.DATE,
        get: function(fieldName) {
            return moment.utc(this.getDataValue(fieldName)).format('YYYY-MM-DD')
        }
    },
    IndexCode: {
        primaryKey: true,
        field: 'index',
        type: DataTypes.STRING,
        allowNull: false
    },
    MarketIndex: {
        primaryKey: true,
        field: 'mkt_index',
        type: DataTypes.STRING,
        allowNull: false
    },
    Industry: {
        field: 'industry',
        type: DataTypes.STRING,
        allowNull: false
    },
    Weight: {
        type: DataTypes.FLOAT,
        field: 'weight',
        allowNull: false
    },
    Beta: {
        type: DataTypes.FLOAT,
        field: 'beta',
        allowNull: false
    },
    SysVol: {
        type: DataTypes.FLOAT,
        field: 'sysVol',
        allowNull: false
    },
    SpecVol: {
        type: DataTypes.FLOAT,
        field: 'specVol',
        allowNull: false
    },
    SharesExcluded: {
        type: DataTypes.STRING(64),
        field: 'shares_excl'
    }
}, {
    tableName: 'industry_portfolio_metrics',
    timestamps: false
});

export default IndustryPortfolioMetrics;
