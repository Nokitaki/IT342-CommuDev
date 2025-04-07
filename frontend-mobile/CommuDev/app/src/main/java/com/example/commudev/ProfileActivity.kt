package com.example.commudev

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import com.example.commudev.databinding.ActivityProfileBinding

class ProfileActivity : AppCompatActivity() {

    private lateinit var binding: ActivityProfileBinding
    private lateinit var authManager: AuthManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityProfileBinding.inflate(layoutInflater)
        setContentView(binding.root)

        authManager = AuthManager(this)

        // Load user profile
        loadUserProfile()

        // Setup click listeners for buttons
        setupClickListeners()
    }

    private fun loadUserProfile() {
        val userId = authManager.getCurrentUserId() ?: return

        // Get user data from SharedPreferences
        val sharedPreferences = getSharedPreferences("auth_prefs", MODE_PRIVATE)
        val fullName = sharedPreferences.getString("user_${userId}_fullName", "") ?: ""
        val email = sharedPreferences.getString("user_${userId}_email", "") ?: ""
        val username = sharedPreferences.getString("user_${userId}_username", "") ?: ""
        val joinDate = sharedPreferences.getLong("user_${userId}_joinDate", 0)

        // Update UI with user data
        binding.profileNameText.text = fullName
        binding.emailText.text = email

        // Sample data for demo purposes - in a real app, you would store and retrieve this data
        binding.ageText.text = "22"
        binding.employmentText.text = "Student"
        binding.countryText.text = "PH"
    }

    private fun setupClickListeners() {
        binding.backButton.setOnClickListener {
            finish()
        }

        binding.editProfileButton.setOnClickListener {
            // Handle edit profile action
            // You would typically start a new activity or show a dialog
        }

        binding.deleteAccountButton.setOnClickListener {
            // Show confirmation dialog before deleting account
            showDeleteAccountConfirmation()
        }

        // Add a logout button to your layout and set its click listener
        binding.logoutButton.setOnClickListener {
            showLogoutConfirmation()
        }
    }

    private fun showLogoutConfirmation() {
        AlertDialog.Builder(this)
            .setTitle("Logout")
            .setMessage("Are you sure you want to logout?")
            .setPositiveButton("Yes") { _, _ ->
                logout()
            }
            .setNegativeButton("No", null)
            .show()
    }

    private fun showDeleteAccountConfirmation() {
        AlertDialog.Builder(this)
            .setTitle("Delete Account")
            .setMessage("Are you sure you want to delete your account? This action cannot be undone.")
            .setPositiveButton("Yes") { _, _ ->
                // Delete account logic here
                authManager.logoutUser() // For now, just logout
                navigateToLogin()
            }
            .setNegativeButton("No", null)
            .show()
    }

    private fun logout() {
        authManager.logoutUser()
        navigateToLogin()
    }

    private fun navigateToLogin() {
        val intent = Intent(this, LoginActivity::class.java)
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        startActivity(intent)
        finish()
    }
}