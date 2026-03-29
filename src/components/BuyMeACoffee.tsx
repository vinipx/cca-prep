import React from "react";
import styles from "./BuyMeACoffee.module.css";

const CoffeeIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
    <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
    <g className={styles.steam}>
      <line x1="6" y1="2" x2="6" y2="4" />
      <line x1="10" y1="2" x2="10" y2="4" />
      <line x1="14" y1="2" x2="14" y2="4" />
    </g>
  </svg>
);

export default function BuyMeACoffee(): React.JSX.Element {
  return (
    <a
      href="https://buymeacoffee.com/vinipx"
      target="_blank"
      rel="noopener noreferrer"
      className={styles.bmcButton}
    >
      <CoffeeIcon />
      <span>Buy me a Coffee</span>
    </a>
  );
}
