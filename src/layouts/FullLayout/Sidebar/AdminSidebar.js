import {
  DashboardOutlined,
  DescriptionOutlined,
  SupervisedUserCircleOutlined,
} from "@material-ui/icons/";

const AdminSidebar = [
  {
    title: "Dashboard",
    icon: DashboardOutlined,
    href: "/main/dashboards/dashboard1",
  },
  {
    title: "Kalibrasi",
    icon: DescriptionOutlined,
    href: "/main/admin/calibration",
  },
  {
    title: "Master Karyawan",
    icon: SupervisedUserCircleOutlined,
    href: "/main/employee",
  },
];

export default AdminSidebar;
