import React, { useEffect, useState } from "react";
import { Grid, Box, Card, CardContent, Typography, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Container, Rating } from "@material-ui/core";

import axios from "axios";
import { useCookies } from "react-cookie";

const TypewriterDashboard = () => {
  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookies] = useCookies();
  const [calibrationAnalysis, setCalibrationAnalysis] = useState([]);

  const getCustomerAnalysis = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/dashboard/find-customer-analysis-typewriter/${cookies.auth?.userProfile?.id}`, { headers: { Authorization: `Bearer ${cookies.auth.token}` } })
      .then((response) => {
        if (response.status === 200) {
          setCalibrationAnalysis(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getCustomerAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Container>
      <Box>
        <Grid container spacing={0}>
          <Grid item xs={12} lg={12}>
            <Card variant="outlined">
              <CardContent>
                <Box
                  sx={{
                    display: {
                      sm: "flex",
                      xs: "block",
                    },
                    alignItems: "flex-start",
                  }}
                >
                  <Box>
                    <Typography
                      variant="h3"
                      sx={{
                        marginBottom: "0",
                      }}
                      gutterBottom
                    >
                      Analisis Pelanggan Kalibrasi
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    mt: 3,
                  }}
                >
                  <TableContainer sx={{ maxHeight: 400, overflow: 'auto' }}>
                    <Table
                      stickyHeader
                      aria-label="simple table"
                      sx={{
                        mt: 3,
                        whiteSpace: "nowrap",
                      }}
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <Typography color="textSecondary" variant="h6">
                              Nama Perusahaan
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography color="textSecondary" variant="h6">
                              Nama PIC
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography color="textSecondary" variant="h6">
                              Alamat
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography color="textSecondary" variant="h6">
                              Jumlah Kalibrasi
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography color="textSecondary" variant="h6">
                              Rata-rata Penilaian
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography color="textSecondary" variant="h6">
                              Rata-rata Angka
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {calibrationAnalysis.map((calibrationAnalysis) => (
                          <TableRow key={calibrationAnalysis.id}>
                            <TableCell>
                              <Typography
                                sx={{
                                  fontSize: "15px",
                                  fontWeight: "500",
                                }}
                              >
                                {calibrationAnalysis.customers?.companyName}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <Box>
                                  <Typography
                                    variant="h6"
                                    sx={{
                                      fontWeight: "600",
                                    }}
                                  >
                                    {calibrationAnalysis.customers?.picName}
                                  </Typography>
                                  <Typography
                                    color="textSecondary"
                                    sx={{
                                      fontSize: "13px",
                                    }}
                                  >
                                    {calibrationAnalysis.customers?.phoneNumber}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography
                                sx={{
                                  fontSize: "15px",
                                  fontWeight: "500",
                                }}
                              >
                                {calibrationAnalysis.customers?.address}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography
                                sx={{
                                  fontSize: "15px",
                                  fontWeight: "500",
                                }}
                              >
                                {calibrationAnalysis.count}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography
                                sx={{
                                  fontSize: "15px",
                                  fontWeight: "500",
                                }}
                              >
                                <Rating name="size-large" value={calibrationAnalysis.averageRate} readOnly size="small" />
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography
                                sx={{
                                  fontSize: "15px",
                                  fontWeight: "500",
                                }}
                              >
                                ({calibrationAnalysis.averageRate})
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default TypewriterDashboard;
