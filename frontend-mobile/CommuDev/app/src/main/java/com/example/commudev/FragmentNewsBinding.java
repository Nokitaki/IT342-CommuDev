package com.example.commudev;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.example.commudev.R;

public class FragmentNewsBinding {
    public RecyclerView newsRecyclerView;

    @NonNull
    public static FragmentNewsBinding inflate(@NonNull LayoutInflater inflater, ViewGroup parent, boolean attachToParent) {
        View root = inflater.inflate(R.layout.fragment_news, parent, attachToParent);
        return bind(root);
    }

    @NonNull
    public static FragmentNewsBinding bind(@NonNull View root) {
        FragmentNewsBinding binding = new FragmentNewsBinding();
        binding.newsRecyclerView = root.findViewById(R.id.newsRecyclerView);
        return binding;
    }

    public View getRoot() {
        return null;
    }
}