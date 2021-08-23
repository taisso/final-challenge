(function (win) {

  const ballsSelected = new Set()
  const chosenGame = { title: "", ballsSelected, price: 0, totalVal: 0 };
  let dataGame;

  function leftPad(value, totalWidth, paddingChar) {
    var length = totalWidth - value.toString().length + 1;
    return Array(length).join(paddingChar || "0") + value;
  }

  function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  function getStyles(backColor, color) {
    const styles = {
      backgroundColor: backColor,
      color,
      border: `1px solid ${color}`,
    };
    Object.keys(styles).forEach((key) => (this.style[key] = styles[key]));
  }

  const optionsDefault = {
    minimumFractionDigits: 2,
    style: "currency",
    currency: "BRL",
  };

  function formatNumber(value, options = optionsDefault, lang = "pt-BR") {
    return value.toLocaleString(lang, options);
  }

  function convertStringInNumber(value) {
    return Number(value.match(/\d,\d\d/)[0].replace(",", "."));
  }

  async function findGame(text) {
    return this.dataGame.types.find(({ type }) => type === text);
  }

  function removeBalls($balls, chosenGame) {
    chosenGame.ballsSelected.clear();
    const children = $balls.children;
    Array.prototype.forEach.call(children, (child) => {
      getStyles.call(child, "#adc0c4", "#fff");
    });
  }
  

  win.Global = {
    leftPad,
    getRandomArbitrary,
    getStyles,
    formatNumber,
    convertStringInNumber,
    findGame,
    removeBalls,
    chosenGame,
    dataGame
  };

})(window);
