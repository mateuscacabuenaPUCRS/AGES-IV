type NewsItemProps = {
  imageUrl?: string;
  title: string;
  link?: string;
  onClick?: () => void;
  "data-testid"?: string;
};

export default function NewsItem({
  imageUrl,
  title,
  link,
  onClick,
  "data-testid": dataTestId,
}: NewsItemProps) {
  const content = (
    <div className="flex flex-col h-full">
      <div className="h-36 w-full">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center"></div>
        )}
      </div>

      <div className="h-24 w-full flex items-center justify-center p-3">
        <h3 className="text-sm font-semibold text-center text-gray-800">{title}</h3>
      </div>
    </div>
  );

  const className =
    "block w-48 h-60 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-100 overflow-hidden cursor-pointer hover:border-2 border-transparent hover:border-[var(--color-components)] hover:border-opacity-50";

  if (onClick) {
    return (
      <button onClick={onClick} className={className} type="button" data-testid={dataTestId}>
        {content}
      </button>
    );
  }

  if (link) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        data-testid={dataTestId}
      >
        {content}
      </a>
    );
  }

  return (
    <div className={className} data-testid={dataTestId}>
      {content}
    </div>
  );
}
