(function (win, doc) {
  "use strict";

  const $balls = win.DOM(".balls").get();
  const $pText = DOM(".text-three").get();

  function ball() {
    return {
      async run() {
        await this.loadBalls();
        this.initEvents();
      },

      initEvents() {
        win.DOM(".balls span").on("click", this.handleSelectBalls);
      },

      async loadBalls() {
        $balls.innerHTML = "";
        const data = await win.Global.findGame(win.Global.chosenGame.title);

        if (data) {
          ball().createDescription(data);
          for (let i = 1; i <= data.range; i++) {
            const resul = win.Global.leftPad(i, 2);
            $balls.innerHTML += `<span>${resul}</span>`;
          }

          win.DOM(".balls span").on("click", this.handleSelectBalls);
        }
      },

      createDescription(data) {
        $pText.innerHTML = `<strong>Fill your bet</strong><br/>${data.description}`;
      },

      async handleSelectBalls() {
        await ball().limitBalls.call(this);
      },

      async handleButtonsGame() {
        const newBall = ball();
        win.Global.chosenGame.title = this.innerText;
        await newBall.buttonsGames.call(
          this,
          await win.Global.findGame(this.innerText)
        );
        await newBall.loadBalls();
      },

      async limitBalls(alertActive = true) {
        const data = await win.Global.findGame(win.Global.chosenGame.title);

        const isTrue = alertActive && data;
        const length = win.Global.chosenGame.ballsSelected.size;

        const balls = Array.from(win.Global.chosenGame.ballsSelected);
        const resultBall = balls.find((ball) => ball === this.innerText);

        if (resultBall) {
          const set =  new Set(balls.filter((ball) => ball !== resultBall));
          win.Global.chosenGame.ballsSelected = set
          ball().ballsStyle.call(this, { color: "#adc0c4" });

        } else {
          if (isTrue && data["max-number"] <= length) {
            return alert(
              `Limite máximo do game ${data.type} é de ${data["max-number"]} bolas`
            );
          }

          win.Global.chosenGame.ballsSelected.add(this.innerText);
          ball().ballsStyle.call(this, data);
        }
      },

      ballsStyle(data) {
        win.Global.getStyles.call(this, data.color, "#fff");
      },
    };
  }

  win.Ball = ball();
})(window, document);
