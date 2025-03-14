import Main from './gamificationMain';
import Leaderboard from './GamificationLeaderboard';
// import gamificationRewards from './gamificationRewards';
// import gamificationBadges from './gamificationBadges';
import {Routes, Route} from 'react-router-dom';

export default function gamification() {
    return(
        <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/rewards" element={<gamificationRewards />} />
            <Route path="/badges" element={<gamificationBadges />} />
        </Routes>
    )
}