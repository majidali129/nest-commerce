import axios, { isAxiosError } from 'axios'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import type { ApiResponse } from '@repo/contracts'

export class ApiError extends Error {
  public statusCode: number
  public errors: unknown

  constructor(message: string, statusCode: number, errors: unknown) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.errors = errors
  }
}

export class HttpClient {
  protected instance: AxiosInstance

  constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    })

    this.initializeRequestInterceptor()
  }

  private initializeRequestInterceptor() {
    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken')
        console.log('token', token)
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (err) => Promise.reject(err),
    )
  }

  private async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.instance.request<ApiResponse<T>>(config);
      console.log('response', response)
      const body = response.data

      if (!body.success) {
        throw new ApiError(body.message, body.statusCode, body.errors)
      }

      return body.data as T
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }

      if (isAxiosError<ApiResponse<null>>(error) && error.response?.data) {
        console.log('error: ', error.response.data)
        const body = error.response.data
        throw new ApiError(
          body.message ?? error.message,
          body.statusCode ?? error.response.status,
          body.errors ?? null,
        )
      }

      if (isAxiosError(error)) {
        throw new ApiError(error.message, 0, null)
      }

      throw error
    }
  }

  get<T>(url: string, config?: AxiosRequestConfig) {
    return this.request<T>({ ...config, method: 'GET', url })
  }

  post<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig) {
    return this.request<T>({ ...config, method: 'POST', url, data })
  }

  put<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig) {
    return this.request<T>({ ...config, method: 'PUT', url, data })
  }

  patch<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig) {
    return this.request<T>({ ...config, method: 'PATCH', url, data })
  }

  delete<T>(url: string, config?: AxiosRequestConfig) {
    return this.request<T>({ ...config, method: 'DELETE', url })
  }
}
export const httpClient = new HttpClient(import.meta.env.VITE_API_URL)
