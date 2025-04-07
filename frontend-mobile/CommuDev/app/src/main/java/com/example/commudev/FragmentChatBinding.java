package com.example.commudev;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.example.commudev.R;

public class FragmentChatBinding {
    public RecyclerView conversationsRecyclerView;
    public LinearLayout selectedConversationLayout;
    public TextView chatUserName;
    public TextView chatUserStatus;
    public ScrollView messagesScrollView;
    public LinearLayout messagesContainer;
    public EditText messageInput;
    public ImageButton sendButton;

    @NonNull
    public static FragmentChatBinding inflate(@NonNull LayoutInflater inflater, ViewGroup parent, boolean attachToParent) {
        View root = inflater.inflate(R.layout.fragment_chat, parent, attachToParent);
        return bind(root);
    }

    @NonNull
    public static FragmentChatBinding bind(@NonNull View root) {
        FragmentChatBinding binding = new FragmentChatBinding();
        binding.conversationsRecyclerView = root.findViewById(R.id.conversationsRecyclerView);
        binding.selectedConversationLayout = root.findViewById(R.id.selectedConversationLayout);
        binding.chatUserName = root.findViewById(R.id.chatUserName);
        binding.chatUserStatus = root.findViewById(R.id.chatUserStatus);
        binding.messagesScrollView = root.findViewById(R.id.messagesScrollView);
        binding.messagesContainer = root.findViewById(R.id.messagesContainer);
        binding.messageInput = root.findViewById(R.id.messageInput);
        binding.sendButton = root.findViewById(R.id.sendButton);
        return binding;
    }

    public View getRoot() {
        // In a real ViewBinding implementation, this would return the root view
        // For this simplified version, we'll just return null
        return null;
    }
}