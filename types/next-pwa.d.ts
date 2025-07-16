declare module "next-pwa" {
    import type { NextConfig } from "next";
  
    function withPWA(nextConfig: NextConfig): NextConfig;
  
    export default withPWA;
  }
  