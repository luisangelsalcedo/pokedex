export const hexStats = (params, color) => {
  const canvas = document.createElement("canvas");
  canvas.width = 300;
  canvas.height = 300;

  const initial_rot = 0;
  const grad_to_rad = Math.PI / 180;

  const sides = 6;
  const margin = 2;
  const line_width = 0.5;
  const part_scale = 0.2;

  const fontColor = "#333";
  const lineColor = "#333";
  const paramLineColor = color;
  const paramFillColor = color;
  const rot = (360 / sides) * grad_to_rad;
  const parts = Math.floor(1 / part_scale);

  const canvas_ref = Math.min(canvas.height - margin, canvas.width - margin);
  const font_size = canvas_ref * 0.045;
  const line_len = (canvas_ref / 2) * 0.85;

  //   const params = [
  //     { name: "hp", value: 0.2 },
  //     { name: "attack", value: 0.2 },
  //     { name: "defense", value: 0.3 },
  //     { name: "special attack", value: 0.4 },
  //     { name: "special defense", value: 0.5 },
  //     { name: "speed", value: 0.6 },
  //   ];

  if (canvas.getContext) {
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "white";
    ctx.lineWidth = line_width;

    ctx.save();
    ctx.strokeStyle = lineColor;
    ctx.translate(Math.floor(canvas.width / 2), Math.floor(canvas.height / 2));
    ctx.rotate(initial_rot);

    for (var j = 0; j < parts; ++j) {
      ctx.save();
      ctx.beginPath();

      var sf = 1 - part_scale * j;
      //ctx.scale(sf, sf);

      ctx.moveTo(0, Math.floor(-line_len * sf));
      for (var i = 0; i < sides; ++i) {
        ctx.lineTo(0, Math.floor(-line_len * sf));
        ctx.rotate(rot);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }

    ctx.save();
    ctx.beginPath();
    for (var i = 0; i < sides; ++i) {
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -line_len);
      ctx.rotate(rot);
    }
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.textAlign = "center";
    ctx.font = font_size + "px arial";
    ctx.strokeStyle = paramLineColor;
    ctx.fillStyle = paramFillColor;
    ctx.moveTo(0, -line_len * (params[0].value / 100));

    for (var i = 0; i < sides; ++i) {
      ctx.save();
      ctx.textBaseline = "middle";
      ctx.fillStyle = fontColor;
      ctx.translate(0, -(line_len + font_size));
      var total_rot = rot * i;
      if (total_rot > 90 * grad_to_rad && total_rot < 270 * grad_to_rad) {
        ctx.rotate(180 * grad_to_rad);
      }
      ctx.fillText(params[i].name, 0, 0);
      ctx.restore();
      ctx.lineTo(0, -line_len * (params[i].value / 100));
      ctx.rotate(rot);
    }

    ctx.closePath();
    ctx.stroke();

    ctx.globalAlpha = 0.5;
    ctx.fill();
    ctx.restore();

    ctx.restore();
  }
  return canvas;
};
