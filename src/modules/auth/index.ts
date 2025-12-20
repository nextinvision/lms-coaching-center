// Auth Module Public API
export { useAuth } from './hooks/useAuth';
export { useLogin } from './hooks/useLogin';
export { useSession } from './hooks/useSession';
export { useAuthStore } from './store/authStore';
export { authService } from './services/authService';
export { sessionService } from './services/sessionService';
export { hasPermission, hasAnyPermission, hasAllPermissions } from './utils/permissions';
export { loginSchema, registerSchema, changePasswordSchema } from './utils/validation';

// Components
export { ProtectedRoute } from './components/ProtectedRoute';
export { LoginForm } from './components/LoginForm';
export { LanguageSelector } from './components/LanguageSelector';

export type {
    User,
    AuthUser,
    Student,
    Teacher,
    Admin,
    LoginCredentials,
    LoginResponse,
    Session,
    AuthState,
    Permission,
} from './types/auth.types';

export type { LoginInput, RegisterInput, ChangePasswordInput } from './utils/validation';
