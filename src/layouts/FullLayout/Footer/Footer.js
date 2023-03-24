import React from 'react'
import {
    Box,
    Link,
    Typography,
    
  } from '@material-ui/core';
const Footer = () => {
    return ( 
        <Box sx={{p:3, textAlign:'center'}}>
            <Typography>© 2023 <Link href="#"></Link>PT. Global Quality Indonesia</Typography>
        </Box>
     );
}
 
export default Footer;