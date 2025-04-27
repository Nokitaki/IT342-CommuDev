package com.example.commudev.fragments

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.commudev.R
import com.example.commudev.models.Resource
import java.text.SimpleDateFormat
import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter
import java.util.Locale

class ResourcesAdapter(private val resources: List<Resource>) :
    RecyclerView.Adapter<ResourcesAdapter.ViewHolder>() {

    interface OnResourceInteractionListener {
        fun onResourceClick(resource: Resource)
        fun onDownloadClick(resource: Resource)
        fun onEditClick(resource: Resource)
        fun onDeleteClick(resource: Resource)
    }

    private var listener: OnResourceInteractionListener? = null

    fun setOnResourceInteractionListener(listener: OnResourceInteractionListener) {
        this.listener = listener
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_resource, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val resource = resources[position]
        holder.bind(resource)
    }

    override fun getItemCount() = resources.size

    inner class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val resourceTitleText: TextView = itemView.findViewById(R.id.resourceTitleText)
        private val resourceDescriptionText: TextView = itemView.findViewById(R.id.resourceDescriptionText)
        private val resourceTypeText: TextView = itemView.findViewById(R.id.resourceTypeText)
        private val authorNameText: TextView = itemView.findViewById(R.id.authorNameText)
        private val resourceDateText: TextView = itemView.findViewById(R.id.resourceDateText)
        private val downloadsCountText: TextView = itemView.findViewById(R.id.downloadsCountText)
        private val downloadButton: Button = itemView.findViewById(R.id.downloadButton)
        private val editButton: Button = itemView.findViewById(R.id.editButton)
        private val deleteButton: Button = itemView.findViewById(R.id.deleteButton)

        fun bind(resource: Resource) {
            resourceTitleText.text = resource.resourceTitle
            resourceDescriptionText.text = resource.resourceDescription
            resourceTypeText.text = resource.resourceCategory
            authorNameText.text = resource.creator

            // Format the date string
            try {
                val dateTime = ZonedDateTime.parse(resource.uploadDate)
                val formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy", Locale.getDefault())
                resourceDateText.text = formatter.format(dateTime)
            } catch (e: Exception) {
                resourceDateText.text = resource.uploadDate
            }

            // Set downloads count
            downloadsCountText.text = "${resource.heartCount} hearts"

            // Set click listeners
            itemView.setOnClickListener {
                listener?.onResourceClick(resource)
            }

            downloadButton.setOnClickListener {
                listener?.onDownloadClick(resource)
            }

            editButton.setOnClickListener {
                listener?.onEditClick(resource)
            }

            deleteButton.setOnClickListener {
                listener?.onDeleteClick(resource)
            }
        }
    }
}