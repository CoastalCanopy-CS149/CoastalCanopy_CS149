import { Routes, Route, useLocation, useNavigate } from "react-router-dom"
import CommunityReportingMain from "./report_main"
import ReportAnonymous from "./report_anonymous"
import ReportIdentity from "./report_identity"

export default function Reporting() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <Routes>
      <Route index element={<CommunityReportingMain />} />
      <Route path="report-anonymous" element={<ReportAnonymous location={location} navigate={navigate} />} />
      <Route path="report-identity" element={<ReportIdentity location={location} navigate={navigate} />} />
    </Routes>
  )
}

