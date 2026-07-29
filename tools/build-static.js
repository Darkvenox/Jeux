/*
 * Régénère les listes d'ingrédients pré-calculées de index.html.
 *
 * Elles servent à la version sans JavaScript : impossible d'y calculer les
 * proportions, on écrit donc dans la page les quantités pour 2, 4, 6, 8, 10 et
 * 12 personnes, dans les deux versions de la recette. Le CSS affiche celle qui
 * correspond aux boutons radio cochés.
 *
 * Les valeurs ne sont pas recalculées ici : la page est ouverte dans un vrai
 * navigateur et on relève ce qu'elle affiche. Aucun risque que le repli
 * s'écarte du calcul réel.
 *
 *   node tools/build-static.js
 */
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const FILE = path.join(__dirname, "..", "index.html");
const SERVINGS = [2, 4, 6, 8, 10, 12];
const VARIANTS = [{ id: "c", index: 1 }, { id: "s", index: 2 }];

const esc = t => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined
  });
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", e => errors.push(e.message));
  await page.goto("file://" + FILE);
  await page.waitForSelector("#variants .variant");

  const blocks = [];
  for (const v of VARIANTS) {
    for (const n of SERVINGS) {
      await page.click(`#variants .variant:nth-child(${v.index})`);
      await page.click("#goRecipe").catch(() => {});
      await page.click(`#presets .chip:nth-child(${SERVINGS.indexOf(n) + 1})`);
      const rows = await page.$$eval("#ings li", ls => ls.map(li => ({
        qty: li.querySelector(".qty").value,
        unit: li.querySelector(".unit").textContent,
        name: li.querySelector(".name").childNodes[0].textContent,
        note: li.querySelector(".name small") ? li.querySelector(".name small").textContent : ""
      })));
      if (!rows.length) throw new Error(`aucun ingrédient relevé (${v.id}, ${n} pers.)`);

      const items = rows.map(r =>
        `        <li><span class="qty">${esc(r.qty)}</span><span class="unit">${esc(r.unit)}</span>` +
        `<span class="name">${esc(r.name)}` +
        (r.note ? `<small>${esc(r.note)}</small>` : "") +
        `</span></li>`).join("\n");
      blocks.push(`      <ul class="ings ings-static st-${v.id}-${n}">\n${items}\n      </ul>`);
      await page.click("#toMenu");
    }
  }
  if (errors.length) throw new Error("erreurs JavaScript pendant la génération : " + errors.join(" | "));
  await browser.close();

  const html = fs.readFileSync(FILE, "utf8");
  const begin = "<!-- STATIC:BEGIN — listes pré-calculées, régénérées par tools/build-static.js -->";
  const end = "<!-- STATIC:END -->";
  const i = html.indexOf(begin), j = html.indexOf(end);
  if (i < 0 || j < 0) throw new Error("balises STATIC:BEGIN / STATIC:END introuvables dans index.html");

  fs.writeFileSync(FILE, html.slice(0, i + begin.length) + "\n" + blocks.join("\n") + "\n      " + html.slice(j));
  console.log(`${blocks.length} listes écrites (${VARIANTS.length} versions × ${SERVINGS.length} nombres de personnes)`);
})();
