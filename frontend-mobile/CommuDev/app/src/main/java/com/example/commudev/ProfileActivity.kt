package com.example.commudev

import android.content.Intent
import android.os.Bundle
import android.view.MenuItem
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import com.example.commudev.databinding.ActivityProfileBinding
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import com.google.android.material.tabs.TabLayout

class ProfileActivity : AppCompatActivity() {

    private lateinit var binding: ActivityProfileBinding
    private lateinit var authManager: AuthManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityProfileBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Set up toolbar with back button - FIXED TOOLBAR SETUP
        // Remove this line that's causing the crash:
        // setSupportActionBar(binding.toolbar)

        // Instead, set up the toolbar manually
        if (supportActionBar != null) {
            supportActionBar?.setDisplayHomeAsUpEnabled(true)
            supportActionBar?.title = "Profile"
        }

        authManager = AuthManager(this)

        // Load user profile
        loadUserProfile()

        // Setup click listeners for buttons
        setupClickListeners()

        // Setup tab selection with improved UI
        setupTabs()
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
        binding.userNameText.text = fullName
        binding.userRoleText.text = "Community Development Advocate"

        // Set profile image (in a real app, you would load the actual image)
        binding.profilePicture.setImageResource(R.drawable.profile_placeholder)

        // Set cover photo background (in a real app, you would load the actual image)
        binding.coverPhotoImage.setImageResource(R.drawable.profile_placeholder) // Changed from cover_background to profile_placeholder

        // Set stats
        binding.postsCountText.text = "15"
        binding.friendsCountText.text = "42"
        binding.rewardsCountText.text = "8"

