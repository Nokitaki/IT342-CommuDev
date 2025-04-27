package com.example.commudev.models

import com.google.gson.annotations.SerializedName
import java.time.LocalDateTime

// Auth Request Models
data class LoginRequest(
    val email: String,
    val password: String
)

data class RegisterRequest(
    val email: String,
    val password: String,
    val username: String
)

data class VerifyRequest(
    val email: String,
    val verificationCode: String
)

// Auth Response Models
data class LoginResponse(
    val token: String,
    val expiresIn: Long
)

data class RegisterResponse(
    val message: String,
    val email: String,
    val username: String
)

data class MessageResponse(
    val message: String
)

// User Profile Models
data class UserDto(
    val id: Long,
    val username: String,
    val email: String?,
    val firstname: String?,
    val lastname: String?,
    val dateOfBirth: String?,
    val age: Int?,
    val country: String?,
    val employmentStatus: String?,
    val profilePicture: String?,
    val biography: String?,
    val enabled: Boolean,
    val roles: List<String>?,
    val createdAt: String?,
    val profileVisibility: String?,
    val coverPhoto: String?
)

data class UserProfileResponse(
    val id: Long,
    val username: String,
    val email: String,
    val firstname: String?,
    val lastname: String?,
    val dateOfBirth: String?,
    val age: Int?,
    val country: String?,
    val employmentStatus: String?,
    val profilePicture: String?,
    val biography: String?,
    val enabled: Boolean,
    val roles: List<String>,
    val createdAt: String,
    val profileVisibility: String,
    val coverPhoto: String?
)

data class PublicProfileResponse(
    val username: String,
    val firstname: String?,
    val lastname: String?,
    val profilePicture: String?,
    val biography: String?,
    val country: String?,
    val profileVisibility: String,
    val coverPhoto: String?
)

data class ProfileUpdateRequest(
    val firstname: String?,
    val lastname: String?,
    val dateOfBirth: String?,
    val age: Int?,
    val country: String?,
    val employmentStatus: String?,
    val biography: String?,
    val profileVisibility: String?
)

// Post Models
data class Post(
    val newsfeedId: Int,
    val postDescription: String,
    val postType: String,
    val postDate: String,
    val likeCount: Int,
    val postStatus: String,
    val user: UserDto
)

data class NewsfeedRequestDTO(
    @SerializedName("post_description") val post_description: String,
    @SerializedName("post_type") val post_type: String,
    @SerializedName("post_status") val post_status: String = "active"
)

data class LikeResponse(
    val post: Post,
    val liked: Boolean,
    val likeCount: Int
)

data class LikeStatusResponse(
    val liked: Boolean,
    val likeCount: Int
)

// Comment Models
data class Comment(
    val commentId: Long,
    val commentText: String,
    val createdAt: String,
    val user: UserDto,
    val post: Post
)

data class CommentRequestDTO(
    val commentText: String,
    val postId: Int
)

// Notification Models
data class Notification(
    val notificationId: Long,
    val notificationType: String,
    val notificationText: String,
    val isRead: Boolean,
    val createdAt: String,
    val user: UserDto,
    val actor: UserDto,
    val relatedPostId: Int?,
    val relatedCommentId: Long?
)

// Resource Models
data class Resource(
    val resourceId: Int,
    val resourceTitle: String,
    val resourceDescription: String,
    val uploadDate: String,
    val resourceCategory: String,
    val heartCount: Int,
    val creator: String
)

data class ResourcehubRequestDTO(
    val resourceTitle: String,
    val resourceDescription: String,
    val resourceCategory: String,
    val creator: String
)