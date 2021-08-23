(function (win, doc) {
  "use strict";

  const $balls = win.DOM(".balls").get();
  const $buttonCart = DOM(".button-right");
  const $cardItems = DOM(".card-items").get();
  const $totalValue = DOM(".total-value").get();
  const $save = DOM(".confirmed");

  function Cart() {
    return {
      run() {
        $totalValue.innerHTML = `<strong>cart</strong> VAZIO!`;
        this.initEvents();
      },

      initEvents() {
        $buttonCart.on("click", this.handleAddInCart);
        $save.on("click", this.handleSave);
      },

      addCart(value = 0) {
        win.Global.chosenGame.totalVal += value;
        const resul = win.Global.formatNumber(win.Global.chosenGame.totalVal);
        $totalValue.innerHTML = `<strong>cart</strong> TOTAL: ${resul}`;
      },

      descTotalValue(value = 0) {
        if (win.Global.chosenGame.totalVal >= 0) {
          win.Global.chosenGame.totalVal -= value;
          const num = win.Global.chosenGame.totalVal;

          if (num <= 0) {
            $totalValue.innerHTML = `<strong>cart</strong> VAZIO!`;
          } else {
            const resul = win.Global.formatNumber(
              win.Global.chosenGame.totalVal
            );
            $totalValue.innerHTML = `<strong>cart</strong> TOTAL: ${resul}`;
          }
        }
      },

      async handleAddInCart() {
        if (!win.Global.chosenGame.title) {
          return alert("Selecione o tipo do game!");
        }
        if (win.Global.chosenGame.ballsSelected.size === 0) {
          return alert("Selecione os números!");
        }
        const data = await win.Global.findGame(win.Global.chosenGame.title);

        if (win.Global.chosenGame.ballsSelected.size < data["max-number"]) {
          return alert(
            `É necessário escolher exatamente ${data["max-number"]}`
          );
        }

        const cart = Cart();
        cart.createElment(data);
        win.Global.removeBalls($balls, win.Global.chosenGame);

        cart.addCart(data.price);
      },

      handleRemoveCart() {
        const el = this.parentNode.children[2].children[1];
        const resul = win.Global.convertStringInNumber(el.textContent);

        Cart().descTotalValue(Number(resul));
        this.parentNode.remove();
      },

      handleSave() {
        if (win.Global.chosenGame.totalVal === 0) {
          return alert("Nada foi adicionado no carrinho!");
        }

        alert("Pronto! Tenha uma boa sorte!");
        win.Global.chosenGame.totalVal = 0;
        $cardItems.innerHTML = "";
        $totalValue.innerHTML = `<strong>cart</strong> VAZIO!`;
      },

      createElment({ color }) {
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
        $span2.setAttribute("class", "tag-name");
        $span.setAttribute("class", "line-vertical");
        $span.style.backgroundColor = color;
        $span2.style.color = color;
        $i.setAttribute("class", "bi bi-trash");
        $i.addEventListener("click", Cart().handleRemoveCart);
        $span2.innerText = win.Global.chosenGame.title;
        $p2.appendChild($span2);

        const array = Array.from(win.Global.chosenGame.ballsSelected);
        $p.innerText = array[0] + ", " + array.splice(1).join(",");
        $p2.append(" " + win.Global.chosenGame.price);
        $div2.append($p, $p2);
        $div.append($i, $span, $div2);

        fragment.appendChild($div);
        $cardItems.appendChild(fragment);
      },
    };
  }

  win.Cart = Cart();
})(window, document);
