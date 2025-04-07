package com.example.commudev

import android.content.Intent
import android.os.Bundle
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.commudev.databinding.ActivityLoginBinding
import com.google.android.material.dialog.MaterialAlertDialogBuilder

class LoginActivity : AppCompatActivity() {

    private lateinit var binding: ActivityLoginBinding
    private lateinit var authManager: AuthManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)

        authManager = AuthManager(this)

        // Check if user is already logged in
        if (authManager.isUserLoggedIn()) {
            navigateToMain()
            return
        }

        setupClickListeners()
    }

    private fun setupClickListeners() {
        binding.loginButton.setOnClickListener {
            val username = binding.usernameEditText.text.toString()
            val password = binding.passwordEditText.text.toString()

            if (validateInputs(username, password)) {
                loginUser(username, password)
            }
        }

        binding.registerText.setOnClickListener {
            startActivity(Intent(this, RegisterActivity::class.java))
        }

        binding.registerRedirectButton.setOnClickListener {
            startActivity(Intent(this, RegisterActivity::class.java))
        }

        binding.forgotPasswordText.setOnClickListener {
            // Handle forgot password
            showForgotPasswordDialog()
        }

        // Social login buttons have been removed from the layout
        // to match the new design
    }

    private fun validateInputs(username: String, password: String): Boolean {
        var isValid = true

        if (username.isEmpty()) {
            binding.usernameEditText.error = "Username cannot be empty"
            isValid = false
        }

        if (password.isEmpty()) {
            binding.passwordEditText.error = "Password cannot be empty"
            isValid = false
        }

        return isValid
    }

    private fun loginUser(username: String, password: String) {
        // In a real app, you would handle both username and email login
        // For simplicity, this example assumes the username field is actually email

        showLoading(true)

        authManager.loginUser(username, password) { success, errorMessage ->
            showLoading(false)

            if (success) {
                navigateToMain()
            } else {
                showError(errorMessage ?: "Login failed")
            }
        }
    }

    private fun showLoading(isLoading: Boolean) {
        if (isLoading) {
            binding.loginButton.isEnabled = false
            binding.loginButton.setText(R.string.logging_in)
            // Show progress indicator if you have one
        } else {
            binding.loginButton.isEnabled = true
            binding.loginButton.setText(R.string.login)
            // Hide progress indicator
        }
    }

    private fun showError(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_LONG).show()
    }

    private fun navigateToMain() {
        startActivity(Intent(this, MainActivity::class.java))
        finish()
    }

    private fun showForgotPasswordDialog() {
        val dialogView = layoutInflater.inflate(R.layout.dialog_forgot_password, null)
        val emailEditText = dialogView.findViewById<EditText>(R.id.emailEditText)

        val dialog = MaterialAlertDialogBuilder(this)
            .setTitle("Reset Password")
            .setView(dialogView)
            .setPositiveButton("Reset") { _, _ ->
                val email = emailEditText.text.toString()
                if (email.isNotEmpty()) {
                    authManager.sendPasswordResetEmail(email) { success, message ->
                        if (success) {
                            Toast.makeText(this, "Password reset email sent", Toast.LENGTH_LONG).show()
                        } else {
                            Toast.makeText(this, message ?: "Failed to send reset email", Toast.LENGTH_LONG).show()
                        }
                    }
                } else {
                    Toast.makeText(this, "Please enter your email", Toast.LENGTH_SHORT).show()
                }
            }
            .setNegativeButton("Cancel", null)
            .create()

        dialog.show()
    }
}