package com.example.commudev

import com.example.commudev.models.MessageResponse
import com.example.commudev.models.RegisterRequest
import com.example.commudev.models.RegisterResponse
import com.example.commudev.models.VerifyRequest
import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.commudev.api.RetrofitClient
import com.example.commudev.databinding.ActivityRegisterBinding
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class RegisterActivity : AppCompatActivity() {

    private lateinit var binding: ActivityRegisterBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityRegisterBinding.inflate(layoutInflater)
        setContentView(binding.root)

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
                registerUser(username, email, password)
            }
        }

        binding.backToLoginText.setOnClickListener {
            finish() // Go back to LoginActivity
        }
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

    private fun registerUser(username: String, email: String, password: String) {
        showLoading(true)

        val apiService = RetrofitClient.getApiService(this)
        val registerRequest = RegisterRequest(email, password, username)

        apiService.register(registerRequest).enqueue(object : Callback<RegisterResponse> {
            override fun onResponse(call: Call<RegisterResponse>, response: Response<RegisterResponse>) {
                if (response.isSuccessful) {
                    response.body()?.let { registerResponse ->
                        // Show verification dialog
                        showVerificationDialog(email)
                    }
                } else {
                    val errorMessage = when (response.code()) {
                        409 -> "Email or username already exists"
                        else -> "Registration failed: ${response.message()}"
                    }
                    showLoading(false)
                    showError(errorMessage)
                }
            }

            override fun onFailure(call: Call<RegisterResponse>, t: Throwable) {
                showLoading(false)
                showError("Network error: ${t.message}")
            }
        })
    }

    private fun showVerificationDialog(email: String) {
        // Show verification dialog with input field for verification code
        val dialogView = layoutInflater.inflate(R.layout.dialog_verification, null)
        val verificationCodeInput = dialogView.findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.verificationCodeInput)

        val dialog = androidx.appcompat.app.AlertDialog.Builder(this)
            .setTitle("Account Verification")
            .setMessage("A verification code has been sent to your email. Please enter it below.")
            .setView(dialogView)
            .setCancelable(false)
            .setPositiveButton("Verify") { _, _ ->
                val code = verificationCodeInput.text.toString()
                if (code.isNotEmpty()) {
                    verifyAccount(email, code)
                } else {
                    showError("Please enter the verification code")
                    showVerificationDialog(email) // Show dialog again
                }
            }
            .setNegativeButton("Resend Code") { _, _ ->
                resendVerificationCode(email)
                showVerificationDialog(email) // Show dialog again
            }
            .setNeutralButton("Later") { _, _ ->
                Toast.makeText(this, "You can verify your account later. Please check your email.", Toast.LENGTH_LONG).show()
                showLoading(false)
                finish() // Go back to login
            }
            .create()

        dialog.show()
    }

    private fun verifyAccount(email: String, code: String) {
        val apiService = RetrofitClient.getApiService(this)
        val verifyRequest = VerifyRequest(email, code)

        apiService.verifyAccount(verifyRequest).enqueue(object : Callback<MessageResponse> {
            override fun onResponse(call: Call<MessageResponse>, response: Response<MessageResponse>) {
                showLoading(false)

                if (response.isSuccessful) {
                    Toast.makeText(this@RegisterActivity, "Account verified successfully! Please log in.", Toast.LENGTH_LONG).show()
                    finish() // Go back to login
                } else {
                    val errorMessage = when (response.code()) {
                        400 -> "Invalid verification code"
                        404 -> "User not found"
                        else -> "Verification failed: ${response.message()}"
                    }
                    showError(errorMessage)
                    // Show verification dialog again
                    showVerificationDialog(email)
                }
            }

            override fun onFailure(call: Call<MessageResponse>, t: Throwable) {
                showLoading(false)
                showError("Network error: ${t.message}")
                // Show verification dialog again
                showVerificationDialog(email)
            }
        })
    }

    private fun resendVerificationCode(email: String) {
        val apiService = RetrofitClient.getApiService(this)

        apiService.resendVerificationCode(email).enqueue(object : Callback<MessageResponse> {
            override fun onResponse(call: Call<MessageResponse>, response: Response<MessageResponse>) {
                if (response.isSuccessful) {
                    Toast.makeText(this@RegisterActivity, "Verification code resent", Toast.LENGTH_SHORT).show()
                } else {
                    showError("Failed to resend code: ${response.message()}")
                }
            }

            override fun onFailure(call: Call<MessageResponse>, t: Throwable) {
                showError("Network error: ${t.message}")
            }
        })
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