package com.example.commudev.fragments

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.Toast
import androidx.core.view.GravityCompat
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.commudev.ProfileActivity
import com.example.commudev.R
import com.example.commudev.adapters.ConversationsAdapter
import com.example.commudev.adapters.MessagesAdapter
import com.example.commudev.databinding.FragmentMessagesBinding
import com.example.commudev.models.Conversation
import com.example.commudev.models.Message
import com.example.commudev.util.ProfileNavigationUtil
import java.util.UUID

class ChatFragment : Fragment() {

    private var _binding: FragmentMessagesBinding? = null
    private val binding get() = _binding!!

    private lateinit var conversationsAdapter: ConversationsAdapter
    private lateinit var messagesAdapter: MessagesAdapter
    private var currentConversationId: String? = null
    private val conversations = mutableListOf<Conversation>()
    private val allMessages = mutableMapOf<String, List<Message>>()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentMessagesBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // Add profile button to the view
        addProfileButton()

        // Set up profile navigation from active chat user image
        binding.activeChatUserImage?.let {
            ProfileNavigationUtil.setupProfileImageNavigation(it, requireContext())
        }

        // Set up profile navigation from active chat user card
        binding.activeChatUserImageCard?.let {
            ProfileNavigationUtil.setupProfileCardNavigation(it, requireContext())
        }

        // Set up profile navigation from profile user image in drawer
        binding.profileUserImage?.let {
            ProfileNavigationUtil.setupProfileImageNavigation(it, requireContext())
        }

        // Set up profile button navigation
        binding.viewProfileButton?.setOnClickListener {
            navigateToProfile()
        }

        setupConversationsList()
        setupMessagesArea()
        setupUserProfilePanel()

