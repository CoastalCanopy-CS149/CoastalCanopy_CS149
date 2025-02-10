import { Routes, Route} from "react-router-dom"
import CommunityReportingMain from "./report_main"
import ReportAnonymous from "./report_anonymous"
import ReportIdentity from "./report_identity"

export default function Reporting() {

  return (
    <Routes>
      <Route index element={<CommunityReportingMain />} />
      <Route path="report-anonymous" element={<ReportAnonymous />} />
      <Route path="report-identity" element={<ReportIdentity />} />
    </Routes>
  )
}

