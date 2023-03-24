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
} from "@material-ui/core";
import Footer from "./../../layouts/FullLayout/Footer/Footer";
import { TopbarHeight } from "../../assets/global/Theme-variable";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

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
          navigate("/dashboards/dashboard1");
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
          <Card
            style={{ marginTop: '8%', marginLeft: '28%', marginRight: '28%' }}
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
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  variant="outlined"
                  fullWidth
                  sx={{
                    mb: 2,
                  }}
                  onChange={handleChange}
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
                  <Alert style={{marginTop: '20px'}} severity={alert.severity}>
                    { alert.message }
                  </Alert> : ""}
              </form>
            </CardContent>
            <Footer />
          </Card>
        </Container>
      </PageWrapper>
    </MainWrapper>
  );
};

export default Login;
