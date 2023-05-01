import {
  AssignmentReturnOutlined,
  DashboardOutlined,
  DescriptionOutlined,
} from "@material-ui/icons/";

const TechnicianSidebar = [
  {
    title: "Dashboard",
    icon: DashboardOutlined,
    href: "/main/dashboards/dashboard1",
  },
  {
    title: "Kalibrasi",
    icon: DescriptionOutlined,
    href: "/main/technician/calibration",
  },
  {
    title: "Aduan",
    icon: AssignmentReturnOutlined,
    href: "/main/technician/complain",
  },
];

export default TechnicianSidebar;
