import { httpClient } from './httpClient';
import type { ApiResponse, User } from '../types';

// ── AUTH SERVICE — Real API calls ────────────────────────────

/**
 * POST /auth/register
 * Cria um novo usuário.
 */
export const authRegister = async (
  nome: string,
  email: string,
  senha: string
): Promise<ApiResponse<{ token: string; user: User }>> => {
  try {
    const data = await httpClient.post<any>('/auth/register', { nome, email, senha });
    const responseData = data.data || data;
    
    return {
      success: true,
      data: {
        token: responseData.token,
        user: {
          id: String(responseData.userId || responseData.id || ''),
          nome: responseData.nome || nome,
          email: email,
          role: responseData.role || 'operador',
        },
      },
    };
  } catch (err: any) {
    return {
      success: false,
      error: {
        code: 'REGISTER_ERROR',
        message: err.message || 'Erro ao realizar cadastro.',
      },
    };
  }
};

/**
 * POST /auth/login
 * Autentica usuário com email e senha.
 */
export const authLogin = async (
  email: string,
  senha: string
): Promise<ApiResponse<{ token: string; user: User }>> => {
  try {
    const data = await httpClient.post<any>('/auth/login', { email, senha });
    // Adapt backend response to our ApiResponse format
    const responseData = data.data || data;
    const token = responseData.token;
    const userPayload = responseData;

    if (token) {
      return {
        success: true,
        data: {
          token,
          user: {
            id: String(userPayload.userId || userPayload.id || ''),
            nome: userPayload.nome || '',
            email: email,
            role: userPayload.role || 'Usuário',
          },
        },
      };
    }

    return {
      success: false,
      error: { code: 'LOGIN_FAILED', message: 'Resposta inesperada do servidor.' },
    };
  } catch (err: any) {
    return {
      success: false,
      error: {
        code: 'LOGIN_ERROR',
        message: err.message || 'E-mail ou senha inválidos.',
      },
    };
  }
};

/**
 * POST /auth/logout
 * Encerra sessão no backend.
 */
export const authLogout = async (): Promise<ApiResponse<null>> => {
  try {
    await httpClient.post<any>('/auth/logout');
    return { success: true, data: null };
  } catch {
    // Even if the API call fails, we still want to log out locally
    return { success: true, data: null };
  }
};

/**
 * GET /auth/me
 * Obtém dados do usuário autenticado a partir do token.
 */
export const authMe = async (): Promise<ApiResponse<User>> => {
  try {
    const data = await httpClient.get<any>('/auth/me');
    const user = data.user || data.data || data;

    return {
      success: true,
      data: {
        id: user.id || user._id || '',
        nome: user.nome || user.name || user.nome_completo || '',
        email: user.email || '',
        role: user.role || user.cargo || user.perfil || 'Usuário',
        avatar: user.avatar || user.foto || undefined,
      },
    };
  } catch (err: any) {
    return {
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: err.message || 'Sessão expirada.',
      },
    };
  }
};

/**
 * PUT /auth/perfil
 * Atualiza dados do perfil do usuário.
 */
export const authUpdatePerfil = async (
  data: Partial<User>
): Promise<ApiResponse<User>> => {
  try {
    const result = await httpClient.put<any>('/auth/perfil', data);
    const user = result.user || result.data || result;

    return {
      success: true,
      data: {
        id: user.id || user._id || '',
        nome: user.nome || user.name || user.nome_completo || '',
        email: user.email || '',
        role: user.role || user.cargo || user.perfil || 'Usuário',
        avatar: user.avatar || user.foto || undefined,
      },
    };
  } catch (err: any) {
    return {
      success: false,
      error: {
        code: 'UPDATE_ERROR',
        message: err.message || 'Erro ao atualizar perfil.',
      },
    };
  }
};

/**
 * PUT /auth/senha
 * Altera a senha do usuário.
 */
export const authUpdateSenha = async (
  novaSenha: string
): Promise<ApiResponse<null>> => {
  try {
    await httpClient.put<any>('/auth/senha', {
      novaSenha: novaSenha,
    });
    return { success: true, data: null };
  } catch (err: any) {
    return {
      success: false,
      error: {
        code: 'PASSWORD_ERROR',
        message: err.message || 'Erro ao alterar senha.',
      },
    };
  }
};
