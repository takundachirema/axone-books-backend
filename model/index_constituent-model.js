import {sequelize} from '../api/config/db';
import DataTypes from 'sequelize';
import moment from 'moment';
var SubSectorModel = require('./sub_sector-model').default;
var BetaModel = require('./beta-model').default;

const IndexConstituent = sequelize.define('IndexConstituent', {
    Alpha: {
        primaryKey: true,
        type: DataTypes.STRING,
        allowNull: false
    },
    Date: {
        primaryKey: true,
        type: DataTypes.DATE,
        get: function(fieldName) {
            return moment.utc(this.getDataValue(fieldName)).format('YYYY-MM-DD')
        }
    },
    SubSector: {
        type: DataTypes.STRING,
        field: 'ICB Sub-Sector'
    },
    Instrument: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Gross_Market_Capitalisation: {
        field: 'Gross Market Capitalisation',
        type: DataTypes.FLOAT
    }
}, {
    tableName: 'tbl_Index_Constituents',
    timestamps: false
});

IndexConstituent.belongsTo(SubSectorModel, {
    foreignKey: 'SubSector', as: 'ICBSubSector'
})

IndexConstituent.hasMany(BetaModel, {
    foreignKey: 'Instrument'
})

export default IndexConstituent;
