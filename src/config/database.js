module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'root',
  database: 'scheduling',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
