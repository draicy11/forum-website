import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import React, { Component } from "react";
import Home from "../pages/home/Home";
export default class RouteHandler extends Component {
  render() {
    
    return (
      <Router>
        <Routes>
          <Route exact path="/" element={<Home/>} />
        </Routes>
      </Router>
    );
  }
}
