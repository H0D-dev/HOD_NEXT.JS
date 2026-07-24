"use client";

import React from "react";
import "./TextMarquee.css";

const items = [
  <React.Fragment key="1">HANDMADE WITH CARE</React.Fragment>,
  <React.Fragment key="2">NATURAL & SUSTAINABLE</React.Fragment>,
  <React.Fragment key="3">TIMELESS DESIGN</React.Fragment>,
  <React.Fragment key="4">WORLDWIDE SHIPPING</React.Fragment>,
];

export default function TextMarquee() {
  return (
    <section className="marquee-section">
      <div className="marquee-container">
        <div className="marquee-track">
          <div className="marquee-group">
            {items.map((item, index) => (
              <div key={index} className="marquee-item">
                <h2 className="marquee-text">{item}</h2>
              </div>
            ))}
          </div>
          <div className="marquee-group" aria-hidden="true">
            {items.map((item, index) => (
              <div key={index} className="marquee-item">
                <h2 className="marquee-text">{item}</h2>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
