package com.example.commudev


import com.example.commudev.api.RetrofitClient
import com.example.commudev.models.LoginRequest
import com.example.commudev.models.LoginResponse
import com.example.commudev.models.UserProfileResponse
import com.example.commudev.util.SessionManager
import android.content.Intent
import android.os.Bundle
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.commudev.databinding.ActivityLoginBinding
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class LoginActivity : AppCompatActivity() {

    private lateinit var binding: ActivityLoginBinding
    private lateinit var sessionManager: SessionManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Set theme explicitly to make sure UI displays correctly
        setTheme(R.style.Theme_CommuDev_NoActionBar)

        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)

        sessionManager = SessionManager(this)

        // Check if user is already logged in
        if (sessionManager.isLoggedIn()) {
            navigateToMain()
            return
        }

        setupClickListeners()
    }

    private fun setupClickListeners() {
        binding.loginButton.setOnClickListener {
            val email = binding.usernameEditText.text.toString()
            val password = binding.passwordEditText.text.toString()

            if (validateInputs(email, password)) {
                loginUser(email, password)
            }
        }

        // Long press on login button to auto-fill test user credentials
        binding.loginButton.setOnLongClickListener {
            // Auto-fill with test user credentials
            binding.usernameEditText.setText("test@example.com")
            binding.passwordEditText.setText("password123")
            Toast.makeText(this, "Test user credentials filled", Toast.LENGTH_SHORT).show()
            true
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
    }

    private fun validateInputs(email: String, password: String): Boolean {
        var isValid = true

        if (email.isEmpty()) {
            binding.usernameEditText.error = "Email cannot be empty"
            isValid = false
        }

        if (password.isEmpty()) {
            binding.passwordEditText.error = "Password cannot be empty"
            isValid = false
        }

        return isValid
    }

    private fun loginUser(email: String, password: String) {
        showLoading(true)

        val apiService = RetrofitClient.getApiService(this)
        val loginRequest = LoginRequest(email, password)

        apiService.login(loginRequest).enqueue(object : Callback<LoginResponse> {
            override fun onResponse(call: Call<LoginResponse>, response: Response<LoginResponse>) {
                showLoading(false)

                if (response.isSuccessful) {
                    response.body()?.let { loginResponse ->
                        // Save authentication token and expiry
                        sessionManager.saveAuthToken(loginResponse.token)
                        sessionManager.saveTokenExpiry(loginResponse.expiresIn)
                        sessionManager.setLoggedIn(true)

                        // Fetch user profile to get user info
                        fetchUserProfile()
                    }
                } else {
                    val errorMessage = when (response.code()) {
                        401 -> "Invalid email or password"
                        else -> "Login failed: ${response.message()}"
                    }
                    showError(errorMessage)
                }
            }

            override fun onFailure(call: Call<LoginResponse>, t: Throwable) {
                showLoading(false)
                showError("Network error: ${t.message}")
            }
        })
    }

    private fun fetchUserProfile() {
        val apiService = RetrofitClient.getApiService(this)

        apiService.getCurrentUserProfile().enqueue(object : Callback<UserProfileResponse> {
            override fun onResponse(
                call: Call<UserProfileResponse>,
                response: Response<UserProfileResponse>
            ) {
                if (response.isSuccessful) {
                    response.body()?.let { userProfile ->
                        // Save user information
                        sessionManager.saveUserInfo(
                            userProfile.id,
                            userProfile.email,
                            userProfile.username
                        )
                        navigateToMain()
                    }
                } else {
                    // If we can't get user profile, still navigate to main but show warning
                    Toast.makeText(
                        this@LoginActivity,
                        "Logged in, but couldn't fetch profile",
                        Toast.LENGTH_SHORT
                    ).show()
                    navigateToMain()
                }
            }

            override fun onFailure(call: Call<UserProfileResponse>, t: Throwable) {
                // If we can't get user profile, still navigate to main but show warning
                Toast.makeText(
                    this@LoginActivity,
                    "Logged in, but couldn't fetch profile",
                    Toast.LENGTH_SHORT
                ).show()
                navigateToMain()
            }
        })
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
                    sendPasswordResetEmail(email)
                } else {
                    Toast.makeText(this, "Please enter your email", Toast.LENGTH_SHORT).show()
                }
            }
            .setNegativeButton("Cancel", null)
            .create()

        dialog.show()
    }

    private fun sendPasswordResetEmail(email: String) {
        val apiService = RetrofitClient.getApiService(this)

        // Note: You'll need to implement a password reset endpoint in your backend
        // For now, just show a success message
        Toast.makeText(this, "Password reset email sent to $email", Toast.LENGTH_LONG).show()
    }
}