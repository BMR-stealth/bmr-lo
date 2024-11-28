import axios, { AxiosError } from 'axios';

const BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Request interceptor to handle CSRF token
api.interceptors.request.use(async (config) => {
  if (config.method !== 'get') {
    try {
      // Get CSRF token for non-GET requests
      const { data } = await axios.get(`${BASE_URL}/api/auth/csrf/`, {
        withCredentials: true,
      });
      config.headers['X-CSRFToken'] = data.csrfToken;
    } catch (error) {
      console.error('Error fetching CSRF token:', error);
    }
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const isAuthPage = window.location.pathname.includes('/login') || 
                      window.location.pathname.includes('/register');
                      
    if ((error.response?.status === 401 || error.response?.status === 403) && !isAuthPage) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password1: string;
  password2: string;
  first_name: string;
  last_name: string;
  company_name: string;
  phone_number: string;
  location: string;
}

export interface User {
  id?: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  company_name: string;
  phone_number: string;
  location: string;
}

export interface LoanEstimate {
  id: string;
  // Add other properties as needed
}

export interface Bid {
  id: string;
  status: 'active' | 'won' | 'lost';
  amount: number;
  loanEstimateId: string;
  loanOfficerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Lead {
  id: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed' | 'lost';
  customer_name: string;
  email: string;
  phone: string;
  loan_amount: number;
  loan_type: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const authAPI = {
  register: async (data: RegisterData) => {
    try {
      const response = await api.post<{ user: User; message: string }>('/api/auth/register/', data);
      if (response.data.user.role !== 'LENDER') {
        throw new Error('Access denied. This portal is for lenders only.');
      }
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        console.error('Registration error:', error.response.data);
        
        // Handle different types of error responses
        if (typeof error.response.data === 'object') {
          const errorMessages: string[] = [];
          Object.entries(error.response.data).forEach(([field, messages]) => {
            if (Array.isArray(messages)) {
              errorMessages.push(`${field}: ${messages.join(', ')}`);
            } else if (typeof messages === 'string') {
              errorMessages.push(`${field}: ${messages}`);
            }
          });
          throw new Error(errorMessages.join('\n'));
        } else if (typeof error.response.data === 'string') {
          throw new Error(error.response.data);
        }
      }
      throw new Error('Registration failed. Please try again.');
    }
  },

  login: async (data: LoginData) => {
    try {
      // First, get a fresh CSRF token
      await api.get('/api/auth/csrf/');
      
      const response = await api.post<{ user: User; message: string }>('/api/auth/login/', {
        email: data.email,
        password: data.password,
      });
      
      if (!response.data.user || response.data.user.role !== 'LENDER') {
        throw new Error('Access denied. This portal is for lenders only.');
      }
      
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Login error:', error.response?.data);
        if (error.response?.data?.error) {
          throw new Error(error.response.data.error);
        }
      }
      throw new Error('Login failed. Please try again.');
    }
  },

  logout: async () => {
    try {
      const response = await api.post<{ message: string }>('/api/auth/logout/');
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        throw new Error(error.response.data.detail || 'Logout failed');
      }
      throw new Error('Logout failed. Please try again.');
    }
  },

  getUser: async () => {
    try {
      const response = await api.get<User>('/api/auth/user/');
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        return null;
      }
      throw error;
    }
  },
};

export const apiService = {
  // Loan Estimates
  async getLoanEstimates(): Promise<LoanEstimate[]> {
    try {
      const response = await api.get<LoanEstimate[]>('/api/loan-estimates/');
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch loan estimates');
    }
  },

  async getLoanEstimate(id: string): Promise<LoanEstimate> {
    try {
      const response = await api.get<LoanEstimate>(`/api/loan-estimates/${id}/`);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch loan estimate');
    }
  },

  // Bids
  async placeBid(loanEstimateId: string, amount: number): Promise<Bid> {
    try {
      const response = await api.post<Bid>('/api/bids/', { loan_estimate_id: loanEstimateId, amount });
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to place bid');
    }
  },

  async getMyBids(): Promise<Bid[]> {
    try {
      const response = await api.get<Bid[]>('/api/bids/my-bids/');
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch bids');
    }
  },

  // Leads
  async getMyLeads(): Promise<Lead[]> {
    try {
      const response = await api.get<Lead[]>('/api/leads/my-leads/');
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch leads');
    }
  },

  async updateLeadStatus(
    leadId: string,
    status: Lead['status'],
    notes?: string
  ): Promise<Lead> {
    try {
      const response = await api.patch<Lead>(`/api/leads/${leadId}/`, { status, notes });
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to update lead status');
    }
  },

  // Profile
  async updateProfile(data: Partial<{ company_name: string; phone_number: string; location: string }>) {
    try {
      const response = await api.patch<{ message: string }>('/api/profile/', data);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to update profile');
    }
  },
};

export default api;
