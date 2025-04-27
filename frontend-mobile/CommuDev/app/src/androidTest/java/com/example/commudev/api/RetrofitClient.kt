package com.example.commudev.api

import android.content.Context
import com.example.commudev.util.SessionManager
import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.Response
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

/**
 * Singleton class for creating Retrofit API services
 */
object RetrofitClient {
    private const val BASE_URL = "http://10.0.2.2:8080/" // For Android emulator, pointing to localhost

    /**
     * Get the API service with authentication header
     * @param context Application context
     * @return ApiService instance
     */
    fun getApiService(context: Context): ApiService {
        return createRetrofit(context).create(ApiService::class.java)
    }

    /**
     * Create a Retrofit instance with auth token handling
     * @param context Application context
     * @return Retrofit instance
     */
    private fun createRetrofit(context: Context): Retrofit {
        val sessionManager = SessionManager(context)

        // Create a logging interceptor
        val loggingInterceptor = HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BODY
        }

        // Create an auth interceptor that adds the auth token to requests
        val authInterceptor = object : Interceptor {
            override fun intercept(chain: Interceptor.Chain): Response {
                val originalRequest = chain.request()

                // Skip auth token for login, register, etc.
                if (originalRequest.url.encodedPath.contains("/auth/")) {
                    return chain.proceed(originalRequest)
                }

                // Add auth token to requests that need it
                val token = sessionManager.getAuthToken()
                if (token != null) {
                    val authorizedRequest = originalRequest.newBuilder()
                        .header("Authorization", "Bearer $token")
                        .build()
                    return chain.proceed(authorizedRequest)
                }

                return chain.proceed(originalRequest)
            }
        }

        // Create OkHttpClient with interceptors
        val client = OkHttpClient.Builder()
            .addInterceptor(authInterceptor)
            .addInterceptor(loggingInterceptor)
            .connectTimeout(60, TimeUnit.SECONDS)
            .readTimeout(60, TimeUnit.SECONDS)
            .writeTimeout(60, TimeUnit.SECONDS)
            .build()

        // Create and return Retrofit instance
        return Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(client)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }
}