// main_player_script.js
function movePlayer() {
  if (keyIsDown(RIGHT_ARROW)) x += 2;
  if (keyIsDown(LEFT_ARROW)) x -= 2;
  if (keyIsDown(UP_ARROW)) y -= 2;
  if (keyIsDown(DOWN_ARROW)) y += 2;
}

function keepPlayerInside() {
  x = constrain(x, 50, width - 50);
  y = constrain(y, 50, height - 50);
}

function drawPlayer(bg) {
  fill(lerpColor(bg, color(255), 0.5));
  ellipse(x, y, r);
}

function showEnding(bg) {
  x = lerp(x, width / 2, 0.02);
  y = lerp(y, height / 2, 0.02);
  r = lerp(r, 120, 0.02);

  drawPlayer(bg);

  textAlpha = lerp(textAlpha, 255, 0.02);
  fill(0, 50, 150, textAlpha);
  textAlign(CENTER, CENTER);
  textSize(28);
  text(
    "Change is hard at first,\nMessy in the middle,\nAnd gorgeous at the end.",
    width / 2,
    height / 2 + 100
  );
}
