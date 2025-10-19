export default function CompanyLogo({ logo, companyName, size = "md" }) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14"
  };

  const containerSizes = {
    sm: "w-10 h-10",
    md: "w-12 h-12",
    lg: "w-16 h-16"
  };

  const emojiSizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl"
  };

  const cleanDomain = logo ? logo.replace(/^https?:\/\//, '').replace(/\/.*$/, '') : null;
  const logoUrl = cleanDomain ? `https://img.logo.dev/${cleanDomain}?token=${import.meta.env.VITE_LOGO_DEV_TOKEN}` : null;

  return (
    <div className={`${containerSizes[size]} bg-white rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0`}>
      {logoUrl ? (
        <img 
          src={logoUrl}
          alt={companyName || 'Company'}
          className={`${sizeClasses[size]} object-contain`}
          onError={(e) => { 
            e.target.style.display = 'none'; 
            e.target.nextSibling.style.display = 'block'; 
          }}
        />
      ) : null}
      <span className={emojiSizes[size]} style={{ display: logoUrl ? 'none' : 'block' }}>🏢</span>
    </div>
  );
}
