package com.example.commudev;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.google.android.material.chip.Chip;
import com.google.android.material.chip.ChipGroup;
import java.util.List;

public class ResourcesAdapter extends RecyclerView.Adapter<ResourcesAdapter.ViewHolder> {

    private final List<Resource> resources;

    public ResourcesAdapter(List<Resource> resources) {
        this.resources = resources;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_resource, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        Resource resource = resources.get(position);
        holder.titleText.setText(resource.getTitle());
        holder.descriptionText.setText(resource.getDescription());
        holder.creatorText.setText("Created by: " + resource.getCreator());
        holder.dateText.setText(resource.getDate());

        // Add tags as chips
        holder.tagsChipGroup.removeAllViews();
        for (String tag : resource.getTags()) {
            Chip chip = new Chip(holder.tagsChipGroup.getContext());
            chip.setText(tag);
            holder.tagsChipGroup.addView(chip);
        }
    }

    @Override
    public int getItemCount() {
        return resources.size();
    }

    static class ViewHolder extends RecyclerView.ViewHolder {
        TextView titleText;
        TextView descriptionText;
        TextView creatorText;
        TextView dateText;
        ChipGroup tagsChipGroup;

        ViewHolder(View itemView) {
            super(itemView);
            titleText = itemView.findViewById(R.id.resourceTitle);
            descriptionText = itemView.findViewById(R.id.resourceDescription);
            creatorText = itemView.findViewById(R.id.resourceCreator);
            dateText = itemView.findViewById(R.id.resourceDate);
            tagsChipGroup = itemView.findViewById(R.id.tagsChipGroup);
        }
    }
}