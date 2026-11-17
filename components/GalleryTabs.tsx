"use client";

import { useState, type ReactNode } from "react";

type Props = {
  tabs: { id: string; label: string }[];
  panes: { id: string; content: ReactNode }[];
};

/** Onglets de la page « Notre galerie photo » (remplace les onglets Bootstrap/jQuery). */
export default function GalleryTabs({ tabs, panes }: Props) {
  const [current, setCurrent] = useState(tabs[0]?.id);

  return (
    <div className="row multiple">
      <div className="col-md-12 nopad hide-print">
        <ul className="nav nav-pills nav-stacked nopad-xs nopad-sm" id="myTabs">
          {tabs.map((tab) => (
            <li key={tab.id} className={tab.id === current ? "active" : undefined}>
              <a
                href={`#${tab.id}`}
                className="transition"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrent(tab.id);
                }}
              >
                {tab.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="tab-content col-md-12 nopad">
        {panes.map((pane) => (
          <div key={pane.id} className={`tab-pane${pane.id === current ? " active" : ""}`} id={pane.id}>
            {pane.content}
          </div>
        ))}
      </div>
    </div>
  );
}
