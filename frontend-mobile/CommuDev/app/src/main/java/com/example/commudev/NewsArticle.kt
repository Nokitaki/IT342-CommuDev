package com.example.commudev.models

import java.util.Date

data class NewsArticle(
    val id: String,
    val title: String,
    val summary: String,
    val content: String,
    val imageUrl: String = "",
    val author: String = "",
    val publishDate: Date? = null,
    val source: String = "",
    val url: String = "",
    val isBookmarked: Boolean = false,
    val categories: List<String> = emptyList()
)