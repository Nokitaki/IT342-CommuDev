package com.example.commudev;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import androidx.annotation.NonNull;
import com.example.commudev.R;

public class FragmentHomeBinding {
    public TextView newsHeader;
    public EditText createPostInput;
    public TextView newsTitle;
    public TextView newsContent;
    public Button readMoreButton;
    public Button postButton;

    @NonNull
    public static FragmentHomeBinding inflate(@NonNull LayoutInflater inflater, ViewGroup parent, boolean attachToParent) {
        View root = inflater.inflate(R.layout.fragment_home, parent, attachToParent);
        return bind(root);
    }

    @NonNull
    public static FragmentHomeBinding bind(@NonNull View root) {
        FragmentHomeBinding binding = new FragmentHomeBinding();
        binding.newsHeader = root.findViewById(R.id.newsHeader);
        binding.createPostInput = root.findViewById(R.id.createPostInput);
        binding.newsTitle = root.findViewById(R.id.newsTitle);
        binding.newsContent = root.findViewById(R.id.newsContent);
        binding.readMoreButton = root.findViewById(R.id.readMoreButton);
        binding.postButton = root.findViewById(R.id.postButton);
        return binding;
    }

    public View getRoot() {
        return null;
    }
}