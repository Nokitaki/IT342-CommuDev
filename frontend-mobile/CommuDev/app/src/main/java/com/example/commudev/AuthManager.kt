package com.example.commudev

import android.content.Context
import android.content.SharedPreferences

class AuthManager(private val context: Context) {
    private val sharedPreferences: SharedPreferences =
        context.getSharedPreferences("auth_prefs", Context.MODE_PRIVATE)

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
            putString("userId", userId)
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
            putString("userId", userId)
            putString("user_${userId}_fullName", fullName)
            putString("user_${userId}_username", username)
            putString("user_${userId}_email", email)
            putString("user_${userId}_password", password)
            putString("username_$username", userId)
            putString("email_$email", userId)
            putLong("user_${userId}_joinDate", System.currentTimeMillis())
            apply()
        }
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
            onComplete(true, null)
        } else {
            onComplete(false, "Incorrect password")
        }
    }

    fun logoutUser() {
        sharedPreferences.edit().remove("currentUserId").apply()
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