import {sequelize} from '../api/config/db';
import DataTypes from 'sequelize';
//var IndexConstituent = require('./index_constituent-model').default;

const SubSector = sequelize.define('SubSector', {
    SubSectorCode: {
        primaryKey: true,
        type: DataTypes.STRING,
        field: 'Sub-Sector Code'
    },
    SubSector: {
        type: DataTypes.STRING,
        field: 'Sub-Sector'
    },
    IndustryCode: {
        type: DataTypes.STRING,
        field: 'Industry Code'
    },
    Industry: {
        type: DataTypes.STRING,
        field: 'Industry'
    },
    SuperSectorCode: {
        type: DataTypes.STRING,
        field: 'Super Sector Code'
    },
    SuperSector: {
        type: DataTypes.STRING,
        field: 'Super Sector'
    },
    SectorCode: {
        type: DataTypes.STRING,
        field: 'Sector Code'
    },
    Sector: {
        type: DataTypes.STRING,
        field: 'Sector'
    }
}, {
    tableName: 'tbl_Industry_Classification_Benchmark',
    timestamps: false
});


export default SubSector;
