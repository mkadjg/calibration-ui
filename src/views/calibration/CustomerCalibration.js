import React, { useEffect, useState } from "react";

import { Card, CardContent, Box, Typography, Modal, Button, TextField, Divider, Grid, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Snackbar, Alert, CircularProgress, List, ListItem, ListItemText, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Autocomplete, Rating, MenuItem } from "@material-ui/core";

import DataTable from "react-data-table-component";
import axios from "axios";
import { useCookies } from "react-cookie";
import FilterComponent from "../../components/filter/FIlterComponent";
import Moment from "react-moment";
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineOppositeContent, TimelineSeparator } from "@material-ui/lab";

const CustomerCalibration = () => {
  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookies] = useCookies({});
  const [calibrations, setCalibrations] = useState([]);

  // filter
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [calibrationTrack, setCalibrationTrack] = useState([]);
  const [complainType, setComplainType] = useState([]);
  const [complain, setComplain] = useState({
    complainTypeId: 0,
    complainNote: ''
  });
  const [performanceAssessment, setPerformanceAssessment] = useState({
    performanceAssessmentNote: '',
    rating: 0
  });
  const [equipmentAutocomplete, setEquipmentAutocomplete] = useState([]);
  const [calibrationReport, setCalibrationReport] = useState([]);
  const filteredItems = calibrations.filter(
    (item) =>
      (item.equipment.equipmentName && item.equipment.equipmentName.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.calibrationDate && item.calibrationDate.toString().toLowerCase().includes(filterText.toLowerCase())) ||
      (item.receivedDate && item.receivedDate.toString().toLowerCase().includes(filterText.toLowerCase())) ||
      (item.calibrationStatus.calibrationStatusCode && item.calibrationStatus.calibrationStatusCode.toLowerCase().includes(filterText.toLowerCase()))
  );

  // modal
  const [createModal, setCreateModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [trackModal, setTrackModal] = useState(false);
  const [assessmentModal, setAssessmentModal] = useState(false);
  const [complainModal, setComplainModal] = useState(false);
  const [finishDialog, setFinishDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: ""
  });
  const [item, setItem] = useState({});
  const [body, setBody] = useState({
    equipmentId: 0,
    calibrationNote: ''
  });
  const [assessment, setAssessment] = useState({
    performanceAssessmentNote: '',
    rating: 0
  });
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCreateChange = (e) => {
    setBody({
      ...body,
      [e.target.name]: e.target.value
    })
  }

  const handleAssessmentChange = (e) => {
    setAssessment({
      ...assessment,
      [e.target.name]: e.target.value
    })
  }

  const handleComplainChange = (e) => {
    setComplain({
      ...complain,
      [e.target.name]: e.target.value
    })
  }

  const handleAutocomplete = (e, v) => {
    setBody({
      ...body,
      equipmentId: v.id
    })
  }

  const handleOpenCreateModal = () => {
    getEquipmentAutocomplete();
    setCreateModal(true);
  }

  const handleCloseCreateModal = () => {
    setCreateModal(false);
  }

  const handleOpenAssessmentModal = (id) => {
    setId(id);
    setAssessmentModal(true);
  }

  const handleCloseAssessmentModal = () => {
    setAssessmentModal(false);
  }

  const handleOpenDetailModal = (item) => {
    setItem(item);
    getCalibrationReport(item);
    getPerformanceAssessment(item.id);
    setDetailModal(true);
  }

  const handleCloseDetailModal = () => {
    setItem({});
    setDetailModal(false);
  }

  const handleOpenTrackModal = (id) => {
    getCalibrationTrack(id);
    setTrackModal(true);
  }

  const handleCloseTrackModal = () => {
    setCalibrationTrack([]);
    setTrackModal(false);
  }

  const handleOpenComplainModal = (id) => {
    setId(id);
    getComplainType();
    setComplainModal(true);
  }

  const handleCloseComplainModal = () => {
    setId(null);
    setComplainModal(false);
  }

  const handleOpenFinishDialog = (id) => {
    setId(id);
    setFinishDialog(true);
  }

  const handleCloseFinishDialog = () => {
    setId(null);
    setFinishDialog(false);
    setSnackbar(true);
  }

  const handleCloseSnackbar = () => {
    setSnackbar(false);
  }

  const getCalibrations = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/calibration/find-by-customer-id/${cookies.auth.userProfile.id}`, { headers: { Authorization: `Bearer ${cookies.auth.token}` } })
      .then((response) => {
        if (response.status === 200) {
          setCalibrations(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const createCalibration = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/calibration`, body, { headers: { Authorization: `Bearer ${cookies.auth.token}` } })
      .then((response) => {
        if (response.status === 201) {
          setSnackbar({
            open: true,
            severity: "success",
            message: "Simpan data berhasil"
          });
          setLoading(false);
          handleCloseCreateModal();
          getCalibrations();
        }
      })
      .catch((error) => {
        setSnackbar({
          open: true,
          severity: "error",
          message: error.response?.data
        });
        setLoading(false);
        handleCloseCreateModal();
      });
  };

  const assessmentCalibration = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/performance-assessment/${id}`, assessment, { headers: { Authorization: `Bearer ${cookies.auth.token}` } })
      .then((response) => {
        if (response.status === 201) {
          setSnackbar({
            open: true,
            severity: "success",
            message: "Simpan data berhasil"
          });
          setLoading(false);
          handleCloseAssessmentModal();
          getCalibrations();
        }
      })
      .catch((error) => {
        setSnackbar({
          open: true,
          severity: "error",
          message: error.response?.data
        });
        setLoading(false);
        handleCloseAssessmentModal();
      });
  };

  const createComplain = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/complain/${id}`, complain, { headers: { Authorization: `Bearer ${cookies.auth.token}` } })
      .then((response) => {
        if (response.status === 201) {
          setSnackbar({
            open: true,
            severity: "success",
            message: "Simpan data berhasil"
          });
          setLoading(false);
          handleCloseComplainModal();
          getCalibrations();
        }
      })
      .catch((error) => {
        setSnackbar({
          open: true,
          severity: "error",
          message: error.response?.data
        });
        setLoading(false);
        handleCloseComplainModal();
      });
  };

  const getCalibrationReport = (item) => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/calibration-report/${item.id}`, { headers: { Authorization: `Bearer ${cookies.auth.token}` } })
      .then((response) => {
        if (response.status === 200) {
          setCalibrationReport(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getCalibrationTrack = (id) => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/calibration-track/find-by-calibration-id/${id}`, { headers: { Authorization: `Bearer ${cookies.auth.token}` } })
      .then((response) => {
        if (response.status === 200) {
          setCalibrationTrack(response.data);
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
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getEquipmentAutocomplete = (id) => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/equipment/autocomplete/${cookies.auth.userProfile.id}`, { headers: { Authorization: `Bearer ${cookies.auth.token}` } })
      .then((response) => {
        if (response.status === 200) {
          setEquipmentAutocomplete(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getComplainType = (id) => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/complain-type/find-all`, { headers: { Authorization: `Bearer ${cookies.auth.token}` } })
      .then((response) => {
        if (response.status === 200) {
          setComplainType(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const finishCalibration = () => {
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/calibration/finish-by-customer/${id}`, null, { headers: { Authorization: `Bearer ${cookies.auth.token}` } })
      .then((response) => {
        if (response.status === 200) {
          setSnackbar({
            open: true,
            severity: "success",
            message: "Simpan data berhasil"
          });
        }
        getCalibrations();
        handleCloseFinishDialog();
      })
      .catch((error) => {
        setSnackbar({
          open: true,
          severity: "success",
          message: error.response?.data
        });
        getCalibrations();
        handleCloseFinishDialog();
      });
  };

  useEffect(() => {
    getCalibrations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const columns = [
    {
      name: 'Nomor Order',
      selector: row => row.orderNumber,
      wrap: true,
      sortable: true
    },
    {
      name: 'Nama Peralatan',
      selector: row => row.equipment.equipmentName,
      wrap: true,
      sortable: true
    },
    {
      name: 'Tgl Order',
      selector: row => (<Moment format="YYYY-MM-DD">{row.calibrationDate}</Moment>),
      sortable: true
    },
    {
      name: 'Tgl Diterima',
      selector: row => row.receivedDate ? (<Moment format="YYYY-MM-DD">{row.receivedDate}</Moment>) : "",
      sortable: true
    },
    {
      name: 'Status',
      selector: row => row.calibrationStatus.calibrationStatusName,
      wrap: true,
      sortable: true
    },
    {
      name: 'Aksi',
      selector: row => (
        <>
          <Button size="small" style={{ margin: '6px 3px 3px 0px' }}
            onClick={() => handleOpenDetailModal(row)}
            variant="contained"
            color="secondary">
            Detail
          </Button>
          <Button size="small" style={{ margin: '6px 3px 3px 3px' }}
            onClick={() => handleOpenTrackModal(row.id)}
            variant="contained"
            color="info">
            Lacak
          </Button>
          <Button size="small" style={{ margin: '6px 3px 3px 3px' }}
            onClick={() => handleOpenComplainModal(row.id)}
            variant="contained"
            disabled={!(row.calibrationStatus.calibrationStatusCode === 'FINISHED' && !row.isComplain)}
            color="error">
            Aduan
          </Button>
          <br />
          <Button size="small" style={{ margin: '3px 3px 6px 0px' }}
            onClick={() => handleOpenFinishDialog(row.id)}
            variant="contained"
            disabled={row.calibrationStatus.calibrationStatusCode !== 'FORWARD_TO_CUSTOMER'}
            color="success">
            Selesai
          </Button>
          <Button size="small" style={{ margin: '3px 6px 6px 3px' }}
            onClick={() => handleOpenAssessmentModal(row.id)}
            variant="contained"
            disabled={!(row.calibrationStatus.calibrationStatusCode === 'FINISHED' && !row.isAssessed)}
            color="warning">
            Nilai
          </Button>
        </>
      ),
      width: '240px'
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
                <Typography variant="h3">Daftar Kalibrasi</Typography>
              </Grid>
              <Grid item sm={4} md={2} lg={2} style={{ paddingRight: '15px' }}>
                <Button fullWidth variant="contained" color="primary" onClick={handleOpenCreateModal}>Tambah</Button>
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
        open={createModal}
        onClose={handleCloseCreateModal}
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
                Tambah Kalibrasi
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
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={equipmentAutocomplete}
                name="equipmentId"
                onChange={handleAutocomplete}
                fullWidth
                renderInput={(params) => <TextField
                  {...params}
                  label="Pilih Peralatan"
                  placeholder="Pilih Peralatan" />}
                sx={{
                  mb: 2,
                }}
              />
              <TextField
                id="outlined-multiline-static"
                label="Catatan Kalibrasi"
                multiline
                rows={4}
                variant="outlined"
                fullWidth
                name="calibrationNote"
                value={body.calibrationNote}
                onChange={handleCreateChange}
                sx={{
                  mb: 2,
                }}
              />
              <div>
                <Button onClick={createCalibration}
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
                    <ListItemText primary="Kapasitas"
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
                    <ListItemText primary="Graduation"
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
                    <ListItemText primary="Kondisi T sebelum"
                      secondary={item.envConditionTBefore ? item.envConditionTBefore : '-'} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Kondisi RH sebelum"
                      secondary={item.envConditionRhBefore ? item.envConditionRhBefore : '-'} />
                  </ListItem>
                </List>
              </Grid>

              <Grid item md={4}>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                  <ListItem>
                    <ListItemText primary="Metode Kalibrasi"
                      secondary={item.calibrationMethod ? item.calibrationMethod : '-'} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Kondisi T setelah"
                      secondary={item.envConditionTAfter ? item.envConditionTAfter : '-'} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Kondisi RH setelah"
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
                    <ListItemText primary="Uncertainly"
                      secondary={item.uncertainly != null ? item.uncertainly : '-'} />
                  </ListItem>
                </List>
              </Grid>

              <Grid item md={4}>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                  <ListItem>
                    <ListItemText primary="Confidence Level"
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
                      secondary={item.standardTraceableToSI ? item.standardTraceableToSI : '-'} />
                  </ListItem>
                </List>
              </Grid>

              <Grid item md={4}>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                  <ListItem>
                    <ListItemText primary="Merk / Tipe Standar Kalibrasi"
                      secondary={item.standardType ? item.standardType : '-'} />
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
                  Lacak Kalibrasi
                </Typography>
                <Typography
                  color="textSecondary"
                  variant="body1"
                  sx={{
                    fontWeight: "400",
                    fontSize: "13px",
                  }}
                >
                  Informasi status terkini proses kalibrasi
                </Typography>
              </Box>
            </Box>
            <Timeline
              sx={{
                p: 0,
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
                    {<Moment format="dddd, YYYY-MM-DD">{calibrationTrack.trackDate}</Moment>}
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
                    {calibrationTrack.calibrationStatus?.calibrationStatusCode} - {calibrationTrack.calibrationStatus?.calibrationStatusName}
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </CardContent>
        </Card>
      </Modal>

      <Modal
        open={assessmentModal}
        onClose={handleCloseAssessmentModal}
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
                Penilaian Kalibrasi
              </Typography>
            </Box>
          </Box>
          <Divider />
          <CardContent
            sx={{
              padding: "20px",
            }}
          >
            <form>
              <Rating sx={{ fontSize: '45px' }} 
                name="rating" 
                onChange={handleAssessmentChange}
                alue={assessment.rating} 
                size="large" 
              />
              <br/>
              <br/>
              <TextField
                id="outlined-multiline-static"
                label="Komentar"
                multiline
                rows={4}
                variant="outlined"
                fullWidth
                name="performanceAssessmentNote"
                value={assessment.performanceAssessmentNote}
                onChange={handleAssessmentChange}
                sx={{
                  mb: 2,
                }}
              />
              <div>
                <Button onClick={assessmentCalibration}
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
        open={complainModal}
        onClose={handleCloseComplainModal}
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
                Aduan Kalibrasi
              </Typography>
            </Box>
          </Box>
          <Divider />
          <CardContent
            sx={{
              padding: "20px",
            }}
          >
            <form>
              <TextField
                fullWidth
                id="standard-select-number"
                variant="outlined"
                select
                value={complain.complainTypeId}
                onChange={handleComplainChange}
                name="complainTypeId"
                label="Jenis Pengaduan"
                sx={{
                  mb: 2,
                }}
              >
                {complainType.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.complainTypeName}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                id="outlined-multiline-static"
                label="Catatan Aduan"
                multiline
                rows={4}
                variant="outlined"
                fullWidth
                name="complainNote"
                value={complain.complainNote}
                onChange={handleComplainChange}
                sx={{
                  mb: 2,
                }}
              />
              <div>
                <Button onClick={createComplain}
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

      <Dialog
        open={finishDialog}
        onClose={handleCloseFinishDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle fontSize={16} id="alert-dialog-title">
          Konfirmasi penyelesaian proses kalibrasi
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`Anda yakin mau menyelesaikan proses kalibrasi ini ?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFinishDialog}>No</Button>
          <Button onClick={finishCalibration} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

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

export default CustomerCalibration;
