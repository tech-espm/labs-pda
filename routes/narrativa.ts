import app = require("teem");
import Usuario = require("../models/usuario");
import DataUtil = require("../utils/dataUtil");

class NarrativaRoute {

	public static async criar(req: app.Request, res: app.Response) {
		let u = await Usuario.cookie(req);
		if (!u)
			res.redirect(app.root + "/acesso");
		else
			res.render("narrativa/criar", {
				titulo: "Criar Narrativa",
				textoSubmit: "Criar",
				usuario: u,
				item: null
			});
	}

	public static async editar(req: app.Request, res: app.Response) {
		let u = await Usuario.cookie(req);
		if (!u)
			res.redirect(app.root + "/acesso");
		else
			res.render("narrativa/editar", {
				titulo: "Editar Narrativa",
				textoSubmit: "Editar",
				usuario: u,
				item: null
			});
	}

}
export = NarrativaRoute;
