import axios, { AxiosInstance } from 'axios';
import { useAuthStore } from '../stores/auth';

export interface GraphQLErrorLocation {
  line: number;
  column: number;
}

export interface GraphQLErrorItem {
  message: string;
  locations?: GraphQLErrorLocation[];
  path?: (string | number)[];
  extensions?: Record<string, any>;
}

export interface GraphQLResponse<T> {
  data?: T;
  errors?: GraphQLErrorItem[];
}

class GraphQLClient {
  private http: AxiosInstance;

  constructor() {
    this.http = axios.create({
      baseURL: import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:4000/graphql',
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    this.http.interceptors.request.use((config) => {
      try {
        const authStore = useAuthStore();
        if (authStore && authStore.token) {
          config.headers.Authorization = `Bearer ${authStore.token}`;
        }
      } catch {
        // Pinia pode não estar inicializado em testes unitários ou fora de contexto Vue
      }
      return config;
    });
  }

  public async request<TData = any, TVariables = Record<string, any>>(
    query: string,
    variables?: TVariables
  ): Promise<TData> {
    try {
      const response = await this.http.post<GraphQLResponse<TData>>('', {
        query: query.trim(),
        variables: variables || {}
      });

      if (response.data.errors && response.data.errors.length > 0) {
        const errorMessages = response.data.errors.map((e) => e.message).join('; ');
        const error = new Error(`GraphQL Error: ${errorMessages}`);
        (error as any).graphQLErrors = response.data.errors;
        throw error;
      }

      if (!response.data.data) {
        throw new Error('GraphQL response did not return data');
      }

      return response.data.data;
    } catch (err: any) {
      if (err.graphQLErrors) {
        throw err;
      }
      if (err.response?.data?.errors) {
        const messages = err.response.data.errors.map((e: any) => e.message).join('; ');
        throw new Error(`GraphQL Error: ${messages}`);
      }
      throw new Error(err.message || 'Erro ao comunicar com o servidor GraphQL');
    }
  }
}

export const graphqlClient = new GraphQLClient();
export default graphqlClient;
