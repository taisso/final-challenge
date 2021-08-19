(async function (win, doc) {
  "use strict";

  const $balls = win.DOM(".balls").get();
  const $tag = win.DOM(".tags").get();
  const $buttons = DOM(".button-left");
  const $buttonCart = DOM(".button-right");
  const $cardItems = DOM(".card-items").get();
  const $pText = DOM(".text-three").get();
  const $totalValue = DOM(".total-value").get();
  const chosenGame = { title: "", ballsSelected: [], price: 0, totalVal: 0 };
  let dataGame;

  function app() {
    return {
      async run() {
        await this.load();
        this.initEvents();
      },

      async load() {
        dataGame = await this.gameInfo();
        this.setButtonsGame(dataGame);
        await this.loadBalls();
        this.loadCart();
      },

      initEvents() {
        win.DOM(".balls span").on("click", this.handleSelectBalls);
        win.DOM(".tags button").on("click", this.handleButtonsGame);
        $buttonCart.on("click", this.handleAddInCart);
        $buttons
          .get(0)
          .addEventListener("click", this.handleCompleteGame.bind(this));
        $buttons.get(1).addEventListener("click", this.handleClearGame);
      },

      loadCart(value = 0, desc = false) {
        this.verifyValue(value, desc);
        if (chosenGame.totalVal >= 0) {
          const resul = chosenGame.totalVal.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            style: "currency",
            currency: "BRL",
          });
          $totalValue.innerHTML = `<strong>cart</strong> TOTAL: ${resul}`;
        }
      },

      verifyValue(value, desc) {
        if (desc) {
          chosenGame.totalVal -= value || 0;
        } else chosenGame.totalVal += value || 0;
      },

      async loadBalls() {
        $balls.innerHTML = "";
        const data = await this.findGame(chosenGame.title);

        if (data) {
          $pText.childNodes[$pText.childNodes.length - 1].textContent =
            data.description;
          for (let i = 1; i <= data.range; i++) {
            const value = parseInt(this.getRandomArbitrary(1, 100));
            const resul = this.leftPad(value, 2);
            $balls.innerHTML += `<span>${resul}</span>`;
          }

          win.DOM(".balls span").on("click", this.handleSelectBalls);
        }
      },

      async gameInfo() {
        return fetch("./static/js/games.json")
          .then(async (response) => await response.json())
          .then((data) => data)
          .catch((err) => alert(err));
      },

      async handleSelectBalls() {
        await app().limitBalls.call(this);
      },

      async handleCompleteGame() {
        const children = $balls.children;
        const length = children.length;
        const data = await this.findGame(chosenGame.title);

        while (chosenGame.ballsSelected.length <= data["max-number"]) {
          const index = parseInt(this.getRandomArbitrary(0, length));
          chosenGame.ballsSelected.push(children[index].textContent);
          this.getStyles.call(children[index], "#fff", "#adc0c4");
        }
      },

      handleClearGame() {
        app().removeBalls();
      },

      async handleButtonsGame() {
        const newApp = app();
        chosenGame.title = this.innerText;
        await newApp.buttonsGames.call(
          this,
          await newApp.findGame.call(this, this.innerText)
        );
        await newApp.loadBalls();
      },

      async handleAddInCart() {
        if (!chosenGame.title) {
          return alert("Selecione o tipo do game!");
        }
        if (chosenGame.ballsSelected.length === 0) {
          return alert("Selecione os números!");
        }
        const newApp = app();
        newApp.createElment();
        newApp.removeBalls();

        const data = await newApp.findGame(chosenGame.title);
        newApp.loadCart(data.price);
        DOM(".bi-trash").on("click", newApp.handleRemoveCart);
      },

      handleRemoveCart() {
        const el =
          this.parentNode.children[2].children[1] ||
          alert("Ocorreu um erro ao deletar");
        const resul = app().convertStringInNumber(el.textContent);
        this.parentNode.remove();
        app().loadCart(Number(resul), true);
      },

      convertStringInNumber(value) {
        return Number(value.match(/\d,\d\d/)[0].replace(",", "."));
      },

      async findGame(text) {
        return dataGame.types.find(({ type }) => type === text);
      },

      async limitBalls(alertActive = true) {
        const data = await app().findGame(chosenGame.title);
        if (
          alertActive &&
          data &&
          data["max-number"] < chosenGame.ballsSelected.length
        ) {
          return alert(
            `Limite do game ${data.type} é de ${data["max-number"]} bolas`
          );
        }

        chosenGame.ballsSelected.push(this.innerText);
        app().ballsStyle.call(this);
      },

      leftPad(value, totalWidth, paddingChar) {
        var length = totalWidth - value.toString().length + 1;
        return Array(length).join(paddingChar || "0") + value;
      },

      getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
      },

      getStyles(backColor, color) {
        const styles = {
          backgroundColor: backColor,
          color,
          border: `1px solid ${color}`,
        };
        Object.keys(styles).forEach((key) => (this.style[key] = styles[key]));
      },

      ballsStyle() {
        app().getStyles.call(this, "#fff", "#adc0c4");
      },

      removeBalls() {
        chosenGame.ballsSelected = [];
        const children = $balls.children;
        const newApp = app();
        Array.prototype.forEach.call(children, (child) => {
          newApp.getStyles.call(child, "#adc0c4", "#fff");
        });
      },

      removeStyle({ type, color }, index, children) {
        if (this.innerText !== type) {
          children[index].style.backgroundColor = "#fff";
          children[index].style.color = color;
        }
      },

      async buttonsGames(find) {
        const styles = {
          background: find.color,
          color: "#fff",
        };

        chosenGame.price = find.price.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          style: "currency",
          currency: "BRL",
        });
        Object.keys(styles).forEach((key) => (this.style[key] = styles[key]));
        const children = $tag.children;
        dataGame.types.forEach(({ type, color }, index) => {
          app().removeStyle.call(this, { type, color }, index, children);
        });
      },

      createElment() {
        const fragment = doc.createDocumentFragment();

        const $div = doc.createElement("div");
        const $div2 = doc.createElement("div");
        const $i = doc.createElement("i");
        const $span = doc.createElement("span");
        const $p = doc.createElement("p");
        const $p2 = doc.createElement("p");
        const $span2 = doc.createElement("span");

        $div.setAttribute("class", "item");
        $div2.setAttribute("class", "item-description");
        $span.setAttribute("class", "line-vertical");
        $span2.setAttribute("class", "tag-name");
        $i.setAttribute("class", "bi bi-trash");

        $span2.innerText = chosenGame.title;
        $p2.appendChild($span2);

        $p.innerText =
          chosenGame.ballsSelected[0] +
          ", " +
          chosenGame.ballsSelected.splice(1).join(",");
        $p2.append(" " + chosenGame.price);
        $div2.append($p, $p2);
        $div.append($i, $span, $div2);

        fragment.appendChild($div);
        $cardItems.appendChild(fragment);
      },

      generateStyleOfButton(color, index) {
        return `
        .main .container-left .tags button:nth-of-type(${index + 1}) {
          color: ${color};
          border: 2px solid ${color}
        }
        .main .container-left .tags button:hover:nth-of-type(${index + 1}) {
          background: ${color} !important;
          color: #fff !important;
        }
        `;
      },

      createSyle(css) {
        const style = doc.createElement("style");
        style.appendChild(doc.createTextNode(css));
        return style;
      },

      classButton(color, index) {
        const css = this.generateStyleOfButton(color, index);
        return this.createSyle(css);
      },

      createButtons({ type, color }, index) {
        const $button = doc.createElement("button");
        $button.append(type);

        $button.appendChild(this.classButton(color, index));
        $tag.appendChild($button);
      },

      buttonDefault(types) {
        $tag.children[1].style.backgroundColor = types[1].color;
        $tag.children[1].style.color = "#fff";
        chosenGame.title = types[1].type;
        chosenGame.price = types[1].price.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          style: "currency",
          currency: "BRL",
        });
      },

      setButtonsGame({ types }) {
        types.forEach(this.createButtons.bind(this));
        this.buttonDefault(types);
      },
    };
  }

  await app().run();
})(window, document);
