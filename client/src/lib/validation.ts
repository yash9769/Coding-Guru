// Form validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateProjectName = (name: string): string | null => {
  if (!name.trim()) {
    return "Project name is required";
  }
  if (name.length < 3) {
    return "Project name must be at least 3 characters";
  }
  if (name.length > 50) {
    return "Project name must be less than 50 characters";
  }
  if (!/^[a-zA-Z0-9\s-_]+$/.test(name)) {
    return "Project name can only contain letters, numbers, spaces, hyphens, and underscores";
  }
  return null;
};

export const validateApiPath = (path: string): string | null => {
  if (!path.trim()) {
    return "API path is required";
  }
  if (!path.startsWith('/')) {
    return "API path must start with '/'";
  }
  if (!/^\/[a-zA-Z0-9\/_:-]*$/.test(path)) {
    return "API path contains invalid characters";
  }
  return null;
};

export const validateEnvVarName = (name: string): string | null => {
  if (!name.trim()) {
    return "Environment variable name is required";
  }
  if (!/^[A-Z_][A-Z0-9_]*$/.test(name)) {
    return "Environment variable name must be uppercase with underscores";
  }
  return null;
};

export const validateComponentName = (name: string): string | null => {
  if (!name.trim()) {
    return "Component name is required";
  }
  if (!/^[A-Z][a-zA-Z0-9]*$/.test(name)) {
    return "Component name must start with uppercase letter and contain only alphanumeric characters";
  }
  return null;
};

export const validateModelField = (field: { name: string; type: string }): string | null => {
  if (!field.name.trim()) {
    return "Field name is required";
  }
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(field.name)) {
    return "Field name must be a valid identifier";
  }
  if (!field.type.trim()) {
    return "Field type is required";
  }
  return null;
};