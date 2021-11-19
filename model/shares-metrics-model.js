import {sequelize} from '../api/config/db';
import DataTypes from 'sequelize';
import moment from 'moment';

const SharesMetrics = sequelize.define('SharesMetrics', {
    Date: {
        primaryKey: true,
        type: DataTypes.DATE,
        get: function(fieldName) {
            return moment.utc(this.getDataValue(fieldName)).format('YYYY-MM-DD')
        }
    },
    IndexCode: {
        primaryKey: true,
        field: 'index_code',
        type: DataTypes.STRING,
        allowNull: false
    },
    MarketIndex: {
        primaryKey: true,
        field: 'mkt_index_code',
        type: DataTypes.STRING,
        allowNull: false
    },
    ShareCode: {
        primaryKey: true,
        field: 'share_code',
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
    SpecVol: {
        type: DataTypes.FLOAT,
        field: 'spec_vol',
        allowNull: false
    }
}, {
    tableName: 'shares_metrics',
    timestamps: false
});

export default SharesMetrics;
