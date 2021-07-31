const Sequelize = require('sequelize');

const connection = require('../../database/database');
const Category = require('../../categories/model/Category');


const Article = connection.define('article',
    {
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        slug: {
            type: Sequelize.STRING,
            allowNull: false
        },
        body: {
            type: Sequelize.TEXT,
            allowNull: false
        }
    });

/** 1 X 1 */
Article.belongsTo(Category);

/** 1 X N */
Category.hasMany(Article);

Article.sync({ force: true })
    .then(() => {
        console.log('Tabela ');
    });

module.exports = Article;