package com.example.commudev.adapters

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.ImageButton
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.example.commudev.R
import com.example.commudev.models.Post
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.concurrent.TimeUnit

class PostsAdapter(
    private var posts: List<Post>,
    private val currentUserId: String
) : RecyclerView.Adapter<PostsAdapter.ViewHolder>() {

    interface OnPostInteractionListener {
        fun onLikeClick(post: Post)
        fun onCommentClick(post: Post)
        fun onShareClick(post: Post)
        fun onProfileImageClick(post: Post)
    }

    private var listener: OnPostInteractionListener? = null

    fun setOnPostInteractionListener(listener: OnPostInteractionListener) {
        this.listener = listener
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_post, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val post = posts[position]
        holder.bind(post)
    }

    override fun getItemCount() = posts.size

    inner class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val userProfileImage: ImageView = itemView.findViewById(R.id.userProfileImage)
        private val userNameText: TextView = itemView.findViewById(R.id.userNameText)
        private val timeAgoText: TextView = itemView.findViewById(R.id.timeAgoText)
        private val userStatusText: TextView = itemView.findViewById(R.id.userStatusText)
        private val postTypeText: TextView = itemView.findViewById(R.id.postTypeText)
        private val postContentText: TextView = itemView.findViewById(R.id.postContentText)
        private val postImageView: ImageView = itemView.findViewById(R.id.postImageView)
        private val likesCountText: TextView = itemView.findViewById(R.id.likesCountText)
        private val commentsCountText: TextView = itemView.findViewById(R.id.commentsCountText)
        private val likeButton: Button = itemView.findViewById(R.id.likeButton)
        private val commentButton: Button = itemView.findViewById(R.id.commentButton)
        private val shareButton: Button = itemView.findViewById(R.id.shareButton)
        private val postOptionsButton: ImageButton = itemView.findViewById(R.id.postOptionsButton)

        fun bind(post: Post) {
            // Set user profile image - Use Glide to load image from URL if available
            if (!post.user.profilePicture.isNullOrEmpty()) {
                // Assuming the profile picture URL is a relative path
                val baseUrl = "http://10.0.2.2:8080" // Change to your backend URL
                val imageUrl = baseUrl + post.user.profilePicture

                Glide.with(itemView.context)
                    .load(imageUrl)
                    .placeholder(R.drawable.profile_placeholder)
                    .error(R.drawable.profile_placeholder)
                    .circleCrop()
                    .into(userProfileImage)
            } else {
                userProfileImage.setImageResource(R.drawable.profile_placeholder)
            }

            // Add click listener to profile image
            userProfileImage.setOnClickListener {
                listener?.onProfileImageClick(post)
            }

            // Set user name and post metadata
            userNameText.text = if (!post.user.firstname.isNullOrEmpty() && !post.user.lastname.isNullOrEmpty()) {
                "${post.user.firstname} ${post.user.lastname}"
            } else {
                post.user.username
            }

            timeAgoText.text = getTimeAgo(post.postDate)
            postTypeText.text = post.postType

            // Set user status - This is a placeholder, the backend might not provide this
            userStatusText.visibility = View.GONE

            // Set post content
            postContentText.text = post.postDescription

            // Set post image if available - Backend API doesn't seem to provide post images
            postImageView.visibility = View.GONE

            // Set engagement stats
            likesCountText.text = "${post.likeCount} Likes"
            // We need to get comment count from a separate API call, or it could be included in the post object
            // For now, just show 0 comments
            commentsCountText.text = "0 Comments"

            // Set like button state based on user's like status - this info should come from the backend
            // For now, we don't have that info so we'll just use default state
            likeButton.setCompoundDrawablesWithIntrinsicBounds(R.drawable.ic_like, 0, 0, 0)
            likeButton.setTextColor(itemView.context.getColor(R.color.dark_gray))

            // Set button click listeners
            likeButton.setOnClickListener {
                listener?.onLikeClick(post)
            }

            commentButton.setOnClickListener {
                listener?.onCommentClick(post)
            }

            shareButton.setOnClickListener {
                listener?.onShareClick(post)
            }

            // Show edit/delete options for own posts
            if (post.user.id.toString() == currentUserId) {
                postOptionsButton.visibility = View.VISIBLE
                postOptionsButton.setOnClickListener {
                    showPostOptions(post)
                }
            } else {
                postOptionsButton.visibility = View.GONE
            }
        }

        private fun showPostOptions(post: Post) {
            // Create a popup menu with edit and delete options
            val popup = android.widget.PopupMenu(itemView.context, postOptionsButton)

            // Inflate menu resource - you need to create this resource file
            // at res/menu/menu_post_options.xml
            popup.menuInflater.inflate(R.menu.menu_post_options, popup.menu)

            popup.setOnMenuItemClickListener { menuItem ->
                when (menuItem.itemId) {
                    R.id.action_edit -> {
                        // Open edit post dialog - Implement this functionality
                        true
                    }
                    R.id.action_delete -> {
                        // Show delete confirmation dialog - Implement this functionality
                        true
                    }
                    else -> false
                }
            }
            popup.show()
        }
    }

    private fun getTimeAgo(dateString: String): String {
        try {
            // Parse the date from the API
            val dateFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS", Locale.getDefault())
            val date = dateFormat.parse(dateString)

            val now = System.currentTimeMillis()
            val diff = now - (date?.time ?: now)

            return when {
                diff < TimeUnit.MINUTES.toMillis(1) -> "Just now"
                diff < TimeUnit.HOURS.toMillis(1) -> "${TimeUnit.MILLISECONDS.toMinutes(diff)} minutes ago"
                diff < TimeUnit.DAYS.toMillis(1) -> "${TimeUnit.MILLISECONDS.toHours(diff)} hours ago"
                diff < TimeUnit.DAYS.toMillis(7) -> "${TimeUnit.MILLISECONDS.toDays(diff)} days ago"
                else -> {
                    val displayFormat = SimpleDateFormat("MMM dd, yyyy", Locale.getDefault())
                    displayFormat.format(date ?: Date())
                }
            }
        } catch (e: Exception) {
            return "Unknown date"
        }
    }
}