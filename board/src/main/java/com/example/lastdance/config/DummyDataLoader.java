//package com.example.lastdance.config;
//
//import com.example.lastdance.entity.Board;
//import com.example.lastdance.entity.Post;
//import com.example.lastdance.entity.Tag;
//import com.example.lastdance.repository.BoardRepository;
//import com.example.lastdance.repository.PostRepository;
//import com.example.lastdance.repository.TagRepository;  // TagRepository 추가
//import jakarta.annotation.PostConstruct;
//import jakarta.transaction.Transactional;
//import lombok.RequiredArgsConstructor;
//import net.datafaker.Faker;
//import org.springframework.stereotype.Component;
//
//import java.util.*;
//import java.util.stream.Collectors;
//
//@Component // 또는 @Configuration
//@RequiredArgsConstructor
//public class DummyDataLoader {
//
//    private final PostRepository postRepository;
//    private final BoardRepository boardRepository;
//    private final TagRepository tagRepository;  // TagRepository 주입
//
//    private final Faker faker = new Faker(new Locale("ko"));
//
//    @PostConstruct
//    @Transactional
//    public void init() {
//        int count = 100;
//        int batchSize = 1000;
//
//        List<Board> allBoards = boardRepository.findAll();
//        if (allBoards.isEmpty()) {
//            throw new IllegalStateException("게시판(Board) 데이터가 존재하지 않습니다.");
//        }
//
//        List<Tag> allTags = tagRepository.findAll(); // 기존에 DB에 저장된 태그들을 가져옴
//        if (allTags.isEmpty()) {
//            throw new IllegalStateException("태그(Tag) 데이터가 존재하지 않습니다.");
//        }
//
//        List<Post> batch = new ArrayList<>();
//
//        for (int i = 1; i <= count; i++) {
//            Board randomBoard = allBoards.get(faker.number().numberBetween(0, allBoards.size()));
//
//            Post post = Post.builder()
//                    .title(faker.lorem().sentence()) // 한글 문장으로 제목 생성
//                    .content(faker.lorem().paragraph(3)) // 한글 문단
//                    .nickname(faker.name().username())
//                    .authorId((long) faker.number().numberBetween(1, 1000))
//                    .board(randomBoard) // 랜덤 게시판
//                    .viewCount(faker.number().numberBetween(0, 100))
//                    .tags(assignRandomTags(allTags))  // 랜덤 태그 할당
//                    .build();
//
//            batch.add(post);
//
//            if (i % batchSize == 0) {
//                postRepository.saveAll(batch);
//                postRepository.flush(); // 즉시 insert
//                batch.clear();
//                System.out.println(i + "건 배치 저장 완료");
//            }
//        }
//
//        // 남은 데이터 저장
//        if (!batch.isEmpty()) {
//            postRepository.saveAll(batch);
//            System.out.println("남은 데이터 " + batch.size() + "건 저장 완료");
//        }
//
//        System.out.println("총 " + count + "건의 게시글 생성 완료!");
//    }
//
//
//    // 포스트에 임의의 태그를 할당하는 메서드
//    private Set<Tag> assignRandomTags(List<Tag> allTags) {
//        // 태그 수를 1~3개로 랜덤 설정
//        int tagCount = faker.number().numberBetween(1, 4);
//
//        // 태그 리스트에서 랜덤하게 tagCount만큼 선택하기 위해 리스트를 셔플합니다.
//        Collections.shuffle(allTags);  // 리스트를 랜덤하게 섞기
//
//        // 셔플된 리스트에서 필요한 수만큼 태그를 선택합니다.
//        return new HashSet<>(allTags.subList(0, tagCount));  // 태그를 Set으로 변환하여 반환
//    }
//}