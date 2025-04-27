package com.example.commudev.models

import java.util.UUID

// User data model
data class User(
    val id: String = UUID.randomUUID().toString(),
    val fullName: String = "",
    val username: String = "",
    val email: String = "",
    val profileImageUrl: String = "",
    val coverImageUrl: String = "",
    val country: String = "",
    val state: String = "",
    val age: Int = 0,
    val employment: String = "",
    val joinDate: Long = 0,
    val languages: List<Language> = emptyList(),
    val hobbies: List<String> = emptyList(),
    val goals: List<String> = emptyList(),
    val isOnline: Boolean = false
)

data class Language(
    val name: String,
    val proficiency: String
)

// Conversation data model
data class Conversation(
    val id: String = UUID.randomUUID().toString(),
    val userId: String = "",
    val userName: String = "",
    val lastMessage: String = "",
    val userImageUrl: String = "",
    val timestamp: Long = 0,
    val isOnline: Boolean = false,
    val unreadCount: Int = 0
)

// Message data model
data class Message(
    val id: String = UUID.randomUUID().toString(),
    val senderId: String = "",
    val receiverId: String = "",
    val text: String = "",
    val timestamp: Long = 0,
    val isRead: Boolean = false,
    val attachments: List<Attachment> = emptyList()
)

data class Attachment(
    val id: String = UUID.randomUUID().toString(),
    val type: String = "", // image, video, document, etc.
    val url: String = "",
    val name: String = "",
    val size: Long = 0
)

// Notification data model
data class Notification(
    val id: String = UUID.randomUUID().toString(),
    val title: String = "",
    val message: String = "",
    val time: String = "",
    val userImageUrl: String = "",
    val timestamp: Long = 0,
    val isRead: Boolean = false,
    val type: String = "", // like, comment, follow, etc.
    val targetId: String = "" // post id, comment id, etc.
)

// Resource data model
data class Resource(
    val id: String = UUID.randomUUID().toString(),
    val title: String = "",
    val description: String = "",
    val type: String = "",
    val creator: String = "",
    val creatorId: String = "",
    val creatorImageUrl: String = "",
    val date: String = "",
    val timestamp: Long = 0,
    val tags: List<String> = emptyList(),
    val isActive: Boolean = true,
    val downloadCount: Int = 0,
    val sizeInBytes: Long = 0,
    val url: String = ""
)

// Post data model
data class Post(
    val id: String = UUID.randomUUID().toString(),
    val userId: String = "",
    val userName: String = "",
    val userImageUrl: String = "",
    val content: String = "",
    val timestamp: Long = 0,
    val images: List<String> = emptyList(),
    val videoUrl: String = "",
    val likeCount: Int = 0,
    val commentCount: Int = 0,
    val shareCount: Int = 0,
    val isLiked: Boolean = false,
    val comments: List<Comment> = emptyList(),
    val feeling: String = "",
    val activity: String = "",
    val location: String = ""
)

data class Comment(
    val id: String = UUID.randomUUID().toString(),
    val userId: String = "",
    val userName: String = "",
    val userImageUrl: String = "",
    val content: String = "",
    val timestamp: Long = 0,
    val likeCount: Int = 0,
    val isLiked: Boolean = false
)

// Task data model
data class Task(
    val id: String = UUID.randomUUID().toString(),
    val title: String = "",
    val description: String = "",
    val dueDate: Long = 0,
    val priority: String = "",
    val status: String = "",
    val assigneeId: String = "",
    val assigneeName: String = "",
    val creatorId: String = "",
    val creatorName: String = "",
    val projectId: String = "",
    val projectName: String = "",
    val tags: List<String> = emptyList()
)

// Reward data model
data class Reward(
    val id: String = UUID.randomUUID().toString(),
    val title: String = "",
    val description: String = "",
    val points: Int = 0,
    val imageUrl: String = "",
    val isRedeemed: Boolean = false,
    val expiryDate: Long = 0,
    val code: String = ""
)

// Feedback data model
data class Feedback(
    val id: String = UUID.randomUUID().toString(),
    val userId: String = "",
    val userName: String = "",
    val userImageUrl: String = "",
    val content: String = "",
    val rating: Int = 0,
    val timestamp: Long = 0,
    val category: String = "",
    val status: String = "",
    val response: String = ""
)

// Calendar Event data model
data class CalendarEvent(
    val id: String = UUID.randomUUID().toString(),
    val title: String = "",
    val description: String = "",
    val startTime: Long = 0,
    val endTime: Long = 0,
    val location: String = "",
    val organizerId: String = "",
    val organizerName: String = "",
    val participants: List<String> = emptyList(),
    val color: String = "",
    val isAllDay: Boolean = false,
    val isRecurring: Boolean = false,
    val recurrencePattern: String = ""
)