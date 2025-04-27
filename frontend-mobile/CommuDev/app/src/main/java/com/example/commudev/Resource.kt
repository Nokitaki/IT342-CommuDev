package com.example.commudev

/**
 * Data class to represent a resource in the application
 */
data class Resource(
    val id: String,
    val title: String,
    val description: String,
    val type: String, // Document, Media, etc.
    val creator: String,
    val creatorId: String = "",
    val creatorImageUrl: String = "",
    val date: String,
    val timestamp: Long = 0,
    val tags: List<String> = emptyList(),
    val isActive: Boolean = true,
    val downloadCount: Int = 0,
    val sizeInBytes: Long = 0,
    val url: String = ""
)