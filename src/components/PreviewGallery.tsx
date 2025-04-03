type PreviewGalleryProps = {
  files: File[];
};
export default function PreviewGallery({ files }: PreviewGalleryProps) {

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1.5rem",
          marginTop: "2rem",
        }}
      >
        {files.map((file) => {
          const preview = URL.createObjectURL(file);
          return (
            <div key={file.name} style={{ textAlign: "center" }}>
              <img
                src={preview}
                alt={file.name}
                style={{
                  width: "100%",
                  height: 180,
                  objectFit: "contain",
                  borderRadius: "8px",
                  boxShadow: "0 0 4px rgba(0, 0, 0, 0.1)",
                }}
              />
              <p
                style={{
                  fontSize: "0.75rem",
                  marginTop: "0.5rem",
                  wordBreak: "break-word",
                }}
              >
                {file.name}
              </p>
            </div>
          );
        })}
      </div>
    );
  }