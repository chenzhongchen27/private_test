const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractCss = new ExtractTextPlugin('./[name].css');
module.exports = {
	entry:'./entry.js'
	,output:{
		path:'./dist'
		,filename:'bundle.js'
	}
	,module:{
		loaders:[
			{
				test:/\.css$/,
				use:extractCss.extract({
					fallback:'style-loader'
					,use:"css-loader"
				})
			},
			{
				test : /\.js$/,
				loader : 'babel-loader',
				exclude : /node_modules/,
				query:{
					presets:['es2015',"stage-0"]
				}
			},
			{
				test: /\.scss$/,
				use: extractCss.extract({
					fallback:'style-loader'
					,use:['css-loader','sass-loader']
				})
			},
		]
	}
	,resolve:{
		extensions:['.js','.json']
	}
	,plugins:[extractCss]
	,devtool:"inline-source-map"
}