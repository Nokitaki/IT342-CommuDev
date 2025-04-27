package com.example.commudev.adapters

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.commudev.R
import com.example.commudev.models.Conversation
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.concurrent.TimeUnit

class ConversationsAdapter(
    private var conversations: List<Conversation>
) : RecyclerView.Adapter<ConversationsAdapter.ViewHolder>() {

    interface OnConversationClickListener {
        fun onConversationClick(conversation: Conversation)
        fun onProfileImageClick(conversation: Conversation)
    }

    private var listener: OnConversationClickListener? = null

    fun setOnConversationClickListener(listener: OnConversationClickListener) {
        this.listener = listener
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_conversation_preview, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val conversation = conversations[position]
        holder.bind(conversation)
    }

    override fun getItemCount() = conversations.size

    inner class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val userImageView: ImageView = itemView.findViewById(R.id.userImageView)
        private val onlineIndicator: View = itemView.findViewById(R.id.onlineIndicator)
        private val userNameText: TextView = itemView.findViewById(R.id.userNameText)
        private val lastMessageText: TextView = itemView.findViewById(R.id.lastMessageText)
        private val timestampText: TextView = itemView.findViewById(R.id.timestampText)
        private val userImageCard: View? = itemView.findViewById(R.id.userImageCard)

        init {
            itemView.setOnClickListener {
                val position = adapterPosition
                if (position != RecyclerView.NO_POSITION) {
                    listener?.onConversationClick(conversations[position])
                }
            }

            userImageView.setOnClickListener {
                val position = adapterPosition
                if (position != RecyclerView.NO_POSITION) {
                    listener?.onProfileImageClick(conversations[position])
                }
            }

            userImageCard?.setOnClickListener {
                val position = adapterPosition
                if (position != RecyclerView.NO_POSITION) {
                    listener?.onProfileImageClick(conversations[position])
                }
            }
        }

        fun bind(conversation: Conversation) {
            // Set user profile image
            // In real app, use Glide or similar to load image
            userImageView.setImageResource(R.drawable.profile_placeholder)

            // Show/hide online indicator
            onlineIndicator.visibility = if (conversation.isOnline) View.VISIBLE else View.GONE

            // Set user name
            userNameText.text = conversation.userName

            // Set last message
            lastMessageText.text = conversation.lastMessage

            // Format timestamp
            timestampText.text = getFormattedTimestamp(conversation.timestamp)
        }

        private fun getFormattedTimestamp(timestamp: Long): String {
            val now = System.currentTimeMillis()
            val diff = now - timestamp

            return when {
                diff < TimeUnit.MINUTES.toMillis(1) -> "Just now"
                diff < TimeUnit.HOURS.toMillis(1) -> "${TimeUnit.MILLISECONDS.toMinutes(diff)} min ago"
                diff < TimeUnit.DAYS.toMillis(1) -> {
                    val sdf = SimpleDateFormat("h:mm a", Locale.getDefault())
                    sdf.format(Date(timestamp))
                }
                diff < TimeUnit.DAYS.toMillis(7) -> {
                    val sdf = SimpleDateFormat("EEE", Locale.getDefault())
                    sdf.format(Date(timestamp))
                }
                else -> {
                    val sdf = SimpleDateFormat("MMM d", Locale.getDefault())
                    sdf.format(Date(timestamp))
                }
            }
        }
    }
}