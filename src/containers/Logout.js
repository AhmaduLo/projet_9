import { ROUTES_PATH } from "../constants/routes.js";

export default class Logout {
  constructor({ document, onNavigate, localStorage }) {
    this.document = document;
    this.onNavigate = onNavigate;
    this.localStorage = localStorage;
    $("#layout-disconnect").click(this.handleClick);
    $("#layout-icon1").click(this.handleClickbills);
    $("#layout-icon2").click(this.handleClickmail);
  }

  handleClick = (e) => {
    this.localStorage.clear();
    this.onNavigate(ROUTES_PATH["Login"]);
  };
  handleClickmail = (e) => {
    this.onNavigate(ROUTES_PATH["NewBill"]);
  };
  handleClickbills = (e) => {
    this.onNavigate(ROUTES_PATH["Bills"]);
  };
}
