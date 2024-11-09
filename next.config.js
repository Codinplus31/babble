/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['lucide-react'],
    images: {
        domains: ["res.cloudinary.com", "lh3.googleusercontent.com"],
    },
    typescript:{ ignoreBuildErrors:true }
};

module.exports = nextConfig;
