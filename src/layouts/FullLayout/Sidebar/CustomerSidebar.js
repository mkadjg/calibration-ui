import {
  DashboardOutlined,
  DescriptionOutlined,
  AssignmentReturnOutlined,
  ConstructionOutlined
} from "@material-ui/icons/";

const CustomerSidebar = [
  {
    title: "Dashboard",
    icon: DashboardOutlined,
    href: "/main/dashboards/dashboard1",
  },
  {
    title: "Peralatan",
    icon: ConstructionOutlined,
    href: "/main/equipment",
  },
  {
    title: "Kalibrasi",
    icon: DescriptionOutlined,
    href: "/main/customer/calibration",
  },
  {
    title: "Aduan",
    icon: AssignmentReturnOutlined,
    href: "/main/customer/complain",
  },
];

export default CustomerSidebar;
