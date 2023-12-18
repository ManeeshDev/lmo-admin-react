import React, { useEffect } from "react";

import "./assets/css/custom.css";
import "./assets/css/bootstrap.min.css";
import "./assets/css/font-awesome.css";
import "antd/dist/antd.less";

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

import Login from "./Component/Common/Login";
import ContentTeam from "./Component/ContentTeam/";
import AssignedImages from "./Component/ContentTeam/ContentNonManager/AssignedImages";
import AllImages from "./Component/ContentTeam/ContentManager/AllImages";
import AllItemImages from "./Component/ContentTeam/ContentManager/AllItemImages";
import NeedToUploadImages from "./Component/ContentTeam/ContentNonManager/NeedToUploadImages";
import UploadedImages from "./Component/ContentTeam/ContentNonManager/UploadedImages";
import RejectedImages from "./Component/ContentTeam/ContentNonManager/RejectedImages";
import ApprovedImages from "./Component/ContentTeam/ContentManager/ApprovedImages";
import ApproveImage from "./Component/ContentTeam/ContentManager/NeedToApproveImages";
import AssignImages from "./Component/ContentTeam/ContentManager/AssignImages";
import NeedToRejectImage from "./Component/ContentTeam/ContentManager/NMRejectedItems";
import AllImagesNM from "./Component/ContentTeam/ContentNonManager/AllImages";
import AMUploadItems from "./Component/ContentTeam/ContentManager/AMUploadItems";
import AMTextFile from "./Component/ContentTeam/ContentManager/AMTextFile";
import AMMissedItems from "./Component/ContentTeam/ContentManager/AMMissedImages";
import SearchImages from "./Component/ContentTeam/ContentManager/SearchImages";
import InventoryItems from "./Component/ContentTeam/ContentNonManager/InventoryItems";

import Notifications from "./Component/ContentTeam/ContentNonManager/Notifications";
import ShopAddress from "./Component/ContentTeam/ContentNonManager/ShopAddress";

import AMInventoryItems from "./Component/ContentTeam/ContentManager/InventoryItems";
import ItemMasterList from "./Component/ContentTeam/ContentManager/ItemMasterCSVList";

// Opertaion Team
import OperationTeam from "./Component/OperationTeam";
import NewSignups from "./Component/OperationTeam/OperationNonManager/NewSignups";
import MerchantUploaded from "./Component/OperationTeam/OperationNonManager/MerchantUploaded";
import MerchantPending from "./Component/OperationTeam/OperationNonManager/MerchantPending";
import Feedback from "./Component/ContentTeam/CustomerReviews/List";
import IncorrectShopAreas from "./Component/OperationTeam/OperationNonManager/IncorrectShopAreas";
import IncorrectData from "./Component/OperationTeam/OperationNonManager/IncorrectData";
import GenerateQR from "./Component/OperationTeam/OperationNonManager/GenerateQR";
import Inventory from "./Component/OperationTeam/OperationNonManager/Inventory";
import Document from "./Component/OperationTeam/OperationNonManager/Inventory/document";
import Monthdayoffer from "./Component/OperationTeam/OperationNonManager/Monthdayoffer";
import Orders from "./Component/OperationTeam/OperationNonManager/Orders";

// Agent Managemnt for Operation Team
import AgentForm from "./Component/OperationTeam/AgentManagement";
import AgentList from "./Component/OperationTeam/AgentManagement/Manage";

// Agents Module
import AgentTeam from "./Component/Agents";
import AgentHome from "./Component/Agents/MerchantData";
import AgentProfile from "./Component/Agents/Profile";
import MerchantStatus from "./Component/OperationTeam/OperationNonManager/MerchantStatus";
import MerchantDetails from "./Component/OperationTeam/OperationNonManager/MerchantStatus/MerchantDetail";
import InventorySystem from "./Component/ContentTeam/ContentNonManager/Inventory";
import AddAgent from "./Component/Agents/AddAgent";

//Photogarphers Module
import PhotographerLayout from "./Component/Photographer";
import Home from "./Component/Photographer/home";
import UploadSection from "./Component/Photographer/Upload";

