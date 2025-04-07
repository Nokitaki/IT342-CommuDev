package com.example.commudev

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.fragment.app.Fragment
import com.example.commudev.databinding.FragmentChatBinding
import java.util.UUID

class ChatFragment : Fragment() {

    private var _binding: FragmentChatBinding? = null
    private val binding get() = _binding!!
    private lateinit var authManager: AuthManager

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentChatBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        authManager = AuthManager(requireContext())

        // Setup UI components and load conversations
        setupConversations()

        // Set up send message button
        binding.sendButton.setOnClickListener {
            val message = binding.messageInput.text.toString().trim()
            if (message.isNotEmpty()) {
                sendMessage(message)
                binding.messageInput.text.clear()
            }
        }
    }

    private fun setupConversations() {
        // Load sample conversations
        val conversations = getSampleConversations()

        // You would normally set up your RecyclerView adapter here
        // For now, just display the first conversation
        if (conversations.isNotEmpty()) {
            openConversation(conversations[0])
        }
    }

    private fun getSampleConversations(): List<Conversation> {
        return listOf(
            Conversation(
                userId = "1",
                userName = "Garvey Gene Sanjorjo",
                lastMessage = "Yes of course!",
                userImageUrl = "",
                timestamp = System.currentTimeMillis()
            ),
            Conversation(
                userId = "2",
                userName = "Kenji Ermita",
                lastMessage = "Hi!",
                userImageUrl = "",
                timestamp = System.currentTimeMillis() - 3600000 // 1 hour ago
            )
        )
    }

    private fun openConversation(conversation: Conversation) {
        // Show the selected conversation layout
        binding.selectedConversationLayout.visibility = View.VISIBLE

        // Set conversation details
        binding.chatUserName.text = conversation.userName
        binding.chatUserStatus.text = "Online"

        // Load profile image (would use Glide in a real implementation)

        // Load messages for this conversation
        loadMessages(conversation.userId)
    }

    private fun loadMessages(conversationPartnerId: String) {
        // Clear existing messages
        binding.messagesContainer.removeAllViews()

        val currentUserId = authManager.getCurrentUserId() ?: "user123"

        val messages = listOf(
            Message(
                id = "1",
                senderId = conversationPartnerId,
                receiverId = currentUserId,
                text = "Hey bro, would you be my friend?",
                timestamp = System.currentTimeMillis() - 60000 // 1 minute ago
            ),
            Message(
                id = "2",
                senderId = currentUserId,
                receiverId = conversationPartnerId,
                text = "Yes of course!",
                timestamp = System.currentTimeMillis()
            )
        )

        // Add messages to UI
        messages.forEach { addMessageToUI(it) }
    }

    private fun sendMessage(message: String) {
        val currentUserId = authManager.getCurrentUserId() ?: "user123"
        val newMessage = Message(
            id = UUID.randomUUID().toString(),
            senderId = currentUserId,
            receiverId = "chatPartnerId", // This would be the actual conversation partner's ID
            text = message,
            timestamp = System.currentTimeMillis()
        )

        addMessageToUI(newMessage)
    }

    private fun addMessageToUI(message: Message) {
        val currentUserId = authManager.getCurrentUserId() ?: "user123"
        val isSentByMe = message.senderId == currentUserId

        val messageView = if (isSentByMe) {
            layoutInflater.inflate(R.layout.item_message_sent, binding.messagesContainer, false)
        } else {
            layoutInflater.inflate(R.layout.item_message_received, binding.messagesContainer, false)
        }

        // Set message text
        messageView.findViewById<TextView>(R.id.messageText).text = message.text

        // Add to messages container
        binding.messagesContainer.addView(messageView)

        // Scroll to bottom
        binding.messagesScrollView.post {
            binding.messagesScrollView.fullScroll(View.FOCUS_DOWN)
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}