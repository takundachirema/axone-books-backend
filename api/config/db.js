import Sequelize from 'sequelize';

export const sequelize = new Sequelize('AIFMRM_ERS', null, null, {
    dialect: 'mssql',
    dialectOptions: {
        server: 'localhost',
        authentication: {
            type: 'default',
            options: {
                userName: 'admin',
                password: 'admin'
            }
        },
        options: {
            database: 'AIFMRM_ERS',
            port: 1434,
            encrypt: false
        }
    }
});

// const sequelize = new Sequelize(
//     process.env.DB_NAME, 
//     process.env.DB_USERNAME, 
//     process.env.DB_PASSWORD, 
//     {
//         host: process.env.DB_URL,
//         dialect: process.env.DB_DIALECT,
//         dialectOptions: {
//             options: {
//                 database: process.env.DB_NAME,
//                 port: process.env.DB_PORT,
//                 encrypt: false
//             }
//         }
//     }
// );

export function connectToDB() {
    sequelize
        .authenticate()
        .then(() => {
            console.log('Connection has been established successfully.');
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        });
}
