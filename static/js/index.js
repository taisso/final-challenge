(function (win, doc) {
  "use strict";

  const $balls = doc.querySelectorAll(".balls span");
  const $tag = doc.querySelector(".tags");
  const $buttonCart = doc.querySelector(".button-right");
  const $cardItems = doc.querySelector(".card-items");
  const chosenGame = { title: "", ballsSelected: [] };

  function app() {
    return {
      async run() {
        await this.load();
        this.initEvents();
      },

      async load() {
        const data = await this.gameInfo();
        this.setButtonsGame(data);
      },


      initEvents() {
        Array.prototype.forEach.call($balls, (ball) => {
          ball.addEventListener("click", this.handleSelectBalls);
        });
        Array.prototype.forEach.call($buttonsGame, (button) => {
          button.addEventListener("click", this.handleButtonsGame);
        });
        $buttonCart.addEventListener("click", this.handleAddInCart);
      },

      async gameInfo() {
        return fetch("./static/js/games.json")
          .then(async (response) => await response.json())
          .then((data) => data)
          .catch((err) => alert(err));
      },

      handleSelectBalls() {
        chosenGame.ballsSelected.push(this.innerText);
        app().ballsStyle.call(this);
      },

      ballsStyle() {
        const styles = {
          backgroundColor: "#fff",
          color: "#adc0c4",
          border: "1px solid #adc0c4",
        };

        Object.keys(styles).forEach((key) => (this.style[key] = styles[key]));
      },

      handleButtonsGame() {
        chosenGame.title = this.innerText;
        console.log(chosenGame);
      },

      createElment(data) {
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

        $span2.innerText = "Lotafácil";
        $p2.appendChild($span2);

        $p.innerText = "01, 02,04,05,0";
        $p2.append(" R$ 2.50");
        $div2.append($p, $p2);
        $div.append($i, $span, $div2);

        fragment.appendChild($div);
        $cardItems.appendChild(fragment);
      },

      handleAddInCart() {
        if (!chosenGame.title) {
          return alert("Selecione o tipo do game!");
        }
        if (chosenGame.ballsSelected.length === 0) {
          return alert("Selecione os números!");
        }
        app().createElment();
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
        $tag.children[0].style.backgroundColor = types[0].color;
        $tag.children[0].style.color = "#fff";
      },

      setButtonsGame({ types }) {
        types.forEach(this.createButtons.bind(this));
        this.buttonDefault(types);
      },
    };
  }

  app().run();
})(window, document);
