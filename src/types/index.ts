// Re-export all types from their respective modules
export * from './user';
export * from './onboarding';
export * from './food';
export * from './ui';
export * from './context';
export * from './dashboard';

// Common utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Form validation types
export interface FormField<T = string> {
  value: T;
  error?: string;
  touched: boolean;
  dirty: boolean;
}

export type FormState<T extends Record<string, any>> = {
  [K in keyof T]: FormField<T[K]>;
};

// File upload types
export interface FileUpload {
  uri: string;
  name: string;
  type: string;
  size: number;
}

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

// Navigation types
export interface NavigationParams {
  [key: string]: any;
}

// Loading states
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Common status types
export type Status = 'active' | 'inactive' | 'pending' | 'archived';

// Time period types
export type TimePeriod = 'day' | 'week' | 'month' | 'quarter' | 'year';

// Date range types
export interface DateRange {
  startDate: string;
  endDate: string;
}

// Chart data types
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface ChartDataset {
  label: string;
  data: number[];
  borderColor?: string;
  backgroundColor?: string;
  fill?: boolean;
}

// Statistics types
export interface Statistics {
  total: number;
  count: number;
  average: number;
  min: number;
  max: number;
}

// Search types
export interface SearchResult<T> {
  item: T;
  relevance: number;
  highlights?: string[];
}

// Sort types
export interface SortOption {
  field: string;
  label: string;
  direction?: 'asc' | 'desc';
}

// Filter types
export interface FilterOption {
  field: string;
  label: string;
  value: any;
  operator?: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'contains';
}

// Import environment config types
export type Environment = 'development' | 'staging' | 'production';

// Device types
export type DeviceType = 'phone' | 'tablet' | 'desktop';

// Platform types
export type Platform = 'ios' | 'android' | 'web' | 'windows' | 'macos';