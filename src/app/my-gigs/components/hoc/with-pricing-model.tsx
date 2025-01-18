import { PricingModelType } from "@prisma/client";
import FixedPriceForm from "../pricing-models/fixed-price-form";
import HourlyRateForm from "../pricing-models/hourly-rate-form";
import { Typography } from "@mui/material";
import TieredPricingForm from "../pricing-models/tiered-pricing-form";

interface IWithPricingModelProps {
  pricingModel: PricingModelType | undefined;
}

const withPricingModel = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const HOC = (props: P & IWithPricingModelProps) => {
    const { pricingModel } = props;

    switch (pricingModel) {
      case "FIXED":
        return <FixedPriceForm />;

      case "HOURLY_RATE":
        return <HourlyRateForm />;

      case "TIERED":
        return <TieredPricingForm />;

      default:
        return (
          <Typography variant="h5" color="textSecondary">
            Please select your pricing model!
          </Typography>
        );
    }
  };

  HOC.displayName = `withPricingModel(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return HOC;
};

export default withPricingModel;
