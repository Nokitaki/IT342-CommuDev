package com.example.commudev

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
import com.example.commudev.databinding.FragmentResourcesBinding
import com.google.android.material.dialog.MaterialAlertDialogBuilder

class ResourcesFragment : Fragment() {

    private var _binding: FragmentResourcesBinding? = null
    private val binding get() = _binding!!

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

        setupResourceTabs()
        setupCreateResourceButton()
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
            loadDocumentResources()
        }

        binding.mediaTab.setOnClickListener {
            // Highlight this tab and show only media
            activateTab(binding.mediaTab)
            // Load media resources
            loadMediaResources()
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

    private fun createResource(title: String, description: String, type: String) {
        // In a real app, you would save this to your database
        Toast.makeText(context, "Creating $type resource: $title", Toast.LENGTH_LONG).show()

        // Refresh the resources list
        loadResources()
    }

    private fun loadResources() {
        // Set up the RecyclerView
        binding.resourcesRecyclerView.layoutManager = LinearLayoutManager(context)

        // Sample resource data
        val resources = listOf(
            Resource(
                id = "1",
                title = "New Resource Available!",
                description = "Check it out now and enhance your learning! Let us know your thoughts or share it with others who might find it useful.",
                type = "Document",
                creator = "Garvey Gene Sanjorjo",
                date = "03/05/2025",
                tags = listOf("ResourceHub", "NewResource", "LearningTogether"),
                isActive = true
            )
        )

        val adapter = ResourcesAdapter(resources)
        binding.resourcesRecyclerView.adapter = adapter
    }

    private fun loadDocumentResources() {
        // Filter resources to only show documents
        // This would filter the data in a real app
        loadResources() // For now, just show all
    }

    private fun loadMediaResources() {
        // Filter resources to only show media
        // This would filter the data in a real app
        loadResources() // For now, just show all
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}