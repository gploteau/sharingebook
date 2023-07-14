/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
    //output: 'export',
    // Optional: Add a trailing slash to all paths `/about` -> `/about/`
    // trailingSlash: true,
    // Optional: Change the output directory `out` -> `dist`
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack"]
        });

        return config;
    },
    async rewrites() {
        return [
            {
                source: '/:first([a-f0-9]{32})',
                destination: '/?first=:first',
                // Since the :first parameter is used in the destination the :second parameter
                // will not automatically be added in the query although we can manually add it
                // as shown above
            },
        ]
    },
}

module.exports = nextConfig
