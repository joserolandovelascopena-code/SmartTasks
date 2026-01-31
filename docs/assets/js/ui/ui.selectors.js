// ui.selectors.js

export const UIST = {
  //logica
  inputTask: null,
  descriptionTask: null,
  btnGuardar: null,

  /*List*/
  taskList: null,
  detailsPanel: null,
  addBtn: null,

  init() {
    this.inputTask = document.getElementById("newTask");
    this.descriptionTask = document.getElementById("descripcion");
    this.btnGuardar = document.querySelectorAll(".Guadar-btn");

    this.taskList = document.querySelector("#taskList");
    this.detailsPanel = document.querySelector("#detailsPanel");
    this.addBtn = document.querySelector("#addTask");
  },
};
