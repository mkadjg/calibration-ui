import React, { useEffect, useState } from "react";

import { Card, CardContent, Box, Typography, Modal, Button, TextField, Divider, Grid, Snackbar, Alert, CircularProgress, List, ListItem, ListItemText, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Rating, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, MenuItem } from "@material-ui/core";

import DataTable from "react-data-table-component";
import axios from "axios";
import { useCookies } from "react-cookie";
import FilterComponent from "../../components/filter/FIlterComponent";
import Moment from "react-moment";

const TypewriterCalibration = () => {
  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookies] = useCookies({});
  const [calibrations, setCalibrations] = useState([]);

  // filter
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [calibrationReport, setCalibrationReport] = useState([]);
  const [traceableToSi, setTraceableToSi] = useState([]);
  const [calibrationMethod, setCalibrationMethod] = useState([]);
  const [standardCalibrationType, setStandardCalibrationType] = useState([]);
  const [performanceAssessment, setPerformanceAssessment] = useState({
    performanceAssessmentNote: '',
    rating: 0
  });
  const filteredItems = calibrations.filter(
    (item) =>
      (item.equipment.equipmentName && item.equipment.equipmentName.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.calibrationDate && item.calibrationDate.toString().toLowerCase().includes(filterText.toLowerCase())) ||
      (item.receivedDate && item.receivedDate.toString().toLowerCase().includes(filterText.toLowerCase())) ||
      (item.calibrationStatus.calibrationStatusCode && item.calibrationStatus.calibrationStatusCode.toLowerCase().includes(filterText.toLowerCase()))
  );

  // modal
  const [resultModal, setResultModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [forwardDialog, setForwardDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: ""
  });
  const [item, setItem] = useState({});
  const [certificate, setCertificate] = useState({
    certificateNumber: '',
    calibrationLocation: '',
    calibrationMethod: '',
    calibrationMethodId: 1,
    standardName: '',
    standardType: '',
    standardTypeId: 1,
    standardSerialNumber: '',
    standardTraceableToSI: '',
    standardTraceableToSIId: 1,
    issuanceDate: new Date().toISOString().split('T')[0]
  });
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCertificateChange = (e) => {
    setCertificate({
      ...certificate,
      [e.target.name]: e.target.value
    })
  }

  const handleOpenResultModal = (item) => {
    setId(item.id)
    setResultModal(true);
  }

  const handleCloseResultModal = () => {
    setItem({});
    setResultModal(false);
  }

  const handleOpenConfirmDialog = (id) => {
    setId(id);
    setConfirmDialog(true);
  }

  const handleCloseConfirmDialog = () => {
    setConfirmDialog(false);
  }

  const handleOpenForwardDialog = (id) => {
    setId(id);
    setForwardDialog(true);
  }

  const handleCloseForwardDialog = () => {
    setForwardDialog(false);
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

  const handleCloseSnackbar = () => {
    setSnackbar(false);
  }

  const getCalibrations = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/calibration/find-by-typewriter-id/${cookies.auth.userProfile.id}`, { headers: { Authorization: `Bearer ${cookies.auth.token}` } })
      .then((response) => {
        if (response.status === 200) {
          setCalibrations(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
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

  const getCalibrationMethod = (item) => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/calibration-method/find-all`, { headers: { Authorization: `Bearer ${cookies.auth.token}` } })
      .then((response) => {
        if (response.status === 200) {
          setCalibrationMethod(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getStandardCalibrationType = (item) => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/standard-calibration-type/find-all`, { headers: { Authorization: `Bearer ${cookies.auth.token}` } })
      .then((response) => {
        if (response.status === 200) {
          setStandardCalibrationType(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getTraceableToSi = (item) => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/traceable-to-si/find-all`, { headers: { Authorization: `Bearer ${cookies.auth.token}` } })
      .then((response) => {
        if (response.status === 200) {
          setTraceableToSi(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const confirmCalibration = () => {
    setLoading(true);
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/calibration/confirm-by-typewriter/${id}`, null, { headers: { Authorization: `Bearer ${cookies.auth.token}` } })
      .then((response) => {
        if (response.status === 200) {
          setSnackbar({
            open: true,
            severity: "success",
            message: "Simpan data berhasil"
          });
          setLoading(false);
          handleCloseConfirmDialog();
          getCalibrations();
        }
      })
      .catch((error) => {
        setSnackbar({
          open: true,
          severity: "success",
          message: error.response?.data
        });
        setLoading(false);
        handleCloseConfirmDialog();
      });
  };

  const createCertificateCalibration = () => {
    setLoading(true);
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/certificate/${id}`, certificate, { headers: { Authorization: `Bearer ${cookies.auth.token}` } })
      .then((response) => {
        if (response.status === 200) {
          setSnackbar({
            open: true,
            severity: "success",
            message: "Simpan data berhasil"
          });
          doneByTypewriter();
          setLoading(false);
          handleCloseResultModal();
          getCalibrations();
        }
      })
      .catch((error) => {
        setSnackbar({
          open: true,
          severity: "success",
          message: error.response?.data
        });
        setLoading(false);
        handleCloseResultModal();
      });
  };

  const doneByTypewriter = () => {
    setLoading(true);
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/calibration/done-by-typewriter/${id}`, null, { headers: { Authorization: `Bearer ${cookies.auth.token}` } })
      .then((response) => {
      })
      .catch((error) => {
      });
  };

  const forwardCalibration = () => {
    setLoading(true);
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/calibration/forward-to-customer/${id}`, null,{ headers: { Authorization: `Bearer ${cookies.auth.token}` } })
      .then((response) => {
        if (response.status === 200) {
          setSnackbar({
            open: true,
            severity: "success",
            message: "Simpan data berhasil"
          });
          setLoading(false);
          handleCloseForwardDialog();
          getCalibrations();
        }
      })
      .catch((error) => {
        setSnackbar({
          open: true,
          severity: "error",
          message: "Terjadi kesalahan!"
        });
        setLoading(false);
        handleCloseForwardDialog();
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

  useEffect(() => {
    getCalibrations();
    getCalibrationMethod();
    getStandardCalibrationType();
    getTraceableToSi();
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
            onClick={() => handleOpenConfirmDialog(row.id)}
            variant="contained"
            disabled={row.calibrationStatus.calibrationStatusCode !== 'FORWARD_TO_CERTIFICATE'}
            color="success">
            Konfirmasi
          </Button>
          <Button size="small" style={{ margin: '6px 3px 3px 3px' }}
            onClick={() => handleOpenResultModal(row)}
            variant="contained"
            disabled={row.calibrationStatus.calibrationStatusCode !== 'IN_PROGRESS_BY_CERTIFICATE'}
            color="info">
            Catat
          </Button>
          <br />
          <Button size="small" style={{ margin: '3px 3px 6px 0px' }}
            onClick={() => handleOpenDetailModal(row)}
            variant="contained"
            color="secondary">
            Detail
          </Button>
          <Button size="small" style={{ margin: '3px 3px 6px 3px' }}
            onClick={() => handleOpenForwardDialog(row.id)}
            variant="contained"
            disabled={row.calibrationStatus.calibrationStatusCode !== 'DONE_BY_CERTIFICATE'}
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
        open={resultModal}
        onClose={handleCloseResultModal}
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
                Pencatatan Sertifikat Kalibrasi
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
              <Grid container spacing={2}>
                <Grid item sm={6} md={6} lg={6}>
                  <TextField
                    id="outlined-multiline-static"
                    label="Sertifikat Kalibrasi"
                    placeholder="Sertifikat Kalibrasi"
                    rows={4}
                    variant="outlined"
                    type="text"
                    fullWidth
                    name="certificateNumber"
                    value={certificate.certificateNumber}
                    onChange={handleCertificateChange}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    id="outlined-multiline-static"
                    label="Metode Kalibrasi"
                    placeholder="Metode Kalibrasi"
                    rows={4}
                    variant="outlined"
                    select
                    fullWidth
                    name="calibrationMethodId"
                    value={certificate.calibrationMethodId}
                    onChange={handleCertificateChange}
                    sx={{ mb: 2 }}
                  >
                    {calibrationMethod.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.calibrationMethodName}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item sm={6} md={6} lg={6}>
                  <TextField
                    id="outlined-multiline-static"
                    label="Lokasi Kalibrasi"
                    placeholder="Lokasi Kalibrasi"
                    rows={4}
                    variant="outlined"
                    type="text"
                    fullWidth
                    name="calibrationLocation"
                    value={certificate.calibrationLocation}
                    onChange={handleCertificateChange}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    id="outlined-multiline-static"
                    label="Tanggal Penerbitan"
                    rows={4}
                    variant="outlined"
                    type="date"
                    fullWidth
                    name="issuanceDate"
                    value={certificate.issuanceDate}
                    onChange={handleCertificateChange}
                    sx={{ mb: 2 }}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ mt: '10px', mb: '25px' }}/>

              <Grid container spacing={2}>
                <Grid item sm={6} md={6} lg={6}>
                  <TextField
                    id="outlined-multiline-static"
                    label="Nama Standar Kalibrasi"
                    placeholder="Nama Standar Kalibrasi"
                    rows={4}
                    variant="outlined"
                    type="text"
                    fullWidth
                    name="standardName"
                    value={certificate.standardName}
                    onChange={handleCertificateChange}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    id="outlined-multiline-static"
                    label="Metode / Type Standar Kalibrasi"
                    placeholder="Metode / Type Standar Kalibrasi"
                    rows={4}
                    variant="outlined"
                    select
                    fullWidth
                    name="standardTypeId"
                    value={certificate.standardTypeId}
                    onChange={handleCertificateChange}
                    sx={{ mb: 2 }}
                  >
                    {standardCalibrationType.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.standardCalibrationTypeName}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item sm={6} md={6} lg={6}>
                  <TextField
                    id="outlined-multiline-static"
                    label="Nomor Seri Kalibrasi"
                    placeholder="Nomor Seri Kalibrasi"
                    rows={4}
                    variant="outlined"
                    type="text"
                    fullWidth
                    name="standardSerialNumber"
                    value={certificate.standardSerialNumber}
                    onChange={handleCertificateChange}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    id="outlined-multiline-static"
                    label="Traceable Throudh SI"
                    placeholder="Traceable Throudh SI"
                    rows={4}
                    variant="outlined"
                    select
                    fullWidth
                    name="standardTraceableToSIId"
                    value={certificate.standardTraceableToSIId}
                    onChange={handleCertificateChange}
                    sx={{ mb: 2 }}
                  >
                    {traceableToSi.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.traceableToSiName}
                      </MenuItem>
                    ))}
                  </TextField>
                  
                </Grid>
              </Grid>

              <div>
                <Button onClick={createCertificateCalibration}
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
                      secondary={performanceAssessment.performanceAssessmentNote ? item.performanceAssessmentNote : '-'} />
                  </ListItem>
                </List>
              </Grid>
            </Grid>

          </CardContent>
        </Card>
      </Modal>

      <Dialog
        open={confirmDialog}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle fontSize={16} id="alert-dialog-title">
          Konfirmasi mulai pencatatan sertifikat kalibrasi
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`Anda yakin mau memulai pencatatan sertifikat kalibrasi ?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog}>No</Button>
          <Button onClick={confirmCalibration} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={forwardDialog}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle fontSize={16} id="alert-dialog-title">
          Konfirmasi penyelesaian proses kalibrasi
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`Anda yakin mau meneruskan proses kalibrasi kepada pelanggan ?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForwardDialog}>No</Button>
          <Button onClick={forwardCalibration} autoFocus>
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

export default TypewriterCalibration;