        // No photos, friends, or posts yet - show empty states
        binding.noPhotosText.visibility = View.VISIBLE
        binding.photosGridView.visibility = View.GONE
        binding.noFriendsText.visibility = View.VISIBLE
        binding.friendsRecyclerView.visibility = View.GONE
        binding.loadingPostsText.visibility = View.VISIBLE
        binding.postsRecyclerView.visibility = View.GONE
    }

    private fun setupClickListeners() {
        binding.backButton.setOnClickListener {
            finish()
        }

        binding.editProfileButton.setOnClickListener {
            // In a real app, this would navigate to edit profile screen
            showEditProfileDialog()
        }

        binding.editCoverButton.setOnClickListener {
            // Show options to change cover photo
            showChangeCoverPhotoDialog()
        }

        binding.editProfilePictureButton.setOnClickListener {
            // Show options to change profile picture
            showChangeProfilePictureDialog()
        }

        binding.seeAllPhotosText.setOnClickListener {
            // Navigate to photos section
            binding.profileTabLayout.getTabAt(3)?.select()
        }

        binding.seeAllFriendsText.setOnClickListener {
            // Navigate to friends section
            binding.profileTabLayout.getTabAt(2)?.select()
        }

        // Social media buttons with improved feedback
        setupSocialButton(binding.facebookButton, "Facebook profile")
        setupSocialButton(binding.instagramButton, "Instagram profile")
        setupSocialButton(binding.linkedinButton, "LinkedIn profile")

        // Create post functionality
        binding.postInput.setOnClickListener {
            // Expand post creation UI or show dialog
            showCreatePostDialog()
        }
    }

    private fun setupSocialButton(button: View, platformName: String) {
        button.setOnClickListener {
            // Add visual feedback
            button.alpha = 0.7f
            button.postDelayed({
                button.alpha = 1.0f
                Toast.makeText(this, "$platformName coming soon", Toast.LENGTH_SHORT).show()
            }, 100)
        }
    }

    private fun setupTabs() {
        // Improve tab appearance
        for (i in 0 until binding.profileTabLayout.tabCount) {
            val tab = binding.profileTabLayout.getTabAt(i)
            tab?.let {
                it.view.background = ContextCompat.getDrawable(
                    this,
                    R.drawable.tab_selector
                )
            }
        }

        binding.profileTabLayout.addOnTabSelectedListener(object : TabLayout.OnTabSelectedListener {
            override fun onTabSelected(tab: TabLayout.Tab?) {
                when (tab?.position) {
                    0 -> showPostsSection()
                    1 -> showAboutSection()
                    2 -> showFriendsSection()
                    3 -> showPhotosSection()
                    4 -> showMoreOptions()
                    else -> {
                        // Default case if none of the above match
                        showPostsSection()
                    }
                }

                // Visual feedback for tab selection
                tab?.view?.let {
                    it.setBackgroundColor(ContextCompat.getColor(
                        this@ProfileActivity,
                        R.color.light_green_translucent
                    ))
                }
            }

            override fun onTabUnselected(tab: TabLayout.Tab?) {
                // Reset background
                tab?.view?.setBackgroundColor(ContextCompat.getColor(
                    this@ProfileActivity,
                    android.R.color.transparent
                ))
            }

            override fun onTabReselected(tab: TabLayout.Tab?) {
                // Refresh content when tab is reselected
                onTabSelected(tab)
            }
        })
    }

    private fun showPostsSection() {
        binding.introCard.visibility = View.VISIBLE
        binding.photosCard.visibility = View.VISIBLE
        binding.friendsCard.visibility = View.VISIBLE
        binding.createPostCard.visibility = View.VISIBLE
        binding.loadingPostsText.visibility = View.VISIBLE
        binding.postsRecyclerView.visibility = View.GONE

        // Show posts loading animation
        binding.postsProgressBar.visibility = View.VISIBLE

        // Simulate loading posts (in a real app, you would fetch posts from a database or API)
        binding.postsProgressBar.postDelayed({
            binding.postsProgressBar.visibility = View.GONE
            binding.loadingPostsText.visibility = View.GONE

            // If there are no posts, show an empty state message
            binding.noPostsText.visibility = View.VISIBLE
        }, 1500)
    }

    private fun showAboutSection() {
        // Hide unnecessary cards
        binding.introCard.visibility = View.VISIBLE
        binding.photosCard.visibility = View.GONE
        binding.friendsCard.visibility = View.GONE
        binding.createPostCard.visibility = View.GONE
        binding.loadingPostsText.visibility = View.GONE
        binding.postsRecyclerView.visibility = View.GONE
        binding.postsProgressBar.visibility = View.GONE
        binding.noPostsText.visibility = View.GONE

        // Show About section
        binding.aboutSectionCard.visibility = View.VISIBLE
    }

    private fun showFriendsSection() {
        // Hide unnecessary cards
        binding.introCard.visibility = View.GONE
        binding.photosCard.visibility = View.GONE
        binding.friendsCard.visibility = View.VISIBLE
        binding.createPostCard.visibility = View.GONE
        binding.loadingPostsText.visibility = View.GONE
        binding.postsRecyclerView.visibility = View.GONE
        binding.postsProgressBar.visibility = View.GONE
        binding.noPostsText.visibility = View.GONE
        binding.aboutSectionCard.visibility = View.GONE

        // Show friends loading
        binding.friendsProgressBar.visibility = View.VISIBLE

        // Simulate loading friends
        binding.friendsProgressBar.postDelayed({
            binding.friendsProgressBar.visibility = View.GONE
            binding.noFriendsText.visibility = View.VISIBLE
        }, 1000)
    }

    private fun showPhotosSection() {
        // Hide unnecessary cards
        binding.introCard.visibility = View.GONE
        binding.photosCard.visibility = View.VISIBLE
        binding.friendsCard.visibility = View.GONE
        binding.createPostCard.visibility = View.GONE
        binding.loadingPostsText.visibility = View.GONE
        binding.postsRecyclerView.visibility = View.GONE
        binding.postsProgressBar.visibility = View.GONE
        binding.noPostsText.visibility = View.GONE
        binding.aboutSectionCard.visibility = View.GONE
        binding.friendsProgressBar.visibility = View.GONE

        // Show photos loading
        binding.photosProgressBar.visibility = View.VISIBLE

        // Simulate loading photos
        binding.photosProgressBar.postDelayed({
            binding.photosProgressBar.visibility = View.GONE
            binding.noPhotosText.visibility = View.VISIBLE
        }, 1000)
    }

    private fun showMoreOptions() {
        // Show more options dialog with improved styling
        val options = arrayOf(
            "Settings",
            "Privacy",
            "Help & Support",
            "About",
            "Log Out",
            "Delete Account"
        )

        val dialog = MaterialAlertDialogBuilder(this)
            .setTitle("More Options")
            .setItems(options) { dialog, which ->
                when (which) {
                    4 -> showLogoutConfirmation()
                    5 -> showDeleteAccountConfirmation()
                    else -> {
                        // Handle other options
                        Toast.makeText(this, "Feature coming soon: ${options[which]}", Toast.LENGTH_SHORT).show()
                    }
                }
            }
            .show()

        // Add custom styling to dialog
        dialog.window?.setBackgroundDrawableResource(R.drawable.rounded_dialog_background)
    }

    // Dialog methods

    private fun showEditProfileDialog() {
        // Navigate to edit profile activity in a real app
        Toast.makeText(this, "Edit Profile feature coming soon", Toast.LENGTH_SHORT).show()
    }

    private fun showChangeCoverPhotoDialog() {
        val options = arrayOf("Take Photo", "Choose from Gallery", "Cancel")

        MaterialAlertDialogBuilder(this)
            .setTitle("Change Cover Photo")
            .setItems(options) { dialog, which ->
                when (which) {
                    0, 1 -> Toast.makeText(this, "Photo selection coming soon", Toast.LENGTH_SHORT).show()
                    2 -> dialog.dismiss()
                    else -> {
                        // Default case
                        dialog.dismiss()
                    }
                }
            }
            .show()
    }

    private fun showChangeProfilePictureDialog() {
        val options = arrayOf("Take Photo", "Choose from Gallery", "Cancel")

        MaterialAlertDialogBuilder(this)
            .setTitle("Change Profile Picture")
            .setItems(options) { dialog, which ->
                when (which) {
                    0, 1 -> Toast.makeText(this, "Photo selection coming soon", Toast.LENGTH_SHORT).show()
                    2 -> dialog.dismiss()
                    else -> {
                        // Default case
                        dialog.dismiss()
                    }
                }
            }
            .show()
    }

    private fun showCreatePostDialog() {
        val dialogView = layoutInflater.inflate(R.layout.dialog_create_post, null)

        MaterialAlertDialogBuilder(this)
            .setTitle("Create Post")
            .setView(dialogView)
            .setPositiveButton("Post") { _, _ ->
                Toast.makeText(this, "Post created successfully", Toast.LENGTH_SHORT).show()
            }
            .setNegativeButton("Cancel", null)
            .show()
    }

    private fun showLogoutConfirmation() {
        MaterialAlertDialogBuilder(this)
            .setTitle("Logout")
            .setMessage("Are you sure you want to logout?")
            .setPositiveButton("Yes") { _, _ ->
                logout()
            }
            .setNegativeButton("No", null)
            .show()
    }

    private fun showDeleteAccountConfirmation() {
        MaterialAlertDialogBuilder(this)
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

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        if (item.itemId == android.R.id.home) {
            finish()
            return true
        }
        return super.onOptionsItemSelected(item)
    }
}