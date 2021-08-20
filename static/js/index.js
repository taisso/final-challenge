(async function (win, doc) {
  "use strict";

  const $balls = win.DOM(".balls").get();
  const $tag = win.DOM(".tags").get();
  const $buttons = DOM(".button-left");
  const $buttonCart = DOM(".button-right");
  const $pText = DOM(".text-three").get();

  function app() {
    return {
      async run() {
        await this.preload();
        this.initEvents();
      },

      async preload() {
        win.Global.dataGame = await this.gameInfo();
        this.setButtonsGame(win.Global.dataGame);
        await this.loadBalls();
        Cart.run()
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

      async loadBalls() {
        $balls.innerHTML = "";
        const data = await win.Global.findGame(win.Global.chosenGame.title);

        if (data) {
          $pText.childNodes[$pText.childNodes.length - 1].textContent =
            data.description;
          for (let i = 1; i <= data.range; i++) {
            const value = parseInt(win.Global.getRandomArbitrary(1, 100));
            const resul = win.Global.leftPad(value, 2);
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
        const data = await win.Global.findGame(win.Global.chosenGame.title);

        while (win.Global.chosenGame.ballsSelected.length <= data["max-number"]) {
          const index = parseInt(win.Global.getRandomArbitrary(0, length));
          win.Global.chosenGame.ballsSelected.push(children[index].textContent);
          win.Global.getStyles.call(children[index], "#fff", "#adc0c4");
        }
      },

      handleClearGame() {
        win.Global.removeBalls($balls, win.Global.chosenGame)
      },

      async handleButtonsGame() {
        const newApp = app();
        win.Global.chosenGame.title = this.innerText;
        await newApp.buttonsGames.call(
          this,
          await win.Global.findGame( this.innerText)
        );
        await newApp.loadBalls();
      },

      async limitBalls(alertActive = true) {
        const data = await win.Global.findGame(win.Global.chosenGame.title);
        if (
          alertActive &&
          data &&
          data["max-number"] < win.Global.chosenGame.ballsSelected.length
        ) {
          return alert(
            `Limite do game ${data.type} é de ${data["max-number"]} bolas`
          );
        }

        win.Global.chosenGame.ballsSelected.push(this.innerText);
        app().ballsStyle.call(this);
      },

      ballsStyle() {
        win.Global.getStyles.call(this, "#fff", "#adc0c4");
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

        win.Global.chosenGame.ballsSelected = [];
        win.Global.chosenGame.price = win.Global.formatNumber(find.price);
        Object.keys(styles).forEach((key) => (this.style[key] = styles[key]));
        const children = $tag.children;
        win.Global.dataGame.types.forEach(({ type, color }, index) => {
          app().removeStyle.call(this, { type, color }, index, children);
        });
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
        win.Global.chosenGame.title = types[1].type;
        win.Global.formatNumber(types[1].price);
        win.Global.chosenGame.price = win.Global.formatNumber(types[1].price);
      },

      setButtonsGame({ types }) {
        types.forEach(this.createButtons.bind(this));
        this.buttonDefault(types);
      },
      
    };
  }

  await app().run();
})(window, document);
