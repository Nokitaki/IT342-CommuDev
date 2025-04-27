package com.example.commudev;

import android.view.LayoutInflater;
import android.view.View;
import android.widget.FrameLayout;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
import androidx.annotation.NonNull;
import androidx.appcompat.widget.SearchView;
import android.widget.EditText;
import com.google.android.material.card.MaterialCardView;
import com.example.commudev.R;

public class ActivityMainBinding {
    // Updated field names to match your XML layout
    public LinearLayout homeNav;
    public LinearLayout messagesNav;
    public LinearLayout resourcesNav;
    public LinearLayout tasksNav;
    public LinearLayout rewardsNav;
    public LinearLayout feedbackNav;
    public FrameLayout fragmentContainer;
    public MaterialCardView profileButton;
    public ImageView userProfileIcon;
    public EditText searchInput;
    public LinearLayout navBar;
    public LinearLayout municipalCommunity;
    public LinearLayout barangayCommunity;
    public androidx.recyclerview.widget.RecyclerView peopleRecyclerView;
    public androidx.recyclerview.widget.RecyclerView notificationsRecyclerView;

    @NonNull
    public static ActivityMainBinding inflate(@NonNull LayoutInflater inflater) {
        View root = inflater.inflate(R.layout.activity_main, null, false);
        return bind(root);
    }

    @NonNull
    public static ActivityMainBinding bind(@NonNull View root) {
        ActivityMainBinding binding = new ActivityMainBinding();
        binding.homeNav = root.findViewById(R.id.homeNav);
        binding.messagesNav = root.findViewById(R.id.messagesNav);
        binding.resourcesNav = root.findViewById(R.id.resourcesNav);
        binding.fragmentContainer = root.findViewById(R.id.fragmentContainer);
        binding.profileButton = root.findViewById(R.id.profileButton);
        binding.userProfileIcon = root.findViewById(R.id.userProfileIcon);
        binding.searchInput = root.findViewById(R.id.searchInput);
        binding.navBar = root.findViewById(R.id.navigationBar);
        binding.municipalCommunity = root.findViewById(R.id.municipalCommunity);
        binding.barangayCommunity = root.findViewById(R.id.barangayCommunity);
        binding.peopleRecyclerView = root.findViewById(R.id.peopleRecyclerView);
        return binding;
    }

    public View getRoot() {
        return null; // In a real implementation, this would return the root view
    }
}