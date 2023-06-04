import React, { useEffect, useState } from "react";

import { Card, CardContent, Box, Typography, Modal, Button, TextField, Divider, Grid, Snackbar, Alert, CircularProgress, List, ListItem, ListItemText, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Autocomplete, Rating, MenuItem } from "@material-ui/core";

import DataTable from "react-data-table-component";
import axios from "axios";
import { useCookies } from "react-cookie";
import FilterComponent from "../../components/filter/FIlterComponent";
import Moment from "react-moment";
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineOppositeContent, TimelineSeparator } from "@material-ui/lab";

const QualityComplain = () => {
  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookies] = useCookies({});
  const [complains, setComplains] = useState([]);

  // filter
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [complainTrack, setComplainTrack] = useState([]);
  const [rawData, setRawData] = useState([]);
  const [performanceAssessment, setPerformanceAssessment] = useState({
    performanceAssessmentNote: '',
    rating: 0
  });
  const [technicianAutocomplete, setTechnicianAutocomplete] = useState([]);
  const [typewriterAutocomplete, setTypewriterAutocomplete] = useState([]);
  const [calibrationReport, setCalibrationReport] = useState([]);
  const filteredItems = complains.filter(
    (item) =>
      (item.calibration.equipment.equipmentName && item.calibration.equipment.equipmentName.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.complainStatus.complainStatusName && item.complainStatus.complainStatusName.toLowerCase().includes(filterText.toLowerCase()))
  );

  // modal
  const [confirmModal, setConfirmModal] = useState(false);
  const [forwardModal, setForwardModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [trackModal, setTrackModal] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: ""
  });
  const [complain, setComplain] = useState({});
  const [item, setItem] = useState({});
  const [confirm, setConfirm] = useState({
    complainNumber: ''
  });
  const [forward, setForward] = useState({
    forwardTypeId: 1,
    employeeId: ''
  });
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(false);

  const forwardType = [
    {
      id: 1,
      label: 'Teknisi'
    },
    {
      id: 2,
      label: 'Sertifikat'
    }
  ]

  const handleConfirmChange = (e) => {
    setConfirm({
      ...confirm,
      [e.target.name]: e.target.value
    })
  }

  const handleAutocomplete = (e, v) => {
    setForward({
      ...forward,
      employeeId: v.id
    })
  }

  const handleForwardChange = (e) => {
    setForward({
      ...forward,
      [e.target.name]: e.target.value
    });
  }

  const handleOpenConfirmModal = (id) => {
    setId(id);
    setConfirmModal(true);
  }

  const handleCloseConfirmModal = () => {
    setItem({});
    setConfirmModal(false);
  }

  const handleOpenForwardModal = (id) => {
    setId(id);
    getTechnicianAutocomplete();
    getTypewriterAutocomplete();
    setForwardModal(true);
  }

  const handleCloseForwardModal = () => {
    setItem({});
    setForwardModal(false);
  }

  const handleOpenDetailModal = (item) => {
    setComplain(item);
    setItem(item.calibration);
    getCalibrationReport(item.calibration.id);
    getPerformanceAssessment(item.calibration.id);
    getRawData(item.calibration.id);
    setDetailModal(true);
  }

  const handleCloseDetailModal = () => {
    setComplain({});
    setItem({});
    setDetailModal(false);
  }

  const handleOpenTrackModal = (id) => {
    getComplainTrack(id);
    setTrackModal(true);
  }

  const handleCloseTrackModal = () => {
    setComplainTrack([]);
    setTrackModal(false);
  }

  const handleCloseSnackbar = () => {
    setSnackbar(false);
  }

  const getComplains = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/complain/find-all`, { headers: { Authorization: `Bearer ${cookies.auth.token}` } })
      .then((response) => {
        if (response.status === 200) {
          setComplains(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getCalibrationReport = (id) => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/calibration-report/${id}`, { headers: { Authorization: `Bearer ${cookies.auth.token}` } })
      .then((response) => {
        if (response.status === 200) {
          setCalibrationReport(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getRawData = (id) => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/calibration-raw-data/${id}`, { headers: { Authorization: `Bearer ${cookies.auth.token}` } })
      .then((response) => {
        if (response.status === 200) {
          setRawData(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getComplainTrack = (id) => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/complain-track/find-by-complain-id/${id}`, { headers: { Authorization: `Bearer ${cookies.auth.token}` } })
      .then((response) => {
        if (response.status === 200) {
          setComplainTrack(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getPerformanceAssessment = (id) => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/performance-assessment/find-by-calibration-id/${id}`, { headers: { Authorization: `Bearer ${cookies.auth.token}` } })
      .then((response) => {
        if (response.status === 200) {
          if (response.data.length > 0) {
            setPerformanceAssessment(response.data[0]);
          } else {
            setPerformanceAssessment({});
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const confirmComplain = () => {
    setLoading(true);
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/complain/confirm/${id}`, confirm, { headers: { Authorization: `Bearer ${cookies.auth.token}` } })
      .then((response) => {
        if (response.status === 200) {
          setSnackbar({
            open: true,
            severity: "success",
            message: "Simpan data berhasil"
          });
          setLoading(false);
          handleCloseConfirmModal();
          getComplains();
        }
      })
      .catch((error) => {
        setSnackbar({
          open: true,
          severity: "success",
          message: error.response?.data
        });
        setLoading(false);
        handleCloseConfirmModal();
      });
  };

  const forwardComplain = () => {
    setLoading(true);
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/complain/forward/${id}`, forward, { headers: { Authorization: `Bearer ${cookies.auth.token}` } })
      .then((response) => {
        if (response.status === 200) {
          setSnackbar({
            open: true,
            severity: "success",
            message: "Simpan data berhasil"
          });
          setLoading(false);
          handleCloseForwardModal();
          getComplains();
        }
      })
      .catch((error) => {
        setSnackbar({
          open: true,
          severity: "error",
          message: "Terjadi kesalahan!"
        });
        setLoading(false);
        handleCloseForwardModal();
      });
  };

  const getTypewriterAutocomplete = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/employee/typewriter/autocomplete`, { headers: { Authorization: `Bearer ${cookies.auth.token}` } })
      .then((response) => {
        if (response.status === 200) {
          setTypewriterAutocomplete(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getTechnicianAutocomplete = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/employee/technician/autocomplete`, { headers: { Authorization: `Bearer ${cookies.auth.token}` } })
      .then((response) => {
        if (response.status === 200) {
          setTechnicianAutocomplete(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getComplains();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const columns = [
    {
      name: 'Nomor Aduan',
      selector: row => row.complainNumber,
      wrap: true,
      sortable: true
    },
    {
      name: 'Nama Peralatan',
      selector: row => row.calibration.equipment.equipmentName,
      wrap: true,
      sortable: true
    },
    {
      name: 'Status',
      selector: row => row.complainStatus.complainStatusName,
      wrap: true,
      sortable: true
    },
    {
      name: 'Aksi',
      selector: row => (
        <>
          <Button size="small" style={{ margin: '6px 3px 3px 0px' }}
            onClick={() => handleOpenConfirmModal(row.id)}
            variant="contained"
            disabled={row.complainStatus.complainStatusCode !== 'SUBMITTED'}
            color="success">
            Konfirmasi
          </Button>
          <Button size="small" style={{ margin: '6px 3px 3px 3px' }}
            onClick={() => handleOpenDetailModal(row)}
            variant="contained"
            color="secondary">
            Detail
          </Button>
          <br />
          <Button size="small" style={{ margin: '3px 3px 6px 0px' }}
            onClick={() => handleOpenTrackModal(row.id)}
            variant="contained"
            color="info">
            Lacak
          </Button>
          <Button size="small" style={{ margin: '3px 3px 6px 3px' }}
            onClick={() => handleOpenForwardModal(row.id)}
            variant="contained"
            disabled={row.complainStatus.complainStatusCode !== 'CONFIRM_BY_QUALITY'}
            color="warning">
            Teruskan
          </Button>
        </>
      ),
      width: '200px'
    },

  ];

  const customStyles = {
    headRow: {
      style: {
        marginTop: '15px',
        border: 'none',
        fontFamily: "DM Sans, sans-serif"
      },
    },
    headCells: {
      style: {
        fontFamily: "DM Sans, sans-serif",
        color: '#202124',
        fontSize: '14px',
      },
    },
    rows: {
      highlightOnHoverStyle: {
        fontFamily: "DM Sans, sans-serif",
        backgroundColor: 'rgb(230, 244, 244)',
        borderBottomColor: '#FFFFFF',
        borderRadius: '25px',
        outline: '1px solid #FFFFFF',
      },
      style: {
        fontFamily: "DM Sans, sans-serif"
      }
    },
    pagination: {
      style: {
        fontFamily: "DM Sans, sans-serif",
        fontSize: '13px'
      }
    },
    table: {
      style: {
        fontFamily: "DM Sans, sans-serif"
      }
    }
  };

  const getSubHeaderComponent = () => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText('');
      }
    };

    return (
      <FilterComponent onFilter={e => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} />
    );
  };

  const modalPosition = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4
  };

  const modalDetailPosition = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4
  };

  return (
    <>
      <Box>
        <Card variant="outlined">
          <CardContent>
            <Grid container>
              <Grid item sm={8} md={10} lg={10}>
                <Typography variant="h3">Daftar Aduan Kalibrasi</Typography>
              </Grid>
            </Grid>

            <Box
              sx={{
                overflow: {
                  xs: "auto",
                  sm: "unset",
                },
              }}
            >
              <DataTable
                columns={columns}
                customStyles={customStyles}
                data={filteredItems}
                striped={true}
                pagination={true}
                defaultSortFieldId={1}
                responsive
                highlightOnHover
                subHeader
                subHeaderComponent={getSubHeaderComponent()}
              />
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Modal
        open={confirmModal}
        onClose={handleCloseConfirmModal}
      >
        <Card
          variant="outlined"
          sx={{
            p: 0,
          }}
          style={modalPosition}
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
                  fontSize: "18px",
                  fontWeight: "500",
                }}
              >
                Konfirmasi Aduan Kalibrasi
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
                id="outlined-multiline-static"
                label="Nomor Aduan"
                rows={4}
                variant="outlined"
                fullWidth
                name="complainNumber"
                value={confirm.complainNumber}
                onChange={handleConfirmChange}
                sx={{
                  mb: 2,
                }}
              />
              <div>
                <Button onClick={confirmComplain}
                  fullWidth color="primary"
                  size="large" variant="contained"
                  disabled={loading}>
                  {loading ? <CircularProgress size={26} color="inherit" /> : "Simpan"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </Modal>

      <Modal
        open={forwardModal}
        onClose={handleCloseForwardModal}
      >
        <Card
          variant="outlined"
          sx={{
            p: 0,
          }}
          style={modalPosition}
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
                  fontSize: "18px",
                  fontWeight: "500",
                }}
              >
                Teruskan Aduan Kalibrasi
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
                fullWidth
                id="standard-select-number"
                variant="outlined"
                select
                value={forward.forwardTypeId}
                onChange={handleForwardChange}
                name="forwardTypeId"
                label="Jenis Terusan"
                sx={{
                  mb: 2,
                }}
              >
                {forwardType.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              {forward.forwardTypeId === 1 ?
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={technicianAutocomplete}
                  name="employeeId"
                  onChange={handleAutocomplete}
                  fullWidth
                  renderInput={(params) => <TextField
                    {...params}
                    label="Pilih Teknisi"
                    placeholder="Pilih Teknisi" />}
                  sx={{
                    mb: 2,
                  }}
                /> :
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={typewriterAutocomplete}
                  name="employeeId"
                  onChange={handleAutocomplete}
                  fullWidth
                  renderInput={(params) => <TextField
                    {...params}
                    label="Pilih Bag. Sertifikat"
                    placeholder="Pilih Bag. Sertifikat" />}
                  sx={{
                    mb: 2,
                  }}
                />
              }
              <div>
                <Button onClick={forwardComplain}
                  fullWidth color="primary"
                  size="large" variant="contained"
                  disabled={loading}>
                  {loading ? <CircularProgress size={26} color="inherit" /> : "Simpan"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </Modal>

      <Modal
        open={detailModal}
        onClose={handleCloseDetailModal}
      >
        <Card
          variant="outlined"
          sx={{
            p: 0,
          }}
          style={modalDetailPosition}
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
                  fontSize: "18px",
                  fontWeight: "500",
                }}
              >
                Detail Kalibrasi
              </Typography>
            </Box>
          </Box>
          <Divider />
          <CardContent
            sx={{
              padding: "0px 20px",
              maxHeight: 600,
              overflow: 'auto'
            }}
          >
            <Grid container>
              <Grid item md={4}>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                  <ListItem>
                    <ListItemText primary="Nomor Order"
                      secondary={item.orderNumber ? item.orderNumber : '-'} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Pemilik"
                      secondary={item.equipment?.customers.companyName ? item.equipment?.customers.companyName : '-'} />
                  </ListItem>
                </List>
              </Grid>

              <Grid item md={4}>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                  <ListItem>
                    <ListItemText primary="Sertifikat Kalibrasi"
                      secondary={item.certificateNumber ? item.certificateNumber : '-'} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Alamat"
                      secondary={item.equipment?.customers?.address ? item.equipment?.customers?.address : '-'} />
                  </ListItem>
                </List>
              </Grid>

              <Grid item md={4}>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                  <ListItem>
                    <ListItemText primary="Tanggal Diterima"
                      secondary={item.receivedDate ? <Moment format="YYYY-MM-DD">{item.receivedDate}</Moment> : '-'} />
                  </ListItem>
                </List>
              </Grid>
            </Grid>

            <Divider />

            <Grid container>
              <Grid item md={4}>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                  <ListItem>
                    <ListItemText primary="Nama Alat"
                      secondary={item.equipment?.equipmentName ? item.equipment?.equipmentName : '-'} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Nomor Seri"
                      secondary={item.equipment?.serialNumber ? item.equipment?.serialNumber : '-'} />
                  </ListItem>
                </List>
              </Grid>

              <Grid item md={4}>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                  <ListItem>
                    <ListItemText primary="Pabrikan"
                      secondary={item.equipment?.manufacturer ? item.equipment?.manufacturer : '-'} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Kapasitas (psi)"
                      secondary={item.equipment?.capacity ? item.equipment?.capacity : '-'} />
                  </ListItem>
                </List>
              </Grid>

              <Grid item md={4}>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                  <ListItem>
                    <ListItemText primary="Tipe Modal"
                      secondary={item.equipment?.modelType ? item.equipment?.modelType : '-'} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Graduation (psi)"
                      secondary={item.equipment?.graduation ? item.equipment?.graduation : '-'} />
                  </ListItem>
                </List>
              </Grid>
            </Grid>

            <Divider />

            <Grid container>
              <Grid item md={4}>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                  <ListItem>
                    <ListItemText primary="Teknisi"
                      secondary={item.technician?.employeeName ? item.technician?.employeeName : '-'} />
                  </ListItem>
                </List>
              </Grid>

              <Grid item md={4}>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                  <ListItem>
                    <ListItemText primary="Penulis"
                      secondary={item.typewriter?.employeeName ? item.typewriter?.employeeName : '-'} />
                  </ListItem>
                </List>
              </Grid>

              <Grid item md={4} />
            </Grid>

            <Divider />

            <Grid container>
              <Grid item md={4}>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                  <ListItem>
                    <ListItemText primary="Lokasi Kalibrasi"
                      secondary={item.calibrationLocation ? item.calibrationLocation : '-'} />
                  </ListItem>
                  <ListItem>
                  <ListItemText primary={`Kondisi T sebelum (` + String.fromCharCode(176) + `C)`}
                      secondary={item.envConditionTBefore ? item.envConditionTBefore : '-'} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Kondisi RH sebelum (%)"
                      secondary={item.envConditionRhBefore ? item.envConditionRhBefore : '-'} />
                  </ListItem>
                </List>
              </Grid>

              <Grid item md={4}>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                  <ListItem>
                    <ListItemText primary="Metode Kalibrasi"
                      secondary={item.calibrationMethode ? item.calibrationMethode.calibrationMethodName : '-'} />
                  </ListItem>
                  <ListItem>
                  <ListItemText primary={`Kondisi T setelah (` + String.fromCharCode(176) + `C)`}
                      secondary={item.envConditionTAfter ? item.envConditionTAfter : '-'} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Kondisi RH setelah (%)"
                      secondary={item.envConditionRhAfter ? item.envConditionRhAfter : '-'} />
                  </ListItem>
                </List>
              </Grid>

              <Grid item md={4}>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                  <ListItem>
                    <ListItemText primary="Tanggal Kalibrasi"
                      secondary={item.calibrationDate ? <Moment format="YYYY-MM-DD">{item.calibrationDate}</Moment> : '-'} />
                  </ListItem>
                </List>
              </Grid>
            </Grid>

            <Card variant="outlined">
              <CardContent>
                <Typography variant="h4" align="center" sx={{ marginBottom: '20px' }}>Laporan Kalibrasi</Typography>
                <Divider />
                <TableContainer>
                  <Table sx={{ minWidth: 650, border: '1px' }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell rowSpan={2} align="center">Instrument Indication</TableCell>
                        <TableCell colSpan={2} align="center">Standart Indication &nbsp; (psi)</TableCell>
                        <TableCell colSpan={2} align="center">Correction &nbsp; (psi)</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell align="center">Up</TableCell>
                        <TableCell align="center">Down</TableCell>
                        <TableCell align="center">Up</TableCell>
                        <TableCell align="center">Down</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {
                        calibrationReport.map((body, index) => (
                          <TableRow key={body.id}>
                            <TableCell align="center">{body.instrumentIndication}</TableCell>
                            <TableCell align="center">{body.standardIndicationUp}</TableCell>
                            <TableCell align="center">{body.standardIndicationDown}</TableCell>
                            <TableCell align="center">{body.correctionUp}</TableCell>
                            <TableCell align="center">{body.correctionDown}</TableCell>
                          </TableRow>
                        ))
                      }
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>

            <Grid container>
              <Grid item md={4}>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                  <ListItem>
                    <ListItemText primary="Uncertainly (psi)"
                      secondary={item.uncertainly != null ? item.uncertainly : '-'} />
                  </ListItem>
                </List>
              </Grid>

              <Grid item md={4}>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                  <ListItem>
                    <ListItemText primary="Confidence Level (%)"
                      secondary={item.confidenceLevel != null ? item.confidenceLevel : '-'} />
                  </ListItem>
                </List>
              </Grid>

              <Grid item md={4}>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                  <ListItem>
                    <ListItemText primary="Coverage Factor"
                      secondary={item.coverageFactor != null ? item.coverageFactor : '-'} />
                  </ListItem>
                </List>
              </Grid>
            </Grid>

            <Divider />

            <Grid container>
              <Grid item md={4}>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                  <ListItem>
                    <ListItemText primary="Nama Standar Kalibrasi"
                      secondary={item.standardName ? item.standardName : '-'} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Traceable Through SI"
                      secondary={item.traceableToSi ? item.traceableToSi.traceableToSiName : '-'} />
                  </ListItem>
                </List>
              </Grid>

              <Grid item md={4}>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                  <ListItem>
                    <ListItemText primary="Merk / Tipe Standar Kalibrasi"
                      secondary={item.standardCalibrationType ? item.standardCalibrationType.standardCalibrationTypeName : '-'} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Tanggal Penerbitan"
                      secondary={item.issuanceDate ? <Moment format="YYYY-MM-DD">{item.issuanceDate}</Moment> : '-'} />
                  </ListItem>
                </List>
              </Grid>

              <Grid item md={4}>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                  <ListItem>
                    <ListItemText primary="Nomor Seri Standar Kalibrasi"
                      secondary={item.standardSerialNumber ? item.standardSerialNumber : '-'} />
                  </ListItem>
                </List>
              </Grid>
            </Grid>

            <Divider />

            <Grid container>
              <Grid item md={6}>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                  <ListItem>
                    <ListItemText primary="Penilaian :" />
                    <Rating name="size-large" value={performanceAssessment.rating} readOnly size="large" />
                  </ListItem>
                </List>
              </Grid>
              <Grid item md={6}>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                  <ListItem>
                    <ListItemText primary="Catatan Pelanggan"
                      secondary={performanceAssessment.performanceAssessmentNote ? performanceAssessment.performanceAssessmentNote : '-'} />
                  </ListItem>
                </List>
              </Grid>
            </Grid>

            <Divider />

            <Grid container>
              <Grid item md={6}>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                  <ListItem>
                    <ListItemText primary="Nomor Aduan"
                      secondary={complain.complainNumber ? complain.complainNumber : '-'} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Catatan Aduan"
                      secondary={complain.complainNote ? complain.complainNote : '-'} />
                  </ListItem>
                </List>
              </Grid>
              <Grid item md={6}>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                  <ListItem>
                    <ListItemText primary="Jenis Aduan"
                      secondary={complain.complainType?.complainTypeName ? complain.complainType?.complainTypeName : '-'} />
                  </ListItem>
                </List>
              </Grid>
            </Grid>

            <Divider />

            <Typography sx={{ m: 2 }}>Data Mentah</Typography>
            <Grid container>
              <Grid item md={12}>
                <div className="form-group multi-preview">
                  {(rawData || []).map(data => (
                      <img height={550} width={500} key={data.id} src={'data:image/jpeg;base64,' + data.document} alt="..." />
                  ))}
                </div>
              </Grid>
            </Grid>

          </CardContent>
        </Card>
      </Modal>

      <Modal
        open={trackModal}
        onClose={handleCloseTrackModal}
      >
        <Card
          variant="outlined"
          sx={{
            maxHeight: 600,
            overflow: 'auto',
            pb: 0,
          }}
          style={modalPosition}
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
                  Lacak Aduan Kalibrasi
                </Typography>
                <Typography
                  color="textSecondary"
                  variant="body1"
                  sx={{
                    fontWeight: "400",
                    fontSize: "13px",
                  }}
                >
                  Informasi status terkini proses aduan kalibrasi
                </Typography>
              </Box>
            </Box>
            <Timeline
              sx={{
                p: 0,
              }}
            >
              {complainTrack.map((complainTrack) => (
                <TimelineItem key={complainTrack.trackDate}>
                  <TimelineOppositeContent
                    sx={{
                      fontSize: "12px",
                      fontWeight: "700",
                      flex: "0 100px"
                    }}
                  >
                    {<Moment format="dddd, YYYY-MM-DD">{complainTrack.trackDate}</Moment>}
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
                    {complainTrack.complainStatus?.complainStatusCode} - {complainTrack.complainStatus?.complainStatusName}
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </CardContent>
        </Card>
      </Modal>

      <Snackbar open={snackbar.open}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default QualityComplain;
