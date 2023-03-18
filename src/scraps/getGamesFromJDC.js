// const categories = [
//     ' https://juegosdigitaleschile.com/categorias/juegos-digitales-ps3',
//      'https://juegosdigitaleschile.com/categorias/juegos-digitales-ps4',
//      'https://juegosdigitaleschile.com/categorias/juegos-digitales-ps5',
//      'https://juegosdigitaleschile.com/categorias/pc',
//      'https://juegosdigitaleschile.com/categorias/xbox/juegos-xbox-one',
//      'https://juegosdigitaleschile.com/categorias/nintendo-switch/juegos-nintendo-switch'
//  ]

const categories = ["https://juegosdigitaleschile.com/categorias/pc/120"];
const nextSelector = "body > div:nth-child(8) > div > div > div.col-md-9.col-sm-12 > div:nth-child(2) > div.col-xs-12.text-center > nav > ul > li.next"

export async function getGamesFromJDC(page) {
    const linkGames = [];
    for(const category of categories) {
        await page.goto(category);
        await page.waitForNetworkIdle();
        while (await page.$(nextSelector)) {
            linkGames.push(await page.$$eval(".product-hover", (el) => el.map((x) => x.getAttribute("href"))));
            // console.log(linkGames);
            await page.click(nextSelector)
            await page.waitForNetworkIdle();
        }
    }
    for (const game of linkGames.flat(Infinity)) {
        console.log(game);
        await page.goto(game);
        await page.waitForNetworkIdle();
        const gamesData = await page.evaluate(() => {
            return data = {
                title: document.querySelector(".underlined.pb-10.mb-20").textContent,
                description: document.querySelector("#description").textContent,
                price: document.querySelector(".price-new").textContent.replace(/\$|CLP/g, "").replace(/\,/g, ".").trim(),
                sku: document.querySelector(".btn.btn.btn-buy.btn-block.btn-cart.st-btn-buy").getAttribute("data-id"),
                category: document.querySelector(".tags > li:first-of-type > a").textContent.toUpperCase() || "Sin categoría"
            };

        })
        console.log(gamesData);
    }
    return;
}
