package com.example.commudev

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.commudev.databinding.ActivityRegisterBinding

class RegisterActivity : AppCompatActivity() {

    private lateinit var binding: ActivityRegisterBinding
    private lateinit var authManager: AuthManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityRegisterBinding.inflate(layoutInflater)
        setContentView(binding.root)

        authManager = AuthManager(this)

        setupClickListeners()
    }

    private fun setupClickListeners() {
        binding.registerButton.setOnClickListener {
            if (!binding.termsCheckBox.isChecked) {
                Toast.makeText(this, "Please accept the Terms & Conditions", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val fullName = binding.fullNameEditText.text.toString()
            val username = binding.usernameEditText.text.toString()
            val email = binding.emailEditText.text.toString()
            val password = binding.passwordEditText.text.toString()
            val confirmPassword = binding.confirmPasswordEditText.text.toString()

            if (validateInputs(fullName, username, email, password, confirmPassword)) {
                registerUser(fullName, username, email, password)
            }
        }

        binding.backToLoginText.setOnClickListener {
            finish() // Go back to LoginActivity
        }

        // Social login buttons have been removed from the layout
        // to match the new design
    }

    private fun validateInputs(
        fullName: String,
        username: String,
        email: String,
        password: String,
        confirmPassword: String
    ): Boolean {
        var isValid = true

        // Clear previous errors
        binding.fullNameEditText.error = null
        binding.usernameEditText.error = null
        binding.emailEditText.error = null
        binding.passwordEditText.error = null
        binding.confirmPasswordEditText.error = null

        if (fullName.isEmpty()) {
            binding.fullNameEditText.error = "Full name cannot be empty"
            isValid = false
        }

        if (username.isEmpty()) {
            binding.usernameEditText.error = "Username cannot be empty"
            isValid = false
        }

        if (email.isEmpty()) {
            binding.emailEditText.error = "Email cannot be empty"
            isValid = false
        } else if (!android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            binding.emailEditText.error = "Invalid email format"
            isValid = false
        }

        if (password.isEmpty()) {
            binding.passwordEditText.error = "Password cannot be empty"
            isValid = false
        } else if (password.length < 6) {
            binding.passwordEditText.error = "Password must be at least 6 characters"
            isValid = false
        }

        if (confirmPassword.isEmpty()) {
            binding.confirmPasswordEditText.error = "Please confirm your password"
            isValid = false
        } else if (password != confirmPassword) {
            binding.confirmPasswordEditText.error = "Passwords do not match"
            isValid = false
        }

        return isValid
    }

    private fun registerUser(fullName: String, username: String, email: String, password: String) {
        showLoading(true)

        authManager.registerUser(fullName, username, email, password) { success, errorMessage ->
            showLoading(false)

            if (success) {
                Toast.makeText(this, "Registration successful! Please log in.", Toast.LENGTH_LONG).show()
                finish() // Go back to LoginActivity for login
            } else {
                showError(errorMessage ?: "Registration failed")
            }
        }
    }

    private fun showLoading(isLoading: Boolean) {
        if (isLoading) {
            binding.registerButton.isEnabled = false
            binding.registerButton.text = "REGISTERING..."
            // Show progress indicator if you have one
        } else {
            binding.registerButton.isEnabled = true
            binding.registerButton.text = "CREATE ACCOUNT"
            // Hide progress indicator
        }
    }

    private fun showError(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_LONG).show()
    }
}