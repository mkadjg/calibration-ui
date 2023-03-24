import React, { useEffect, useState } from "react";

import { Card, CardContent, Box, Typography } from "@material-ui/core";

import DataTable from "react-data-table-component";
import axios from "axios";
import { useCookies } from "react-cookie";
import FilterComponent from "../../components/filter/FIlterComponent";

const Equipment = () => {
  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookies] = useCookies({});
  const [equipments, setEquipments] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const filteredItems = equipments.filter((o) => {
      return Object.keys(o).some((k) => {
          return  o[k].toString().toLowerCase().indexOf(filterText.toLowerCase()) !== -1;
      })
  });

  const getEquipments = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/equipment/find-all`, { headers: { Authorization: `Bearer ${cookies.auth.token}` } })
      .then((response) => {
        if (response.status === 200) {
          setEquipments(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getEquipments();
  })

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
    }
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

  return (
    <Box>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h3">Daftar Peralatan</Typography>
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
  );
};

export default Equipment;
