package edu.cit.commudev.entity;


/**
 * Enumeration of Employment Statuses for dropdown selection
 */
public enum EmploymentStatus {
    EMPLOYED_FULL_TIME("Employed Full-Time"),
    EMPLOYED_PART_TIME("Employed Part-Time"),
    SELF_EMPLOYED("Self-Employed"),
    UNEMPLOYED("Unemployed"),
    STUDENT("Student"),
    RETIRED("Retired"),
    HOMEMAKER("Homemaker"),
    UNABLE_TO_WORK("Unable to Work"),
    PREFER_NOT_TO_SAY("Prefer Not to Say");

    private final String displayName;

    EmploymentStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    @Override
    public String toString() {
        return displayName;
    }
}