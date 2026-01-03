"use client";

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* No header or footer for preview pages */}
      {children}
    </>
  );
}


