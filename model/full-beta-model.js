import {sequelize} from '../api/config/db';
import DataTypes from 'sequelize';
import moment from 'moment';

const FullBeta = sequelize.define('FullBeta', {
    Date: {
        primaryKey: true,
        type: DataTypes.DATE,
        get: function(fieldName) {
            return moment.utc(this.getDataValue(fieldName)).format('YYYY-MM-DD')
        }
    },
    InstrumentCode: {
        primaryKey: true,
        field: 'Instrument',
        type: DataTypes.STRING,
        allowNull: false
    },
    IndexCode: {
        primaryKey: true,
        field: 'Index',
        type: DataTypes.STRING,
        allowNull: false
    },
    StartDate: {
        type: DataTypes.DATE,
        field: 'Start Date',
        allowNull: false,
        get: function(fieldName) {
            return moment.utc(this.getDataValue(fieldName)).format('YYYY-MM-DD')
        }
    },
    DaysTraded: {
        type: DataTypes.FLOAT,
        field: '% Days Traded',
        allowNull: false
    },
    DataPoints: {
        type: DataTypes.INTEGER,
        field: 'Data Points',
        allowNull: false
    },
    Alpha: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    Beta: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    SeAlpha: {
        type: DataTypes.FLOAT,
        field: 'SE Alpha'
    },
    SeBeta: {
        type: DataTypes.FLOAT,
        field: 'SE Beta'
    },
    pValAlpha: {
        type: DataTypes.FLOAT,
        field: 'p-Value Alpha'
    },
    pValBeta: {
        type: DataTypes.FLOAT,
        field: 'p-Value Beta'
    },
    R2: {
        type: DataTypes.FLOAT,
        field: 'R2'
    },
    TotalRisk: {
        field: 'Total Risk',
        type: DataTypes.FLOAT,
        allowNull: false
    },
    UniqueRisk: {
        field: 'Unique Risk',
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, {
    tableName: 'tbl_BA_Beta_Output',
    timestamps: false
});

export default FullBeta;
