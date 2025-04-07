package com.example.commudev;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.example.commudev.R;
import com.google.android.material.button.MaterialButton;

public class FragmentResourcesBinding {
    public TextView allResourcesTab;
    public TextView documentsTab;
    public TextView mediaTab;
    public MaterialButton createResourceButton;
    public RecyclerView resourcesRecyclerView;

    @NonNull
    public static FragmentResourcesBinding inflate(@NonNull LayoutInflater inflater, ViewGroup parent, boolean attachToParent) {
        View root = inflater.inflate(R.layout.fragment_resources, parent, attachToParent);
        return bind(root);
    }

    @NonNull
    public static FragmentResourcesBinding bind(@NonNull View root) {
        FragmentResourcesBinding binding = new FragmentResourcesBinding();
        binding.allResourcesTab = root.findViewById(R.id.allResourcesTab);
        binding.documentsTab = root.findViewById(R.id.documentsTab);
        binding.mediaTab = root.findViewById(R.id.mediaTab);
        binding.createResourceButton = root.findViewById(R.id.createResourceButton);
        binding.resourcesRecyclerView = root.findViewById(R.id.resourcesRecyclerView);
        return binding;
    }

    public View getRoot() {
        return null;
    }
}