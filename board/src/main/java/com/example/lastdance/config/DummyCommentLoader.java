//package com.example.lastdance.config;
//
//import com.example.lastdance.entity.Comment;
//import com.example.lastdance.entity.Post;
//import com.example.lastdance.repository.CommentRepository;
//import com.example.lastdance.repository.PostRepository;
//import jakarta.annotation.PostConstruct;
//import jakarta.transaction.Transactional;
//import lombok.RequiredArgsConstructor;
//import net.datafaker.Faker;
//import org.springframework.stereotype.Component;
//
//import java.time.LocalDateTime;
//import java.util.ArrayList;
//import java.util.List;
//import java.util.Locale;
//import java.util.Random;
//
//@Component
//@RequiredArgsConstructor
//public class DummyCommentLoader {
//
//    private final CommentRepository commentRepository;
//    private final PostRepository postRepository;
//
//    private final Faker faker = new Faker(new Locale("ko"));
//    private final Random random = new Random();
//
//    @PostConstruct
//    @Transactional
//    public void initDummyComments() {
//        if (commentRepository.count() > 0) {
//            System.out.println("댓글이 이미 존재합니다.");
//            return;
//        }
//
//        List<Post> posts = postRepository.findAll();
//        List<Comment> commentBatch = new ArrayList<>();
//        int totalCount = 0;
//
//        for (Post post : posts) {
//            int commentCount = random.nextInt(5) + 1; // 댓글 1~5개 랜덤 생성
//
//            for (int i = 0; i < commentCount; i++) {
//                Comment comment = Comment.builder()
//                        .post(post)
//                        .authorId((long) faker.number().numberBetween(1, 1000))
//                        .content(faker.lorem().sentence())
//                        .createdAt(LocalDateTime.now())
//                        .build();
//
//                commentBatch.add(comment);
//                totalCount++;
//            }
//
//            if (commentBatch.size() >= 1000) {
//                commentRepository.saveAll(commentBatch);
//                commentBatch.clear();
//                System.out.println("댓글 1000개 저장 완료");
//            }
//        }
//
//        if (!commentBatch.isEmpty()) {
//            commentRepository.saveAll(commentBatch);
//            System.out.println("잔여 댓글 저장 완료");
//        }
//
//        System.out.println("총 생성된 댓글 수: " + totalCount + "개");
//    }
//}
