package com.example.commudev.adapters

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.commudev.R
import com.example.commudev.models.User
import com.google.android.material.card.MaterialCardView

class PeopleAdapter(
    private val people: List<User>
) : RecyclerView.Adapter<PeopleAdapter.ViewHolder>() {

    interface OnPersonClickListener {
        fun onPersonClick(person: User)
        fun onConnectClick(person: User)
    }

    private var listener: OnPersonClickListener? = null

    fun setOnPersonClickListener(listener: OnPersonClickListener) {
        this.listener = listener
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_person, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val person = people[position]
        holder.bind(person)
    }

    override fun getItemCount() = people.size

    inner class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val personImage: ImageView = itemView.findViewById(R.id.personImage)
        private val personName: TextView = itemView.findViewById(R.id.personName)
        private val connectButton: Button = itemView.findViewById(R.id.connectButton)
        private val imageCardView: MaterialCardView = itemView.findViewById(R.id.imageCardView)

        init {
            itemView.setOnClickListener {
                val position = adapterPosition
                if (position != RecyclerView.NO_POSITION) {
                    listener?.onPersonClick(people[position])
                }
            }

            // Add click listener to the profile image
            personImage.setOnClickListener {
                val position = adapterPosition
                if (position != RecyclerView.NO_POSITION) {
                    listener?.onPersonClick(people[position])
                }
            }

            // Add click listener to the image card
            imageCardView.setOnClickListener {
                val position = adapterPosition
                if (position != RecyclerView.NO_POSITION) {
                    listener?.onPersonClick(people[position])
                }
            }

            connectButton.setOnClickListener {
                val position = adapterPosition
                if (position != RecyclerView.NO_POSITION) {
                    listener?.onConnectClick(people[position])
                    // Change button appearance to indicate connection requested
                    connectButton.text = "Requested"
                    connectButton.isEnabled = false
                }
            }
        }

        fun bind(person: User) {
            personName.text = person.fullName

            // Set profile image
            // In a real app, use Glide or Picasso to load image
            personImage.setImageResource(R.drawable.profile_placeholder)

            // Add online indicator if online
            if (person.isOnline) {
                // Add a small green dot to indicate online status
                imageCardView.strokeColor = itemView.context.getColor(R.color.light_green)
                imageCardView.strokeWidth = 2
            } else {
                imageCardView.strokeColor = itemView.context.getColor(R.color.white)
                imageCardView.strokeWidth = 0
            }
        }
    }
}