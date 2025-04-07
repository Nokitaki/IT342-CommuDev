package com.example.commudev;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import androidx.annotation.NonNull;
import androidx.appcompat.widget.SearchView;
import com.example.commudev.R;
import com.google.android.material.chip.Chip;

public class FragmentWeatherBinding {
    public SearchView searchBar;
    public Chip coldestFilterChip;
    public Chip temperatureRangeChip;
    public Chip rainyChip;
    public LinearLayout weatherContainer;

    @NonNull
    public static FragmentWeatherBinding inflate(@NonNull LayoutInflater inflater, ViewGroup parent, boolean attachToParent) {
        View root = inflater.inflate(R.layout.fragment_weather, parent, attachToParent);
        return bind(root);
    }

    @NonNull
    public static FragmentWeatherBinding bind(@NonNull View root) {
        FragmentWeatherBinding binding = new FragmentWeatherBinding();
        binding.searchBar = root.findViewById(R.id.searchBar);
        binding.coldestFilterChip = root.findViewById(R.id.coldestFilterChip);
        binding.temperatureRangeChip = root.findViewById(R.id.temperatureRangeChip);
        binding.rainyChip = root.findViewById(R.id.rainyChip);
        binding.weatherContainer = root.findViewById(R.id.weatherContainer);
        return binding;
    }

    public View getRoot() {
        return null;
    }
}