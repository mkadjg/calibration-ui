import {
  AssignmentReturnOutlined,
  DashboardOutlined,
  DescriptionOutlined,
} from "@material-ui/icons/";

const TechnicianSidebar = [
  {
    title: "Dashboard",
    icon: DashboardOutlined,
    href: "/main/dashboard/technician-dashboard",
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
