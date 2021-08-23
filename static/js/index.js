(async function (win, doc) {
  "use strict";

  const $balls = win.DOM(".balls").get();
  const $tag = win.DOM(".tags").get();
  const $buttons = DOM(".button-left");
  const $buttonCart = DOM(".button-right");

  function app() {
    return {
      async run() {
        await this.preload();
        this.initEvents();
      },

      async preload() {
        win.Global.dataGame = await this.gameInfo();
        this.setButtonsGame(win.Global.dataGame);
        await win.Ball.run();
        win.Cart.run();
      },

      initEvents() {
        win.DOM(".tags button").on("click", this.handleButtonsGame);
        $buttonCart.on("click", this.handleAddInCart);
        $buttons
          .get(0)
          .addEventListener("click", this.handleCompleteGame.bind(this));
        $buttons.get(1).addEventListener("click", this.handleClearGame);
      },

      async gameInfo() {
        return fetch("./static/js/games.json")
          .then(async (response) => await response.json())
          .then((data) => data)
          .catch((err) => alert(err));
      },

      async handleCompleteGame() {
        const children = $balls.children;
        const length = children.length;
        const data = await win.Global.findGame(win.Global.chosenGame.title);
        while (
          win.Global.chosenGame.ballsSelected.size < data["max-number"]
        ) {

          const index = parseInt(win.Global.getRandomArbitrary(0, length));
          win.Global.chosenGame.ballsSelected.add(children[index].textContent);
          win.Global.getStyles.call(children[index], data.color, "#fff");
        }
      },

      handleClearGame() {
        win.Global.removeBalls($balls, win.Global.chosenGame);
      },

      async handleButtonsGame() {
        const newApp = app();
        const data = await win.Global.findGame(this.innerText);
        const title = win.Global.chosenGame.title;
        const length = win.Global.chosenGame.ballsSelected.size;

        if (title !== this.innerText) {
          if (length >= 1) {
            return alert(
              `Antes de mudar para ${title} adicione no carrinho primeiro`
            );
          }
          win.Global.chosenGame.title = this.innerText;
          await newApp.buttonsGames.call(this, data);
          await win.Ball.loadBalls();
        }
      },

      async buttonsGames(find) {
        const styles = {
          background: find.color,
          color: "#fff",
        };
        Object.keys(styles).forEach((key) => (this.style[key] = styles[key]));

        app().removeUnselected.call(this, find);
      },

      removeStyle({ type, color }, index, children) {
        if (this.innerText !== type) {
          children[index].style.backgroundColor = "#fff";
          children[index].style.color = color;
        }
      },

      removeUnselected(find) {
        win.Global.chosenGame.ballsSelected.clear();
        win.Global.chosenGame.price = win.Global.formatNumber(find.price);
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

      createStyle(css) {
        const style = doc.createElement("style");
        style.appendChild(doc.createTextNode(css));
        return style;
      },

      classButton(color, index) {
        const css = this.generateStyleOfButton(color, index);
        return this.createStyle(css);
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
