import React, { useEffect, useState } from "react";

import { Card, CardContent, Box, Typography, Modal, Button, TextField, Divider, Grid, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Snackbar, Alert, CircularProgress } from "@material-ui/core";

import DataTable from "react-data-table-component";
import axios from "axios";
import { useCookies } from "react-cookie";
import FilterComponent from "../../components/filter/FIlterComponent";

const Equipment = () => {
  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookies] = useCookies({});
  const [equipments, setEquipments] = useState([]);

  // filter
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const filteredItems = equipments.filter((o) => {
    return Object.keys(o).some((k) => {
      return o[k].toString().toLowerCase().indexOf(filterText.toLowerCase()) !== -1;
    })
  });

  // modal
  const [createModal, setCreateModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: ""
  });
  const [item, setItem] = useState({});
  const [body, setBody] = useState({
    equipmentName: '',
    capacity: 0,
    manufacturer: '',
    graduation: 0,
    modelType: '',
    serialNumber: '',
    customerId: cookies.auth.userProfile.id
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
    setCreateModal(true);
  }

  const handleCloseCreateModal = () => {
    setCreateModal(false);
  }

  const handleOpenUpdateModal = (item) => {
    setItem(item);
    setUpdateModal(true);
  }

  const handleCloseUpdateModal = () => {
    setItem({});
    setUpdateModal(false);
  }

  const handleCloseDeleteDialog = () => {
    setId(null);
    setDeleteDialog(false);
    setSnackbar(true);
  }

  const handleCloseSnackbar = () => {
    setSnackbar(false);
  }

  const getEquipments = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/equipment/find-by-customer-id/${cookies.auth.userProfile.id}`, { headers: { Authorization: `Bearer ${cookies.auth.token}` } })
      .then((response) => {
        if (response.status === 200) {
          setEquipments(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const createEquipment = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/equipment`, body ,{ headers: { Authorization: `Bearer ${cookies.auth.token}` } })
      .then((response) => {
        if (response.status === 201) {
          setSnackbar({
            open: true,
            severity: "success",
            message: "Simpan data berhasil"
          });
          setLoading(false);
          handleCloseCreateModal();
          getEquipments();
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

  const updateEquipment = (e) => {
    setLoading(true);
    e.preventDefault();
    item.customerId = cookies.auth.userProfile.id;
    axios
      .put(`${process.env.REACT_APP_BASE_URL}/equipment/${item.id}`, item, { headers: { Authorization: `Bearer ${cookies.auth.token}` } })
      .then((response) => {
        if (response.status === 200) {
          setSnackbar({
            open: true,
            severity: "success",
            message: "Ubah data berhasil"
          });
          setLoading(false);
          handleCloseUpdateModal();
          getEquipments();
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

  const deleteEquipment = () => {
    axios
      .delete(`${process.env.REACT_APP_BASE_URL}/equipment/${id}`, { headers: { Authorization: `Bearer ${cookies.auth.token}` } })
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
    getEquipments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const columns = [
    {
      name: 'Nama Peralatan',
      selector: row => row.equipmentName,
      wrap: true,
      sortable: true
    },
    {
      name: 'Kapasitas',
      selector: row => row.capacity,
      sortable: true
    },
    {
      name: 'Graduation',
      selector: row => row.graduation,
      sortable: true
    },
    {
      name: 'Manufacturer',
      selector: row => row.manufacturer,
      wrap: true,
      sortable: true
    },
    {
      name: 'Model Type',
      selector: row => row.modelType,
      sortable: true
    },
    {
      name: 'Serial Number',
      selector: row => row.serialNumber,
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
    width: '40%',
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
                <Typography variant="h3">Daftar Peralatan</Typography>
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
            }}
          >
            <form>
              <TextField
                id="equipment-name"
                label="Nama Peralatan"
                variant="outlined"
                placeholder="Nama Peralatan"
                type="text"
                name="equipmentName"
                onChange={handleCreateChange}
                fullWidth
                sx={{
                  mb: 2,
                }}
              />
              <TextField
                id="manufacturer"
                label="Manufacturer"
                variant="outlined"
                placeholder="Manufacturer"
                type="text"
                name="manufacturer"
                onChange={handleCreateChange}
                fullWidth
                sx={{
                  mb: 2,
                }}
              />
              <TextField
                id="capacity"
                label="Kapasitas"
                variant="outlined"
                placeholder="Kapasitas"
                type="number"
                name="capacity"
                onChange={handleCreateChange}
                fullWidth
                sx={{
                  mb: 2,
                }}
              />
              <TextField
                id="graduation"
                label="Graduation"
                variant="outlined"
                placeholder="Graduation"
                type="number"
                name="graduation"
                onChange={handleCreateChange}
                fullWidth
                sx={{
                  mb: 2,
                }}
              />
              <TextField
                id="model-type"
                label="Model Type"
                variant="outlined"
                placeholder="Model Type"
                type="text"
                name="modelType"
                onChange={handleCreateChange}
                fullWidth
                sx={{
                  mb: 2,
                }}
              />
              <TextField
                id="serial-number"
                label="Serial Number"
                variant="outlined"
                placeholder="Serial Number"
                type="text"
                name="serialNumber"
                onChange={handleCreateChange}
                fullWidth
                sx={{
                  mb: 2,
                }}
              />
              <div>
                <Button onClick={createEquipment} 
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
            }}
          >
            <form>
              <TextField
                id="equipment-name"
                label="Nama Peralatan"
                variant="outlined"
                placeholder="Nama Peralatan"
                type="text"
                name="equipmentName"
                value={item.equipmentName}
                onChange={handleUpdateChange}
                fullWidth
                sx={{
                  mb: 2,
                }}
              />
              <TextField
                id="manufacturer"
                label="Manufacturer"
                variant="outlined"
                placeholder="Manufacturer"
                type="text"
                name="manufacturer"
                value={item.manufacturer}
                onChange={handleUpdateChange}
                fullWidth
                sx={{
                  mb: 2,
                }}
              />
              <TextField
                id="capacity"
                label="Kapasitas"
                variant="outlined"
                placeholder="Kapasitas"
                type="number"
                name="capacity"
                value={item.capacity}
                onChange={handleUpdateChange}
                fullWidth
                sx={{
                  mb: 2,
                }}
              />
              <TextField
                id="graduation"
                label="Graduation"
                variant="outlined"
                placeholder="Graduation"
                type="number"
                name="graduation"
                value={item.graduation}
                onChange={handleUpdateChange}
                fullWidth
                sx={{
                  mb: 2,
                }}
              />
              <TextField
                id="model-type"
                label="Model Type"
                variant="outlined"
                placeholder="Model Type"
                type="text"
                name="modelType"
                value={item.modelType}
                onChange={handleUpdateChange}
                fullWidth
                sx={{
                  mb: 2,
                }}
              />
              <TextField
                id="serial-number"
                label="Serial Number"
                variant="outlined"
                placeholder="Serial Number"
                type="text"
                name="serialNumber"
                value={item.serialNumber}
                onChange={handleUpdateChange}
                fullWidth
                sx={{
                  mb: 2,
                }}
              />
              <div>
                <Button onClick={updateEquipment} 
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
          <Button onClick={deleteEquipment} autoFocus>
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

export default Equipment;
