package com.example.commudev.util

import android.content.Context
import android.content.SharedPreferences
import android.util.Log

/**
 * Session manager to save and fetch data from SharedPreferences
 */
class SessionManager(context: Context) {
    private val preferences: SharedPreferences = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    private val editor = preferences.edit()

    companion object {
        private const val PREFS_NAME = "commudev_prefs"
        private const val KEY_TOKEN = "auth_token"
        private const val KEY_TOKEN_EXPIRY = "auth_token_expiry"
        private const val KEY_USER_ID = "user_id"
        private const val KEY_USER_EMAIL = "user_email"
        private const val KEY_USER_NAME = "user_name"
        private const val KEY_IS_LOGGED_IN = "is_logged_in"
    }

    /**
     * Function to save auth token
     */
    fun saveAuthToken(token: String) {
        editor.putString(KEY_TOKEN, token)
        editor.apply()
    }

    /**
     * Function to fetch auth token
     */
    fun getAuthToken(): String? {
        return preferences.getString(KEY_TOKEN, null)
    }

    /**
     * Save token expiry time in milliseconds
     */
    fun saveTokenExpiry(expiryInSeconds: Long) {
        val expiryTimeMillis = System.currentTimeMillis() + (expiryInSeconds * 1000)
        editor.putLong(KEY_TOKEN_EXPIRY, expiryTimeMillis)
        editor.apply()
    }

    /**
     * Check if token is expired
     */
    fun isTokenExpired(): Boolean {
        val expiryTime = preferences.getLong(KEY_TOKEN_EXPIRY, 0)
        return System.currentTimeMillis() > expiryTime
    }

    /**
     * Save user information
     */
    fun saveUserInfo(userId: Long, email: String, username: String) {
        editor.putLong(KEY_USER_ID, userId)
        editor.putString(KEY_USER_EMAIL, email)
        editor.putString(KEY_USER_NAME, username)
        editor.apply()
    }

    /**
     * Get user ID
     */
    fun getUserId(): Long {
        return preferences.getLong(KEY_USER_ID, 0)
    }

    /**
     * Get user email
     */
    fun getUserEmail(): String? {
        return preferences.getString(KEY_USER_EMAIL, null)
    }

    /**
     * Get username
     */
    fun getUsername(): String? {
        return preferences.getString(KEY_USER_NAME, null)
    }

    /**
     * Set logged in status
     */
    fun setLoggedIn(isLoggedIn: Boolean) {
        editor.putBoolean(KEY_IS_LOGGED_IN, isLoggedIn)
        editor.apply()
    }

    /**
     * Check if user is logged in
     */
    fun isLoggedIn(): Boolean {
        return preferences.getBoolean(KEY_IS_LOGGED_IN, false)
    }

    /**
     * Clear session details
     */
    fun clearSession() {
        editor.clear()
        editor.apply()
    }
}