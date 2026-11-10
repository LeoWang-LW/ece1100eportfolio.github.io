// Scrolling LED dot matrix for the home page banner.
// To change what it says, edit MESSAGE (capital letters, spaces, + - .).
(function () {
  var MESSAGE = "LEO WANG   * ELECTRICAL ENGINEERING AT GEORGIA TECH   * ROBOTICS + CIRCUITS + CLEANER TECH   ";
  var STILL = "LEO WANG";

  var F = {
    A: "01110 10001 10001 11111 10001 10001 10001", B: "11110 10001 10001 11110 10001 10001 11110",
    C: "01110 10001 10000 10000 10000 10001 01110", D: "11110 10001 10001 10001 10001 10001 11110",
    E: "11111 10000 10000 11110 10000 10000 11111", F: "11111 10000 10000 11110 10000 10000 10000",
    G: "01110 10001 10000 10111 10001 10001 01111", H: "10001 10001 10001 11111 10001 10001 10001",
    I: "01110 00100 00100 00100 00100 00100 01110", J: "00111 00010 00010 00010 00010 10010 01100",
    K: "10001 10010 10100 11000 10100 10010 10001", L: "10000 10000 10000 10000 10000 10000 11111",
    M: "10001 11011 10101 10101 10001 10001 10001", N: "10001 11001 10101 10011 10001 10001 10001",
    O: "01110 10001 10001 10001 10001 10001 01110", P: "11110 10001 10001 11110 10000 10000 10000",
    Q: "01110 10001 10001 10001 10101 10010 01101", R: "11110 10001 10001 11110 10100 10010 10001",
    S: "01111 10000 10000 01110 00001 00001 11110", T: "11111 00100 00100 00100 00100 00100 00100",
    U: "10001 10001 10001 10001 10001 10001 01110", V: "10001 10001 10001 10001 10001 01010 00100",
    W: "10001 10001 10001 10101 10101 11011 10001", X: "10001 10001 01010 00100 01010 10001 10001",
    Y: "10001 10001 01010 00100 00100 00100 00100", Z: "11111 00001 00010 00100 01000 10000 11111",
    " ": "00000 00000 00000 00000 00000 00000 00000", "+": "00000 00100 00100 11111 00100 00100 00000",
    "-": "00000 00000 00000 11111 00000 00000 00000", ".": "00000 00000 00000 00000 00000 01100 01100",
    "*": "00110 00101 00100 00100 01100 11100 01000"
  };

  // Turn text into an array of columns, each an array of 8 on/off values.
  function columns(text) {
    var cols = [];
    text.split("").forEach(function (ch) {
      var rows = (F[ch] || F[" "]).split(" ");
      for (var x = 0; x < 5; x++) {
        var col = [0];
        for (var y = 0; y < 7; y++) col.push(rows[y][x] === "1" ? 1 : 0);
        cols.push(col);
      }
      cols.push([0, 0, 0, 0, 0, 0, 0, 0]);
    });
    return cols;
  }

  var canvas = document.getElementById("matrix");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");
  var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var data = columns(MESSAGE), stillData = columns(STILL);
  var offset = -2, nCols = 0, pitch = 0, timer = null;

  function size() {
    var w = canvas.clientWidth;
    pitch = Math.max(7, Math.min(16, w / 64));
    nCols = Math.floor(w / pitch);
    var dpr = window.devicePixelRatio || 1;
    canvas.style.height = pitch * 8 + pitch + "px";
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round((pitch * 9) * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  function lit(x, y) {
    if (still) {
      var start = Math.floor((nCols - stillData.length) / 2);
      var c = stillData[x - start];
      return c ? c[y] : 0;
    }
    var i = ((x + offset) % data.length + data.length) % data.length;
    return x + offset < 0 ? 0 : data[i][y];
  }

  function draw() {
    var w = canvas.clientWidth, pad = (w - nCols * pitch) / 2 + pitch / 2, r = pitch * 0.34;
    ctx.clearRect(0, 0, w, pitch * 9);
    for (var x = 0; x < nCols; x++) {
      for (var y = 0; y < 8; y++) {
        var on = lit(x, y);
        ctx.beginPath();
        ctx.arc(pad + x * pitch, pitch + y * pitch, r, 0, Math.PI * 2);
        ctx.fillStyle = on ? "#ffb02e" : "#1b4a3f";
        ctx.shadowColor = on ? "rgba(255,176,46,0.8)" : "transparent";
        ctx.shadowBlur = on ? pitch * 0.6 : 0;
        ctx.fill();
      }
    }
  }

  function tick() { offset++; draw(); }

  size();
  window.addEventListener("resize", size);
  if (!still) {
    setTimeout(function () { timer = setInterval(tick, 75); }, 1800);
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) { clearInterval(timer); timer = null; }
      else if (!timer) timer = setInterval(tick, 75);
    });
  }
})();
