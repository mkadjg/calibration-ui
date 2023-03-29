import {
  DashboardOutlined,
  DescriptionOutlined,
  ConstructionOutlined
} from "@material-ui/icons/";

const Menuitems = [
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
];

export default Menuitems;
