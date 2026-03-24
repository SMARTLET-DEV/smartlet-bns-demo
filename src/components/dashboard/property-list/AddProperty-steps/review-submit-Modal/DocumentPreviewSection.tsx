interface DocumentPreviewSectionProps {
  property: any;
}

export default function DocumentPreviewSection({ property }: DocumentPreviewSectionProps) {
  const documents = [
    {
      label: "Title deed",
      fileName: property?.titleDeed ? "Uploaded" : "Not uploaded",
    },
    {
      label: "Utility bill",
      fileName: property?.utilityBill ? "Uploaded" : "Not uploaded",
    },
  ];
  return (
    <div className="grid grid-cols-2 gap-y-4 mb-3 text-sm text-muted-foreground">
      {documents.map((doc) => (
        <div key={doc.label} className="space-y-1">
          <div className="font-normal text-muted">{doc.label}</div>
          <div className="font-normal text-secondary">{doc.fileName}</div>
        </div>
      ))}
    </div>
  );
}
