"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import NProgress from "nprogress";
const ProgressBar = () => {
  const pathname = usePathname();

  useEffect(() => {
    // Stop progress when route changes
    NProgress.done();
  }, [pathname]);

  return null;
};
export default ProgressBar;
