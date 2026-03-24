interface UploadIconPlaceholderProps {
  url?: string;
}

export default function UploadIconPlaceholder({ url }: UploadIconPlaceholderProps) {
  return (
    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted rounded-md flex items-center justify-center border overflow-hidden">
      {url ? (
        <img
          src={url}
          alt="preview"
          className="object-cover w-full h-full rounded-md"
        />
      ) : (
        <span className="text-xs">📎</span>
      )}
    </div>
  );
}
