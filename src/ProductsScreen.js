import React, {useState} from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {Box, Typography, Divider} from '@mui/material';
import {MESSAGE_SUBSCRIPTION, PRODUCTS_QUERY} from './product_gqls.js' 
import {useQuery, useSubscription} from '@apollo/client';


const ProductsScreen = () => {
    
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
          backgroundColor: theme.palette.common.black,
          color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
          fontSize: 14,
        },
      }));
      
      const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
          backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
          border: 0,
        },
      }));

      const [products, setProducts] = useState([])

      const { loading, error, data } = useQuery(PRODUCTS_QUERY, {
        onCompleted(data){
            setProducts(data.products);
        },
        onError(error){
            console.log(error.name)
            console.log(error.cause)
            console.log(error.message)
            console.log(error.stack)
        }
      });

      const { subLoading, subError, subscriptionData } = useSubscription(MESSAGE_SUBSCRIPTION,{
        onData(subscriptionData){
            setProducts(products.map( (product) => {
                    let updatedProductInfo = subscriptionData.data.data.productInfoUpdated
                    if (product.id === updatedProductInfo.id) {
                        let newProduct = { ...product };
                        newProduct.avg_rating = updatedProductInfo.avg_rating;
                        newProduct.total_sales = updatedProductInfo.total_sales;
                        return newProduct;
                    } else {
                        return product;
                    }
                } )
            );
        },
        onError(subError){
            console.log(subError.name)
            console.log(subError.cause)
            console.log(subError.message)
            console.log(subError.stack)
        }
      });

      if(loading) return <Typography variant='h6'>Still Loading Products</Typography>
      if(error) return <Typography variant='h6'>Something went wrong. Couldn't load Products!!</Typography>

      if(subLoading) return <Typography variant='h6'>Received Product Updates...</Typography>
      if(subError) return <Typography variant='h6'>Couldn't load updated Products!!</Typography>

    return (
        <Box>
            <Typography variant="h2">Products List:</Typography>
            <Divider />
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                    <TableRow>
                        <StyledTableCell>Product ID</StyledTableCell>
                        <StyledTableCell align="left">Product Name</StyledTableCell>
                        <StyledTableCell align="right">Price&nbsp;($)</StyledTableCell>
                        <StyledTableCell align="right">Avg. Rating&nbsp;(*)</StyledTableCell>
                        <StyledTableCell align="right">Total Sales&nbsp;(*)</StyledTableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {products.map((row) => (
                        <StyledTableRow key={row.id}>
                        <StyledTableCell component="th" scope="row">
                            {row.id}
                        </StyledTableCell>
                        <StyledTableCell align="left">{row.title}</StyledTableCell>
                        <StyledTableCell align="right">{row.price}</StyledTableCell>
                        <StyledTableCell align="right">{row.avg_rating}</StyledTableCell>
                        <StyledTableCell align="right">{row.total_sales}</StyledTableCell>
                        </StyledTableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Typography variant="caption" display={'flex'} sx={{py:1}}>* These value will update as the data changes.</Typography>
        </Box>
    )
}

export default ProductsScreen