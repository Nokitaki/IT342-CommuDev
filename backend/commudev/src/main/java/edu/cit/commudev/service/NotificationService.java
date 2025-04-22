package edu.cit.commudev.service;

import edu.cit.commudev.entity.CommentEntity;
import edu.cit.commudev.entity.NewsfeedEntity;
import edu.cit.commudev.entity.NotificationEntity;
import edu.cit.commudev.entity.User;
import edu.cit.commudev.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private UserService userService;

    /**
     * Get all notifications for the current user (newest first)
     * @return List of notifications
     */
    public List<NotificationEntity> getCurrentUserNotifications() {
        User currentUser = userService.getCurrentUser();
        return notificationRepository.findByUserOrderByCreatedAtDesc(currentUser);
    }

    /**
     * Get unread notifications for the current user
     * @return List of unread notifications
     */
    public List<NotificationEntity> getUnreadNotifications() {
        User currentUser = userService.getCurrentUser();
        return notificationRepository.findByUserAndIsReadFalseOrderByCreatedAtDesc(currentUser);
    }

    /**
     * Count unread notifications for the current user
     * @return Number of unread notifications
     */
    public long countUnreadNotifications() {
        User currentUser = userService.getCurrentUser();
        return notificationRepository.countByUserAndIsReadFalse(currentUser);
    }

    /**
     * Mark a notification as read
     * @param notificationId ID of the notification to mark as read
     * @return The updated notification
     */
    @Transactional
    public NotificationEntity markAsRead(Long notificationId) {
        User currentUser = userService.getCurrentUser();
        NotificationEntity notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new NoSuchElementException("Notification not found"));
        
        // Verify that the notification belongs to the current user
        if (!notification.getUser().getId().equals(currentUser.getId())) {
            throw new SecurityException("You don't have permission to access this notification");
        }
        
        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    /**
     * Mark all notifications for the current user as read
     * @return Number of notifications marked as read
     */
    @Transactional
    public int markAllAsRead() {
        User currentUser = userService.getCurrentUser();
        List<NotificationEntity> unreadNotifications = 
                notificationRepository.findByUserAndIsReadFalseOrderByCreatedAtDesc(currentUser);
        
        for (NotificationEntity notification : unreadNotifications) {
            notification.setRead(true);
            notificationRepository.save(notification);
        }
        
        return unreadNotifications.size();
    }
    
    /**
     * Create a comment notification
     * @param comment The comment that was created
     * @param post The post that was commented on
     */
    @Transactional
    public void createCommentNotification(CommentEntity comment, NewsfeedEntity post) {
        // Only create notification if the commenter is not the post owner
        if (!comment.getUser().getId().equals(post.getUser().getId())) {
            User recipient = post.getUser();
            User actor = comment.getUser();
            
            String notificationText = actor.getUsername() + " commented on your post";
            
            NotificationEntity notification = new NotificationEntity(
                    "COMMENT",
                    notificationText,
                    recipient,
                    actor
            );
            
            notification.setRelatedPostId(post.getNewsfeedId());
            notification.setRelatedCommentId(comment.getCommentId());
            
            notificationRepository.save(notification);
        }
    }
    
    /**
     * Create a like notification
     * @param post The post that was liked
     * @param actor The user who liked the post
     */
    @Transactional
public void createLikeNotification(NewsfeedEntity post, User actor) {
    // Only create notification if the liker is not the post owner
    if (!actor.getId().equals(post.getUser().getId())) {
        User recipient = post.getUser();
        
        String notificationText = actor.getUsername() + " liked your post";
        
        NotificationEntity notification = new NotificationEntity(
                "LIKE",
                notificationText,
                recipient,
                actor
        );
        
        notification.setRelatedPostId(post.getNewsfeedId());
        
        notificationRepository.save(notification);
    }
}
    
    /**
     * Delete notification
     * @param notificationId ID of the notification to delete
     */
    @Transactional
    public void deleteNotification(Long notificationId) {
        User currentUser = userService.getCurrentUser();
        NotificationEntity notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new NoSuchElementException("Notification not found"));
        
        // Verify that the notification belongs to the current user
        if (!notification.getUser().getId().equals(currentUser.getId())) {
            throw new SecurityException("You don't have permission to delete this notification");
        }
        
        notificationRepository.deleteById(notificationId);
    }
}