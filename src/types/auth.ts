
export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin" | "it-admin" | "hostel-admin" | "staff";
  department?: string;
  studentId?: string;
  contactInfo?: string;
  phone?: string;
  photo?: string;
  notificationPreferences?: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
  staffId?: string;
  staffDepartment?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role: "student" | "admin";
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  studentId: string;
  department: string;
  role: "student"; // Only students can signup through the public form
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => void;
}
