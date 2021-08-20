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
        this.addCart();
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
          const resul = win.Global.formatNumber(win.Global.chosenGame.totalVal);
          $totalValue.innerHTML = `<strong>cart</strong> TOTAL: ${resul}`;
        }
      },

      async handleAddInCart() {
        if (!win.Global.chosenGame.title) {
          return alert("Selecione o tipo do game!");
        }
        if (win.Global.chosenGame.ballsSelected.length === 0) {
          return alert("Selecione os números!");
        }
        const cart = Cart();
        cart.createElment();
        win.Global.removeBalls($balls, win.Global.chosenGame);

        const data = await win.Global.findGame(win.Global.chosenGame.title);
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
          return alert('Nada foi adicionado no carrinho!')
        }

        alert("Pronto! Tenha uma boa sorte!");
        win.Global.chosenGame.totalVal = 0;
        $cardItems.innerHTML = "";
        $totalValue.innerHTML = `<strong>cart</strong> TOTAL: R$ 0,00`;
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
        $i.addEventListener("click", Cart().handleRemoveCart);
        $span2.innerText = win.Global.chosenGame.title;
        $p2.appendChild($span2);

        $p.innerText =
          win.Global.chosenGame.ballsSelected[0] +
          ", " +
          win.Global.chosenGame.ballsSelected.splice(1).join(",");
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