        // Load sample data
        loadSampleConversations()
    }

    private fun addProfileButton() {
        // Create a simple button and add it to the layout
        try {
            val headerLayout = binding.chatToolbar
            if (headerLayout != null) {
                // Create button programmatically
                val profileButton = Button(requireContext())
                profileButton.text = "Go to Profile"
                profileButton.setCompoundDrawablesWithIntrinsicBounds(R.drawable.ic_person, 0, 0, 0)
                profileButton.setPadding(8, 4, 8, 4)

                // Set background and text colors (using resources that definitely exist)
                profileButton.setBackgroundColor(resources.getColor(R.color.light_green, null))
                profileButton.setTextColor(resources.getColor(android.R.color.white, null))

                // Set layout parameters
                val params = ViewGroup.MarginLayoutParams(
                    ViewGroup.LayoutParams.WRAP_CONTENT,
                    ViewGroup.LayoutParams.WRAP_CONTENT
                )
                profileButton.layoutParams = params

                // Set click listener
                profileButton.setOnClickListener {
                    navigateToProfile()
                }

                // Add button to header layout
                headerLayout.addView(profileButton)
            } else {
                // Fallback approach
                addFallbackProfileButton()
            }
        } catch (e: Exception) {
            // If any error occurs, use fallback
            addFallbackProfileButton()
        }
    }

    private fun addFallbackProfileButton() {
        // If the main approach doesn't work, try this alternative
        try {
            // Find a suitable container in the layout
            val container = view?.findViewById<ViewGroup>(R.id.fragmentContainer)
                ?: view as? ViewGroup

            if (container != null) {
                // Create a button
                val button = Button(requireContext())
                button.text = "PROFILE"
                button.setBackgroundColor(resources.getColor(R.color.light_green, null))
                button.setTextColor(resources.getColor(android.R.color.white, null))

                // Set layout parameters
                val params = ViewGroup.MarginLayoutParams(
                    ViewGroup.LayoutParams.WRAP_CONTENT,
                    ViewGroup.LayoutParams.WRAP_CONTENT
                )
                button.layoutParams = params

                // Set click listener
                button.setOnClickListener {
                    navigateToProfile()
                }

                // Add to container
                container.addView(button)
            }
        } catch (e: Exception) {
            // Last resort - show a toast with instructions
            Toast.makeText(
                context,
                "To view your profile, go to the Home tab and tap your profile picture",
                Toast.LENGTH_LONG
            ).show()
        }
    }

    private fun navigateToProfile() {
        // Use the utility class to navigate to profile
        context?.let {
            ProfileNavigationUtil.navigateToProfile(it)
        }
    }

    private fun setupConversationsList() {
        binding.conversationsRecyclerView.layoutManager = LinearLayoutManager(requireContext())

        conversationsAdapter = ConversationsAdapter(emptyList())
        conversationsAdapter.setOnConversationClickListener(object : ConversationsAdapter.OnConversationClickListener {
            override fun onConversationClick(conversation: Conversation) {
                openConversation(conversation)
                binding.messagesDrawerLayout?.closeDrawer(GravityCompat.START)
            }

            // Add profile image click listener
            override fun onProfileImageClick(conversation: Conversation) {
                // Navigate to profile
                navigateToProfile()
            }
        })

        binding.conversationsRecyclerView.adapter = conversationsAdapter

        // Setup new message button
        binding.newMessageButton.setOnClickListener {
            showNewMessageDialog()
        }

        // Search functionality
        binding.searchConversationsInput.setOnClickListener {
            Toast.makeText(context, "Search functionality coming soon", Toast.LENGTH_SHORT).show()
        }

        // Configure open conversations button
        binding.openConversationsButton?.setOnClickListener {
            binding.messagesDrawerLayout?.openDrawer(GravityCompat.START)
        }

        // Configure profile button if it exists
        binding.viewProfileButton?.setOnClickListener {
            navigateToProfile()
        }
    }

    private fun showNewMessageDialog() {
        // In a real app, this would show a list of contacts to message
        val users = arrayOf("Kenji Ermita", "Garvey Gene", "John Smith", "Maria Garcia")

        android.app.AlertDialog.Builder(requireContext())
            .setTitle("New Message")
            .setItems(users) { _, which ->
                // Create a new conversation with the selected user
                createNewConversation(users[which])
            }
            .setNegativeButton("Cancel", null)
            .show()
    }

    private fun createNewConversation(userName: String) {
        // Check if conversation already exists
        val existingConversation = conversations.find { it.userName == userName }
        if (existingConversation != null) {
            // Open existing conversation
            openConversation(existingConversation)
            return
        }

        // Create new conversation
        val newConversation = Conversation(
            id = UUID.randomUUID().toString(),
            userId = UUID.randomUUID().toString(),
            userName = userName,
            lastMessage = "",
            timestamp = System.currentTimeMillis(),
            isOnline = true
        )

        // Add to list and update adapter
        conversations.add(0, newConversation)
        conversationsAdapter = ConversationsAdapter(conversations)
        conversationsAdapter.setOnConversationClickListener(object : ConversationsAdapter.OnConversationClickListener {
            override fun onConversationClick(conversation: Conversation) {
                openConversation(conversation)
                binding.messagesDrawerLayout?.closeDrawer(GravityCompat.START)
            }

            override fun onProfileImageClick(conversation: Conversation) {
                navigateToProfile()
            }
        })
        binding.conversationsRecyclerView.adapter = conversationsAdapter

        // Open the new conversation
        openConversation(newConversation)
        binding.messagesDrawerLayout?.closeDrawer(GravityCompat.START)
    }

    private fun setupMessagesArea() {
        binding.messagesRecyclerView.layoutManager = LinearLayoutManager(requireContext()).apply {
            stackFromEnd = true // Show newest messages at the bottom
        }

        messagesAdapter = MessagesAdapter(emptyList(), "current_user_id")
        binding.messagesRecyclerView.adapter = messagesAdapter

        // Setup send button
        binding.sendButton.setOnClickListener {
            val messageText = binding.messageInput.text.toString().trim()
            if (messageText.isNotEmpty() && currentConversationId != null) {
                sendMessage(messageText)
                binding.messageInput.text?.clear()
            }
        }

        // Setup attachment options
        binding.attachButton.setOnClickListener {
            Toast.makeText(context, "Attachment feature coming soon", Toast.LENGTH_SHORT).show()
        }

        binding.emojiButton.setOnClickListener {
            Toast.makeText(context, "Emoji feature coming soon", Toast.LENGTH_SHORT).show()
        }

        // Setup call buttons
        binding.audioCallButton.setOnClickListener {
            Toast.makeText(context, "Audio call feature coming soon", Toast.LENGTH_SHORT).show()
        }

        binding.videoCallButton.setOnClickListener {
            Toast.makeText(context, "Video call feature coming soon", Toast.LENGTH_SHORT).show()
        }
    }

    private fun setupUserProfilePanel() {
        // Initially hide the profile panel
        binding.userProfileDrawer.visibility = View.GONE

        // Setup mute notifications toggle
        binding.muteNotificationsSwitch.setOnCheckedChangeListener { _, isChecked ->
            Toast.makeText(
                context,
                "Notifications ${if (isChecked) "muted" else "enabled"}",
                Toast.LENGTH_SHORT
            ).show()
        }
    }

    private fun openConversation(conversation: Conversation) {
        currentConversationId = conversation.id

        // Update the header with user info
        binding.activeChatUserName.text = conversation.userName
        binding.activeChatUserStatus.text = if (conversation.isOnline) "Online" else "Offline"

        // Show the conversation area
        binding.conversationContentLayout.visibility = View.VISIBLE

        // Update user profile panel
        updateUserProfilePanel(conversation)

        // Load messages for this conversation
        val messages = allMessages[conversation.id] ?: emptyList()
        messagesAdapter = MessagesAdapter(messages, "current_user_id")
        binding.messagesRecyclerView.adapter = messagesAdapter

        // Scroll to bottom
        if (messages.isNotEmpty()) {
            binding.messagesRecyclerView.scrollToPosition(messages.size - 1)
        }
    }

    private fun updateUserProfilePanel(conversation: Conversation) {
        // Update user information in the profile panel
        binding.profileUserName.text = conversation.userName
        binding.profileUserStatus.text = if (conversation.isOnline) "Active Now" else "Offline"

        // Sample data for demo purposes
        binding.profileUserAge.text = "28"
        binding.profileUserState.text = "California"
        binding.profileUserEmployment.text = "Full-time"
        binding.profileUserJoined.text = "January 2024"

        // Show profile panel
        binding.userProfileDrawer.visibility = View.VISIBLE
    }

    private fun sendMessage(text: String) {
        if (currentConversationId == null) return

        // Create new message
        val newMessage = Message(
            id = UUID.randomUUID().toString(),
            senderId = "current_user_id",
            receiverId = currentConversationId!!,
            text = text,
            timestamp = System.currentTimeMillis()
        )

        // Add message to list
        val conversationMessages = allMessages[currentConversationId!!]?.toMutableList() ?: mutableListOf()
        conversationMessages.add(newMessage)
        allMessages[currentConversationId!!] = conversationMessages

        // Update adapter
        messagesAdapter = MessagesAdapter(conversationMessages, "current_user_id")
        binding.messagesRecyclerView.adapter = messagesAdapter

        // Scroll to bottom
        binding.messagesRecyclerView.scrollToPosition(conversationMessages.size - 1)

        // Update conversation with last message
        val index = conversations.indexOfFirst { it.id == currentConversationId }
        if (index >= 0) {
            val updatedConversation = conversations[index].copy(
                lastMessage = text,
                timestamp = System.currentTimeMillis()
            )
            conversations[index] = updatedConversation

            // Sort conversations by most recent message
            val sortedConversations = conversations.sortedByDescending { it.timestamp }
            conversations.clear()
            conversations.addAll(sortedConversations)

            conversationsAdapter = ConversationsAdapter(conversations)
            conversationsAdapter.setOnConversationClickListener(object : ConversationsAdapter.OnConversationClickListener {
                override fun onConversationClick(conversation: Conversation) {
                    openConversation(conversation)
                    binding.messagesDrawerLayout?.closeDrawer(GravityCompat.START)
                }

                override fun onProfileImageClick(conversation: Conversation) {
                    navigateToProfile()
                }
            })
            binding.conversationsRecyclerView.adapter = conversationsAdapter
        }
    }

    private fun loadSampleConversations() {
        // Sample conversations
        val sampleConversations = listOf(
            Conversation(
                id = "1",
                userId = "user1",
                userName = "Maria Garcia",
                lastMessage = "I'm doing well, thanks for asking! Just working on some community projects.",
                timestamp = System.currentTimeMillis() - 10 * 60 * 1000, // 10 minutes ago
                isOnline = true
            ),
            Conversation(
                id = "2",
                userId = "user2",
                userName = "John Smith",
                lastMessage = "Did you see the new community guidelines?",
                timestamp = System.currentTimeMillis() - 2 * 60 * 60 * 1000, // 2 hours ago
                isOnline = false
            ),
            Conversation(
                id = "3",
                userId = "user3",
                userName = "Kenji Ermita",
                lastMessage = "Thanks for your help yesterday!",
                timestamp = System.currentTimeMillis() - 1 * 24 * 60 * 60 * 1000, // 1 day ago
                isOnline = true
            ),
            Conversation(
                id = "4",
                userId = "user4",
                userName = "Garvey Gene",
                lastMessage = "Looking forward to the meeting tomorrow",
                timestamp = System.currentTimeMillis() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
                isOnline = false
            )
        )

        conversations.addAll(sampleConversations)
        conversationsAdapter = ConversationsAdapter(conversations)
        conversationsAdapter.setOnConversationClickListener(object : ConversationsAdapter.OnConversationClickListener {
            override fun onConversationClick(conversation: Conversation) {
                openConversation(conversation)
                binding.messagesDrawerLayout?.closeDrawer(GravityCompat.START)
            }

            override fun onProfileImageClick(conversation: Conversation) {
                navigateToProfile()
            }
        })
        binding.conversationsRecyclerView.adapter = conversationsAdapter

        // Sample messages for each conversation
        // Conversation 1 - Maria Garcia
        val conversation1Messages = listOf(
            Message(
                id = "msg1",
                senderId = "user1",
                receiverId = "current_user_id",
                text = "Hey, how are you doing?",
                timestamp = System.currentTimeMillis() - 20 * 60 * 1000 // 20 min ago
            ),
            Message(
                id = "msg2",
                senderId = "current_user_id",
                receiverId = "user1",
                text = "I'm doing well, thanks for asking! Just working on some community projects.",
                timestamp = System.currentTimeMillis() - 10 * 60 * 1000 // 10 min ago
            )
        )
        allMessages["1"] = conversation1Messages

        // Conversation 2 - John Smith
        val conversation2Messages = listOf(
            Message(
                id = "msg3",
                senderId = "user2",
                receiverId = "current_user_id",
                text = "Did you see the new community guidelines?",
                timestamp = System.currentTimeMillis() - 2 * 60 * 60 * 1000 // 2 hours ago
            )
        )
        allMessages["2"] = conversation2Messages

        // Open the first conversation by default
        if (conversations.isNotEmpty()) {
            openConversation(conversations[0])
        }
    }

    override fun onResume() {
        super.onResume()
        // Enable drawer when this fragment is active
        binding.messagesDrawerLayout?.setDrawerLockMode(androidx.drawerlayout.widget.DrawerLayout.LOCK_MODE_UNLOCKED)
    }

    override fun onPause() {
        super.onPause()
        // Disable drawer when switching away from this fragment
        binding.messagesDrawerLayout?.setDrawerLockMode(androidx.drawerlayout.widget.DrawerLayout.LOCK_MODE_LOCKED_CLOSED)
        binding.messagesDrawerLayout?.closeDrawers()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}