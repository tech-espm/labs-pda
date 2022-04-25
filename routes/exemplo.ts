import app = require("teem");
import Usuario = require("../models/usuario");

class ExemploRoute {
	public static async animacoes(req: app.Request, res: app.Response) {
		let u = await Usuario.cookie(req);
		if (!u)
			res.redirect(app.root + "/login");
		else
			res.render("exemplo/animacoes", { layout: "layout-sem-form", titulo: "Animações", usuario: u });
	}

	public static async bordas(req: app.Request, res: app.Response) {
		let u = await Usuario.cookie(req);
		if (!u)
			res.redirect(app.root + "/login");
		else
			res.render("exemplo/bordas", { layout: "layout-sem-form", titulo: "Bordas", usuario: u });
	}

	public static async botoes(req: app.Request, res: app.Response) {
		let u = await Usuario.cookie(req);
		if (!u)
			res.redirect(app.root + "/login");
		else
			res.render("exemplo/botoes", { layout: "layout-sem-form", titulo: "Botões", usuario: u });
	}

	public static async cards(req: app.Request, res: app.Response) {
		let u = await Usuario.cookie(req);
		if (!u)
			res.redirect(app.root + "/login");
		else
			res.render("exemplo/cards", { layout: "layout-sem-form", titulo: "Cards", usuario: u });
	}

	public static async cores(req: app.Request, res: app.Response) {
		let u = await Usuario.cookie(req);
		if (!u)
			res.redirect(app.root + "/login");
		else
			res.render("exemplo/cores", { layout: "layout-sem-form", titulo: "Cores", usuario: u });
	}

	public static async data(req: app.Request, res: app.Response) {
		let u = await Usuario.cookie(req);
		if (!u)
			res.redirect(app.root + "/login");
		else
			res.render("exemplo/data", { layout: "layout-sem-form", titulo: "Data", datepicker: true, usuario: u });
	}

	public static async esqueci(req: app.Request, res: app.Response) {
		res.render("exemplo/esqueci", { layout: "layout-externo", titulo: "Esqueci minha senha" });
	}

	public static async graficos(req: app.Request, res: app.Response) {
		let u = await Usuario.cookie(req);
		if (!u)
			res.redirect(app.root + "/login");
		else
			res.render("exemplo/graficos", { layout: "layout-sem-form", titulo: "Gráficos", usuario: u });
	}

	public static async outros(req: app.Request, res: app.Response) {
		let u = await Usuario.cookie(req);
		if (!u)
			res.redirect(app.root + "/login");
		else
			res.render("exemplo/outros", { layout: "layout-sem-form", titulo: "Outros", usuario: u });
	}

	public static async registro(req: app.Request, res: app.Response) {
		res.render("exemplo/registro", { layout: "layout-externo", titulo: "Registro" });
	}

	public static async tabelas(req: app.Request, res: app.Response) {
		let u = await Usuario.cookie(req);
		if (!u)
			res.redirect(app.root + "/login");
		else
			res.render("exemplo/tabelas", { layout: "layout-tabela", titulo: "Tabelas", datatables: true, usuario: u });
	}

	public static async vazia(req: app.Request, res: app.Response) {
		let u = await Usuario.cookie(req);
		if (!u)
			res.redirect(app.root + "/login");
		else
			res.render("exemplo/vazia", { titulo: "Vazia", usuario: u });
	}

	public static async vaziasemform(req: app.Request, res: app.Response) {
		let u = await Usuario.cookie(req);
		if (!u)
			res.redirect(app.root + "/login");
		else
			res.render("exemplo/vazia", { layout: "layout-sem-form", titulo: "Vazia (Sem Form)", usuario: u });
	}


	public static async listarNarrativas(req: app.Request, res: app.Response) {

		let u = await Usuario.cookie(req);

		let idnarrativa = parseInt(req.query["id"] as string);

		// @@@ pegar as narrativas do banco
		let narrativa = null;

		await app.sql.connect(async (sql) => {
			narrativa = await sql.query("select id, idusuario, nome, descricao, criacao from narrativa order by id asc");
		});


		if (!u)
			res.redirect(app.root + "/login");
		else
			res.render("exemplo/listarNarrativas", {
				layout: "layout-sem-form",
				titulo: "Narrativas",
				narrativa: narrativa,
				usuario: u
			});
	}
	

	/*
	public static async jogar(req: app.Request, res: app.Response) {
		// http://localhost:3000/jogar?id=123
		let idnarrativa = parseInt(req.query["id"] as string);

		// @@@ pegar a narrativa e todos os estados dela do banco
		let narrativa = null;
		let estados = null;

		res.render("index/jogar", {
			layout: "layout-vazio",
			titulo: "Jogar",
			narrativa: narrativa,
			estados: estados
		});
	}	
	}*/

	public static async listarEstados(req: app.Request, res: app.Response) {
		let idestado = parseInt(req.query["id"] as string);

		let estado = null;

		await app.sql.connect(async (sql) => {
			estado = await sql.query("select id, idnarrativa, titulo, descricao, idestado1, texto1, idestado2, texto2, idestado3, texto3, idestado4, texto4, idestado5, texto5 from estado order by id asc");
		});


		let u = await Usuario.cookie(req);
		if (!u)
			res.redirect(app.root + "/login");
		else
			res.render("exemplo/listarEstados", {
				layout: "layout-sem-form",
				titulo: "Estados da narrativa",
				estado: estado,
				usuario: u
			});
	}
}

export = ExemploRoute;
