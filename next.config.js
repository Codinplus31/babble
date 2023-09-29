/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["res.cloudinary.com", "lh3.googleusercontent.com"],
    },
    output: "export",
    reactStrictMode: true,
};

module.exports = nextConfig;
