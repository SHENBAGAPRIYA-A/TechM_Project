
import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContextType, AuthState, LoginCredentials, SignupCredentials, User } from "@/types/auth";
import { useToast } from "@/components/ui/use-toast";

// Mock API for authentication (simulate backend)
const mockLogin = async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock users for demonstration
  const adminUser = {
    id: "admin1",
    name: "Admin User",
    email: "admin@college.edu",
    role: "admin" as const
  };

  const studentUser = {
    id: "student1",
    name: "John Smith",
    email: "john.smith@college.edu",
    role: "student" as const,
    department: "Computer Science",
    studentId: "CS12345",
    contactInfo: "john.smith@college.edu"
  };

  // Check credentials (in a real app, this would be validated by the backend)
  if (credentials.email === "admin@college.edu" && credentials.password === "admin123" && credentials.role === "admin") {
    return {
      user: adminUser,
      token: "mock-admin-jwt-token"
    };
  } else if (credentials.email === "john@college.edu" && credentials.password === "student123" && credentials.role === "student") {
    return {
      user: studentUser,
      token: "mock-student-jwt-token"
    };
  }

  throw new Error("Invalid credentials");
};

// Mock signup API
const mockSignup = async (credentials: SignupCredentials): Promise<{ user: User; token: string }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Validate password match
  if (credentials.password !== credentials.confirmPassword) {
    throw new Error("Passwords do not match");
  }
  
  // In a real app, this would create a new user in the backend
  const newUser: User = {
    id: `student_${Date.now()}`,
    name: credentials.name,
    email: credentials.email,
    role: "student",
    department: credentials.department,
    studentId: credentials.studentId,
    contactInfo: credentials.email
  };
  
  return {
    user: newUser,
    token: `mock-student-jwt-token-${Date.now()}`
  };
};

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial auth state
const initialAuthState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>(initialAuthState);
  const { toast } = useToast();

  // Check if a user is already logged in on mount
  useEffect(() => {
    const loadStoredAuth = () => {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");
      
      if (storedUser && storedToken) {
        try {
          setAuth({
            user: JSON.parse(storedUser),
            token: storedToken,
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error) {
          console.error("Failed to parse stored user data", error);
          // Clear invalid storage
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          setAuth({ ...initialAuthState, isLoading: false });
        }
      } else {
        setAuth({ ...initialAuthState, isLoading: false });
      }
    };

    loadStoredAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setAuth(prev => ({ ...prev, isLoading: true }));
      
      // In a real app, this would be an actual API call to your backend
      const { user, token } = await mockLogin(credentials);
      
      // Store auth data
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      
      // Update state
      setAuth({
        user,
        token,
        isAuthenticated: true,
        isLoading: false
      });
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.name}!`,
      });
    } catch (error) {
      setAuth({ ...initialAuthState, isLoading: false });
      toast({
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signup = async (credentials: SignupCredentials) => {
    try {
      setAuth(prev => ({ ...prev, isLoading: true }));
      
      // In a real app, this would be an API call to your backend
      const { user, token } = await mockSignup(credentials);
      
      // Store auth data
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      
      // Update state
      setAuth({
        user,
        token,
        isAuthenticated: true,
        isLoading: false
      });
      
      toast({
        title: "Registration successful",
        description: `Welcome to Student Helpdesk, ${user.name}!`,
      });
    } catch (error) {
      setAuth({ ...initialAuthState, isLoading: false });
      
      // Show specific error message
      const errorMessage = error instanceof Error ? error.message : "Registration failed. Please try again.";
      
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = () => {
    // Clear stored auth data
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    
    // Reset state
    setAuth({ ...initialAuthState, isLoading: false });
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const contextValue: AuthContextType = {
    ...auth,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
