package com.example.commudev

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.widget.SearchView
import androidx.fragment.app.Fragment
import com.example.commudev.databinding.FragmentWeatherBinding

class WeatherFragment : Fragment() {

    private var _binding: FragmentWeatherBinding? = null
    private val binding get() = _binding!!

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
        setupFilters()
        loadWeatherData()
    }

    private fun setupSearchBar() {
        binding.searchBar.setOnQueryTextListener(object : SearchView.OnQueryTextListener {
            override fun onQueryTextSubmit(query: String?): Boolean {
                if (!query.isNullOrEmpty()) {
                    // Search for weather in the specified location
                    searchWeather(query)
                }
                return true
            }

            override fun onQueryTextChange(newText: String?): Boolean {
                // Optional: Implement autocomplete suggestions
                return true
            }
        })
    }

    private fun setupFilters() {
        binding.coldestFilterChip.setOnClickListener {
            // Toggle filter state
            binding.coldestFilterChip.isChecked = !binding.coldestFilterChip.isChecked
            applyFilters()
        }

        binding.temperatureRangeChip.setOnClickListener {
            // Toggle filter state
            binding.temperatureRangeChip.isChecked = !binding.temperatureRangeChip.isChecked
            applyFilters()
        }

        binding.rainyChip.setOnClickListener {
            // Toggle filter state
            binding.rainyChip.isChecked = !binding.rainyChip.isChecked
            applyFilters()
        }
    }

    private fun applyFilters() {
        // In a real app, you would filter weather data based on selected filters
        Toast.makeText(context, "Filters applied", Toast.LENGTH_SHORT).show()
        loadWeatherData() // Reload with filters
    }

    private fun searchWeather(location: String) {
        // In a real app, you would fetch weather data for the specified location
        Toast.makeText(context, "Searching weather for $location", Toast.LENGTH_SHORT).show()

        // Mock search result - replace with actual API call
        if (location.equals("cebu", ignoreCase = true)) {
            loadCebuWeather()
        } else if (location.equals("talisay", ignoreCase = true)) {
            loadTalisayWeather()
        } else {
            Toast.makeText(context, "Location not found", Toast.LENGTH_SHORT).show()
        }
    }

    private fun loadWeatherData() {
        // Load default weather locations
        loadTalisayWeather()
        loadCebuWeather()
    }

    private fun loadTalisayWeather() {
        val weather = WeatherData(
            location = "Talisay",
            temperature = 35,
            windSpeed = 11,
            time = "Tuesday : 19:52",
            condition = "Cloudy"
        )

        addWeatherCard(weather, binding.weatherContainer, 0)
    }

    private fun loadCebuWeather() {
        val weather = WeatherData(
            location = "Cebu",
            temperature = 35,
            windSpeed = 9,
            time = "Tuesday : 19:52",
            condition = "Sunny"
        )

        addWeatherCard(weather, binding.weatherContainer, 1)
    }

    private fun addWeatherCard(weather: WeatherData, container: ViewGroup, position: Int) {
        val weatherCardView = layoutInflater.inflate(R.layout.item_weather_card, container, false)

        // Set weather data to views
        weatherCardView.findViewById<TextView>(R.id.locationText).text = weather.location
        weatherCardView.findViewById<TextView>(R.id.temperatureText).text = "${weather.temperature}°C"
        weatherCardView.findViewById<TextView>(R.id.windSpeedText).text = "wind speed : ${weather.windSpeed} km"
        weatherCardView.findViewById<TextView>(R.id.timeText).text = weather.time
        weatherCardView.findViewById<TextView>(R.id.conditionText).text = weather.condition

        // Set weather icon based on condition
        val weatherIcon = weatherCardView.findViewById<ImageView>(R.id.weatherIcon)
        when (weather.condition.lowercase()) {
            "sunny" -> weatherIcon.setImageResource(R.drawable.ic_sunny)
            "cloudy" -> weatherIcon.setImageResource(R.drawable.ic_cloudy)
            "rainy" -> weatherIcon.setImageResource(R.drawable.ic_rainy)
            else -> weatherIcon.setImageResource(R.drawable.ic_sunny)
        }

        // If this is a new location, add to container. Otherwise, replace existing
        if (container.childCount > position) {
            container.removeViewAt(position)
            container.addView(weatherCardView, position)
        } else {
            container.addView(weatherCardView)
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}