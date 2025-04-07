package com.example.commudev

import java.util.UUID

// User data model
data class User(
    val id: String = "",
    val fullName: String = "",
    val username: String = "",
    val email: String = "",
    val profileImageUrl: String = "",
    val country: String = "",
    val age: Int = 0,
    val employment: String = "",
    val joinDate: Long = 0,
    val languages: List<Language> = emptyList(),
    val hobbies: List<String> = emptyList(),
    val goals: List<String> = emptyList()
)

data class Language(
    val name: String,
    val proficiency: String
)

// Conversation data model
data class Conversation(
    val userId: String = "",
    val userName: String = "",
    val lastMessage: String = "",
    val userImageUrl: String = "",
    val timestamp: Long = 0
)

// Message data model
data class Message(
    val id: String = "",
    val senderId: String = "",
    val receiverId: String = "",
    val text: String = "",
    val timestamp: Long = 0
)

// Notification data model
data class Notification(
    val title: String = "",
    val message: String = "",
    val time: String = "",
    val userImageUrl: String = ""
)

// Resource data model
data class Resource(
    val id: String = "",
    val title: String = "",
    val description: String = "",
    val type: String = "",
    val creator: String = "",
    val date: String = "",
    val tags: List<String> = emptyList(),
    val isActive: Boolean = true
)

// Weather data model
data class WeatherData(
    val location: String = "",
    val temperature: Int = 0,
    val windSpeed: Int = 0,
    val time: String = "",
    val condition: String = ""
)