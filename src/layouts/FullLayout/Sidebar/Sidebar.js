import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { Link, NavLink } from "react-router-dom";
import {
  Box,
  Drawer,
  useMediaQuery,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
} from "@material-ui/core";
import { SidebarWidth } from "../../../assets/global/Theme-variable";
import logo from "./../../../assets/images/logo-quality.jpeg";
import CustomerSidebar from "./CustomerSidebar";
import AdminSidebar from "./AdminSidebar";
import { useCookies } from "react-cookie";
import TechnicianSidebar from "./TechnicianSidebar";
import TypewriterSidebar from "./TypewriterSidebar";
import QualitySidebar from "./QualitySidebar";

const Sidebar = (props) => {
  const [open, setOpen] = React.useState(true);
  const { pathname } = useLocation();
  const pathDirect = pathname;
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookies] = useCookies({});
  const [menuItems, setMenuItems] = useState([]);

  const handleClick = (index) => {
    if (open === index) {
      setOpen((prevopen) => !prevopen);
    } else {
      setOpen(index);
    }
  };

  useEffect(() => {
    if (cookies.auth?.role?.roleName === 'Customer') {
      setMenuItems(CustomerSidebar);
    } else if (cookies.auth?.userProfile?.jobPosition?.jobPositionName === 'Admin') {
      setMenuItems(AdminSidebar);
    } else if (cookies.auth?.userProfile?.jobPosition?.jobPositionName === 'Technician') {
      setMenuItems(TechnicianSidebar);
    } else if (cookies.auth?.userProfile?.jobPosition?.jobPositionName === 'Certificate') {
      setMenuItems(TypewriterSidebar);
    } else if (cookies.auth?.userProfile?.jobPosition?.jobPositionName === 'Quality') {
      setMenuItems(QualitySidebar);
    } else {
      setMenuItems([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const SidebarContent = (
    <Box sx={{ p: 3, height: "calc(100vh - 40px)" }}>
      <Link to="/">
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            alt="logo"
            src={logo}
            sx={{ width: '50%', height: '50%' }}
            variant="rounded"
          />
        </Box>
      </Link>

      <Box>
        <List
          sx={{
            mt: 4,
          }}
        >
          {menuItems.map((item, index) => {
            //{/********SubHeader**********/}

            return (
              <List component="li" disablePadding key={item.title}>
                <ListItem
                  onClick={() => handleClick(index)}
                  button
                  component={NavLink}
                  to={item.href}
                  selected={pathDirect === item.href}
                  sx={{
                    mb: 1,
                    ...(pathDirect === item.href && {
                      color: "white",
                      backgroundColor: (theme) =>
                        `${theme.palette.primary.main}!important`,
                    }),
                  }}
                >
                  <ListItemIcon
                    sx={{
                      ...(pathDirect === item.href && { color: "white" }),
                    }}
                  >
                    <item.icon width="20" height="20" />
                  </ListItemIcon>
                  <ListItemText>{item.title}</ListItemText>
                </ListItem>
              </List>
            );
          })}
        </List>
      </Box>
    </Box>
  );
  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open={props.isSidebarOpen}
        variant="persistent"
        PaperProps={{
          sx: {
            width: SidebarWidth,
          },
        }}
      >
        {SidebarContent}
      </Drawer>
    );
  }
  return (
    <Drawer
      anchor="left"
      open={props.isMobileSidebarOpen}
      onClose={props.onSidebarClose}
      PaperProps={{
        sx: {
          width: SidebarWidth,
        },
      }}
      variant="temporary"
    >
      {SidebarContent}
    </Drawer>
  );
};

export default Sidebar;
