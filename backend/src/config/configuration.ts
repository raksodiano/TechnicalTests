export default () => ({
	port: parseInt(process.env.PORT, 10) || 3000,
	environment: process.env.NODE_ENV,
	jwt: {
		secret: process.env.JWT_SECRET,
		expire: `${process.env.JWT_EXPIRE}`,
	},
	database: {
		type: 'mysql',
		host: process.env.DB_HOST,
		port: parseInt(process.env.DB_PORT, 10) || 3306,
		username: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		synchronize: process.env.NODE_ENV == 'dev',
		logging: process.env.NODE_ENV == 'dev',
	},
});
