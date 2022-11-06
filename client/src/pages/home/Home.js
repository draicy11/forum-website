import React, { Component } from "react";
import axios, * as others from "axios";

export default class Home extends Component {
  render() {
    async function getUser() {
      const response = await axios.get("http://localhost:8000/");
      console.log(response);
    }
    getUser();
    return <div>Hodcsccsdcsme</div>;
  }
}
