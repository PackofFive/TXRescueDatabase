type BrandLogoProps = {
  size?: number;
};

export default function BrandLogo({ size = 30 }: BrandLogoProps) {
  return (
    <img
      src="/pack-of-five-logo.png"
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      style={{
        display: "block",
        width: size,
        height: size,
        flex: "0 0 auto",
        objectFit: "contain",
      }}
    />
  );
}
