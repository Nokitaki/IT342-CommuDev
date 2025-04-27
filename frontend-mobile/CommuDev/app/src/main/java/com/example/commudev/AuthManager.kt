package com.example.commudev

import android.content.Context
import android.content.SharedPreferences
import android.util.Log

class AuthManager(private val context: Context) {
    private val sharedPreferences: SharedPreferences =
        context.getSharedPreferences("auth_prefs", Context.MODE_PRIVATE)

    init {
        // Optional: Log the current login state for debugging
        val isLoggedIn = isUserLoggedIn()
        Log.d("AuthManager", "Current login state: ${if (isLoggedIn) "Logged in" else "Logged out"}")
    }

    fun registerUser(
        fullName: String,
        username: String,
        email: String,
        password: String,
        onComplete: (Boolean, String?) -> Unit
    ) {
        if (sharedPreferences.contains("username_$username")) {
            onComplete(false, "Username already exists")
            return
        }

        val userId = "user_${System.currentTimeMillis()}"

        with(sharedPreferences.edit()) {
            putString("user_${userId}_fullName", fullName)
            putString("user_${userId}_username", username)
            putString("user_${userId}_email", email)
            putString("user_${userId}_password", password)
            putString("username_$username", userId)
            putString("email_$email", userId)
            putLong("user_${userId}_joinDate", System.currentTimeMillis())
            apply()
        }

        onComplete(true, null)
    }

    fun createTestUser() {
        val userId = "test_user_123"
        val fullName = "Test User"
        val username = "testuser"
        val email = "test@example.com"
        val password = "password123"

        with(sharedPreferences.edit()) {
            putString("user_${userId}_fullName", fullName)
            putString("user_${userId}_username", username)
            putString("user_${userId}_email", email)
            putString("user_${userId}_password", password)
            putString("username_$username", userId)
            putString("email_$email", userId)
            putLong("user_${userId}_joinDate", System.currentTimeMillis())
            apply()
        }

        Log.d("AuthManager", "Test user created")
    }

    fun loginUser(email: String, password: String, onComplete: (Boolean, String?) -> Unit) {
        val userId = sharedPreferences.getString("email_$email", null)

        if (userId == null) {
            onComplete(false, "User not found")
            return
        }

        val storedPassword = sharedPreferences.getString("user_${userId}_password", "")
        if (password == storedPassword) {
            sharedPreferences.edit().putString("currentUserId", userId).apply()
            Log.d("AuthManager", "User logged in: $userId")
            onComplete(true, null)
        } else {
            onComplete(false, "Incorrect password")
        }
    }

    fun logoutUser() {
        val wasLoggedIn = isUserLoggedIn()
        sharedPreferences.edit().remove("currentUserId").apply()
        Log.d("AuthManager", "User logged out, previous state: ${if (wasLoggedIn) "Logged in" else "Already logged out"}")
    }

    fun isUserLoggedIn(): Boolean {
        return sharedPreferences.contains("currentUserId")
    }

    fun getCurrentUserId(): String? {
        return sharedPreferences.getString("currentUserId", null)
    }

    fun sendPasswordResetEmail(email: String, onComplete: (Boolean, String?) -> Unit) {
        val userId = sharedPreferences.getString("email_$email", null)

        if (userId == null) {
            onComplete(false, "Email not found")
            return
        }

        onComplete(true, null)
    }
}