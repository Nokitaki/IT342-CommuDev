package com.example.commudev;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.annotation.NonNull;
import com.example.commudev.R;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.textfield.TextInputEditText;

public class ActivityLoginBinding {
    public TextInputEditText usernameEditText;
    public TextInputEditText passwordEditText;
    public MaterialButton loginButton;
    public MaterialButton registerRedirectButton;
    public TextView forgotPasswordText;
    public TextView registerText;

    @NonNull
    public static ActivityLoginBinding inflate(@NonNull LayoutInflater inflater) {
        View root = inflater.inflate(R.layout.activity_login, null, false);
        return bind(root);
    }

    @NonNull
    public static ActivityLoginBinding bind(@NonNull View root) {
        ActivityLoginBinding binding = new ActivityLoginBinding();
        binding.usernameEditText = root.findViewById(R.id.usernameEditText);
        binding.passwordEditText = root.findViewById(R.id.passwordEditText);
        binding.loginButton = root.findViewById(R.id.loginButton);
        binding.registerRedirectButton = root.findViewById(R.id.registerRedirectButton);
        binding.forgotPasswordText = root.findViewById(R.id.forgotPasswordText);
        binding.registerText = root.findViewById(R.id.registerText);
        return binding;
    }

    public View getRoot() {
        return null;
    }
}