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
  Snackbar,
} from "@material-ui/core";
import Footer from "../../layouts/FullLayout/Footer/Footer";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const MainWrapper = experimentalStyled("div")(({ theme }) => ({
  display: "flex",
  minHeight: "100vh",
  overflow: "hidden",
  width: "100%",
}));

const Register = () => {
  const [data, setData] = useState({
    companyName: '',
    picName: '',
    email: '',
    phoneNumber: '',
    address: '', 
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
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: ""
  });

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    })
  }

  const handleCloseSnackbar = () => {
    setSnackbar(false);
  }

  const submit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios.post(`${process.env.REACT_APP_BASE_URL}/customer/register`, data)
      .then((response) => {
        if (response.status === 201) {
          setLoading(false);
          setSnackbar({
            open: true,
            severity: "success",
            message: "Pendaftaran pelanggan berhasil"
          });
          navigate("/#/login");
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
        <Container>
          <Card
            style={{ marginLeft: '18%', marginRight: '18%' }}
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
                  Formulir Pendaftaran Pelanggan
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
                  id="company-name-text"
                  label="Nama Perusahaan"
                  type="text"
                  name="companyName"
                  variant="outlined"
                  fullWidth
                  sx={{
                    mb: 2,
                  }}
                  onChange={handleChange}
                />

                <TextField
                  id="pic-name-text"
                  label="Nama PIC"
                  type="text"
                  name="picName"
                  variant="outlined"
                  fullWidth
                  sx={{
                    mb: 2,
                  }}
                  onChange={handleChange}
                />

                <TextField
                  id="email-text"
                  label="Email"
                  type="text"
                  name="email"
                  variant="outlined"
                  fullWidth
                  sx={{
                    mb: 2,
                  }}
                  onChange={handleChange}
                />

                <TextField
                  id="phone-number-text"
                  label="Nomor Telepon"
                  type="text"
                  name="phoneNumber"
                  variant="outlined"
                  fullWidth
                  sx={{
                    mb: 2,
                  }}
                  onChange={handleChange}
                />

                <TextField
                  id="address-text"
                  label="Alamat"
                  type="text"
                  name="address"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={2}
                  sx={{
                    mb: 2,
                  }}
                  onChange={handleChange}
                />

                <Divider/>
                <br/>

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
                  <Alert style={{ marginTop: '20px' }} severity={alert.severity}>
                    {alert.message}
                  </Alert> : ""}
              </form>
            </CardContent>
            <Footer />
          </Card>
        </Container>

        <Snackbar open={snackbar.open}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </MainWrapper>
  );
};

export default Register;
