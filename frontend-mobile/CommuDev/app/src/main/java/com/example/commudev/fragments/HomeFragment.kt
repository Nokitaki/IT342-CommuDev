package com.example.commudev.fragments

import com.example.commudev.api.RetrofitClient
import com.example.commudev.models.Comment
import com.example.commudev.models.CommentRequestDTO
import com.example.commudev.models.LikeResponse
import com.example.commudev.models.NewsfeedRequestDTO
import com.example.commudev.models.Post
import com.example.commudev.util.ProfileNavigationUtil
import com.example.commudev.util.SessionManager
import android.app.AlertDialog
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.EditText
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout
import com.example.commudev.R
import com.example.commudev.adapters.PostsAdapter
import com.example.commudev.databinding.FragmentHomeBinding
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class HomeFragment : Fragment() {

    private var _binding: FragmentHomeBinding? = null
    private val binding get() = _binding!!

    private lateinit var postsAdapter: PostsAdapter
    private val posts = mutableListOf<Post>()
    private lateinit var sessionManager: SessionManager
    private lateinit var swipeRefreshLayout: SwipeRefreshLayout

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentHomeBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        sessionManager = SessionManager(requireContext())

        // Setup swipe refresh
        swipeRefreshLayout = view.findViewById(R.id.swipeRefreshLayout)
        swipeRefreshLayout.setOnRefreshListener {
            loadPosts()
        }

        // Setup profile navigation from user profile image
        binding.userProfileImage?.let {
            ProfileNavigationUtil.setupProfileImageNavigation(it, requireContext())
        }

        setupCreatePostSection()
        setupPostsRecyclerView()
        loadPosts()
    }

    private fun setupCreatePostSection() {
        // Handle post creation
        binding.createPostInput.setOnClickListener {
            showCreatePostDialog()
        }
    }

    private fun showCreatePostDialog() {
        val dialogView = layoutInflater.inflate(R.layout.dialog_create_post, null)
        val postContentInput = dialogView.findViewById<EditText>(R.id.postContentInput)
        val postTypeSpinner = dialogView.findViewById<androidx.appcompat.widget.AppCompatSpinner>(R.id.postTypeSpinner)

        // Setup post types spinner
        val postTypes = arrayOf("General", "Announcement", "Event", "Question", "Discussion", "Resource")
        val adapter = ArrayAdapter(requireContext(), android.R.layout.simple_spinner_item, postTypes)
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        postTypeSpinner.adapter = adapter

        val dialog = AlertDialog.Builder(requireContext())
            .setTitle("Create New Post")
            .setView(dialogView)
            .setPositiveButton("Post") { _, _ ->
                val content = postContentInput.text.toString()
                val postType = postTypeSpinner.selectedItem.toString()

                if (content.isNotEmpty()) {
                    createPost(content, postType)
                } else {
                    Toast.makeText(context, "Post content cannot be empty", Toast.LENGTH_SHORT).show()
                }
            }
            .setNegativeButton("Cancel", null)
            .create()

        dialog.show()
    }

    private fun createPost(content: String, postType: String) {
        val apiService = RetrofitClient.getApiService(requireContext())
        val postRequest = NewsfeedRequestDTO(
            post_description = content,
            post_type = postType
        )

        apiService.createPost(postRequest).enqueue(object : Callback<Post> {
            override fun onResponse(call: Call<Post>, response: Response<Post>) {
                if (response.isSuccessful) {
                    Toast.makeText(context, "Post created successfully", Toast.LENGTH_SHORT).show()
                    loadPosts() // Reload posts to show the new one
                } else {
                    Toast.makeText(
                        context,
                        "Failed to create post: ${response.message()}",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }

            override fun onFailure(call: Call<Post>, t: Throwable) {
                Toast.makeText(
                    context,
                    "Network error: ${t.message}",
                    Toast.LENGTH_SHORT
                ).show()
            }
        })
    }

    private fun setupPostsRecyclerView() {
        binding.postsRecyclerView.layoutManager = LinearLayoutManager(context)
        postsAdapter = PostsAdapter(posts, sessionManager.getUserId().toString())
        binding.postsRecyclerView.adapter = postsAdapter

        // Set up interaction listener
        postsAdapter.setOnPostInteractionListener(object : PostsAdapter.OnPostInteractionListener {
            override fun onLikeClick(post: Post) {
                toggleLikePost(post)
            }

            override fun onCommentClick(post: Post) {
                showCommentDialog(post)
            }

            override fun onShareClick(post: Post) {
                sharePost(post)
            }

            override fun onProfileImageClick(post: Post) {
                if (context != null) {
                    ProfileNavigationUtil.navigateToProfile(requireContext())
                }
            }
        })
    }

    private fun loadPosts() {
        val apiService = RetrofitClient.getApiService(requireContext())

        apiService.getAllPosts().enqueue(object : Callback<List<Post>> {
            override fun onResponse(call: Call<List<Post>>, response: Response<List<Post>>) {
                swipeRefreshLayout.isRefreshing = false

                if (response.isSuccessful) {
                    posts.clear()
                    response.body()?.let { newPosts ->
                        posts.addAll(newPosts)
                        postsAdapter.notifyDataSetChanged()
                    }
                } else {
                    Toast.makeText(
                        context,
                        "Failed to load posts: ${response.message()}",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }

            override fun onFailure(call: Call<List<Post>>, t: Throwable) {
                swipeRefreshLayout.isRefreshing = false
                Toast.makeText(
                    context,
                    "Network error: ${t.message}",
                    Toast.LENGTH_SHORT
                ).show()
            }
        })
    }

    private fun toggleLikePost(post: Post) {
        val apiService = RetrofitClient.getApiService(requireContext())

        apiService.toggleLikePost(post.newsfeedId).enqueue(object : Callback<LikeResponse> {
            override fun onResponse(call: Call<LikeResponse>, response: Response<LikeResponse>) {
                if (response.isSuccessful) {
                    response.body()?.let { likeResponse ->
                        // Update post in the list
                        val index = posts.indexOfFirst { it.newsfeedId == post.newsfeedId }
                        if (index != -1) {
                            posts[index] = likeResponse.post
                            postsAdapter.notifyItemChanged(index)
                        }
                    }
                } else {
                    Toast.makeText(
                        context,
                        "Failed to like post: ${response.message()}",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }

            override fun onFailure(call: Call<LikeResponse>, t: Throwable) {
                Toast.makeText(
                    context,
                    "Network error: ${t.message}",
                    Toast.LENGTH_SHORT
                ).show()
            }
        })
    }

    private fun showCommentDialog(post: Post) {
        val dialogView = layoutInflater.inflate(R.layout.dialog_add_comment, null)
        val commentInput = dialogView.findViewById<EditText>(R.id.commentInput)

        val dialog = AlertDialog.Builder(requireContext())
            .setTitle("Add Comment")
            .setView(dialogView)
            .setPositiveButton("Post") { _, _ ->
                val commentText = commentInput.text.toString()
                if (commentText.isNotEmpty()) {
                    addComment(post, commentText)
                }
            }
            .setNegativeButton("Cancel", null)
            .create()

        dialog.show()
    }

    private fun addComment(post: Post, commentText: String) {
        val apiService = RetrofitClient.getApiService(requireContext())
        val commentRequest = CommentRequestDTO(commentText, post.newsfeedId)

        apiService.createComment(commentRequest).enqueue(object : Callback<Comment> {
            override fun onResponse(call: Call<Comment>, response: Response<Comment>) {
                if (response.isSuccessful) {
                    Toast.makeText(context, "Comment added", Toast.LENGTH_SHORT).show()
                    // Reload posts to refresh comment count
                    loadPosts()
                } else {
                    Toast.makeText(
                        context,
                        "Failed to add comment: ${response.message()}",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }

            override fun onFailure(call: Call<Comment>, t: Throwable) {
                Toast.makeText(
                    context,
                    "Network error: ${t.message}",
                    Toast.LENGTH_SHORT
                ).show()
            }
        })
    }

    private fun sharePost(post: Post) {
        // In a real app, implement sharing functionality
        Toast.makeText(context, "Sharing post: ${post.newsfeedId}", Toast.LENGTH_SHORT).show()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}