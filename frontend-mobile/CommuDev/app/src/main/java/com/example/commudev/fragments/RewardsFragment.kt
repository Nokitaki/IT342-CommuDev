package com.example.commudev.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.GridLayoutManager
import com.example.commudev.R
import com.example.commudev.databinding.FragmentRewardsBinding
import com.example.commudev.models.Reward
import java.util.UUID

class RewardsFragment : Fragment() {

    private var _binding: FragmentRewardsBinding? = null
    private val binding get() = _binding!!

    private val rewards = mutableListOf<Reward>()
    private var currentUserPoints = 500 // Placeholder points value

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentRewardsBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        setupPointsDisplay()
        setupRewardsRecyclerView()
        loadSampleRewards()
        setupCategoryTabs()
    }

    private fun setupPointsDisplay() {
        binding.pointsValueText.text = currentUserPoints.toString()

        binding.pointsHistoryButton.setOnClickListener {
            Toast.makeText(context, "Points history feature coming soon!", Toast.LENGTH_SHORT).show()
        }
    }

    private fun setupRewardsRecyclerView() {
        binding.rewardsRecyclerView.layoutManager = GridLayoutManager(context, 2)
        // In a real app, you would set an adapter here
        // binding.rewardsRecyclerView.adapter = RewardsAdapter(rewards)
    }

    private fun setupCategoryTabs() {
        binding.allRewardsTab.setOnClickListener {
            binding.allRewardsTab.setBackgroundResource(R.drawable.tab_active)
            binding.vouchersTab.setBackgroundResource(R.drawable.tab_inactive)
            binding.digitalTab.setBackgroundResource(R.drawable.tab_inactive)
            loadSampleRewards() // Filter would be applied in a real app
        }

        binding.vouchersTab.setOnClickListener {
            binding.allRewardsTab.setBackgroundResource(R.drawable.tab_inactive)
            binding.vouchersTab.setBackgroundResource(R.drawable.tab_active)
            binding.digitalTab.setBackgroundResource(R.drawable.tab_inactive)
            loadSampleRewards() // Filter would be applied in a real app
        }

        binding.digitalTab.setOnClickListener {
            binding.allRewardsTab.setBackgroundResource(R.drawable.tab_inactive)
            binding.vouchersTab.setBackgroundResource(R.drawable.tab_inactive)
            binding.digitalTab.setBackgroundResource(R.drawable.tab_active)
            loadSampleRewards() // Filter would be applied in a real app
        }

        // Start with "All Rewards" tab selected
        binding.allRewardsTab.setBackgroundResource(R.drawable.tab_active)
    }

    private fun loadSampleRewards() {
        rewards.clear()

        // Add sample rewards
        rewards.add(
            Reward(
                id = UUID.randomUUID().toString(),
                title = "Community Garden T-Shirt",
                description = "A stylish eco-friendly t-shirt with our community garden logo",
                points = 250,
                imageUrl = "",
                isRedeemed = false,
                expiryDate = System.currentTimeMillis() + (30L * 24 * 60 * 60 * 1000), // 30 days from now
                code = ""
            )
        )

        rewards.add(
            Reward(
                id = UUID.randomUUID().toString(),
                title = "$10 Grocery Voucher",
                description = "Voucher for local grocery store, perfect for fresh produce",
                points = 400,
                imageUrl = "",
                isRedeemed = false,
                expiryDate = System.currentTimeMillis() + (60L * 24 * 60 * 60 * 1000), // 60 days from now
                code = ""
            )
        )

        rewards.add(
            Reward(
                id = UUID.randomUUID().toString(),
                title = "Seed Starter Kit",
                description = "Premium seed starter kit with organic soil and variety of vegetable seeds",
                points = 300,
                imageUrl = "",
                isRedeemed = false,
                expiryDate = System.currentTimeMillis() + (45L * 24 * 60 * 60 * 1000), // 45 days from now
                code = ""
            )
        )

        rewards.add(
            Reward(
                id = UUID.randomUUID().toString(),
                title = "Digital Gardening E-Book",
                description = "Comprehensive e-book on urban gardening techniques and tips",
                points = 150,
                imageUrl = "",
                isRedeemed = false,
                expiryDate = System.currentTimeMillis() + (90L * 24 * 60 * 60 * 1000), // 90 days from now
                code = ""
            )
        )

        // In a real app, you would update the adapter here
        // rewardsAdapter.notifyDataSetChanged()

        // Since we don't have an adapter yet, just show a toast
        Toast.makeText(context, "Loaded ${rewards.size} rewards", Toast.LENGTH_SHORT).show()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}