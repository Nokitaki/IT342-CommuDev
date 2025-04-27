package com.example.commudev

import com.example.commudev.api.RetrofitClient
import com.example.commudev.models.UserDto
import com.example.commudev.models.UserProfileResponse
import com.example.commudev.util.ProfileNavigationUtil
import com.example.commudev.util.SessionManager
import android.content.Intent
import android.os.Bundle
import android.view.MenuItem
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.ActionBarDrawerToggle
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.GravityCompat
import androidx.drawerlayout.widget.DrawerLayout
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import com.bumptech.glide.Glide
import com.example.commudev.adapters.PeopleAdapter
import com.example.commudev.api.RetrofitClient
import com.example.commudev.databinding.ActivityMainBinding
import com.example.commudev.fragments.ChatFragment
import com.example.commudev.fragments.HomeFragment
import com.example.commudev.fragments.ResourcesFragment
import com.example.commudev.fragments.WeatherFragment
import com.example.commudev.models.User
import com.google.android.material.navigation.NavigationView
import com.google.android.material.tabs.TabLayout
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class MainActivity : AppCompatActivity(), NavigationView.OnNavigationItemSelectedListener {

    private lateinit var binding: ActivityMainBinding
    private lateinit var drawerLayout: DrawerLayout
    private lateinit var drawerToggle: ActionBarDrawerToggle
    private lateinit var sessionManager: SessionManager
    private var currentTabPosition = 0

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Initialize SessionManager
        sessionManager = SessionManager(this)

        // Check if user is logged in
        if (!sessionManager.isLoggedIn()) {
            navigateToLogin()
            return
        }

        // Initialize DrawerLayout
        drawerLayout = binding.drawerLayout

        // Setup navigation view
        val navigationView = findViewById<NavigationView>(R.id.leftDrawer)
        navigationView.setNavigationItemSelectedListener(this)

        // Setup left drawer toggle
        binding.appLogo.setOnClickListener {
            if (drawerLayout.isDrawerOpen(GravityCompat.START)) {
                drawerLayout.closeDrawer(GravityCompat.START)
            } else {
                drawerLayout.openDrawer(GravityCompat.START)
            }
        }

        // Load user profile
        loadUserProfile()

        // Setup profile navigation from user profile icon
        if (binding.userProfileIcon != null) {
            ProfileNavigationUtil.setupProfileImageNavigation(binding.userProfileIcon, this)
        }

        // Setup profile navigation from profile button if it exists
        if (binding.profileButton != null) {
            ProfileNavigationUtil.setupProfileCardNavigation(binding.profileButton, this)
        }

        // Setup community links
        setupCommunityLinks()

        // Setup People You May Know section
        setupPeopleYouMayKnow()

        // Setup Weather Dashboard
        setupWeatherDashboard()

        // Setup tab navigation
        setupTabNavigation()

        // Default to Home fragment
        replaceFragment(HomeFragment())
    }

    private fun loadUserProfile() {
        val apiService = RetrofitClient.getApiService(this)

        apiService.getCurrentUserProfile().enqueue(object : Callback<UserProfileResponse> {
            override fun onResponse(
                call: Call<UserProfileResponse>,
                response: Response<UserProfileResponse>
            ) {
                if (response.isSuccessful) {
                    response.body()?.let { profile ->
                        // Save user profile info
                        sessionManager.saveUserInfo(profile.id, profile.email, profile.username)

                        // Update UI with user info
                        updateProfileUI(profile)
                    }
                } else {
                    Toast.makeText(
                        this@MainActivity,
                        "Failed to load profile: ${response.message()}",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }

            override fun onFailure(call: Call<UserProfileResponse>, t: Throwable) {
                Toast.makeText(
                    this@MainActivity,
                    "Network error: ${t.message}",
                    Toast.LENGTH_SHORT
                ).show()
            }
        })
    }

    private fun updateProfileUI(profile: UserProfileResponse) {
        // Find header view in navigation drawer
        val navigationView = findViewById<NavigationView>(R.id.leftDrawer)
        val headerView = navigationView.getHeaderView(0)

        // Update profile picture if available
        val profileImageView = headerView.findViewById<ImageView>(R.id.navHeaderProfileImage)
        if (profileImageView != null && profile.profilePicture != null) {
            val baseUrl = "http://10.0.2.2:8080" // Change to your backend URL
            val imageUrl = baseUrl + profile.profilePicture

            Glide.with(this)
                .load(imageUrl)
                .placeholder(R.drawable.profile_placeholder)
                .error(R.drawable.profile_placeholder)
                .circleCrop()
                .into(profileImageView)
        }

        // Update user name and email
        val userNameTextView = headerView.findViewById<TextView>(R.id.navHeaderUserName)
        val userEmailTextView = headerView.findViewById<TextView>(R.id.navHeaderUserEmail)

        if (userNameTextView != null) {
            userNameTextView.text = if (!profile.firstname.isNullOrEmpty() && !profile.lastname.isNullOrEmpty()) {
                "${profile.firstname} ${profile.lastname}"
            } else {
                profile.username
            }
        }

        if (userEmailTextView != null) {
            userEmailTextView.text = profile.email
        }

        // Update main screen profile image if available
        if (binding.userProfileIcon != null && profile.profilePicture != null) {
            val baseUrl = "http://10.0.2.2:8080" // Change to your backend URL
            val imageUrl = baseUrl + profile.profilePicture

            Glide.with(this)
                .load(imageUrl)
                .placeholder(R.drawable.profile_placeholder)
                .error(R.drawable.profile_placeholder)
                .circleCrop()
                .into(binding.userProfileIcon)
        }
    }

    private fun setupTabNavigation() {
        binding.tabLayout.addOnTabSelectedListener(object : TabLayout.OnTabSelectedListener {
            override fun onTabSelected(tab: TabLayout.Tab) {
                currentTabPosition = tab.position
                when (tab.position) {
                    0 -> {
                        // Home tab
                        replaceFragment(HomeFragment())
                        // Lock drawer if it exists
                        findViewById<DrawerLayout>(R.id.messagesDrawerLayout)?.setDrawerLockMode(
                            DrawerLayout.LOCK_MODE_LOCKED_CLOSED
                        )
                    }
                    1 -> {
                        // Messages tab
                        replaceFragment(ChatFragment())
                        // Drawer will be unlocked in the fragment's onResume()
                    }
                    2 -> {
                        // Resources tab
                        replaceFragment(ResourcesFragment())
                        // Lock drawer if it exists
                        findViewById<DrawerLayout>(R.id.messagesDrawerLayout)?.setDrawerLockMode(
                            DrawerLayout.LOCK_MODE_LOCKED_CLOSED
                        )
                    }
                }
            }

            override fun onTabUnselected(tab: TabLayout.Tab) {
                // Not needed
            }

            override fun onTabReselected(tab: TabLayout.Tab) {
                // Refresh current tab if needed
            }
        })

        // Make sure first tab is selected initially
        binding.tabLayout.getTabAt(0)?.select()
    }

    private fun setupCommunityLinks() {
        binding.municipalCommunity.setOnClickListener {
            Toast.makeText(this, "Municipal Community selected", Toast.LENGTH_SHORT).show()
            drawerLayout.closeDrawer(GravityCompat.START)
        }

        binding.barangayCommunity.setOnClickListener {
            Toast.makeText(this, "Barangay Community selected", Toast.LENGTH_SHORT).show()
            drawerLayout.closeDrawer(GravityCompat.START)
        }
    }

    private fun setupPeopleYouMayKnow() {
        val recyclerView = binding.peopleRecyclerView
        recyclerView.layoutManager = LinearLayoutManager(this)

        // In a real app, fetch users from the backend
        val apiService = RetrofitClient.getApiService(this)
        apiService.getAllUsers().enqueue(object : Callback<List<com.example.commudev.models.UserDto>> {
            override fun onResponse(
                call: Call<List<com.example.commudev.models.UserDto>>,
                response: Response<List<com.example.commudev.models.UserDto>>
            ) {
                if (response.isSuccessful) {
                    val users = response.body()?.map { userDto ->
                        User(
                            fullName = if (userDto.firstname != null && userDto.lastname != null) {
                                "${userDto.firstname} ${userDto.lastname}"
                            } else {
                                userDto.username
                            },
                            isOnline = true // We don't have online status from backend
                        )
                    } ?: listOf()

                    val adapter = PeopleAdapter(users)
                    adapter.setOnPersonClickListener(object : PeopleAdapter.OnPersonClickListener {
                        override fun onPersonClick(person: User) {
                            // Navigate to profile page when profile is clicked
                            ProfileNavigationUtil.navigateToProfile(this@MainActivity)
                        }

                        override fun onConnectClick(person: User) {
                            Toast.makeText(
                                this@MainActivity,
                                "Connection request sent to ${person.fullName}",
                                Toast.LENGTH_SHORT
                            ).show()
                        }
                    })

                    recyclerView.adapter = adapter
                } else {
                    Toast.makeText(
                        this@MainActivity,
                        "Failed to load users: ${response.message()}",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }

            override fun onFailure(call: Call<List<com.example.commudev.models.UserDto>>, t: Throwable) {
                Toast.makeText(
                    this@MainActivity,
                    "Network error: ${t.message}",
                    Toast.LENGTH_SHORT
                ).show()
            }
        })

        // Setup see all button
        binding.seeAllPeopleText.setOnClickListener {
            Toast.makeText(this, "See all People You May Know", Toast.LENGTH_SHORT).show()
        }
    }

    private fun setupWeatherDashboard() {
        // Add the weather fragment to the right drawer
        supportFragmentManager.beginTransaction()
            .replace(R.id.weatherDashboardContainer, WeatherFragment())
            .commit()

        // Show weather when clicking notification icon (as a demo)
        binding.notificationIcon.setOnClickListener {
            if (drawerLayout.isDrawerOpen(GravityCompat.END)) {
                drawerLayout.closeDrawer(GravityCompat.END)
            } else {
                drawerLayout.openDrawer(GravityCompat.END)
            }
        }
    }

    private fun replaceFragment(fragment: Fragment) {
        supportFragmentManager.beginTransaction()
            .replace(R.id.fragmentContainer, fragment)
            .commit()
    }

    override fun onBackPressed() {
        if (drawerLayout.isDrawerOpen(GravityCompat.START)) {
            drawerLayout.closeDrawer(GravityCompat.START)
        } else if (drawerLayout.isDrawerOpen(GravityCompat.END)) {
            drawerLayout.closeDrawer(GravityCompat.END)
        } else if (currentTabPosition != 0) {
            // Return to home tab
            binding.tabLayout.getTabAt(0)?.select()
        } else {
            super.onBackPressed()
        }
    }

    override fun onNavigationItemSelected(item: MenuItem): Boolean {
        // Handle navigation item selections
        when (item.itemId) {
            R.id.nav_profile -> {
                ProfileNavigationUtil.navigateToProfile(this)
            }
            R.id.nav_settings -> {
                Toast.makeText(this, "Settings", Toast.LENGTH_SHORT).show()
            }
            R.id.nav_help -> {
                Toast.makeText(this, "Help & Support", Toast.LENGTH_SHORT).show()
            }
            R.id.nav_logout -> {
                logoutUser()
            }
        }
        drawerLayout.closeDrawer(GravityCompat.START)
        return true
    }

    private fun logoutUser() {
        // Clear session and navigate to login screen
        sessionManager.clearSession()
        navigateToLogin()
    }

    private fun navigateToLogin() {
        val intent = Intent(this, LoginActivity::class.java)
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        startActivity(intent)
        finish()
    }
}