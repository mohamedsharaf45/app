// next.config.mjs

export default {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        has: [
          {
            type: 'header',
            key: 'x-authenticated-user',
            value: '(false|undefined)', // Check if user is not authenticated
          },
        ],
        destination: '/signin', // Redirect to Sign In page
        permanent: false,
      },
    ];
  },
};
