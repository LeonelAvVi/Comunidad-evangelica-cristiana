type LogoProps = {
  width?: number;
  height?: number;
  className?: string;
  alt?: string;
};

export function BrandMark({ width = 40, height = 60, className, alt = "Logo Comunidad Cristiana" }: LogoProps) {
  return (
    <img
      className={className}
      src="/logo-comunidad-cristiana.jpg"
      alt={alt}
      width={width}
      height={height}
    />
  );
}

export function RainbowMark({ width = 60, height = 60 }: { width?: number; height?: number }) {
  return <BrandMark width={width} height={height} alt="Logo Comunidad Cristiana" />;
}
