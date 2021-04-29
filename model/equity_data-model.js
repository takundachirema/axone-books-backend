import {sequelize} from '../api/config/db';
import DataTypes from 'sequelize';
import moment from 'moment';

const EquityData = sequelize.define('EquityData', {
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
    Price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    Volume: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    Return: {
        type: DataTypes.VIRTUAL,
        set(value) {
            this.setDataValue("Return",value);
        }
      }
}, {
    tableName: 'tbl_EOD_Equity_Data',
    timestamps: false
});

export default EquityData;
