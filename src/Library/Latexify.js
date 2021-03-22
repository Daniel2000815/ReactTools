export const latexify = (f) => {
  let translations = {
    sin: "\\sin ",
    cos: "\\cos ",
    tan: "\\tan ",
    tg: "\\tg ",
    "*": "\\cdot ",
    sqrt: "\\sqrt",
    ln: "\\ln",
    log: "\\log"
  };

  for (let t in translations) {
    f = String(f).replaceAll(t, translations[t]);
  }

  // Find fractions
  let fracPos = f.search("/");
  if (fracPos !== -1) {
    let parentesis = Array(4).fill(-1);
    for (let i = fracPos; i >= 0; i--) {
      if (f[i] === ")" && parentesis[1] === -1) parentesis[1] = i;
      else if (f[i] === "(" && parentesis[0] === -1) {
        parentesis[0] = i;
        break;
      }
    }

    for (let i = fracPos; i < f.length; i++) {
      if (f[i] === "(" && parentesis[2] === -1) parentesis[2] = i;
      else if (f[i] === ")" && parentesis[3] === -1) {
        parentesis[3] = i;
        break;
      }
    }

    console.log("DEBU: " + parentesis);

    if (!parentesis.includes(-1)) {
      let numerator = f.substring(parentesis[0] + 1, parentesis[1]);
      let denominator = f.substring(parentesis[2] + 1, parentesis[3]);
      console.log("YES: " + numerator + denominator);
      let fracLatex = "\\frac{" + numerator + "}{" + denominator + "}";
      f = f.replace(f.substring(parentesis[0], parentesis[3] + 1), fracLatex);
      console.log("YES: " + f);
    }
  }
  return f;
};
