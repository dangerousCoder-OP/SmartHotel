package org.example.dto.Response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.entity.ReviewReply;


import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewReplyResponse {
    private Long id;
    private String text;
    private LocalDateTime repliedAt;

    public ReviewReplyResponse(ReviewReply reply) {
        this.id = reply.getId();
        this.text = reply.getText();
        this.repliedAt = reply.getRepliedAt();
    }
}