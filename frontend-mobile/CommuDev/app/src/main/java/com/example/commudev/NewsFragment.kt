package com.example.commudev.fragments

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.commudev.R
import com.example.commudev.adapters.NewsAdapter
import com.example.commudev.databinding.FragmentNewsBinding
import com.example.commudev.models.NewsArticle
import java.util.Date

class NewsFragment : Fragment() {

    private var _binding: FragmentNewsBinding? = null
    private val binding get() = _binding!!

    private lateinit var newsAdapter: NewsAdapter
    private val newsArticles = mutableListOf<NewsArticle>()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentNewsBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        setupRecyclerView()
        loadNewsArticles()
    }

    private fun setupRecyclerView() {
        binding.newsRecyclerView.layoutManager = LinearLayoutManager(context)
        newsAdapter = NewsAdapter(newsArticles)
        binding.newsRecyclerView.adapter = newsAdapter

        newsAdapter.setOnNewsClickListener(object : NewsAdapter.OnNewsClickListener {
            override fun onNewsArticleClick(article: NewsArticle) {
                openNewsDetail(article)
            }

            override fun onShareClick(article: NewsArticle) {
                shareNewsArticle(article)
            }

            override fun onBookmarkClick(article: NewsArticle) {
                toggleBookmark(article)
            }
        })
    }

    private fun loadNewsArticles() {
        // In a real app, you would fetch news from an API or database
        // For now, we'll use sample data

        val sampleArticles = listOf(
            NewsArticle(
                id = "1",
                title = "Community Garden Project Gets Funding",
                summary = "The local community garden project has received a $50,000 grant to expand its operations and provide more fresh produce to the community.",
                content = "The local community garden project has received a $50,000 grant from the Regional Development Fund to expand its operations. The funding will be used to purchase additional land, build new garden beds, and establish a greenhouse for year-round growing. This expansion will allow the garden to double its production of fresh vegetables and fruits, which are distributed to local families in need.\n\n\"We're thrilled to receive this funding,\" said Maria Lopez, the garden's coordinator. \"This will make a huge difference in our ability to serve the community and promote sustainable food practices.\"\n\nThe community garden, which was established five years ago, currently has 50 volunteer gardeners who maintain individual and communal plots. With the expansion, they hope to bring on an additional 30 volunteers and establish educational programs for local schools.",
                imageUrl = "",
                author = "John Thompson",
                publishDate = Date(),
                source = "Community News",
                url = "https://example.com/news/1",
                isBookmarked = false
            ),
            NewsArticle(
                id = "2",
                title = "New Recycling Initiative Launches Next Month",
                summary = "The city has announced a new recycling program that will expand the types of materials accepted and provide curbside pickup for all residents.",
                content = "Starting next month, the city will launch an expanded recycling program that includes curbside pickup for all residents. The new program will accept a wider range of materials, including soft plastics, electronics, and textiles.\n\n\"This is a major step forward in our city's sustainability goals,\" said Mayor Robert Chen. \"We're making it easier than ever for residents to recycle and reduce waste going to landfills.\"\n\nAs part of the initiative, each household will receive a new sorting bin with compartments for different materials. The city is also establishing three drop-off centers for larger items and hazardous waste.\n\nResidents can attend one of several information sessions scheduled throughout the month to learn more about the program and proper sorting techniques.",
                imageUrl = "",
                author = "Sarah Williams",
                publishDate = Date(System.currentTimeMillis() - 86400000), // Yesterday
                source = "Local News Network",
                url = "https://example.com/news/2",
                isBookmarked = true
            ),
            NewsArticle(
                id = "3",
                title = "Youth Leadership Conference Set for June",
                summary = "The annual Youth Leadership Conference will take place June 15-17 at the Community Center, featuring workshops, speakers, and networking opportunities.",
                content = "The annual Youth Leadership Conference will take place June 15-17 at the Community Center. The event, now in its seventh year, brings together young people ages 14-21 for workshops, panel discussions, and networking opportunities.\n\n\"This conference is designed to empower the next generation of leaders,\" said organizing committee chair David Wilson. \"We focus on practical skills development, community engagement, and social justice issues.\"\n\nThis year's keynote speaker is internationally recognized youth advocate Amara Johnson, who will discuss climate activism and intergenerational cooperation. Other session topics include public speaking, project management, digital literacy, and conflict resolution.\n\nRegistration is open now through May 31, with scholarships available for those who need financial assistance.",
                imageUrl = "",
                author = "Emily Rodriguez",
                publishDate = Date(System.currentTimeMillis() - 172800000), // 2 days ago
                source = "Youth Today",
                url = "https://example.com/news/3",
                isBookmarked = false
            )
        )

        newsArticles.clear()
        newsArticles.addAll(sampleArticles)
        newsAdapter.notifyDataSetChanged()
    }

    private fun openNewsDetail(article: NewsArticle) {
        // In a real app, you would navigate to a detail activity/fragment
        // For now, just show a toast with the article title
        Toast.makeText(context, "Opening article: ${article.title}", Toast.LENGTH_SHORT).show()

        // Example of how you would navigate to a detail screen
        // val intent = Intent(context, NewsDetailActivity::class.java)
        // intent.putExtra("ARTICLE_ID", article.id)
        // startActivity(intent)
    }

    private fun shareNewsArticle(article: NewsArticle) {
        // Create share intent
        val shareIntent = Intent(Intent.ACTION_SEND)
        shareIntent.type = "text/plain"
        shareIntent.putExtra(Intent.EXTRA_SUBJECT, article.title)
        shareIntent.putExtra(Intent.EXTRA_TEXT, "${article.title}\n\n${article.summary}\n\nRead more: ${article.url}")

        // Launch the share dialog
        startActivity(Intent.createChooser(shareIntent, "Share News Article"))
    }

    private fun toggleBookmark(article: NewsArticle) {
        // In a real app, you would update a database or repository
        // For now, just toggle the state in memory and update the adapter

        val index = newsArticles.indexOfFirst { it.id == article.id }
        if (index != -1) {
            val updatedArticle = article.copy(isBookmarked = !article.isBookmarked)
            newsArticles[index] = updatedArticle
            newsAdapter.notifyItemChanged(index)

            val message = if (updatedArticle.isBookmarked) "Article bookmarked" else "Bookmark removed"
            Toast.makeText(context, message, Toast.LENGTH_SHORT).show()
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}