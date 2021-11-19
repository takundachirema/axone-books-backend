import {sequelize} from '../api/config/db';
import DataTypes from 'sequelize';
import moment from 'moment';

const IndexMetric = sequelize.define('IndexMetric', {
    Date: {
        field: 'date',
        type: DataTypes.DATE,
        get: function(fieldName) {
            return moment.utc(this.getDataValue(fieldName)).format('YYYY-MM-DD')
        }
    },
    IndexCode: {
        field: 'index',
        type: DataTypes.STRING
    },
    MarketIndexCode: {
        type: DataTypes.STRING,
        field: 'mkt_index',
        allowNull: false
    },
    Industry: {
        type: DataTypes.STRING,
        field: 'industry',
        allowNull: false
    },
    Weight: {
        field: 'weight',
        type: DataTypes.FLOAT,
        allowNull: false
    },
    Beta: {
        field: 'beta',
        type: DataTypes.FLOAT,
        allowNull: false
    },
    SystemVolatility: {
        field: 'sysVol',
        type: DataTypes.FLOAT,
        allowNull: false
    },
    SpecificVolatility: {
        field: 'specVol',
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, {
    tableName: 'tbl_industry_index_metrics',
    timestamps: false
});

export default IndexMetric;
