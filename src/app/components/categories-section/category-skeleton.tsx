import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid2,
  Skeleton,
} from "@mui/material";

const CategorySkeleton = () => (
  <Container maxWidth={false} sx={{ mb: 4 }}>
    <Grid2 container spacing={1}>
      {[49652, 49653, 49654, 49655, 49656, 49657].map((category) => (
        <Grid2 key={category} size={{ xs: 12, md: 12 / 6 }}>
          <Card variant="elevation" elevation={2}>
            <CardMedia
              component="img"
              height="140"
              image="images/no-picture-available.jpg"
            />
            <CardContent>
              <Skeleton variant="text" width="90" height="10" />
            </CardContent>
          </Card>
        </Grid2>
      ))}
    </Grid2>
  </Container>
);

export default CategorySkeleton;
