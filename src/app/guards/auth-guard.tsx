import React, { useContext } from "react";
import { AuthContext } from "../contexts/auth/auth-context";
import { UserType } from "@prisma/client";
import { Box, Button, Container, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

interface AuthGuardProps extends React.PropsWithChildren {
  userType: UserType;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, userType }) => {
  const { account } = useContext(AuthContext);

  if (account && account.user.user_type === userType) {
    return children;
  }

  return (
    <Container maxWidth={false} sx={{ mt: 12 }}>
      <Box
        component="div"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          src="/images/access-denied.svg"
          alt="access-denied"
          height={300}
          width={300}
          quality={100}
        />
        <Box
          component="div"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 0.2,
            mt: 2,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h2" color="primary">
            Access Denied
          </Typography>
          <Typography variant="subtitle1">
            You don&apos;t have enough permission to access this resource.
          </Typography>
          <Button
            LinkComponent={Link}
            href="/"
            variant="contained"
            sx={{ width: 150, mt: 3 }}
          >
            Back to Home
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default AuthGuard;
