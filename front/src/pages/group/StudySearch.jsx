import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import StudyCard from "../../components/group/StudyCard.jsx";
import { getAllStudyGroupsPaged } from "../../api/GroupServiceApi.js";
import { fetchCategoryList } from "../../api/boardApi.js";
import "../../style/group/StudySearch.css";
import "../../style/group/StudyCard.css";

function StudySearch() {
    const navigate = useNavigate();
    const [studies, setStudies] = useState([]);
    const [filteredStudies, setFilteredStudies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('all');
    const [location, setLocation] = useState('all');
    const [sortBy, setSortBy] = useState('latest');
    const [isLoading, setIsLoading] = useState(true);
    const [categories, setCategories] = useState([{ id: 'all', name: '전체' }]);

    const locations = [
        { id: 'seoul', name: '서울' },
        { id: 'gyeonggi', name: '경기' },
        { id: 'incheon', name: '인천' },
        { id: 'daegu', name: '대구' },
        { id: 'jeju', name: '제주' },
        { id: 'busan', name: '부산' },
        { id: 'gwangju', name: '광주' },
        { id: 'gangwon', name: '강원' },
        { id: 'ulsan', name: '울산' },
        { id: 'chungbook', name: '충북' },
        { id: 'chungnam', name: '충남' },
        { id: 'daejeon', name: '대전' },
    ];

    useEffect(() => {
        const fetchStudies = async () => {
            setIsLoading(true);
            try {
                const response = await getAllStudyGroupsPaged(0, 15);
                const data = response.data.content;
                setStudies(data);
                setFilteredStudies(data);
            } catch (error) {
                console.error('❌ 스터디 데이터 로딩 실패:', error);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchCategories = async () => {
            try {
                const res = await fetchCategoryList();
                const serverCategories = res.data.map(c => ({
                    id: c.category.toLowerCase(),
                    name: c.category
                }));
                setCategories([{ id: 'all', name: '전체' }, ...serverCategories]);
            } catch (error) {
                console.error('❌ 카테고리 불러오기 실패:', error);
            }
        };

        fetchStudies();
        fetchCategories();
    }, []);

    useEffect(() => {
        let filtered = studies;

        if (searchTerm) {
            filtered = filtered.filter(study =>
                study.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                study.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (category !== 'all') {
            filtered = filtered.filter(study => study.category?.toLowerCase() === category);
        }

        if (location !== 'all') {
            filtered = filtered.filter(study => study.location === location);
        }

        switch (sortBy) {
            case 'members':
                filtered.sort((a, b) => b.currentMember - a.currentMember);
                break;
            case 'startDate':
                filtered.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
                break;
            default:
                filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        setFilteredStudies(filtered);
    }, [searchTerm, category, location, sortBy, studies]);

    const handleStudyClick = (studyId) => {
        navigate(`/study/${studyId}`);
    };

    if (isLoading) {
        return <div className="loading">로딩 중...</div>;
    }

    return (
        <>
            <button className="study-create-btn" onClick={()=> navigate("/study/create")}>스터디 생성</button>
            <div className="sub-header">
                <h2>지금 모집 중인 스터디 그룹</h2>
                <p>함께 공부할 사람들을 찾고 계신가요? 관심 있는 스터디를 지금 바로 찾아보세요.</p>
            </div>
            <div className="study-search-container">
                <aside className="search-sidebar">
                    <h3 className="filter-title"> 필터 검색</h3>
                    <input
                        type="text"
                        placeholder="스터디명 검색"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="filter-input"
                    />

                    <div className="filter-group">
                        <label>카테고리</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)}>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>지역</label>
                        <select value={location} onChange={(e) => setLocation(e.target.value)}>
                            {locations.map(loc => (
                                <option key={loc.id} value={loc.id}>{loc.name}</option>
                            ))}
                        </select>
                    </div>
                </aside>

                <div className="study-content-column">
                    <div className="recommendation-box">
                        <div className="message">AI 추천 스터디: "React 입문자 스터디"</div>
                        <div className="ai-hint">지난주 35명이 신청한 인기 스터디입니다.</div>
                    </div>

                    <div className="study-main-list">
                        {filteredStudies.length === 0 ? (
                            <div className="no-results">검색 결과가 없습니다.</div>
                        ) : (
                            filteredStudies.map(study => (
                                <StudyCard
                                    key={study.id}
                                    study={study}
                                    categories={categories}
                                    locations={locations}
                                    onClick={() => handleStudyClick(study.id)}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default StudySearch;
