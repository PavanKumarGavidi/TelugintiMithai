import { useEffect, useState, type ReactNode } from "react";

export function currentPath(): string {
  const h = window.location.hash.replace(/^#/, "");
  return h === "" ? "/" : h;
}

export function navigate(to: string) {
  window.location.hash = to;
}

export function useRoute(): { path: string; parts: string[] } {
  const [path, setPath] = useState(currentPath());
  useEffect(() => {
    const onChange = () => setPath(currentPath());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return { path, parts: path.split("/").filter(Boolean) };
}

export function Link({
  to,
  className,
  children,
  onClick,
}: {
  to: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <a
      href={`#${to}`}
      className={className}
      onClick={() => {
        if (onClick) onClick();
      }}
    >
      {children}
    </a>
  );
}

/** Navigate to home, then scroll to a section once the page has painted. */
export function goSection(id: string) {
  const onHome = currentPath() === "/";
  if (!onHome) {
    navigate("/");
  }
  window.setTimeout(() => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, onHome ? 40 : 350);
}
