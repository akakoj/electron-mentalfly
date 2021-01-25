import "./styles/main.scss";

export default class Game {
  controlsBox = document.querySelector("#controls");
  listBox = document.querySelector("#list");
  logBox = document.querySelector("#log");
  cubeBox = document.querySelector("#cube");
  isLost = false;
  teamId = 0;
  teamList = [];

  directions = [
    { title: "Вверх", name: "up", coord: "y", sign: 1 },
    { title: "Вниз", name: "down", coord: "y", sign: -1 },
    { title: "Вправо", name: "right", coord: "x", sign: 1 },
    { title: "Влево", name: "left", coord: "x", sign: -1 },
    { title: "Назад", name: "back", coord: "z", sign: 1 },
    { title: "Вперед", name: "forward", coord: "z", sign: -1 },
  ];

  constructor() {
    this.init();
  }

  init() {
    this.coords = { x: 0, y: 0, z: 0 };

    this.drawInit();
  }
  reset() {
    this.listBox.innerHTML = "";
    [1, 2, 3, 4].forEach(() => this.addItem());
    this.replay();
  }
  replay() {
    this.teamId = 0;
    this.logBox.innerHTML = "";
    this.unsetActiveCube(this.coords);
    this.coords = { x: 0, y: 0, z: 0 };
    this.setActiveCube(this.coords);
    this.isLost = false;
  }

  drawInit() {
    this.directions.forEach((direction) => this.makeDirectionButton(direction));

    const cls =
      "mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent";
    const reset = this.reset.bind(this);
    this.makeButton({
      title: "Заново",
      onClick: reset,
      cls,
    });
    const replay = this.replay.bind(this);
    this.makeButton({
      title: "Обновить",
      onClick: replay,
      cls,
    });

    [1, 2, 3, 4].forEach(() => this.addItem());
    const addButton = document.querySelector("#add");
    addButton.onclick = () => this.addItem();
    this.drawCube();
    this.setActiveCube();
  }

  drawCube() {
    const cube = document.createElement("div");
    cube.className = "wrapD3Cube";
    this.cubeBox.append(cube);
    for (let l of [1, 2, 3]) {
      const layer = document.createElement("div");
      layer.className = `layer${l}`;
      cube.append(layer);
      for (let r of [1, 2, 3]) {
        const row = document.createElement("div");
        row.className = `row${r}`;
        layer.append(row);
        for (let c of [1, 2, 3]) {
          const col = document.createElement("div");
          col.className = `col${c}`;
          row.append(col);
          col.append(cube_tmpl.content.cloneNode(true));
        }
      }
    }
  }

  setActiveCube(coord = { x: 0, y: 0, z: 0 }) {
    const cube = this.getCube(coord);
    cube?.classList.add("active");
  }

  unsetActiveCube(coord = { x: 0, y: 0, z: 0 }) {
    const cube = this.getCube(coord);
    cube?.classList.remove("active");
  }

  getCube(coord = { x: 0, y: 0, z: 0 }) {
    const z = coord.z === 0 ? 2 : coord.z === 1 ? 1 : 3;
    const y = coord.y === 0 ? 2 : coord.y === 1 ? 3 : 1;
    const x = coord.x === 0 ? 2 : coord.x === 1 ? 3 : 1;

    const cube = document.querySelector(
      `.wrapD3Cube div:nth-child(${z}) div:nth-child(${y}) div:nth-child(${x}) .D3Cube`
    );
    return cube;
  }

  log(dir, coords, team) {
    const log = document.createElement("div");
    log.innerHTML = `${team}: ${dir}  ${JSON.stringify(coords)}`;
    this.logBox.append(log);
  }

  addItem() {
    this.listBox.append(li_tmpl.content.cloneNode(true));
  }

  makeButton({ title, onClick, cls }) {
    const button = document.createElement("button");
    button.innerHTML = title;
    button.onclick = onClick;
    button.className = cls;
    this.controlsBox.append(button);
  }

  makeDirectionButton(direction) {
    this.makeButton({
      title: direction.title,
      onClick: () => this.move(direction),
      cls:
        "mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored",
    });
  }

  drawLost() {
    const lost = document.createElement("H1");
    lost.innerHTML = "Улетела!";
    this.logBox.append(lost);
  }

  check(coordinate) {
    const mode = document.querySelector("switch-1");
    const size = mode ? 3 : 2;
    if (Math.abs(coordinate) >= size) {
      this.isLost = true;
      return false;
    }
    return true;
  }

  getTeamList() {
    const list = [...document.querySelectorAll(".team_item input")]
      .map((e) => e.value)
      .filter(Boolean);
    return list;
  }

  getNextTeam() {
    const list = this.getTeamList();
    const nextId = this.teamId + 1;
    this.teamId = nextId >= list.length ? 0 : nextId;
  }

  move({ coord, sign, title }) {
    if (this.isLost) return;
    const list = this.getTeamList();
    const team = list[this.teamId] || "Игрок";
    this.unsetActiveCube(this.coords);
    this.getNextTeam();
    this.coords[coord] = this.coords[coord] + 1 * sign;
    this.log(title, this.coords, team);
    if (!this.check(this.coords[coord])) {
      this.drawLost();
    } else {
      this.setActiveCube(this.coords);
    }
  }
}
