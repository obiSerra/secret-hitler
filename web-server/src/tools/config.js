const config = {
	DB_USER: process.env['POSTGRES_USER'],
	DB_DATABASE: process.env['POSTGRES_DB'],
	DB_PASSWORD: process.env['POSTGRES_PASSWORD'],
	DB_HOST: process.env['DB_HOST'],
	DB_PORT: process.env['DB_PORT'],
}

config['DB_URL'] = `postgres://${config.DB_USER}:${config.DB_PASSWORD}@${config.DB_HOST}:${config.DB_PORT}/${config.DB_DATABASE}`;

module.exports = {
	...config
};
