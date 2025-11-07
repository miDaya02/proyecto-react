import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Hook para mostrar loading screen en cambios de página
 * @param duration - Duración del loading en ms (default: 2000)
 * @param excludeRoutes - Rutas donde NO mostrar loading
 */
export const usePageLoading = (
  duration: number = 1000,
  excludeRoutes: string[] = ['/login', '/register']
) => {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // Si está en ruta excluida, no mostrar loading
    if (excludeRoutes.includes(pathname)) {
      setIsLoading(false);
      return;
    }

    // Resetear loading al cambiar de página
    setIsLoading(true);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [pathname, duration, excludeRoutes]);

  return { isLoading, pathname };
};