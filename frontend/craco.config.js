const cracoAlias = require('craco-alias');

module.exports = {
	plugins: [
		{
			plugin: cracoAlias,
			options: {
				source: 'tsconfig',
				baseUrl: './src',
				tsConfigPath: 'tsconfig.json',
			},
		},
	],
};
