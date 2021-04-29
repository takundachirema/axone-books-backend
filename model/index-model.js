import {sequelize} from '../api/config/db';
import DataTypes from 'sequelize';
var BetaModel = require('./beta-model').default;

const Index = sequelize.define('Index', {
    IndexCode: {
        primaryKey: true,
        field: 'Index Code',
        type: DataTypes.STRING
    },
    IndexType: {
        type: DataTypes.STRING,
        field: 'Index Type',
        allowNull: false
    },
    IndexName: {
        type: DataTypes.STRING,
        field: 'Index Name',
        allowNull: false
    }
}, {
    tableName: 'tbl_FTSEJSE_Index_Series',
    timestamps: false
});

Index.hasMany(BetaModel, {
    foreignKey: 'Instrument'
})

export default Index;
