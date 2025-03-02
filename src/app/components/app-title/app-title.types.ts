import { SxProps, TypographyPropsVariantOverrides } from "@mui/material";
import { Variant } from "@mui/material/styles/createTypography";
import { Theme } from "@mui/system";
import { OverridableStringUnion } from "@mui/types";

export interface AppTitleProps {
  variant?: OverridableStringUnion<
    Variant | "inherit",
    TypographyPropsVariantOverrides
  >;
  sx?: SxProps<Theme>;
}
