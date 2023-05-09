import React, { useEffect, useState } from "react";
import { Grid, Box, Card, CardContent, Typography, MenuItem, Select, FormControl, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Container } from "@material-ui/core";

import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineOppositeContent, TimelineSeparator } from "@material-ui/lab";
import Moment from "react-moment";
import moment from 'moment';
import axios from "axios";
import { useCookies } from "react-cookie";

const CustomerDashboard = () => {
  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookies] = useCookies();
  const [months, setMonths] = useState([]);
  const [calibrationTrack, setCalibrationTrack] = useState([]);
  const [complainTrack, setComplainTrack] = useState([]);
  const [calibrationHistory, setCalibrationHistory] = useState([]);
  const [complainHistory, setComplainHistory] = useState([]);

  const getCalibrationTrack = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/dashboard/find-actual-calibration-track/${cookies.auth.userProfile.id}`, { headers: { Authorization: `Bearer ${cookies.auth.token}` } })
      .then((response) => {
        if (response.status === 200) {
          setCalibrationTrack(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getComplainTrack = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/dashboard/find-actual-complain-track/${cookies.auth.userProfile.id}`, { headers: { Authorization: `Bearer ${cookies.auth.token}` } })
      .then((response) => {
        if (response.status === 200) {
          setComplainTrack(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getCalibrationHistory = (period) => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/dashboard/find-calibration-history/${cookies.auth.userProfile.id}`, { params: { period: period}, headers: { Authorization: `Bearer ${cookies.auth.token}` } })
      .then((response) => {
        if (response.status === 200) {
          setCalibrationHistory(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getComplainHistory = (period) => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/dashboard/find-complain-history/${cookies.auth.userProfile.id}`, {params: { period: period}, headers: { Authorization: `Bearer ${cookies.auth.token}` } })
      .then((response) => {
        if (response.status === 200) {
          setComplainHistory(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleChangeCalibrationMonth = (e) => {
    getCalibrationHistory(e.target.value);
  }

  const handleChangeComplainMonth = (e) => {
    getComplainHistory(e.target.value);
  }

  const getMonthList = () => {
    const months = [];
    const dateStart = moment().add(-6, 'month');
    const dateEnd = moment().add();
    while (dateEnd.diff(dateStart, 'months') >= 0) {
      months.push(dateStart.format('MMMM, YYYY'));
      dateStart.add(1, 'month');
    }
    setMonths(months);
  }

  useEffect(() => {
    getCalibrationTrack();
    getComplainTrack();
    getMonthList();
    getCalibrationHistory(moment().format('MMMM, YYYY'));
    getComplainHistory(moment().format('MMMM, YYYY'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Container>
      <Box>
        <Grid container spacing={0}>
          <Grid item xs={12} lg={5}>
            <Card
              variant="outlined"
              sx={{
                pb: 0,
              }}
            >
              <CardContent
                sx={{
                  pb: "0 !important",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    mb: 5,
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: "500",
                        fontSize: "h3.fontSize",
                        marginBottom: "0",
                      }}
                      gutterBottom
                    >
                      Lacak Kalibrasi Berjalan
                    </Typography>
                    <Typography
                      color="textSecondary"
                      variant="body1"
                      sx={{
                        fontWeight: "400",
                        fontSize: "13px",
                      }}
                    >
                      Informasi status terkini proses kalibrasi yang sedang berjalan
                    </Typography>
                    <Typography
                      color="textSecondary"
                      variant="body1"
                      sx={{
                        fontWeight: "400",
                        fontSize: "13px",
                      }}
                    >
                      Nomor Order : {calibrationTrack.length > 0 ? <strong>{calibrationTrack[0].calibration?.orderNumber}</strong> : '-'}
                    </Typography>
                  </Box>
                </Box>
                <Timeline
                  sx={{
                    p: 0,
                    maxHeight: 400,
                    overflow: 'auto',
                  }}
                >
                  {calibrationTrack.map((calibrationTrack) => (
                    <TimelineItem key={calibrationTrack.trackDate}>
                      <TimelineOppositeContent
                        sx={{
                          fontSize: "12px",
                          fontWeight: "700",
                          flex: "0 100px"
                        }}
                      >
                        {<Moment format="dddd, YYYY-MM-DD hh:mm:ss">{calibrationTrack.trackDate}</Moment>}
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineDot
                          variant="outlined"
                          color="success"
                        />
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent
                        color="text.secondary"
                        sx={{
                          fontSize: "14px",
                        }}
                      >
                        {calibrationTrack.calibrationStatus?.calibrationStatusName}
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} lg={7}>
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
                      Riwayat Kalibrasi
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      marginLeft: "auto",
                      mt: {
                        lg: 0,
                        xs: 2,
                      },
                    }}
                  >
                    <FormControl variant="standard" sx={{ minWidth: 120 }}>
                      <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        label="Periode"
                        defaultValue={moment().format('MMMM, YYYY')}
                        onChange={handleChangeCalibrationMonth}
                      >
                        {months.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
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
                              Nomor Order
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography color="textSecondary" variant="h6">
                              Nama Alat
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography color="textSecondary" variant="h6">
                              Tanggal Kalibrasi
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {calibrationHistory.map((calibrationHistory) => (
                          <TableRow key={calibrationHistory.id}>
                            <TableCell>
                              <Typography
                                sx={{
                                  fontSize: "15px",
                                  fontWeight: "500",
                                }}
                              >
                                {calibrationHistory.orderNumber}
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
                                    {calibrationHistory.equipment?.equipmentName}
                                  </Typography>
                                  <Typography
                                    color="textSecondary"
                                    sx={{
                                      fontSize: "13px",
                                    }}
                                  >
                                    {calibrationHistory.equipment?.manufacturer}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography color="textSecondary" variant="h6">
                                <Moment format="YYYY-MM-DD">{calibrationHistory.calibrationDate}</Moment>
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

        <Grid container spacing={0}>
          <Grid item xs={12} lg={5}>
            <Card
              variant="outlined"
              sx={{
                pb: 0,
              }}
            >
              <CardContent
                sx={{
                  pb: "0 !important",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    mb: 5,
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: "500",
                        fontSize: "h3.fontSize",
                        marginBottom: "0",
                      }}
                      gutterBottom
                    >
                      Lacak Aduan Kalibrasi Berjalan
                    </Typography>
                    <Typography
                      color="textSecondary"
                      variant="body1"
                      sx={{
                        fontWeight: "400",
                        fontSize: "13px",
                      }}
                    >
                      Informasi status terkini proses aduan kalibrasi yang sedang berjalan
                    </Typography>
                    <Typography
                      color="textSecondary"
                      variant="body1"
                      sx={{
                        fontWeight: "400",
                        fontSize: "13px",
                      }}
                    >
                      Nomor Aduan : {complainTrack.length > 0 ? <strong>{complainTrack[0].complain?.complainNumber}</strong> : '-'}
                    </Typography>
                  </Box>
                </Box>
                <Timeline
                  sx={{
                    p: 0,
                  }}
                >
                  {complainTrack.map((complainTrack) => (
                    <TimelineItem
                      sx={{
                        maxHeight: 400,
                        overflow: 'auto',
                      }}
                      key={complainTrack.trackDate}>
                      <TimelineOppositeContent
                        sx={{
                          fontSize: "12px",
                          fontWeight: "700",
                          flex: "0 100px"
                        }}
                      >
                        {<Moment format="dddd, YYYY-MM-DD hh:mm:ss">{complainTrack.trackDate}</Moment>}
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineDot
                          variant="outlined"
                          color="success"
                        />
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent
                        color="text.secondary"
                        sx={{
                          fontSize: "14px",
                        }}
                      >
                        {complainTrack.complainStatus?.complainStatusName}
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} lg={7}>
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
                      Riwayat Aduan Kalibrasi
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      marginLeft: "auto",
                      mt: {
                        lg: 0,
                        xs: 2,
                      },
                    }}
                  >
                    <FormControl variant="standard" sx={{ minWidth: 120 }}>
                      <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        label="Periode"
                        defaultValue={moment().format('MMMM, YYYY')}
                        onChange={handleChangeComplainMonth}
                      >
                        {months.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
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
                              Nomor Aduan
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography color="textSecondary" variant="h6">
                              Nama Alat
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography color="textSecondary" variant="h6">
                              Tanggal Aduan
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {complainHistory.map((complainHistory) => (
                          <TableRow key={complainHistory.id}>
                            <TableCell>
                              <Typography
                                sx={{
                                  fontSize: "15px",
                                  fontWeight: "500",
                                }}
                              >
                                {complainHistory.complainNumber}
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
                                    {complainHistory.calibration?.equipment?.equipmentName}
                                  </Typography>
                                  <Typography
                                    color="textSecondary"
                                    sx={{
                                      fontSize: "13px",
                                    }}
                                  >
                                    {complainHistory.calibration?.equipment?.manufacturer}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography color="textSecondary" variant="h6">
                                <Moment format="YYYY-MM-DD">{complainHistory.complainDate}</Moment>
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

export default CustomerDashboard;
