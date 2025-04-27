package com.example.commudev.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.commudev.R
import com.example.commudev.databinding.FragmentTasksBinding
import com.example.commudev.models.Task
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.UUID

class TasksFragment : Fragment() {

    private var _binding: FragmentTasksBinding? = null
    private val binding get() = _binding!!

    private val tasks = mutableListOf<Task>()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentTasksBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        setupTabNavigation()
        setupTasksRecyclerView()
        loadSampleTasks()
        setupCreateTaskButton()
    }

    private fun setupTabNavigation() {
        // Set up task filter tabs
        binding.allTasksTab.setOnClickListener {
            // Load all tasks
            binding.allTasksTab.setBackgroundResource(R.drawable.tab_active)
            binding.assignedToMeTab.setBackgroundResource(R.drawable.tab_inactive)
            binding.createdByMeTab.setBackgroundResource(R.drawable.tab_inactive)
            // Apply filter
            loadSampleTasks()
        }

        binding.assignedToMeTab.setOnClickListener {
            // Load tasks assigned to current user
            binding.allTasksTab.setBackgroundResource(R.drawable.tab_inactive)
            binding.assignedToMeTab.setBackgroundResource(R.drawable.tab_active)
            binding.createdByMeTab.setBackgroundResource(R.drawable.tab_inactive)
            // Apply filter - for now just show the same sample tasks
            loadSampleTasks()
        }

        binding.createdByMeTab.setOnClickListener {
            // Load tasks created by current user
            binding.allTasksTab.setBackgroundResource(R.drawable.tab_inactive)
            binding.assignedToMeTab.setBackgroundResource(R.drawable.tab_inactive)
            binding.createdByMeTab.setBackgroundResource(R.drawable.tab_active)
            // Apply filter - for now just show the same sample tasks
            loadSampleTasks()
        }

        // Start with "All Tasks" selected
        binding.allTasksTab.setBackgroundResource(R.drawable.tab_active)
    }

    private fun setupTasksRecyclerView() {
        binding.tasksRecyclerView.layoutManager = LinearLayoutManager(context)
        // In a real app, you would set an adapter here
        // binding.tasksRecyclerView.adapter = TasksAdapter(tasks)
    }

    private fun loadSampleTasks() {
        tasks.clear()

        // Add sample tasks
        tasks.add(
            Task(
                id = UUID.randomUUID().toString(),
                title = "Community Garden Planning",
                description = "Plan layout for new community garden space, including plot allocation and common areas.",
                dueDate = System.currentTimeMillis() + (3 * 24 * 60 * 60 * 1000), // 3 days from now
                priority = "High",
                status = "In Progress",
                assigneeId = "user_123",
                assigneeName = "Maria Garcia",
                creatorId = "admin_456",
                creatorName = "John Doe",
                projectId = "proj_001",
                projectName = "Community Garden Initiative",
                tags = listOf("Planning", "Garden", "Community")
            )
        )

        tasks.add(
            Task(
                id = UUID.randomUUID().toString(),
                title = "Resource Collection Drive",
                description = "Organize collection of gardening supplies and seeds for community members.",
                dueDate = System.currentTimeMillis() + (7 * 24 * 60 * 60 * 1000), // 7 days from now
                priority = "Medium",
                status = "Not Started",
                assigneeId = "user_456",
                assigneeName = "David Chen",
                creatorId = "admin_456",
                creatorName = "John Doe",
                projectId = "proj_001",
                projectName = "Community Garden Initiative",
                tags = listOf("Resources", "Collection", "Supplies")
            )
        )

        tasks.add(
            Task(
                id = UUID.randomUUID().toString(),
                title = "Workshop Scheduling",
                description = "Schedule gardening workshops for community members of all experience levels.",
                dueDate = System.currentTimeMillis() + (5 * 24 * 60 * 60 * 1000), // 5 days from now
                priority = "Low",
                status = "Not Started",
                assigneeId = "user_789",
                assigneeName = "Sarah Johnson",
                creatorId = "user_123",
                creatorName = "Maria Garcia",
                projectId = "proj_001",
                projectName = "Community Garden Initiative",
                tags = listOf("Workshop", "Education", "Scheduling")
            )
        )

        // In a real app, you would update your adapter here
        // tasksAdapter.notifyDataSetChanged()

        // Since we don't have an adapter yet, just display a message
        Toast.makeText(context, "Loaded ${tasks.size} tasks", Toast.LENGTH_SHORT).show()
    }

    private fun setupCreateTaskButton() {
        binding.createTaskButton.setOnClickListener {
            Toast.makeText(context, "Create Task feature coming soon!", Toast.LENGTH_SHORT).show()
            // In a real app, you would navigate to a task creation screen or show a dialog
            // startActivity(Intent(context, CreateTaskActivity::class.java))
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}