//HR Module
import HRLayout from "./Component/HR";
import HRHome from "./Component/HR/Home";
import OnboardSettlement from "./Component/ContentTeam/ContentNonManager/OnboardSettlement";
import DoorbusterSettlement from "./Component/ContentTeam/ContentNonManager/DoorbusterSettlement";

function App() {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("loggedIn_user_role");

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          {!token ? (
            <Login />
          ) : ["AM"].includes(userRole) ? (
            <Redirect to="/ContentTeam/AllItemImages" />
          ) : ["M", "NM"].includes(userRole) ? (
            <Redirect to="/ContentTeam/AllImages" />
          ) : ["OM", "ONM"].includes(userRole) ? (
            <Redirect to="/OperationTeam/Newsignups" />
          ) : userRole === "AG" ? (
            <Redirect to="/agents" />
          ) : userRole === "PHG" ? (
            <Redirect to="/photographers" />
          ) : userRole === "HR" ? (
            <Redirect to="/hr/team" />
          ) : (
            ""
          )}
        </Route>
        {userRole === null || !token ? (
          <Redirect to="/">
            <Login />
          </Redirect>
        ) : userRole === "M" ? (
          <div>
            <Route exact path="/ContentTeam/AllItemImages">
              <ContentTeam component={AllItemImages} />
            </Route>
            <Route exact path="/ContentTeam/AllImages">
              <ContentTeam component={AllImages} />
            </Route>
            <Route exact path="/ContentTeam/ApprovedImages">
              <ContentTeam component={ApprovedImages} />
            </Route>
            <Route exact path="/ContentTeam/ApproveImage">
              <ContentTeam component={ApproveImage} />
            </Route>
            <Route exact path="/ContentTeam/AssignImage">
              <ContentTeam component={AssignImages} />
            </Route>
            <Route exact path="/ContentTeam/NeedToRejectImage">
              <ContentTeam component={NeedToRejectImage} />
            </Route>
            <Route exact path="/ContentTeam/SearchImages">
              <ContentTeam component={SearchImages} />
            </Route>
            <Route exact path="/ContentTeam/AMInventoryItems">
              <ContentTeam component={AMInventoryItems} />
            </Route>
            <Route exact path="/ContentTeam/Feedback">
              <ContentTeam component={Feedback} />
            </Route>
          </div>
        ) : userRole === "AG" ? (
          <>
            <Route exact path="/agents">
              <AgentTeam component={AgentHome} />
            </Route>
            <Route exact path="/agents/profile">
              <AgentTeam component={AgentProfile} />
            </Route>
            <Route exact path="/agents/add">
              <AgentTeam component={AddAgent} />
            </Route>

            <Route exact path="/agents/merchant-status/:mrch_id">
              <AgentTeam component={MerchantDetails} />
            </Route>
          </>
        ) : userRole === "NM" ? (
          <div>
            <Route exact path="/ContentTeam/AllImages">
              <ContentTeam component={AllImagesNM} />
            </Route>

            <Route exact path="/ContentTeam/RejectedImages">
              <ContentTeam component={RejectedImages} />
            </Route>

            <Route exact path="/ContentTeam/UploadedImage">
              <ContentTeam component={UploadedImages} />
            </Route>
            <Route exact path="/ContentTeam/AssignedImages">
              <ContentTeam component={AssignedImages} />
            </Route>
            <Route exact path="/ContentTeam/UploadImage">
              <ContentTeam component={NeedToUploadImages} />
            </Route>
            <Route exact path="/ContentTeam/InventoryItems">
              <ContentTeam component={InventoryItems} />
            </Route>
            <Route exact path="/ContentTeam/Inventory/new/add">
              <ContentTeam component={InventorySystem} />
            </Route>

            <Route exact path="/ContentTeam/Notifications">
              <ContentTeam component={Notifications} />
            </Route>
          </div>
        ) : userRole === "AM" ? (
          <>
            <Route exact path="/ContentTeam/AllShopImages">
              <ContentTeam component={AssignImages} />
            </Route>
            <Route exact path="/ContentTeam/ItemMasterList">
              <ContentTeam component={ItemMasterList} />
            </Route>
            <Route exact path="/ContentTeam/AllItemImages">
              <ContentTeam component={AllItemImages} />
            </Route>
            <Route exact path="/ContentTeam/AMUploadItems">
              <ContentTeam component={AMUploadItems} />
            </Route>
            <Route exact path="/ContentTeam/ApprovedImages">
              <ContentTeam component={ApprovedImages} />
            </Route>
            <Route exact path="/ContentTeam/ApproveImage">
              <ContentTeam component={ApproveImage} />
            </Route>
            <Route exact path="/ContentTeam/NeedToRejectImage">
              <ContentTeam component={NeedToRejectImage} />
            </Route>
            <Route exact path="/ContentTeam/AMUploadText">
              <ContentTeam component={AMTextFile} />
            </Route>
            <Route exact path="/ContentTeam/AMMissedItems">
              <ContentTeam component={AMMissedItems} />
            </Route>
            <Route exact path="/ContentTeam/SearchImages">
              <ContentTeam component={SearchImages} />
            </Route>
            <Route exact path="/ContentTeam/AMInventoryItems">
              <ContentTeam component={AMInventoryItems} />
            </Route>
            <Route exact path="/ContentTeam/Feedback">
              <ContentTeam component={Feedback} />
            </Route>
          </>
        ) : userRole === "OM" || userRole === "ONM" ? (
          <>
            <Route exact path="/OperationTeam/Newsignups">
              <OperationTeam component={NewSignups} />
            </Route>
            <Route exact path="/OperationTeam/MerchantUploaded">
              <OperationTeam component={MerchantUploaded} />
            </Route>
            <Route exact path="/OperationTeam/pendingDocuments">
              <OperationTeam component={MerchantPending} />
            </Route>
            <Route exact path="/OperationTeam/IncorrectShopArea">
              <OperationTeam component={IncorrectShopAreas} />
            </Route>
            <Route exact path="/OperationTeam/IncorrectDetails">
              <OperationTeam component={IncorrectData} />
            </Route>
            <Route exact path="/OperationTeam/Agents/signup">
              <OperationTeam component={AgentForm} />
            </Route>
            <Route exact path="/OperationTeam/Agents">
              <OperationTeam component={AgentList} />
            </Route>
            <Route exact path="/OperationTeam/generate-qr">
              <OperationTeam component={GenerateQR} />
            </Route>
            <Route exact path="/OperationTeam/merchant-status">
              <OperationTeam component={MerchantStatus} />
            </Route>
            <Route exact path="/OperationTeam/merchant-status/:mrch_id">
              <OperationTeam component={MerchantDetails} />
            </Route>
            <Route exact path="/OperationTeam/inventory">
              <OperationTeam component={Inventory} />
            </Route>
            <Route exact path="/OperationTeam/inventory/help">
              <OperationTeam component={Document} />
            </Route>
            <Route exact path="/OperationTeam/monthdayoffer">
              <OperationTeam component={Monthdayoffer} />
            </Route>
            <Route exact path="/OperationTeam/order">
              <OperationTeam component={Orders} />
            </Route>
            <Route exact path="/ContentTeam/Notifications">
              <OperationTeam component={Notifications} />
            </Route>
            <Route exact path="/ContentTeam/ShopAddress">
              <OperationTeam component={ShopAddress} />
            </Route>
            <Route exact path="/ContentTeam/OnboardSettlement">
              <OperationTeam component={OnboardSettlement} />
            </Route>
            <Route exact path="/ContentTeam/DoorbusterSettlement">
              <OperationTeam component={DoorbusterSettlement} />
            </Route>
          </>
        ) : userRole === "PHG" ? (
          <>
            <Route exact path="/photographers">
              <PhotographerLayout component={Home} />
            </Route>
            <Route exact path="/photographers/:mrch_id/:ctgy_cd/:subCtgy_cd">
              <PhotographerLayout component={UploadSection} />
            </Route>
          </>
        ) : userRole === "HR" ? (
          <Route exact path="/HR/team">
            <HRLayout component={HRHome} />
          </Route>
        ) : null}
      </Switch>
    </Router>
  );
}

export default App;
