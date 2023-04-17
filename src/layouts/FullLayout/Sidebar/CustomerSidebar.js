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
    href: "/dashboards/dashboard1",
  },
  {
    title: "Peralatan",
    icon: ConstructionOutlined,
    href: "/equipment",
  },
  {
    title: "Kalibrasi",
    icon: DescriptionOutlined,
    href: "/customer/calibration",
  },
  {
    title: "Aduan",
    icon: AssignmentReturnOutlined,
    href: "/customer/complain",
  },
];

export default CustomerSidebar;
