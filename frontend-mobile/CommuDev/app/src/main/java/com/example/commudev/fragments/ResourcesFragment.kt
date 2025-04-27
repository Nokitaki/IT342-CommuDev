package com.example.commudev.fragments

import com.example.commudev.api.RetrofitClient
import com.example.commudev.models.Resource
import com.example.commudev.models.ResourcehubRequestDTO
import com.example.commudev.util.SessionManager
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.EditText
import android.widget.Spinner
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout
import com.example.commudev.R
import com.example.commudev.databinding.FragmentResourcesBinding
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class ResourcesFragment : Fragment() {

    private var _binding: FragmentResourcesBinding? = null
    private val binding get() = _binding!!
    private lateinit var resourcesAdapter: ResourcesAdapter
    private val resources = mutableListOf<Resource>()
    private lateinit var sessionManager: SessionManager
    private lateinit var swipeRefreshLayout: SwipeRefreshLayout

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentResourcesBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        sessionManager = SessionManager(requireContext())

        // Setup swipe refresh
        swipeRefreshLayout = view.findViewById(R.id.swipeRefreshLayout)
        swipeRefreshLayout.setOnRefreshListener {
            loadResources()
        }

        setupResourceTabs()
        setupCreateResourceButton()
        setupResourcesRecyclerView()
        loadResources()
    }

    private fun setupResourceTabs() {
        binding.allResourcesTab.setOnClickListener {
            // Highlight this tab and show all resources
            activateTab(binding.allResourcesTab)
            // Load all resources
            loadResources()
        }

        binding.documentsTab.setOnClickListener {
            // Highlight this tab and show only documents
            activateTab(binding.documentsTab)
            // Load document resources
            loadResourcesByCategory("Document")
        }

        binding.mediaTab.setOnClickListener {
            // Highlight this tab and show only media
            activateTab(binding.mediaTab)
            // Load media resources
            loadResourcesByCategory("Media")
        }

        // Start with all resources selected
        activateTab(binding.allResourcesTab)
    }

    private fun activateTab(tabView: TextView) {
        // Reset all tabs
        binding.allResourcesTab.setBackgroundResource(R.drawable.tab_inactive)
        binding.documentsTab.setBackgroundResource(R.drawable.tab_inactive)
        binding.mediaTab.setBackgroundResource(R.drawable.tab_inactive)

        // Activate the selected tab
        tabView.setBackgroundResource(R.drawable.tab_active)
    }

    private fun setupCreateResourceButton() {
        binding.createResourceButton.setOnClickListener {
            // Show dialog or navigate to resource creation screen
            showCreateResourceDialog()
        }
    }

    private fun setupResourcesRecyclerView() {
        binding.resourcesRecyclerView.layoutManager = LinearLayoutManager(requireContext())
        resourcesAdapter = ResourcesAdapter(resources)
        binding.resourcesRecyclerView.adapter = resourcesAdapter

        // Set up item click listener when the adapter supports it
        // resourcesAdapter.setOnResourceClickListener { resource ->
        //     // Navigate to resource detail screen
        // }
    }

    private fun showCreateResourceDialog() {
        // Create a dialog for resource creation
        val dialogView = layoutInflater.inflate(R.layout.dialog_create_resource, null)
        val titleInput = dialogView.findViewById<EditText>(R.id.resourceTitleInput)
        val descriptionInput = dialogView.findViewById<EditText>(R.id.resourceDescriptionInput)
        val typeSpinner = dialogView.findViewById<Spinner>(R.id.resourceTypeSpinner)

        // Setup resource types spinner
        val resourceTypes = arrayOf("Document", "Media", "Other")
        val adapter = ArrayAdapter(requireContext(), android.R.layout.simple_spinner_item, resourceTypes)
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        typeSpinner.adapter = adapter

        val dialog = MaterialAlertDialogBuilder(requireContext())
            .setTitle("Create New Resource")
            .setView(dialogView)
            .setPositiveButton("Create") { _, _ ->
                val title = titleInput.text.toString()
                val description = descriptionInput.text.toString()
                val type = typeSpinner.selectedItem.toString()

                if (title.isNotEmpty() && description.isNotEmpty()) {
                    // Create the resource
                    createResource(title, description, type)
                } else {
                    Toast.makeText(context, "Please fill all fields", Toast.LENGTH_SHORT).show()
                }
            }
            .setNegativeButton("Cancel", null)
            .create()

        dialog.show()
    }

    private fun createResource(title: String, description: String, category: String) {
        val apiService = RetrofitClient.getApiService(requireContext())

        // Get current username from SessionManager
        val username = sessionManager.getUsername() ?: "Anonymous"

        val resourceRequest = ResourcehubRequestDTO(
            resourceTitle = title,
            resourceDescription = description,
            resourceCategory = category,
            creator = username
        )

        apiService.createResource(resourceRequest).enqueue(object : Callback<Resource> {
            override fun onResponse(call: Call<Resource>, response: Response<Resource>) {
                if (response.isSuccessful) {
                    Toast.makeText(context, "Resource created successfully", Toast.LENGTH_SHORT).show()
                    loadResources() // Reload resources to show the new one
                } else {
                    Toast.makeText(
                        context,
                        "Failed to create resource: ${response.message()}",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }

            override fun onFailure(call: Call<Resource>, t: Throwable) {
                Toast.makeText(
                    context,
                    "Network error: ${t.message}",
                    Toast.LENGTH_SHORT
                ).show()
            }
        })
    }

    private fun loadResources() {
        val apiService = RetrofitClient.getApiService(requireContext())

        apiService.getAllResources().enqueue(object : Callback<List<Resource>> {
            override fun onResponse(call: Call<List<Resource>>, response: Response<List<Resource>>) {
                swipeRefreshLayout.isRefreshing = false

                if (response.isSuccessful) {
                    resources.clear()
                    response.body()?.let { resourcesList ->
                        resources.addAll(resourcesList)
                        resourcesAdapter.notifyDataSetChanged()

                        // Show empty state if no resources
                        if (resources.isEmpty()) {
                            binding.emptyResourcesView.visibility = View.VISIBLE
                            binding.resourcesRecyclerView.visibility = View.GONE
                        } else {
                            binding.emptyResourcesView.visibility = View.GONE
                            binding.resourcesRecyclerView.visibility = View.VISIBLE
                        }
                    }
                } else {
                    Toast.makeText(
                        context,
                        "Failed to load resources: ${response.message()}",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }

            override fun onFailure(call: Call<List<Resource>>, t: Throwable) {
                swipeRefreshLayout.isRefreshing = false
                Toast.makeText(
                    context,
                    "Network error: ${t.message}",
                    Toast.LENGTH_SHORT
                ).show()
            }
        })
    }

    private fun loadResourcesByCategory(category: String) {
        val apiService = RetrofitClient.getApiService(requireContext())

        apiService.getResourcesByCategory(category).enqueue(object : Callback<List<Resource>> {
            override fun onResponse(call: Call<List<Resource>>, response: Response<List<Resource>>) {
                swipeRefreshLayout.isRefreshing = false

                if (response.isSuccessful) {
                    resources.clear()
                    response.body()?.let { resourcesList ->
                        resources.addAll(resourcesList)
                        resourcesAdapter.notifyDataSetChanged()

                        // Show empty state if no resources
                        if (resources.isEmpty()) {
                            binding.emptyResourcesView.visibility = View.VISIBLE
                            binding.resourcesRecyclerView.visibility = View.GONE
                        } else {
                            binding.emptyResourcesView.visibility = View.GONE
                            binding.resourcesRecyclerView.visibility = View.VISIBLE
                        }
                    }
                } else {
                    Toast.makeText(
                        context,
                        "Failed to load resources: ${response.message()}",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }

            override fun onFailure(call: Call<List<Resource>>, t: Throwable) {
                swipeRefreshLayout.isRefreshing = false
                Toast.makeText(
                    context,
                    "Network error: ${t.message}",
                    Toast.LENGTH_SHORT
                ).show()
            }
        })
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}