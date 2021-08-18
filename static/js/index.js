(function (win, doc) {
  "use strict";

  const $balls = doc.querySelectorAll(".balls span");
  const $buttonsGame = doc.querySelectorAll(".tags button");

  function app() {
    return {
      run() {
        this.initEvents();
      },

      initEvents() {
        Array.prototype.forEach.call($balls, (ball) => {
          ball.addEventListener("click", this.handleSelectBalls);
        });
      },

      handleSelectBalls() {
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
    };
  }

  app().run();
})(window, document);
