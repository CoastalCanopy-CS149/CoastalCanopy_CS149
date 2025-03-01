import Main from './gamificationMain';
// import gamificationLeaderboard from './gamificationLeaderboard';
// import gamificationRewards from './gamificationRewards';
// import gamificationBadges from './gamificationBadges';
import {Routes, Route} from 'react-router-dom';

export default function gamification() {
    return(
        <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/leaderboard" element={<gamificationLeaderboard />} />
            <Route path="/rewards" element={<gamificationRewards />} />
            <Route path="/badges" element={<gamificationBadges />} />
        </Routes>
    )
}