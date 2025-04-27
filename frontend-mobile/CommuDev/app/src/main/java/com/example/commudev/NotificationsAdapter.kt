package com.example.commudev.adapters

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.commudev.R
import com.example.commudev.models.Notification
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.concurrent.TimeUnit

class NotificationsAdapter(private var notifications: List<Notification>) :
    RecyclerView.Adapter<NotificationsAdapter.ViewHolder>() {

    interface OnNotificationClickListener {
        fun onNotificationClick(notification: Notification)
    }

    private var listener: OnNotificationClickListener? = null

    fun setOnNotificationClickListener(listener: OnNotificationClickListener) {
        this.listener = listener
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_notification, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val notification = notifications[position]
        holder.bind(notification)
    }

    override fun getItemCount() = notifications.size

    fun updateNotifications(newNotifications: List<Notification>) {
        this.notifications = newNotifications
        notifyDataSetChanged()
    }

    inner class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val userImageView: ImageView = itemView.findViewById(R.id.notificationUserImage)
        private val titleText: TextView = itemView.findViewById(R.id.notificationTitle)
        private val messageText: TextView = itemView.findViewById(R.id.notificationMessage)
        private val timeText: TextView = itemView.findViewById(R.id.notificationTime)

        init {
            itemView.setOnClickListener {
                val position = adapterPosition
                if (position != RecyclerView.NO_POSITION) {
                    listener?.onNotificationClick(notifications[position])
                }
            }
        }

        fun bind(notification: Notification) {
            titleText.text = notification.title
            messageText.text = notification.message

            // Display relative time for better UX
            if (notification.timestamp > 0) {
                timeText.text = getTimeAgo(notification.timestamp)
            } else {
                timeText.text = notification.time
            }

            // Set read/unread status visually
            if (!notification.isRead) {
                itemView.setBackgroundResource(R.color.very_light_gray)
            } else {
                itemView.setBackgroundResource(android.R.color.transparent)
            }

            // Load profile image - in a real app, you would use Glide or Picasso
            if (notification.userImageUrl.isNotEmpty()) {
                // In a real app: Glide.with(userImageView).load(notification.userImageUrl).into(userImageView)
                userImageView.setImageResource(R.drawable.profile_placeholder)
            } else {
                userImageView.setImageResource(R.drawable.profile_placeholder)
            }
        }

        private fun getTimeAgo(timestamp: Long): String {
            val now = System.currentTimeMillis()
            val diff = now - timestamp

            return when {
                diff < TimeUnit.MINUTES.toMillis(1) -> "Just now"
                diff < TimeUnit.HOURS.toMillis(1) -> "${TimeUnit.MILLISECONDS.toMinutes(diff)} minutes ago"
                diff < TimeUnit.DAYS.toMillis(1) -> "${TimeUnit.MILLISECONDS.toHours(diff)} hours ago"
                diff < TimeUnit.DAYS.toMillis(7) -> "${TimeUnit.MILLISECONDS.toDays(diff)} days ago"
                else -> {
                    val sdf = SimpleDateFormat("MMM dd, yyyy", Locale.getDefault())
                    sdf.format(Date(timestamp))
                }
            }
        }
    }
}