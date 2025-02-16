export const getColorShade = (noOfIterations: number, baseShade: number) => {
  const shade = baseShade + noOfIterations * 100;
  return shade <= 900 ? shade : baseShade;
};
