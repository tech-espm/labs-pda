import app = require("teem");
import ListaNomeada = require("../data/listaNomeada");
import Narrativa = require("../models/narrativa");
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

	public static async listar(req: app.Request, res: app.Response) {
		let u = await Usuario.cookie(req);
		if (!u || !u.admin)
			res.redirect(app.root + "/acesso");
		else
			res.render("narrativa/listar", {
				layout: "layout-tabela",
				titulo: "Gerenciar Narrativas",
				datatables: true,
				usuario: u,
				lista: await Narrativa.listar(u.id, u.admin)
			});
	}

}
export = NarrativaRoute;
