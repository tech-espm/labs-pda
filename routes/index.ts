import app = require("teem");
import Estado = require("../models/estado");
import Narrativa = require("../models/narrativa");
import Usuario = require("../models/usuario");

class IndexRoute {
	public static async index(req: app.Request, res: app.Response) {
		let u = await Usuario.cookie(req);
		if (!u)
			res.redirect(app.root + "/login");
		else
			res.render("index/index", {
				layout: "layout-sem-form",
				titulo: "Dashboard",
				usuario: u
			});
	}

	@app.http.all()
	public static async login(req: app.Request, res: app.Response) {
		let u = await Usuario.cookie(req);
		if (!u) {
			let mensagem: string = null;
	
			if (req.body.email || req.body.senha) {
				[mensagem, u] = await Usuario.efetuarLogin(req.body.email as string, req.body.senha as string, res);
				if (mensagem)
					res.render("index/login", {
						layout: "layout-externo",
						mensagem: mensagem
					});
				else
					res.redirect(app.root + "/");
			} else {
				res.render("index/login", {
					layout: "layout-externo",
					mensagem: null
				});
			}
		} else {
			res.redirect(app.root + "/");
		}
	}

	public static async acesso(req: app.Request, res: app.Response) {
		let u = await Usuario.cookie(req);
		if (!u)
			res.redirect(app.root + "/login");
		else
			res.render("index/acesso", {
				layout: "layout-sem-form",
				titulo: "Sem Permissão",
				usuario: u
			});
	}

	public static async perfil(req: app.Request, res: app.Response) {
		let u = await Usuario.cookie(req);
		if (!u)
			res.redirect(app.root + "/");
		else
			res.render("index/perfil", {
				titulo: "Meu Perfil",
				usuario: u
			});
	}

	public static async logout(req: app.Request, res: app.Response) {
		let u = await Usuario.cookie(req);
		if (u)
			await Usuario.efetuarLogout(u, res);
		res.redirect(app.root + "/");
	}

	@app.route.methodName("jogar/:id")
	public static async jogar(req: app.Request, res: app.Response, next: app.NextFunction) {
		let id = parseInt(req.params["id"] as string);
		let item: Narrativa = null;
		if (isNaN(id) || !(item = await Narrativa.obter(id, 0, true))) {
			next();
		} else {
			res.render("narrativa/jogar", {
				layout: "layout-vazio",
				item: item,
				estados: await Estado.listar(id, 0, true)
			});
		}
	}
}

export = IndexRoute;
