import {
  AssignmentReturnOutlined,
  DashboardOutlined,
  DescriptionOutlined,
} from "@material-ui/icons/";

const TypewriterSidebar = [
  {
    title: "Dashboard",
    icon: DashboardOutlined,
    href: "/main/dashboard/typewriter-dashboard",
  },
  {
    title: "Kalibrasi",
    icon: DescriptionOutlined,
    href: "/main/typewriter/calibration",
  },
  {
    title: "Aduan",
    icon: AssignmentReturnOutlined,
    href: "/main/typewriter/complain",
  },
];

export default TypewriterSidebar;
