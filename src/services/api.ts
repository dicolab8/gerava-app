// src/services/api.ts
// Use o seu IP local se estiver testando com um servidor local no Android (ex: 'http://192.168.x.x:3000/api')
// Ou use 10.0.2.2 para o emulador Android padrão: 'http://10.0.2.2:3000/api'
const BASE_URL = 'https://gerava.onrender.com/api'; 

export const normalizeApiList = <T = any>(data: any): T[] => {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  if (Array.isArray(data?.avaliacoes)) {
    return data.avaliacoes;
  }

  return [];
};

export const api = {
  get: async (endpoint: string, token?: string) => {
    const headers: { [key: string]: string } = {};

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const fullUrl = `${BASE_URL}${endpoint}`;
      console.log(`[API DEBUG] Iniciando GET para: ${fullUrl}`);
      
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers,
      });

      console.log(`[API DEBUG] Resposta recebida. Status: ${response.status}`);

      if (!response.ok) {
        throw new Error(`Erro na API (Status ${response.status})`);
      }

      return await response.json();
    } catch (error: any) {
      console.error(`[API ERROR] Falha no GET ${endpoint}:`, error);
      // Log detalhado para o usuário
      if (error instanceof TypeError && error.message === 'Network request failed') {
        console.warn('[API HELP] Ocorreu um erro de rede. Isso pode ser caused por:\n1. Falta de internet no emulador\n2. URL inacessível\n3. Problema com HTTPS/Certificado');
      }
      throw error;
    }
  },

  post: async (endpoint: string, data: any, token?: string) => {
    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error posting to ${endpoint}:`, error);
      throw error;
    }
  },
};
