package com.example.commudev;

import android.view.LayoutInflater;
import android.view.View;
import android.widget.FrameLayout;
import android.widget.ImageButton;
import android.widget.ImageView;
import androidx.annotation.NonNull;
import androidx.appcompat.widget.SearchView;
import com.google.android.material.card.MaterialCardView;
import com.example.commudev.R;

public class ActivityMainBinding {
    public ImageButton homeButton;
    public ImageButton chatButton;
    public ImageButton resourcesButton;
    public ImageButton weatherButton;
    public ImageButton newsButton;
    public FrameLayout fragmentContainer;
    public MaterialCardView profileCard;
    public ImageView userProfileIcon;
    public SearchView searchView;
    public MaterialCardView navBar;
    public MaterialCardView mainContentCard;

    @NonNull
    public static ActivityMainBinding inflate(@NonNull LayoutInflater inflater) {
        View root = inflater.inflate(R.layout.activity_main, null, false);
        return bind(root);
    }

    @NonNull
    public static ActivityMainBinding bind(@NonNull View root) {
        ActivityMainBinding binding = new ActivityMainBinding();
        binding.homeButton = root.findViewById(R.id.homeButton);
        binding.chatButton = root.findViewById(R.id.chatButton);
        binding.resourcesButton = root.findViewById(R.id.resourcesButton);
        binding.weatherButton = root.findViewById(R.id.weatherButton);
        binding.newsButton = root.findViewById(R.id.newsButton);
        binding.fragmentContainer = root.findViewById(R.id.fragmentContainer);
        binding.profileCard = root.findViewById(R.id.profileCard);
        binding.userProfileIcon = root.findViewById(R.id.userProfileIcon);
        binding.searchView = root.findViewById(R.id.searchView);
        binding.navBar = root.findViewById(R.id.navBar);
        binding.mainContentCard = root.findViewById(R.id.mainContentCard);
        return binding;
    }

    public View getRoot() {
        return null;
    }
}