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
    href: "/main/dashboard/customer-dashboard",
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
