export interface ApiResponse {
  meta: {
    status: number;
    message: string;
  };
  data: {
    status: string;
    message: string;
  };
}

export interface ApiError {
  response?: {
    data?: {
      meta?: {
        message?: string;
      };
    };
  };
}

export interface GoogleButtonProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  country: string;
  language: string;
}

export interface GoogleUserInfo {
  email: string;
  name: string;
  picture: string;
  sub: string;
}
