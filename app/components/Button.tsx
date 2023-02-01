import * as React from "react";

export function Button({ children, onClick, href }: any) {
  if (href) {
    <a href={href}>{children}</a>;
  }

  return <button onClick={onClick}>{children}</button>;
}
