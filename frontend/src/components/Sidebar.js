import React from "react";

export const Sidebar = props => {
  return (
    <ul
      className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
      id="accordionSidebar"
    >
      <a
        className="sidebar-brand d-flex align-items-center justify-content-center"
        href="index.html"
      >
        <div className="sidebar-brand-icon">
          <i className="fas fa-hdd"></i>
        </div>
        <div className="sidebar-brand-text mx-2">Edge Device</div>
      </a>

      <hr className="sidebar-divider my-0" />

      <hr className="sidebar-divider d-none d-md-block" />

      <div className="avail-ids">
        <p>Available IDs</p>
        <ul>
          {props.ids.map((item, i) => {
            return <li key={i}>{item.id}</li>;
          })}
        </ul>
      </div>
    </ul>
  );
};
