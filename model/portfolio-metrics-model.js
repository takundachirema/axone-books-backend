import {sequelize} from '../api/config/db';
import DataTypes from 'sequelize';
import moment from 'moment';

const PortfolioMetrics = sequelize.define('PortfolioMetrics', {
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
    MarketIndexCode: {
        primaryKey: true,
        field: 'mkt_index_code',
        type: DataTypes.STRING,
        allowNull: false
    },
    MarketVolatility: {
        field: 'mkt_vol',
        type: DataTypes.FLOAT,
        allowNull: false
    },
    PortfolioBeta: {
        type: DataTypes.FLOAT,
        field: 'port_beta',
        allowNull: false
    },
    PortfolioSystemicVolatility: {
        type: DataTypes.FLOAT,
        field: 'port_sys_vol',
        allowNull: false
    },
    PortfolioSpecificVolatility: {
        type: DataTypes.FLOAT,
        field: 'port_spec_vol',
        allowNull: false
    },
    PortfolioVolatility: {
        type: DataTypes.FLOAT,
        field: 'port_vol',
        allowNull: false
    },
    SystemicCovMatrix: {
        type: DataTypes.STRING('MAX'),
        field: 'sys_cov_mat',
        allowNull: false
    },
    SpecificCovMatrix: {
        type: DataTypes.STRING('MAX'),
        field: 'spec_cov_mat',
        allowNull: false
    },
    TotalCovMatrix: {
        type: DataTypes.STRING('MAX'),
        field: 'total_cov_mat',
        allowNull: false
    },
    CorrelationMatrix: {
        type: DataTypes.STRING('MAX'),
        field: 'corr_mat',
        allowNull: false
    },
    MatrixID: {
        type: DataTypes.STRING('MAX'),
        field: 'mat_id',
        allowNull: false
    },
    SharesExcluded: {
        type: DataTypes.STRING,
        field: 'shares_excl',
        allowNull: false
    }
}, {
    tableName: 'portfolio_metrics',
    timestamps: false
});

export default PortfolioMetrics;
