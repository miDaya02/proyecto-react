const isDev = process.env.NODE_ENV === 'development';

export const logger = {
  log: (...args: any[]) => {
    if (isDev) console.log(...args);
  },
  
  error: (...args: any[]) => {
    if (isDev) console.error(...args);
  },
  
  warn: (...args: any[]) => {
    if (isDev) console.warn(...args);
  },
  
  info: (...args: any[]) => {
    if (isDev) console.info(...args);
  },
  
  // Para debugging de APIs
  api: (method: string, endpoint: string, data?: any) => {
    if (isDev) {
      console.log(`🌐 API ${method}:`, endpoint);
      if (data) console.log('📦 Data:', data);
    }
  },
  
  // Para debugging de Redux
  redux: (action: string, payload?: any) => {
    if (isDev) {
      console.log(`🔄 Redux Action: ${action}`);
      if (payload) console.log('📦 Payload:', payload);
    }
  }
};

export default logger;