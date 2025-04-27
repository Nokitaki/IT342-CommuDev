package com.example.commudev.util

import android.content.Context
import android.content.Intent
import android.view.View
import android.widget.ImageView
import com.example.commudev.ProfileActivity
import com.google.android.material.card.MaterialCardView

/**
 * Utility class to handle profile navigation across the app
 */
object ProfileNavigationUtil {

    /**
     * Sets up an ImageView to navigate to the profile screen when clicked
     */
    fun setupProfileImageNavigation(imageView: ImageView, context: Context) {
        imageView.setOnClickListener {
            navigateToProfile(context)
        }
    }

    /**
     * Sets up a MaterialCardView containing a profile image to navigate to the profile screen when clicked
     */
    fun setupProfileCardNavigation(cardView: MaterialCardView, context: Context) {
        cardView.setOnClickListener {
            navigateToProfile(context)
        }
    }

    /**
     * Navigates to the profile activity
     */
    fun navigateToProfile(context: Context) {
        val intent = Intent(context, ProfileActivity::class.java)
        context.startActivity(intent)
    }
}