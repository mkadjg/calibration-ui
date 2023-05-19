import React, { useState } from "react";
import {
  experimentalStyled,
  Container,
  Box,
  Card,
  Typography,
  CardContent,
  TextField,
  Divider,
  Button,
  CircularProgress,
  Alert,
  Link,
  Avatar,
  InputAdornment,
  IconButton,
} from "@material-ui/core";
import Footer from "./../../layouts/FullLayout/Footer/Footer";
import { TopbarHeight } from "../../assets/global/Theme-variable";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import logo from "./../../assets/images/logo-quality.jpeg";
import { Visibility, VisibilityOff } from "@material-ui/icons";

const MainWrapper = experimentalStyled("div")(({ theme }) => ({
  display: "flex",
  minHeight: "100vh",
  overflow: "hidden",
  width: "100%",
}));
const PageWrapper = experimentalStyled("div")(({ theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  overflow: "hidden",

  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.up("lg")]: {
    paddingTop: TopbarHeight,
  },
  [theme.breakpoints.down("lg")]: {
    paddingTop: "64px",
  },
}));

const Login = () => {
  const [data, setData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: ""
  });
  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookies] = useCookies({});
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    })
  }

  const submit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios.post(`${process.env.REACT_APP_BASE_URL}/auth/login`, data)
      .then((response) => {
        if (response.status === 200) {
          setLoading(false);
          setCookies('auth', response.data, { path: '/' });
          if (response.data.role?.roleName === 'Customer') {
            navigate("/main/dashboard/customer-dashboard");
          } else if (response.data.userProfile?.jobPosition?.jobPositionName === 'Admin') {
            navigate("/main/dashboard/admin-dashboard");
          } else if (response.data.userProfile?.jobPosition?.jobPositionName === 'Technician') {
            navigate("/main/dashboard/technician-dashboard");
          } else if (response.data.userProfile?.jobPosition?.jobPositionName === 'Certificate') {
            navigate("/main/dashboard/typewriter-dashboard");
          } else if (response.data.userProfile?.jobPosition?.jobPositionName === 'Quality') {
            navigate("/main/dashboard/quality-dashboard");
          }
        } else {
          setLoading(false);
          setAlert({
            open: true,
            message: response.data,
            severity: "error"
          });
        }

      })
      .catch((error) => {
        setLoading(false);
        setAlert({
          open: true,
          message: error.response?.data,
          severity: "error"
        });
      });
  }

  return (
    <MainWrapper>
      <PageWrapper>
        <Container>
          <Avatar
            alt="logo"
            src={logo}
            sx={{ width: 280, height: 125, marginLeft: '38%', marginRight: '38%' }}
            variant="square"
          />
          <Card
            style={{ marginTop: '2%', marginLeft: '28%', marginRight: '28%' }}
            variant="outlined"
            sx={{
              p: 0,
            }}
          >
            <Box
              sx={{
                padding: "15px 30px",
              }}
              display="flex"
              alignItems="center"
            >
              <Box flexGrow={1}>
                <Typography
                  sx={{
                    fontSize: "24px",
                    fontWeight: "500",
                  }}
                >
                  Login
                </Typography>
              </Box>
            </Box>
            <Divider />
            <CardContent
              sx={{
                padding: "30px",
              }}
            >
              <form>

                <TextField
                  id="email-text"
                  label="Username"
                  type="text"
                  name="username"
                  variant="outlined"
                  fullWidth
                  sx={{
                    mb: 2,
                  }}
                  onChange={handleChange}
                />

                <TextField
                  id="outlined-password-input"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  variant="outlined"
                  fullWidth
                  sx={{
                    mb: 2,
                  }}
                  onChange={handleChange}
                  InputProps={{ 
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />

                <Button
                  color="primary"
                  size="large" fullWidth
                  variant="contained"
                  onClick={submit}
                  disabled={loading}

                >
                  {loading ? <CircularProgress size={26} color="inherit" /> : "Submit"}
                </Button>

                {alert.open ?
                  <Alert style={{ marginTop: '20px' }} severity={alert.severity}>
                    {alert.message}
                  </Alert> : ""}
              </form>
            </CardContent>
            <Box sx={{ textAlign: 'center' }}>
              <Typography>Belum punya akun ? <Link href="/#/register">Daftar Sekarang</Link></Typography>
            </Box>
            <Footer />
          </Card>
        </Container>
      </PageWrapper>
    </MainWrapper>
  );
};

export default Login;
