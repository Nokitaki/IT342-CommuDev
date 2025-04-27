package com.example.commudev.models

/**
 * Data class to represent weather information for a location
 */
data class WeatherData(
    val location: String,
    val temperature: Int,
    val condition: String,
    val humidity: Int,
    val windSpeed: Int,
    val feelsLike: Int,
    val icon: Int, // Drawable resource ID
    val lastUpdated: String
)