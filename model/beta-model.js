import {sequelize} from '../api/config/db';
import DataTypes from 'sequelize';
import moment from 'moment';

const Beta = sequelize.define('Beta', {
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
    Alpha: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    Beta: {
        type: DataTypes.FLOAT,
        allowNull: false
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
    },
    DaysTraded: {
        field: '% Days Traded',
        type: DataTypes.FLOAT
    },
    DataPoints: {
        field: 'Data Points',
        type: DataTypes.INTEGER
    }
}, {
    tableName: 'tbl_BA_Beta_Output',
    timestamps: false
});

export default Beta;
