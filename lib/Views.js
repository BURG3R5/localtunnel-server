function head(tabTitle) {
  return (
    "<!DOCTYPE html>\n" +
    '<html lang="en">\n' +
    "<head>\n" +
    '    <meta charset="UTF-8">\n' +
    '    <meta http-equiv="X-UA-Compatible" content="IE=edge">\n' +
    '    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
    `    <title>${tabTitle}</title>\n` +
    "    <style>\n" +
    "        * {\n" +
    "            margin: 0;\n" +
    "            padding: 0;\n" +
    "            box-sizing: border-box;\n" +
    "        }\n" +
    "        .main-div {\n" +
    "            position: relative;" +
    "        }\n" +
    "        .main-div img, .main-div span {\n" +
    "            margin-bottom: 0.7em;\n" +
    "        }\n" +
    "        .main-div img {\n" +
    "            height: 100px;\n" +
    "            width: 100px;\n" +
    "            border-radius: 50%;\n" +
    "        }\n" +
    "        .layer-one {\n" +
    "            position: absolute;" +
    "            height: 100vh;\n" +
    "            width: 100vw;\n" +
    "            display: flex;\n" +
    "            flex-direction: column;\n" +
    "            align-items: center;\n" +
    "            justify-content: center;\n" +
    "            background-color: #996039;\n" +
    "            color: white;\n" +
    "            font-family: Söhne,ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif,Helvetica Neue,Arial,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;\n" +
    "        }\n" +
    "        .layer-two {\n" +
    "            position: absolute;" +
    "            height: 100vh;\n" +
    "            width: 100vw;\n" +
    "            display: flex;\n" +
    "            flex-direction: column;\n" +
    "            align-items: end;\n" +
    "            justify-content: end;\n" +
    "            text-align: right;\n" +
    "            color: white;\n" +
    "            font-family: Söhne,ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif,Helvetica Neue,Arial,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;\n" +
    "        }\n" +
    "        .table-row {\n" +
    "            width: 25ch;\n" +
    "            display: flex;\n" +
    "            justify-content: space-between;\n" +
    "        }\n" +
    "        .main-title {\n" +
    "            font-size: 1.5em;\n" +
    "            font-weight: bold;\n" +
    "        }\n" +
    "        .table-row-title {\n" +
    "            font-weight: bold;\n" +
    "        }\n" +
    "        .table-row-body {\n" +
    "            text-align: right;\n" +
    "        }\n" +
    "    </style>\n" +
    "</head>\n" +
    '<body><div class="main-div">'
  );
}

function row(left, right) {
  return (
    '<div class="table-row">' +
    `<code class="table-row-title">${left}</code>` +
    `<code class="table-row-body">${right}</code>` +
    "</div>"
  );
}

export function landingPage() {
  return (
    head("tunnelserver") +
    '<div class="layer-one">\n' +
  '  <img src="/public/tunnelserver.png" alt="logo">\n' +
  `  <code class="main-title">welcome to tunnelserver</code>\n` +
  '  <code class="table-row-body">&nbsp;</code>\n'+
    row("Usage", "tc [port] [subdomain]") +
    row("Example", "tc 5000 BURG3R5") +
    row("Terminate", "ctrl + C") +
    "</div></div></body></html>"
  );
}

export function statusPage(stats) {
  // ctx.body = {
  //   idsUsed: stats.idsUsed,
  //   portsEngaged: stats.portsEngaged,
  //   mem: process.memoryUsage(),
  // };

  let idPortTable = "";

  for (let i = 0; i < stats.idsUsed.length; i++) {
    idPortTable += row(stats.idsUsed[i], stats.portsEngaged[i]);
  }

  if (idPortTable === '') {
    idPortTable = '<code>no tunnels</code>';
  }

  const mem = process.memoryUsage();

  return (
    head("tunnelserver status") +
    '<div class="layer-one">\n' +
    '  <img src="/public/tunnelserver.png" alt="logo">\n' +
    `  <code class="main-title">tunnelserver status</code>\n` +
    '  <code class="table-row-body">&nbsp;</code>\n' +
    idPortTable +
    '  <code class="table-row-body">&nbsp;</code>' +
    '</div>' +
    `<div class="layer-two">` +
    `<code>${mem.rss}<br />${mem.heapUsed}<br />${mem.heapTotal}<br />${mem.external}</code>` +
    "</div>" +
    "</body></html>"
  );
}
