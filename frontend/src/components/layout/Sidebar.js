//Graphic component for the sidebar on the left of each view
//Graphic component for the sidebar on the left of each view
// TODO: Cleaning up and replace the placeholder, Finish the implementation of WS_ID
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import LabelerContext from "../../context/labeler/labelerContext";
import DeviceContext from "../../context/device/deviceContext";
import ModelContext from "../../context/model/modelContext";

const Sidebar = () => {
  const labelerContext = useContext(LabelerContext);
  const modelContext = useContext(ModelContext);
  const deviceContext = useContext(DeviceContext);

  const labelerWks = labelerContext.wks;
  const modelWks = modelContext.wks;
  const deviceWks = deviceContext.wks;


  var labelerId = [];
  labelerWks.forEach((element) => {
    labelerId.push(element.ws_id);
  });

  var modelId = [];
  modelWks.forEach((element) => {
    modelId.push(element.ws_id);
  });

  var deviceId = [];
  deviceWks.forEach((element) => {
    deviceId.push(element.ws_id);
  });

  var allWks = [];
  allWks = allWks.concat(labelerWks, modelWks, deviceWks);

  
  if (allWks.length > 0) {
    allWks = allWks.map((item, i) => {
      return (({ ws_id}) => ({ ws_id}))(
        allWks[i]
      );
    });

    const uniqueWks = [...new Set(allWks.map((item) => item.ws_id))];

    const uniqueDict = [];
    uniqueWks.forEach((element) => {
      uniqueDict.push({
        key: element,
        ws_id: element,
        labeler: false,
        model: false,
        device: false,
      });
    }); 

    for (var key in uniqueDict) {
      if (uniqueDict.hasOwnProperty(key)) {
        let current_element = uniqueDict[key];
        if (labelerId.includes(current_element["ws_id"])) {
          current_element["labeler"] = true;
        }
        if (modelId.includes(current_element["ws_id"])) {
          current_element["model"] = true;
        }
        if (deviceId.includes(current_element["ws_id"])) {
          current_element["device"] = true;
        }
      }
    }

    function Display(param) {
      if (param["param"]) {
        return (
          <td>
            <svg height="30" width="30">
              <circle
                cx="15"
                cy="15"
                r="10"
                stroke="black"
                stroke-width="2"
                fill="green"
              />
            </svg>
          </td>
        );
      }
      return (
        <td>
          <svg height="30" width="30">
            <circle
              cx="15"
              cy="15"
              r="10"
              stroke="black"
              stroke-width="2"
              fill="red"
            />
          </svg>
        </td>
      );
    }

    return (
      <ul
        className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
        id="accordionSidebar"
      >
        {/* Link for logo that redirects to home page "/" */}
        <Link
          className="sidebar-brand d-flex align-items-center justify-content-center"
          to="/"
        >
          <div className="sidebar-brand-icon">
            <img
              id="test"
              alt="test"
              className="img-fluid "
              src="img/torch.png"
            ></img>
          </div>
          <div className="sidebar-brand-text mx-3">Edge Device</div>
        </Link>

        <hr className="sidebar-divider my-0" />

        {/* Collapsed dropdown with links for the different data source views */}
        <li className="nav-item">
          <a
            className="nav-link collapsed"
            href="/#"
            data-toggle="collapse"
            data-target="#collapseTwo"
            aria-expanded="true"
            aria-controls="collapseTwo"
          >
            <i className="fas fa-fw fa-signal"></i>
            <span>Data Sources</span>
          </a>
          <div
            id="collapseTwo"
            className="collapse"
            aria-labelledby="headingTwo"
            data-parent="#accordionSidebar"
          >
            <div className="bg-white py-2 collapse-inner rounded">
              <Link className="collapse-item" to="/">
                Labeler Source
              </Link>
              <Link className="collapse-item" to="/model">
                Model Source
              </Link>
              <Link className="collapse-item" to="/debug">
                Device Source
              </Link>
            </div>
          </div>
        </li>

{/*       <li className="nav-item">
          <a
            className="nav-link collapsed"
            href="/#"
            data-toggle="collapse"
            data-target="#collapseUtilities"
            aria-expanded="true"
            aria-controls="collapseUtilities"
          >
            <i className="fas fa-fw fa-cogs"></i>
            <span>List of Devices</span>
          </a>
          <div
            id="collapseUtilities"
            className="collapse"
            aria-labelledby="headingUtilities"
            data-parent="#accordionSidebar"
          >
            <div className="bg-white py-2 collapse-inner rounded">
              <h6 className="collapse-header">Available IDs</h6>
              <a className="collapse-item" href="/test">
                Colors
              </a>
              <a className="collapse-item" href="utilities-border.html">
                Borders
              </a>
              <a className="collapse-item" href="utilities-animation.html">
                Animations
              </a>
              <a className="collapse-item" href="utilities-other.html">
                Other
              </a>
            </div>
          </div>
        </li> */}

<hr className="sidebar-divider d-none d-md-block" />
        <li className="nav-item">   
        <div className="container">
        <table>
          <thead>
            <tr>
            <th> ID </th>
            <th> Labeler </th>
            <th> Model </th>
            <th> Signal </th>
            </tr>
          </thead>
          {uniqueDict.map((item) => {
            return (
                <tbody>
                  <tr>
                    <td> {item["ws_id"]} </td>
                    <Display param={item["labeler"]}></Display>
                    <Display param={item["model"]}></Display>
                    <Display param={item["device"]}></Display>
                   </tr>
                </tbody>

            );
          })}
        </table>
        </div>
        </li>
        

        <hr className="sidebar-divider d-none d-md-block" />

        <div className="text-center d-none d-md-inline">
          <button
            className="rounded-circle border-0"
            id="sidebarToggle"
          ></button>
        </div>
      </ul>
    );
  } else {
    return null;
  }
};

export default Sidebar;
