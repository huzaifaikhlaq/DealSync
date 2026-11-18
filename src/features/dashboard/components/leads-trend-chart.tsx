"use client";

import { useState } from "react";

const intervals = ["Daily", "Weekly", "Monthly"] as const;

export function LeadsTrendChart() {
  const [granularity, setGranularity] =
    useState<(typeof intervals)[number]>("Daily");

  return (
    <section className="panel trend-panel">
      <div className="panel-heading">
        <div>
          <h2>Leads Captured Over Time</h2>
          <p>Aggregated submissions across active forms</p>
        </div>
        <div className="segmented" role="group" aria-label="Chart interval">
          {intervals.map((item) => (
            <button
              key={item}
              type="button"
              className={granularity === item ? "active" : ""}
              aria-pressed={granularity === item}
              onClick={() => setGranularity(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="source-legend">
        <span>
          <i className="dot dot-indigo" />
          Inbound Web (62%)
        </span>
        <span>
          <i className="dot dot-lavender" />
          Direct Links (24%)
        </span>
        <span>
          <i className="dot dot-mint" />
          Partner Embeds (14%)
        </span>
      </div>
      <div className="chart-wrap">
        <div className="chart-y-labels" aria-hidden="true">
          <span>250</span>
          <span>180</span>
          <span>120</span>
          <span>60</span>
          <span>0</span>
        </div>
        <svg
          className="trend-chart"
          viewBox="0 0 720 250"
          preserveAspectRatio="none"
          role="img"
          aria-label={`${granularity} lead submissions trend increasing through October`}
        >
          <defs>
            <linearGradient id="fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#5145e8" stopOpacity=".24" />
              <stop offset="100%" stopColor="#5145e8" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            className="gridline"
            d="M0 20H720 M0 72H720 M0 124H720 M0 176H720 M0 228H720"
          />
          <path
            className="area"
            d="M0 218 C35 209 52 193 78 180 S125 136 161 130 S203 146 235 131 S282 103 313 77 S365 26 401 38 S454 76 492 88 S548 118 587 99 S632 76 661 88 S697 99 720 67 V238 H0Z"
          />
          <path
            className="line"
            d="M0 218 C35 209 52 193 78 180 S125 136 161 130 S203 146 235 131 S282 103 313 77 S365 26 401 38 S454 76 492 88 S548 118 587 99 S632 76 661 88 S697 99 720 67"
          />
        </svg>
      </div>
      <div className="chart-x-labels" aria-hidden="true">
        <span>Oct 01</span>
        <span>Oct 08</span>
        <span>Oct 15</span>
        <span>Oct 22</span>
        <span>Oct 29</span>
      </div>
    </section>
  );
}
