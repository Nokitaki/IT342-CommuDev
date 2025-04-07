package com.example.commudev

import android.content.Intent
import android.os.Bundle
import androidx.fragment.app.FragmentActivity
import com.example.commudev.databinding.ActivityMainBinding

class MainActivity : FragmentActivity() {

    private lateinit var binding: ActivityMainBinding
    private lateinit var authManager: AuthManager

    private var currentFragmentTag: String = "HOME_FRAGMENT"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        authManager = AuthManager(this)

        // Check if user is logged in
        if (!authManager.isUserLoggedIn()) {
            navigateToLogin()
            return
        }

        setupNavigation()

        // Start with home fragment
        replaceFragment(HomeFragment(), "HOME_FRAGMENT")
    }

    private fun setupNavigation() {
        // Set up profile navigation
        binding.profileCard.setOnClickListener {
            val intent = Intent(this, ProfileActivity::class.java)
            startActivity(intent)
        }

        binding.userProfileIcon.setOnClickListener {
            val intent = Intent(this, ProfileActivity::class.java)
            startActivity(intent)
        }

        // Set up main navigation
        binding.homeButton.setOnClickListener {
            if (currentFragmentTag != "HOME_FRAGMENT") {
                replaceFragment(HomeFragment(), "HOME_FRAGMENT")
            }
        }

        binding.chatButton.setOnClickListener {
            if (currentFragmentTag != "CHAT_FRAGMENT") {
                replaceFragment(ChatFragment(), "CHAT_FRAGMENT")
            }
        }

        binding.resourcesButton.setOnClickListener {
            if (currentFragmentTag != "RESOURCES_FRAGMENT") {
                replaceFragment(ResourcesFragment(), "RESOURCES_FRAGMENT")
            }
        }

        binding.weatherButton.setOnClickListener {
            if (currentFragmentTag != "WEATHER_FRAGMENT") {
                replaceFragment(WeatherFragment(), "WEATHER_FRAGMENT")
            }
        }

        binding.newsButton.setOnClickListener {
            if (currentFragmentTag != "NEWS_FRAGMENT") {
                replaceFragment(NewsFragment(), "NEWS_FRAGMENT")
            }
        }
    }

    private fun replaceFragment(fragment: androidx.fragment.app.Fragment, tag: String) {
        currentFragmentTag = tag

        supportFragmentManager.beginTransaction()
            .replace(R.id.fragmentContainer, fragment, tag)
            .commit()
    }

    private fun navigateToLogin() {
        startActivity(Intent(this, LoginActivity::class.java))
        finish()
    }
}