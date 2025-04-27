package com.example.commudev.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.appcompat.widget.SearchView
import androidx.fragment.app.Fragment
import com.example.commudev.R
import com.example.commudev.databinding.FragmentWeatherBinding
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class WeatherFragment : Fragment() {

    private var _binding: FragmentWeatherBinding? = null
    private val binding get() = _binding!!

    // Sample weather data
    private val manilaWeather = WeatherData(
        location = "Manila, Philippines",
        temperature = 30,
        condition = "Few Clouds",
        humidity = 69,
        windSpeed = 11,
        feelsLike = 35,
        icon = R.drawable.ic_few_clouds,
        lastUpdated = "10:11 PM"
    )

    private val cebuWeather = WeatherData(
        location = "Cebu, Philippines",
        temperature = 32,
        condition = "Sunny",
        humidity = 65,
        windSpeed = 8,
        feelsLike = 36,
        icon = R.drawable.ic_sunny,
        lastUpdated = "10:05 PM"
    )

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentWeatherBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        setupSearchBar()
        displayWeatherData(manilaWeather) // Default to Manila
    }

    private fun setupSearchBar() {
        binding.searchBar.setOnQueryTextListener(object : SearchView.OnQueryTextListener {
            override fun onQueryTextSubmit(query: String?): Boolean {
                if (!query.isNullOrEmpty()) {
                    searchLocation(query)
                }
                return true
            }

            override fun onQueryTextChange(newText: String?): Boolean {
                // Could implement suggestions here
                return true
            }
        })
    }

    private fun searchLocation(query: String) {
        // In a real app, this would call an API
        when (query.lowercase()) {
            "manila" -> displayWeatherData(manilaWeather)
            "cebu" -> displayWeatherData(cebuWeather)
            else -> {
                Toast.makeText(
                    context,
                    "Weather data not available for $query",
                    Toast.LENGTH_SHORT
                ).show()
            }
        }
    }

    private fun displayWeatherData(weatherData: WeatherData) {
        // Header
        binding.locationText.text = weatherData.location.split(",")[0]

        // Main weather info
        binding.temperatureValue.text = "${weatherData.temperature}°C"
        binding.conditionText.text = weatherData.condition
        binding.weatherIcon.setImageResource(weatherData.icon)

        // Weather details
        binding.humidityValue.text = "${weatherData.humidity}%"
        binding.windValue.text = "${weatherData.windSpeed} km/h"
        binding.feelsLikeValue.text = "${weatherData.feelsLike}°C"

        // Last updated
        binding.updatedTimeText.text = "Updated: ${weatherData.lastUpdated}"
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}