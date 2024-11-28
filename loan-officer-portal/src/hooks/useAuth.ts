import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authAPI, type LoginData, type RegisterData } from '@/services/api';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  // Query for getting the current user
  const { 
    data: user,
    isLoading: isUserLoading,
    error: userError,
  } = useQuery({
    queryKey: ['user'],
    queryFn: authAPI.getUser,
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !window.location.pathname.includes('/login') && !window.location.pathname.includes('/register'),
  });

  // Login mutation
  const { 
    mutate: login,
    isPending: isLoginLoading,
    error: loginError,
  } = useMutation({
    mutationFn: async (data: LoginData) => {
      try {
        const response = await authAPI.login(data);
        return response;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw new Error('Login failed');
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data.user);
      router.push('/dashboard');
    },
  });

  // Register mutation
  const {
    mutate: register,
    isPending: isRegisterLoading,
    error: registerError,
  } = useMutation({
    mutationFn: async (data: RegisterData) => {
      try {
        const response = await authAPI.register(data);
        return response;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw new Error('Registration failed');
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data.user);
      router.push('/dashboard');
    },
  });

  // Logout mutation
  const {
    mutate: logout,
    isPending: isLogoutLoading,
    error: logoutError,
  } = useMutation({
    mutationFn: async () => {
      try {
        const response = await authAPI.logout();
        return response;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw new Error('Logout failed');
      }
    },
    onSuccess: () => {
      queryClient.setQueryData(['user'], null);
      router.push('/login');
    },
  });

  return {
    user,
    isUserLoading,
    userError,
    login,
    isLoginLoading,
    loginError,
    register,
    isRegisterLoading,
    registerError,
    logout,
    isLogoutLoading,
    logoutError,
    isAuthenticated: !!user,
  };
}
