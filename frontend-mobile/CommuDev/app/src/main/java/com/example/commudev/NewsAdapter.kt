package com.example.commudev.adapters

import android.text.format.DateUtils
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.commudev.R
import com.example.commudev.models.NewsArticle

class NewsAdapter(
    private var newsArticles: List<NewsArticle>
) : RecyclerView.Adapter<NewsAdapter.ViewHolder>() {

    interface OnNewsClickListener {
        fun onNewsArticleClick(article: NewsArticle)
        fun onShareClick(article: NewsArticle)
        fun onBookmarkClick(article: NewsArticle)
    }

    private var listener: OnNewsClickListener? = null

    fun setOnNewsClickListener(listener: OnNewsClickListener) {
        this.listener = listener
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_news, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val article = newsArticles[position]
        holder.bind(article)
    }

    override fun getItemCount() = newsArticles.size

    inner class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val titleText: TextView = itemView.findViewById(R.id.newsTitle)
        private val summaryText: TextView = itemView.findViewById(R.id.newsSummary)
        private val sourceText: TextView = itemView.findViewById(R.id.newsSource)
        private val publishDateText: TextView = itemView.findViewById(R.id.newsDate)
        private val newsImage: ImageView = itemView.findViewById(R.id.newsImage)
        private val shareButton: ImageButton = itemView.findViewById(R.id.shareButton)
        private val bookmarkButton: ImageButton = itemView.findViewById(R.id.bookmarkButton)

        init {
            itemView.setOnClickListener {
                val position = adapterPosition
                if (position != RecyclerView.NO_POSITION) {
                    listener?.onNewsArticleClick(newsArticles[position])
                }
            }

            shareButton.setOnClickListener {
                val position = adapterPosition
                if (position != RecyclerView.NO_POSITION) {
                    listener?.onShareClick(newsArticles[position])
                }
            }

            bookmarkButton.setOnClickListener {
                val position = adapterPosition
                if (position != RecyclerView.NO_POSITION) {
                    listener?.onBookmarkClick(newsArticles[position])
                }
            }
        }

        fun bind(article: NewsArticle) {
            titleText.text = article.title
            summaryText.text = article.summary
            sourceText.text = article.source

            // Format publish date as relative time
            val relativeTime = if (article.publishDate != null) {
                DateUtils.getRelativeTimeSpanString(
                    article.publishDate.time,
                    System.currentTimeMillis(),
                    DateUtils.MINUTE_IN_MILLIS
                )
            } else {
                "Unknown date"
            }
            publishDateText.text = relativeTime

            // Set bookmark icon based on state
            bookmarkButton.setImageResource(
                if (article.isBookmarked) R.drawable.ic_bookmark_filled
                else R.drawable.ic_bookmark
            )

            // Load image if available
            if (article.imageUrl.isNotEmpty()) {
                // In a real app: Glide.with(newsImage).load(article.imageUrl).into(newsImage)
                newsImage.setImageResource(R.drawable.news_placeholder)
                newsImage.visibility = View.VISIBLE
            } else {
                // Use a default placeholder image
                newsImage.setImageResource(R.drawable.news_placeholder)
                newsImage.visibility = View.VISIBLE
            }
        }
    }
}