const PageContainer = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      padding: 24,
      background: "#F9FAFB",
      height: "calc(100vh - 70px)",
      overflow: "auto",
    }}
  >
    {children}
  </div>
);

export default PageContainer;
