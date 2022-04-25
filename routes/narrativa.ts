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

    @app.http.post()
	@app.route.formData()
    public async CriarNarrativa(req: app.Request, res: app.Response) {
		let u = await Usuario.cookie(req, res);
		if (!u)
			return;

		let criar = req.body;
        
        if (!criar) {
			res.status(400);
			res.json("Dados inválidos");
			return;
		}

		if (!criar.NomeNarrativa) {
			res.status(400);
			res.json("Nome da narrativa inválida");
			return;
		}

        if (!criar.DescricaoNarrativa){
			res.status(400);
			res.json("Descrição da narrativa inválida");
			return;
		}

        await app.sql.connect(async (sql) => {
			// Todas os comandos SQL devem ser executados aqui dentro do app.sql.connect().
			// As interrogações serão substituídas pelos valores passados ao final, na ordem passada.
			const agora = DataUtil.horarioDeBrasiliaISOComHorario();       
			await sql.query("INSERT INTO narrativa (idusuario, nome, descricao, criacao) VALUES (?,?,?,?)", [u.id, criar.NomeNarrativa, criar.DescricaoNarrativa, agora]);
		});
		res.json(true);
    }
}
export = NarrativaRoute;
