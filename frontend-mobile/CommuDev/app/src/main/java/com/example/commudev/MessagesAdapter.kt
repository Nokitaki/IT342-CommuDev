package com.example.commudev.adapters

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.commudev.R
import com.example.commudev.models.Message
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class MessagesAdapter(
    private val messages: List<Message>,
    private val currentUserId: String
) : RecyclerView.Adapter<RecyclerView.ViewHolder>() {

    companion object {
        private const val VIEW_TYPE_SENT = 1
        private const val VIEW_TYPE_RECEIVED = 2
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecyclerView.ViewHolder {
        return when (viewType) {
            VIEW_TYPE_SENT -> {
                val view = LayoutInflater.from(parent.context)
                    .inflate(R.layout.item_message, parent, false)
                SentMessageViewHolder(view)
            }
            VIEW_TYPE_RECEIVED -> {
                val view = LayoutInflater.from(parent.context)
                    .inflate(R.layout.item_message, parent, false)
                ReceivedMessageViewHolder(view)
            }
            else -> throw IllegalArgumentException("Invalid view type")
        }
    }

    override fun onBindViewHolder(holder: RecyclerView.ViewHolder, position: Int) {
        val message = messages[position]
        when (holder.itemViewType) {
            VIEW_TYPE_SENT -> (holder as SentMessageViewHolder).bind(message)
            VIEW_TYPE_RECEIVED -> (holder as ReceivedMessageViewHolder).bind(message)
        }
    }

    override fun getItemCount(): Int = messages.size

    override fun getItemViewType(position: Int): Int {
        val message = messages[position]
        return if (message.senderId == currentUserId) {
            VIEW_TYPE_SENT
        } else {
            VIEW_TYPE_RECEIVED
        }
    }

    inner class SentMessageViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val sentMessageLayout = itemView.findViewById<View>(R.id.sentMessageLayout)
        private val receivedMessageLayout = itemView.findViewById<View>(R.id.receivedMessageLayout)
        private val sentMessageText = itemView.findViewById<TextView>(R.id.sentMessageText)
        private val sentMessageTime = itemView.findViewById<TextView>(R.id.sentMessageTime)

        fun bind(message: Message) {
            sentMessageLayout.visibility = View.VISIBLE
            receivedMessageLayout.visibility = View.GONE

            sentMessageText.text = message.text

            // Format time
            val formatter = SimpleDateFormat("h:mm a", Locale.getDefault())
            sentMessageTime.text = formatter.format(Date(message.timestamp))
        }
    }

    inner class ReceivedMessageViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val sentMessageLayout = itemView.findViewById<View>(R.id.sentMessageLayout)
        private val receivedMessageLayout = itemView.findViewById<View>(R.id.receivedMessageLayout)
        private val receivedMessageText = itemView.findViewById<TextView>(R.id.receivedMessageText)
        private val receivedMessageTime = itemView.findViewById<TextView>(R.id.receivedMessageTime)

        fun bind(message: Message) {
            sentMessageLayout.visibility = View.GONE
            receivedMessageLayout.visibility = View.VISIBLE

            receivedMessageText.text = message.text

            // Format time
            val formatter = SimpleDateFormat("h:mm a", Locale.getDefault())
            receivedMessageTime.text = formatter.format(Date(message.timestamp))
        }
    }
}