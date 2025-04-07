package com.example.commudev

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import com.example.commudev.databinding.FragmentHomeBinding

class HomeFragment : Fragment() {

    private var _binding: FragmentHomeBinding? = null
    private val binding get() = _binding!!

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

        setupNewsSection()
        loadNewsContent()
    }

    private fun setupNewsSection() {
        binding.newsHeader.text = "News"

        binding.createPostInput.setOnClickListener {
            // Show post creation dialog or activity
            Toast.makeText(context, "Create post feature not implemented yet", Toast.LENGTH_SHORT).show()
        }
    }

    private fun loadNewsContent() {
        // Setup example news post
        binding.newsTitle.text = "MIT students are eager to know how things work."
        binding.newsContent.text = "MIT people are eager to know how things work and inspired to make them work better. MIT people are eager to know how things work and inspired to make them work better. MIT people are eager to know how things work..."

        binding.readMoreButton.setOnClickListener {
            // Open full news article
            Toast.makeText(context, "Full article feature not implemented yet", Toast.LENGTH_SHORT).show()
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
