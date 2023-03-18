import { Cluster } from "puppeteer-cluster";
import { getGamesFromJDC } from "./scraps/getGamesFromJDC.js";

(async () => {
	const cluster = await Cluster.launch({
		concurrency: Cluster.CONCURRENCY_PAGE,
		maxConcurrency: 3,
    // monitor: true,
		puppeteerOptions: {
			headless: true,
      timeout: 0
		},
    timeout: 300000
	});

	await Promise.all([
		cluster.execute(
			async ({ page }) => {
				console.log("Procesando juegosdigitaleschile.com");
				await getGamesFromJDC(page);
			},
			{ page: 1, priority: 1, taskId: 1 }
		),

		// cluster.execute(
		// 	async ({ page }) => {
		// 		console.log("Processing task 2");
		// 		await page.goto("https://example.com/page2");
		// 		// Ejecutar cualquier otra tarea necesaria en la página
		// 	},
		// 	{ page: 2, priority: 2, taskId: 2 }
		// ),
    
	]);

  cluster.on('taskerror', (err, data) => {
    console.log("Task error: " + err)
});

	await cluster.idle();
	await cluster.close();
})();
