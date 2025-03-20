import Main from './gamificationMain'
import Leaderboard from './gamificationLeaderboard'
import VirtualMangrove from './virtualMangrove';
// import GamificationBadges from './gamificationBadges';
import Progress from './progress'
import {Routes, Route} from 'react-router-dom';

export default function gamification() {
    return(
        <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/rewards" element={<gamificationRewards />} />
            <Route path="/badges" element={<gamificationBadges />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/plant" element={<VirtualMangrove />} />

        </Routes>
    )
}