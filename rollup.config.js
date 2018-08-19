import typescript from 'rollup-plugin-typescript';


export default {
    'input': './src/main.ts',
    'output': {
        'file': './dist/app.js',
        'sourceMap': true,
        'format': 'iife',
        'external': ['leaflet'],
        'globals': {
            'leaflet': 'L'
        }
    },
    'plugins': [
        typescript({
            typescript: require('typescript')
        })
    ]
};
