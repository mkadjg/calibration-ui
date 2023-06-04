import React, { useEffect, useState } from "react";

import { Card, CardContent, Box, Typography, Modal, Button, TextField, Divider, Grid, Snackbar, Alert, CircularProgress, List, ListItem, ListItemText, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Autocomplete, Rating, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, InputAdornment } from "@material-ui/core";

import DataTable from "react-data-table-component";
import axios from "axios";
import { useCookies } from "react-cookie";
import FilterComponent from "../../components/filter/FIlterComponent";
import Moment from "react-moment";

const TechnicianCalibration = () => {
  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookies] = useCookies({});
  const [calibrations, setCalibrations] = useState([]);
  const [files, setFiles] = useState([null]);
  const [filesArr, setFilesArr] = useState([null]);

  // filter
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [typewriterAutocomplete, setTypewriterAutocomplete] = useState([]);
  const [calibrationReport, setCalibrationReport] = useState([]);
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
  const [forwarModal, setForwardModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: ""
  });
  const [item, setItem] = useState({});
  const [result, setResult] = useState([]);
  const [report, setReport] = useState({
    uncertainly: 0,
    confidenceLevel: 0,
    coverageFactor: 0,
    envConditionTBefore: 0,
    envConditionTAfter: 0,
    envConditionRhBefore: 0,
    envConditionRhAfter: 0,
    result: []
  });
  const [forward, setForward] = useState({
    employeeId: ''
  });
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleResultChange = (e, index) => {
    const instrumentIndication = result[index].instrumentIndication;
    if (e.target.name === 'standardIndicationUp') {
      setResult([
        ...result.slice(0, index),
        {
          ...result[index],
          [e.target.name]: e.target.value,
          correctionUp: e.target.value - instrumentIndication
        },
        ...result.slice(index + 1)
      ]);
    } else if (e.target.name === 'standardIndicationDown') {
      setResult([
        ...result.slice(0, index),
        {
          ...result[index],
          [e.target.name]: e.target.value,
          correctionDown: e.target.value - instrumentIndication
        },
        ...result.slice(index + 1)
      ]);
    }
  }

  const handleReportChange = (e) => {
    setReport({
      ...report,
      [e.target.name]: e.target.value
    })
  }

  const handleAutocomplete = (e, v) => {
    setForward({
      ...forward,
      employeeId: v.id
    })
  }

  const fileObj = [];
  const fileArray = [];
  const handleUploadMultipleFiles = (e) => {
    fileObj.push(e.target.files)
    for (const element of fileObj[0]) {
        fileArray.push(URL.createObjectURL(element))
    }
    setFilesArr(fileArray);
    setFiles(fileObj);
  }

  const handleOpenResultModal = (item) => {
    setId(item.id)
    createResultForm(item);
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

  const handleOpenForwardModal = (id) => {
    setId(id);
    getTypewriterAutocomplete();
    setForwardModal(true);
  }

  const handleCloseForwardModal = () => {
    setItem({});
    setForwardModal(false);
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

  const createResultForm = (item) => {
    let resultForm = [];
    for (let i = 0; i <= item.equipment?.capacity; i += 1000) {
      resultForm.push({
        instrumentIndication: i,
        correctionUp: 0,
        correctionDown: 0,
        standardIndicationUp: 0,
        standardIndicationDown: 0
      })
    }
    setResult(resultForm);
  }

  const getCalibrations = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/calibration/find-by-technician-id/${cookies.auth.userProfile.id}`, { headers: { Authorization: `Bearer ${cookies.auth.token}` } })
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

  const getTypewriterAutocomplete = (id) => {
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

  const confirmCalibration = () => {
    setLoading(true);
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/calibration/confirm-by-technician/${id}`, null, { headers: { Authorization: `Bearer ${cookies.auth.token}` } })
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

  const createReportCalibration = () => {
    setLoading(true);
    report.result = result;
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/calibration-report/${id}`, report, { headers: { Authorization: `Bearer ${cookies.auth.token}` } })
      .then((response) => {
        if (response.status === 200) {
          setSnackbar({
            open: true,
            severity: "success",
            message: "Simpan data berhasil"
          });
          doneByTechnician();
          uploadRawData();
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

  const uploadRawData = () => {
    const filesData = new FormData();
    for (const element of files[0]) {
      filesData.append("files", element);
    }
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/calibration-raw-data/${id}`, filesData, { headers: { Authorization: `Bearer ${cookies.auth.token}` } })
      .then((response) => {
      })
      .catch((error) => {
      });
  };

  const doneByTechnician = () => {
    setLoading(true);
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/calibration/done-by-technician/${id}`, null, { headers: { Authorization: `Bearer ${cookies.auth.token}` } })
      .then((response) => {
      })
      .catch((error) => {
      });
  };

  const forwardCalibration = () => {
    setLoading(true);
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/calibration/forward-to-typewriter/${id}`, forward, { headers: { Authorization: `Bearer ${cookies.auth.token}` } })
      .then((response) => {
        if (response.status === 200) {
          setSnackbar({
            open: true,
            severity: "success",
            message: "Simpan data berhasil"
          });
          setLoading(false);
          handleCloseForwardModal();
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
        handleCloseForwardModal();
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
            disabled={row.calibrationStatus.calibrationStatusCode !== 'FORWARD_TO_TECHNICIAN'}
            color="success">
            Konfirmasi
          </Button>
          <Button size="small" style={{ margin: '6px 3px 3px 3px' }}
            onClick={() => handleOpenResultModal(row)}
            variant="contained"
            disabled={row.calibrationStatus.calibrationStatusCode !== 'IN_PROGRESS_BY_TECHNICIAN'}
            color="info">
            Hasil
          </Button>
          <br />
          <Button size="small" style={{ margin: '3px 3px 6px 0px' }}
            onClick={() => handleOpenDetailModal(row)}
            variant="contained"
            color="secondary">
            Detail
          </Button>
          <Button size="small" style={{ margin: '3px 3px 6px 3px' }}
            onClick={() => handleOpenForwardModal(row.id)}
            variant="contained"
            disabled={row.calibrationStatus.calibrationStatusCode !== 'DONE_BY_TECHNICIAN'}
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
                Input Hasil Kalibrasi
              </Typography>
            </Box>
          </Box>
          <Divider />
          <CardContent
            sx={{
              padding: "30px",
              maxHeight: 600,
              overflow: 'auto'
            }}
          >
            <form>
              <Card variant="outlined">
                <CardContent
                  sx={{
                    padding: "0px 20px",
                    maxHeight: 450,
                    overflow: 'auto'
                  }}>
                  <Typography variant="h4" align="center" sx={{ marginBottom: '20px' }}>Laporan Kalibrasi</Typography>
                  <Divider />
                  <TableContainer sx={{ maxHeight: 400 }}>
                    <Table stickyHeader sx={{ minWidth: 650, border: '1px' }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell rowSpan={2} align="center">Instrument Indication</TableCell>
                          <TableCell colSpan={2} align="center">Standart Indication &nbsp; (psi)</TableCell>
                          <TableCell colSpan={2} align="center">Correction &nbsp; (psi)</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ top: '57px' }} align="center">Up</TableCell>
                          <TableCell sx={{ top: '57px' }} align="center">Down</TableCell>
                          <TableCell sx={{ top: '57px' }} align="center">Up</TableCell>
                          <TableCell sx={{ top: '57px' }} align="center">Down</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {result.map((body, index) => (
                          <TableRow key={body.id}>
                            <TableCell align="center">
                              <TextField
                                id={index + "instrumentIndication"}
                                placeholder="0"
                                size="small"
                                rows={4}
                                variant="outlined"
                                type="number"
                                fullWidth
                                name="instrumentIndication"
                                value={result[index].instrumentIndication}
                                onChange={(e) => { handleResultChange(e, index) }}
                                inputProps={{ min: 0, style: { textAlign: 'center' } }}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <TextField
                                id={index + "standardIndicationUp"}
                                placeholder="0"
                                size="small"
                                rows={4}
                                variant="outlined"
                                type="number"
                                fullWidth
                                name="standardIndicationUp"
                                value={result[index].standardIndicationUp}
                                onChange={(e) => { handleResultChange(e, index) }}
                                inputProps={{ min: 0, style: { textAlign: 'center' } }}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <TextField
                                id={index + "standardIndicationDown"}
                                placeholder="0"
                                size="small"
                                rows={4}
                                variant="outlined"
                                type="number"
                                fullWidth
                                name="standardIndicationDown"
                                value={result[index].standardIndicationDown}
                                onChange={(e) => { handleResultChange(e, index) }}
                                inputProps={{ min: 0, style: { textAlign: 'center' } }}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <TextField
                                id={index + "correctionUp"}
                                placeholder="0"
                                size="small"
                                rows={4}
                                variant="outlined"
                                type="number"
                                fullWidth
                                name="correctionUp"
                                readOnly
                                value={result[index].correctionUp}
                                inputProps={{ min: 0, style: { textAlign: 'center' } }}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <TextField
                                id={index + "correctionDown"}
                                placeholder="0"
                                size="small"
                                rows={4}
                                variant="outlined"
                                type="number"
                                fullWidth
                                name="correctionDown"
                                readOnly
                                value={result[index].correctionDown}
                                inputProps={{ min: 0, style: { textAlign: 'center' } }}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                </CardContent>
              </Card>

              <Grid container spacing={2}>
                <Grid item sm={6} md={6} lg={6}>
                  <TextField
                    id="outlined-multiline-static"
                    label="Kondisi T sebelum"
                    placeholder="Kondisi T sebelum"
                    rows={4}
                    variant="outlined"
                    type="number"
                    fullWidth
                    size="small"
                    name="envConditionTBefore"
                    InputProps={{
                      endAdornment: <InputAdornment position="start">&#8451;</InputAdornment>,
                    }}
                    value={report.envConditionTBefore}
                    onChange={handleReportChange}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    id="outlined-multiline-static"
                    label="Kondisi T setelah"
                    placeholder="Kondisi T setelah"
                    rows={4}
                    variant="outlined"
                    type="number"
                    fullWidth
                    size="small"
                    name="envConditionTAfter"
                    InputProps={{
                      endAdornment: <InputAdornment position="start">&#8451;</InputAdornment>,
                    }}
                    value={report.envConditionTAfter}
                    onChange={handleReportChange}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item sm={6} md={6} lg={6}>
                  <TextField
                    id="outlined-multiline-static"
                    label="Kondisi RH sebelum"
                    placeholder="Kondisi RH sebelum"
                    rows={4}
                    variant="outlined"
                    type="number"
                    fullWidth
                    size="small"
                    name="envConditionRhBefore"
                    InputProps={{
                      endAdornment: <InputAdornment position="start">%</InputAdornment>,
                    }}
                    value={report.envConditionRhBefore}
                    onChange={handleReportChange}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    id="outlined-multiline-static"
                    label="Kondisi RH setelah"
                    placeholder="Kondisi RH setelah"
                    rows={4}
                    variant="outlined"
                    type="number"
                    fullWidth
                    size="small"
                    name="envConditionRhAfter"
                    InputProps={{
                      endAdornment: <InputAdornment position="start">%</InputAdornment>,
                    }}
                    value={report.envConditionRhAfter}
                    onChange={handleReportChange}
                    sx={{ mb: 2 }}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ mt: '10px', mb: '25px' }}/>

              <Grid container spacing={2}>
                <Grid item sm={4} md={4} lg={4}>
                  <TextField
                    id="outlined-multiline-static"
                    label="Uncertainly"
                    placeholder="Uncertainly"
                    size="small"
                    rows={4}
                    variant="outlined"
                    type="number"
                    fullWidth
                    name="uncertainly"
                    InputProps={{
                      endAdornment: <InputAdornment position="start">psi</InputAdornment>,
                    }}
                    value={report.uncertainly}
                    onChange={handleReportChange}
                    sx={{ mb: 2 }}
                    inputProps={{ min: 0, style: { textAlign: 'center' } }}
                  />
                </Grid>
                <Grid item sm={4} md={4} lg={4}>
                  <TextField
                    id="outlined-multiline-static"
                    label="Confidence Level"
                    placeholder="Confidence Level"
                    size="small"
                    rows={4}
                    variant="outlined"
                    type="number"
                    fullWidth
                    name="confidenceLevel"
                    InputProps={{
                      endAdornment: <InputAdornment position="start">%</InputAdornment>,
                    }}
                    value={report.confidenceLevel}
                    onChange={handleReportChange}
                    sx={{ mb: 2 }}
                    inputProps={{ min: 0, style: { textAlign: 'center' } }}
                  />
                </Grid>
                <Grid item sm={4} md={4} lg={4}>
                  <TextField
                    id="outlined-multiline-static"
                    label="Coverage Factor"
                    placeholder="Coverage Factor"
                    size="small"
                    rows={4}
                    variant="outlined"
                    type="number"
                    fullWidth
                    name="coverageFactor"
                    value={report.coverageFactor}
                    onChange={handleReportChange}
                    sx={{ mb: 2 }}
                    inputProps={{ min: 0, style: { textAlign: 'center' } }}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ mt: '10px', mb: '25px' }}/>

              <div className="form-group multi-preview">
                {(filesArr || []).map(url => (
                    <img height={150} width={120} key={url} src={url} alt="..." />
                ))}
              </div>

              <Typography>Input Data Mentah</Typography>
              <TextField
                id="outlined-file-input"
                size="small"
                variant="outlined"
                type="file"
                fullWidth
                name="files"
                inputProps={{
                  multiple: true
                }}
                sx={{ mb: 2 }}
                onChange={handleUploadMultipleFiles}
              />

              <div>
                <Button onClick={createReportCalibration}
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
        open={forwarModal}
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
                Teruskan Kalibrasi
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
              <div>
                <Button onClick={forwardCalibration}
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
                      secondary={item.standardCalibrationType ? item.standardCalibrationTypeName : '-'} />
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
          Konfirmasi mulai pengerjaan kalibrasi
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`Anda yakin mau memulai pengerjaan kalibrasi ?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog}>No</Button>
          <Button onClick={confirmCalibration} autoFocus>
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

export default TechnicianCalibration;
