import React from "react";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

export default function DashboardSkeleton() {
  return (
    <Box sx={{ p: 2 }}>
      {/* Header Section */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={0}
      >
        <Skeleton variant="text" width={150} height={150} />
        <Skeleton variant="text" width={200} height={150} />
      </Box>

      {/* Button Section */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Skeleton variant="rectangular" width={150} height={50} />
        <Skeleton variant="rectangular" width={150} height={50} />
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Skeleton variant="text" width={150} height={20} />
        <Skeleton variant="text" width={200} height={20} />
      </Box>

      {/* Button Section */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Skeleton variant="rectangular" width={150} height={40} />
        <Skeleton variant="rectangular" width={150} height={40} />
      </Box>

      {/* Cards Section */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={4}>
          <Skeleton variant="rectangular" height={100} />
        </Grid>
        <Grid item xs={4}>
          <Skeleton variant="rectangular" height={100} />
        </Grid>
        <Grid item xs={4}>
          <Skeleton variant="rectangular" height={100} />
        </Grid>
      </Grid>

      {/* Circular Graph Section */}
      <Box display="flex" justifyContent="center" mt={4}>
        <Skeleton variant="circular" width={200} height={200} />
      </Box>
    </Box>
  );
}
