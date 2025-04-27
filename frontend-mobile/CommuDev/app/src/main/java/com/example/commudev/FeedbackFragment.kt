package com.example.commudev.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.commudev.R
import com.example.commudev.databinding.FragmentFeedbackBinding
import com.example.commudev.models.Feedback
import java.util.UUID

class FeedbackFragment : Fragment() {

    private var _binding: FragmentFeedbackBinding? = null
    private val binding get() = _binding!!

    private val feedbackItems = mutableListOf<Feedback>()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentFeedbackBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        setupTabs()
        setupFeedbackRecyclerView()
        setupSubmitFeedbackButton()
        loadSampleFeedback()
    }

    private fun setupTabs() {
        binding.myFeedbackTab.setOnClickListener {
            binding.myFeedbackTab.setBackgroundResource(R.drawable.tab_active)
            binding.communityFeedbackTab.setBackgroundResource(R.drawable.tab_inactive)
            // In a real app, you would filter to show only user's feedback
            loadSampleFeedback()
        }

        binding.communityFeedbackTab.setOnClickListener {
            binding.myFeedbackTab.setBackgroundResource(R.drawable.tab_inactive)
            binding.communityFeedbackTab.setBackgroundResource(R.drawable.tab_active)
            // In a real app, you would load community feedback
            loadSampleFeedback()
        }

        // Start with "My Feedback" selected
        binding.myFeedbackTab.setBackgroundResource(R.drawable.tab_active)
    }

    private fun setupFeedbackRecyclerView() {
        binding.feedbackRecyclerView.layoutManager = LinearLayoutManager(context)
        // In a real app, you would set up an adapter here
        // binding.feedbackRecyclerView.adapter = FeedbackAdapter(feedbackItems)
    }

    private fun setupSubmitFeedbackButton() {
        binding.submitFeedbackButton.setOnClickListener {
            // In a real app, you would navigate to a feedback submission screen or show a dialog
            val feedbackText = binding.feedbackInput.text.toString().trim()

            if (feedbackText.isNotEmpty()) {
                // Create and submit feedback
                val newFeedback = Feedback(
                    id = UUID.randomUUID().toString(),
                    userId = "current_user_id", // In a real app, get the actual user ID
                    userName = "Current User", // In a real app, get the actual user name
                    userImageUrl = "",
                    content = feedbackText,
                    rating = 5, // Default rating
                    timestamp = System.currentTimeMillis(),
                    category = "General",
                    status = "Pending",
                    response = ""
                )

                // In a real app, you would save this to a database
                feedbackItems.add(0, newFeedback) // Add to the top of the list
                // In a real app, you would update the adapter
                // feedbackAdapter.notifyItemInserted(0)

                // Clear the input
                binding.feedbackInput.text.clear()

                Toast.makeText(context, "Feedback submitted successfully", Toast.LENGTH_SHORT).show()
            } else {
                Toast.makeText(context, "Please enter your feedback", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun loadSampleFeedback() {
        feedbackItems.clear()

        // Add sample feedback items
        feedbackItems.add(
            Feedback(
                id = UUID.randomUUID().toString(),
                userId = "user_123",
                userName = "Maria Garcia",
                userImageUrl = "",
                content = "The new garden layout tool is very useful, but it would be great if we could save multiple layout versions.",
                rating = 4,
                timestamp = System.currentTimeMillis() - (2 * 24 * 60 * 60 * 1000), // 2 days ago
                category = "Feature Request",
                status = "Under Review",
                response = ""
            )
        )

        feedbackItems.add(
            Feedback(
                id = UUID.randomUUID().toString(),
                userId = "user_456",
                userName = "David Chen",
                userImageUrl = "",
                content = "I found a bug in the volunteer sign-up form. When selecting multiple time slots, only the first one gets saved.",
                rating = 3,
                timestamp = System.currentTimeMillis() - (5 * 24 * 60 * 60 * 1000), // 5 days ago
                category = "Bug Report",
                status = "Fixed",
                response = "Thank you for reporting this issue. We've fixed the bug in our latest update."
            )
        )

        feedbackItems.add(
            Feedback(
                id = UUID.randomUUID().toString(),
                userId = "user_789",
                userName = "Sarah Johnson",
                userImageUrl = "",
                content = "The community resources section is fantastic! Very well organized and easy to navigate.",
                rating = 5,
                timestamp = System.currentTimeMillis() - (7 * 24 * 60 * 60 * 1000), // 7 days ago
                category = "Compliment",
                status = "Acknowledged",
                response = "We're glad you're enjoying this feature!"
            )
        )

        // In a real app, you would update the adapter here
        // feedbackAdapter.notifyDataSetChanged()

        // Since we don't have an adapter yet, just show a toast
        Toast.makeText(context, "Loaded ${feedbackItems.size} feedback items", Toast.LENGTH_SHORT).show()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}