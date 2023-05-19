import React, { useEffect, useState } from "react";

import { Card, CardContent, Box, Typography, Modal, Button, TextField, Divider, Grid, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Snackbar, Alert, CircularProgress, MenuItem } from "@material-ui/core";

import DataTable from "react-data-table-component";
import axios from "axios";
import { useCookies } from "react-cookie";
import FilterComponent from "../../components/filter/FIlterComponent";

const Employee = () => {
  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookies] = useCookies({});
  const [employees, setEmployess] = useState([]);
  const [education, setEducation] = useState([]);
  const [jobPosition, setJobPosition] = useState([]);

  // filter
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const filteredItems = employees.filter(
    (item) =>
      (item.nip && item.nip.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.employeeName && item.employeeName.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.email && item.email.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.phoneNumber && item.phoneNumber.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.address && item.address.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.education.educationName && item.education.educationName.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.jobPosition.jobPositionName && item.jobPosition.jobPositionName.toLowerCase().includes(filterText.toLowerCase()))
  );

  // modal
  const [createModal, setCreateModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: ""
  });
  const [item, setItem] = useState({
    nip: '',
    employeeName: '',
    email: '',
    phoneNumber: '',
    address: '',
    educationId: 1,
    jobPositionId: 1
  });
  const [body, setBody] = useState({
    nip: '',
    employeeName: '',
    email: '',
    phoneNumber: '',
    address: '',
    educationId: 1,
    jobPositionId: 1,
    username: '',
    password: ''
  });
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCreateChange = (e) => {
    setBody({
      ...body,
      [e.target.name]: e.target.value
    })
  }

  const handleUpdateChange = (e) => {
    setItem({
      ...item,
      [e.target.name]: e.target.value
    })
  }

  const handleOpenCreateModal = () => {
    getEducation();
    getJobPosition();
    setCreateModal(true);
  }

  const handleCloseCreateModal = () => {
    setBody({
      nip: '',
      employeeName: '',
      email: '',
      phoneNumber: '',
      address: '',
      educationId: 1,
      jobPositionId: 1,
      username: '',
      password: ''
    });
    setCreateModal(false);
  }

  const handleOpenUpdateModal = (item) => {
    getEducation();
    getJobPosition();
    setItem({
      id: item.id,
      nip: item.nip,
      employeeName: item.employeeName,
      email: item.email,
      phoneNumber: item.phoneNumber,
      address: item.address,
      educationId: item.education.id,
      jobPositionId: item.jobPosition.id
    });
    setUpdateModal(true);
  }

  const handleCloseUpdateModal = () => {
    setItem({});
    setUpdateModal(false);
  }

  // const handleOpenDeleteDialog = (id) => {
  //   setId(id);
  //   setDeleteDialog(true);
  // }

  const handleCloseDeleteDialog = () => {
    setId(null);
    setDeleteDialog(false);
    setSnackbar(true);
  }

  const handleCloseSnackbar = () => {
    setSnackbar(false);
  }

  const getEmployees = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/employee/find-all`, { headers: { Authorization: `Bearer ${cookies.auth.token}` } })
      .then((response) => {
        if (response.status === 200) {
          setEmployess(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getEducation = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/education/find-all`, { headers: { Authorization: `Bearer ${cookies.auth.token}` } })
      .then((response) => {
        if (response.status === 200) {
          setEducation(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getJobPosition = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/job-position/find-all`, { headers: { Authorization: `Bearer ${cookies.auth.token}` } })
      .then((response) => {
        if (response.status === 200) {
          setJobPosition(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const createEmployee = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/employee/create`, body, { headers: { Authorization: `Bearer ${cookies.auth.token}` } })
      .then((response) => {
        if (response.status === 201) {
          setSnackbar({
            open: true,
            severity: "success",
            message: "Simpan data berhasil"
          });
          setBody({
            nip: '',
            employeeName: '',
            email: '',
            phoneNumber: '',
            address: '',
            educationId: 1,
            jobPositionId: 1,
            username: '',
            password: ''
          });
          setLoading(false);
          handleCloseCreateModal();
          getEmployees();
        }
      })
      .catch((error) => {
        setSnackbar({
          open: true,
          severity: "error",
          message: error.response?.data
        });
        setBody({
          nip: '',
          employeeName: '',
          email: '',
          phoneNumber: '',
          address: '',
          educationId: 1,
          jobPositionId: 1,
          username: '',
          password: ''
        });
        setLoading(false);
        handleCloseCreateModal();
      });
  };

  const updateEmployee = (e) => {
    setLoading(true);
    e.preventDefault();
    axios
      .put(`${process.env.REACT_APP_BASE_URL}/employee/${item.id}`, item, { headers: { Authorization: `Bearer ${cookies.auth.token}` } })
      .then((response) => {
        if (response.status === 200) {
          setSnackbar({
            open: true,
            severity: "success",
            message: "Ubah data berhasil"
          });
          setLoading(false);
          handleCloseUpdateModal();
          getEmployees();
        }
      })
      .catch((error) => {
        setSnackbar({
          open: true,
          severity: "error",
          message: error.response?.data
        });
        setLoading(false);
        handleCloseUpdateModal();
      });
  };

  const deleteEmployee = () => {
    axios
      .delete(`${process.env.REACT_APP_BASE_URL}/employee/${id}`, { headers: { Authorization: `Bearer ${cookies.auth.token}` } })
      .then((response) => {
        if (response.status === 200) {
          setSnackbar({
            open: true,
            severity: "success",
            message: response.data
          });
        }
      })
      .catch((error) => {
        setSnackbar({
          open: true,
          severity: "success",
          message: error.response?.data
        });
      });
  };

  useEffect(() => {
    getEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const columns = [
    {
      name: 'NIP',
      selector: row => row.nip,
      wrap: true,
      sortable: true
    },
    {
      name: 'Nama Karyawan',
      selector: row => row.employeeName,
      wrap: true,
      sortable: true
    },
    {
      name: 'Email',
      selector: row => row.email,
      wrap: true,
      sortable: true
    },
    {
      name: 'No. Telepon',
      selector: row => row.phoneNumber,
      wrap: true,
      sortable: true
    },
    {
      name: 'Jabatan',
      selector: row => row.jobPosition.jobPositionName,
      wrap: true,
      sortable: true
    },
    {
      name: 'Pendidikan',
      selector: row => row.education.educationName,
      wrap: true,
      sortable: true
    },
    {
      name: 'Alamat',
      selector: row => row.address,
      wrap: true,
      sortable: true
    },
    {
      name: 'Aksi',
      selector: row => (
        <>
          <Button style={{ marginRight: '8px' }}
            onClick={() => handleOpenUpdateModal(row)}
            size="small"
            variant="contained"
            color="success">
            Ubah
          </Button>
          {/* <Button size="small"
            onClick={() => handleOpenDeleteDialog(row.id)}
            variant="contained"
            color="error">
            Hapus
          </Button> */}
        </>
      ),
      width: '100px'
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
    p: 4,
  };

  return (
    <>
      <Box>
        <Card variant="outlined">
          <CardContent>
            <Grid container>
              <Grid item lg={10}>
                <Typography variant="h3">Daftar Karyawan</Typography>
              </Grid>
              <Grid item lg={2} style={{ paddingRight: '15px' }}>
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
                Tambah Peralatan
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
              <TextField
                id="nip"
                label="Nomor Induk Pegawai"
                variant="outlined"
                placeholder="Nomor Induk Pegawai"
                type="text"
                name="nip"
                value={body.nip}
                onChange={handleCreateChange}
                fullWidth
                sx={{
                  mb: 2,
                }}
              />
              <TextField
                id="employee-name"
                label="Nama Karyawan"
                variant="outlined"
                placeholder="Nama Karyawan"
                type="text"
                name="employeeName"
                value={body.employeeName}
                onChange={handleCreateChange}
                fullWidth
                sx={{
                  mb: 2,
                }}
              />
              <TextField
                id="email"
                label="Email"
                variant="outlined"
                placeholder="Email"
                type="email"
                name="email"
                value={body.email}
                onChange={handleCreateChange}
                fullWidth
                sx={{
                  mb: 2,
                }}
              />
              <TextField
                id="phone-number"
                label="No. Telepon"
                variant="outlined"
                placeholder="No. Telepon"
                type="text"
                name="phoneNumber"
                value={body.phoneNumber}
                onChange={handleCreateChange}
                fullWidth
                sx={{
                  mb: 2,
                }}
              />
              <TextField
                id="address"
                label="Alamat"
                variant="outlined"
                placeholder="Alamat"
                type="text"
                name="address"
                value={body.address}
                multiline
                rows={2}
                onChange={handleCreateChange}
                fullWidth
                sx={{
                  mb: 2,
                }}
              />
              <TextField
                fullWidth
                id="education-id"
                variant="outlined"
                select
                value={body.educationId}
                onChange={handleCreateChange}
                name="educationId"
                label="Pendidikan"
                sx={{
                  mb: 2,
                }}
              >
                {education.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.educationName}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                id="standard-select-number"
                variant="outlined"
                select
                value={body.jobPositionId}
                onChange={handleCreateChange}
                name="jobPositionId"
                label="Jabatan"
                sx={{
                  mb: 2,
                }}
              >
                {jobPosition.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.jobPositionName}
                  </MenuItem>
                ))}
              </TextField>
              <Divider />
              <br />
              <TextField
                id="username"
                label="Username"
                variant="outlined"
                placeholder="Username"
                type="text"
                name="username"
                value={body.username}
                onChange={handleCreateChange}
                fullWidth
                sx={{
                  mb: 2,
                }}
              />
              <TextField
                id="password"
                label="Password"
                variant="outlined"
                placeholder="Password"
                type="password"
                name="password"
                value={body.password}
                onChange={handleCreateChange}
                fullWidth
                sx={{
                  mb: 2,
                }}
              />
              <div>
                <Button onClick={createEmployee}
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
        open={updateModal}
        onClose={handleCloseUpdateModal}
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
                Ubah Peralatan
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
              <TextField
                id="nip"
                label="Nomor Induk Pegawai"
                variant="outlined"
                placeholder="Nomor Induk Pegawai"
                type="text"
                name="nip"
                value={item.nip}
                onChange={handleUpdateChange}
                fullWidth
                sx={{
                  mb: 2,
                }}
              />
              <TextField
                id="employee-name"
                label="Nama Karyawan"
                variant="outlined"
                placeholder="Nama Karyawan"
                type="text"
                name="employeeName"
                value={item.employeeName}
                onChange={handleUpdateChange}
                fullWidth
                sx={{
                  mb: 2,
                }}
              />
              <TextField
                id="email"
                label="Email"
                variant="outlined"
                placeholder="Email"
                type="email"
                name="email"
                value={item.email}
                onChange={handleUpdateChange}
                fullWidth
                sx={{
                  mb: 2,
                }}
              />
              <TextField
                id="phone-number"
                label="No. Telepon"
                variant="outlined"
                placeholder="No. Telepon"
                type="text"
                name="phoneNumber"
                value={item.phoneNumber}
                onChange={handleUpdateChange}
                fullWidth
                sx={{
                  mb: 2,
                }}
              />
              <TextField
                id="address"
                label="Alamat"
                variant="outlined"
                placeholder="Alamat"
                type="text"
                name="address"
                value={item.address}
                multiline
                rows={2}
                onChange={handleUpdateChange}
                fullWidth
                sx={{
                  mb: 2,
                }}
              />
              <TextField
                fullWidth
                id="education-id"
                variant="outlined"
                select
                value={item.educationId}
                onChange={handleUpdateChange}
                name="educationId"
                label="Pendidikan"
                sx={{
                  mb: 2,
                }}
              >
                {education.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.educationName}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                id="standard-select-number"
                variant="outlined"
                select
                value={item.jobPositionId}
                onChange={handleCreateChange}
                name="jobPositionId"
                label="Jabatan"
                sx={{
                  mb: 2,
                }}
              >
                {jobPosition.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.jobPositionName}
                  </MenuItem>
                ))}
              </TextField>
              <div>
                <Button onClick={updateEmployee}
                  fullWidth color="primary"
                  size="large" variant="contained"
                  disabled={loading}>
                  {loading ? <CircularProgress size={26} color="inherit" /> : "Ubah"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </Modal>

      <Dialog
        open={deleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle fontSize={16} id="alert-dialog-title">
          Konfirmasi hapus data peralatan
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`Anda yakin mau menghapus peralatan ini ?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>No</Button>
          <Button onClick={deleteEmployee} autoFocus>
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

export default Employee;
