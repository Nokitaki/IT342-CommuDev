package com.example.commudev.api

import com.example.commudev.models.*
import retrofit2.Call
import retrofit2.http.*

/**
 * Retrofit API interface containing all the API endpoints
 */
interface ApiService {

    // Authentication
    @POST("auth/login")
    fun login(@Body request: LoginRequest): Call<LoginResponse>

    @POST("auth/signup")
    fun register(@Body request: RegisterRequest): Call<RegisterResponse>

    @POST("auth/verify")
    fun verifyAccount(@Body request: VerifyRequest): Call<MessageResponse>

    @POST("auth/resend")
    fun resendVerificationCode(@Query("email") email: String): Call<MessageResponse>

    // User management
    @GET("users/me")
    fun getCurrentUserProfile(): Call<UserProfileResponse>

    @GET("users/all")
    fun getAllUsers(): Call<List<UserDto>>

    @GET("users/{userId}")
    fun getUserById(@Path("userId") userId: Long): Call<UserDto>

    @GET("users/profiles/{username}")
    fun getUserProfile(@Path("username") username: String): Call<UserDto>

    @PUT("users/me")
    fun updateUserProfile(@Body userProfile: UserProfileUpdateDto): Call<UserDto>

    // Newsfeed posts
    @GET("api/newsfeed/all")
    fun getAllPosts(): Call<List<Post>>

    @GET("api/newsfeed/my-posts")
    fun getCurrentUserPosts(): Call<List<Post>>

    @GET("api/newsfeed/{id}")
    fun getPostById(@Path("id") postId: Int): Call<Post>

    @GET("api/newsfeed/user/{username}")
    fun getUserPosts(@Path("username") username: String): Call<List<Post>>

    @POST("api/newsfeed/create")
    fun createPost(@Body request: NewsfeedRequestDTO): Call<Post>

    @PUT("api/newsfeed/update/{id}")
    fun updatePost(@Path("id") postId: Int, @Body post: Post): Call<Post>

    @DELETE("api/newsfeed/delete/{id}")
    fun deletePost(@Path("id") postId: Int): Call<MessageResponse>

    @PATCH("api/newsfeed/like/{id}")
    fun toggleLikePost(@Path("id") postId: Int): Call<LikeResponse>

    @GET("api/newsfeed/like-status/{id}")
    fun getLikeStatus(@Path("id") postId: Int): Call<Map<String, Any>>

    // Comments
    @GET("api/comments/post/{postId}")
    fun getCommentsByPostId(@Path("postId") postId: Int): Call<List<Comment>>

    @POST("api/comments")
    fun createComment(@Body request: CommentRequestDTO): Call<Comment>

    @PUT("api/comments/{commentId}")
    fun updateComment(@Path("commentId") commentId: Long, @Body request: Map<String, String>): Call<Comment>

    @DELETE("api/comments/{commentId}")
    fun deleteComment(@Path("commentId") commentId: Long): Call<MessageResponse>

    @GET("api/comments/count/{postId}")
    fun getCommentCount(@Path("postId") postId: Int): Call<Map<String, Long>>

    // Resources
    @GET("api/resourcehub/all")
    fun getAllResources(): Call<List<Resource>>

    @GET("api/resourcehub/{id}")
    fun getResourceById(@Path("id") resourceId: Int): Call<Resource>

    @GET("api/resourcehub/category/{category}")
    fun getResourcesByCategory(@Path("category") category: String): Call<List<Resource>>

    @POST("api/resourcehub/create")
    fun createResource(@Body request: ResourcehubRequestDTO): Call<Resource>

    @PUT("api/resourcehub/update/{id}")
    fun updateResource(@Path("id") resourceId: Int, @Body resource: Resource): Call<Resource>

    @DELETE("api/resourcehub/delete/{id}")
    fun deleteResource(@Path("id") resourceId: Int): Call<String>
}