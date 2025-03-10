import { useCallback, useEffect } from "react";
import MainStore from "../store/MainStore";

export const useResponsiveManager = () => {
    const handleResize = useCallback(() => {
      MainStore.setIsMobile(window.innerWidth < 1140);
    }, []);
  
    useEffect(() => {
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, [handleResize]);
  }; 