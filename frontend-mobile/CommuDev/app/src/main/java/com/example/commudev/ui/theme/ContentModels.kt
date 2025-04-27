package com.example.commudev.models

// Comment Request DTO
data class CommentRequestDTO(
    val commentText: String,
    val postId: Int
)

// Newsfeed Request DTO
data class NewsfeedRequestDTO(
    val post_description: String,
    val post_type: String,
    val post_status: String = "active"
)

// Like Response
data class LikeResponse(
    val post: Post,
    val liked: Boolean,
    val likeCount: Int
)

// Resource Request DTO
data class ResourcehubRequestDTO(
    val resourceTitle: String,
    val resourceDescription: String,
    val resourceCategory: String,
    val creator: String
)
