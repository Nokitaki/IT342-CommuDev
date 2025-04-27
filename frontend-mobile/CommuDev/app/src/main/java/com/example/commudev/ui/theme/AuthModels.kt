package com.example.commudev.models

// Login Request
data class LoginRequest(
    val email: String,
    val password: String
)

// Login Response
data class LoginResponse(
    val token: String,
    val expiresIn: Long
)

// Register Request
data class RegisterRequest(
    val email: String,
    val password: String,
    val username: String
)

// Register Response
data class RegisterResponse(
    val message: String,
    val email: String,
    val username: String
)

// Verification Request
data class VerifyRequest(
    val email: String,
    val verificationCode: String
)

// General Message Response
data class MessageResponse(
    val message: String
)

// User Profile Response
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
    val biography: String?,
    val profilePicture: String?,
    val coverPhoto: String?,
    val enabled: Boolean,
    val roles: List<String>,
    val createdAt: String,
    val profileVisibility: String
)

// User DTO
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

// User Profile Update DTO
data class UserProfileUpdateDto(
    val firstname: String?,
    val lastname: String?,
    val dateOfBirth: String?,
    val age: Int?,
    val country: String?,
    val employmentStatus: String?,
    val biography: String?,
    val profileVisibility: String?
)