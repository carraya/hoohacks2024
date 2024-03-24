import { ReactNode } from "react";

export default function GraphLayer({ children }: { children: ReactNode }) {
  return <div className="flex flex-col justify-center">{children}</div>;
}
