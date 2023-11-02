import './dashboard.css'
import {adminDashboard as DashboardLink} from '../Shared/common'

export default function AdminDashboard() {
    return (
      <div className="main">
        <div className='text'>Admin Dashboard</div>
        <iframe src={DashboardLink} className='dashboardArea' ></iframe>
      </div>
    );
  }