import app = require("teem");
import ListaNomeada = require("../data/listaNomeada");
import Estado = require("../models/estado");
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
		if (!u) {
			res.redirect(app.root + "/acesso");
		} else {
			let id = parseInt(req.query["id"] as string);
			let item: Narrativa = null;
			if(isNaN(id) || !(item = await Narrativa.obter(id, u.id, u.admin))){
				res.render("index/nao-encontrado", {
					layout: "layout-sem-form",
					usuario: u
				});
			} else {
				res.render("narrativa/editar", {
					titulo: "Editar Propriedades",
					textoSubmit: "Salvar",
					usuario: u,
					item: item
				});
			}		
		}	
	}

	public static async estados(req: app.Request, res: app.Response) {
		let u = await Usuario.cookie(req);
		if (!u) {
			res.redirect(app.root + "/acesso");
		} else {
			let id = parseInt(req.query["id"] as string);
			let item: Narrativa = null;
			if(isNaN(id) || !(item = await Narrativa.obter(id, u.id, u.admin))){
				res.render("index/nao-encontrado", {
					layout: "layout-sem-form",
					usuario: u
				});
			} else {
				res.render("narrativa/estados", {
					layout: "layout-card",
					titulo: "Editar Narrativa",
					usuario: u,
					item: item,
					estados: await Estado.listar(id, u.id, u.admin)
				});
			}		
		}	
	}

	public static async listar(req: app.Request, res: app.Response) {
		let u = await Usuario.cookie(req);
		if (!u)
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
