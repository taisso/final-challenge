(function (win, doc) {
  "use strict";

  const $balls = doc.querySelectorAll(".balls span");
  const $buttonsGame = doc.querySelectorAll(".tags button");
  const $buttonCart = doc.querySelector(".button-right");
  const $cardItems = doc.querySelector(".card-items");
  const chosenGame = { title: "", ballsSelected: [] };

  function app() {
    return {
      run() {
        this.initEvents();
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
    };
  }

  app().run();
})(window, document);
