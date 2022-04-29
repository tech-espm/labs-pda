import app = require("teem");
import Narrativa = require("../../models/narrativa");
import Usuario = require("../../models/usuario");

class NarrativaApiRoute {
    @app.http.post()
	@app.route.formData()
    public async criar(req: app.Request, res: app.Response) {
		let u = await Usuario.cookie(req, res);
		if (!u)
			return;

		const narrativa: Narrativa = req.body;

		if (narrativa) {
			narrativa.idusuario = u.id;
		}

		const erro = await Narrativa.criar(narrativa);

		if (erro)
			res.status(400).json(erro);
		else
			res.json(true);
    }

	@app.http.post()
	@app.route.formData()
    public async editar(req: app.Request, res: app.Response) {
		let u = await Usuario.cookie(req, res);
		if (!u)
			return;

		const narrativa: Narrativa = req.body;

		if (!u.admin) {
			if (narrativa) {
				narrativa.idusuario = u.id;
			}
		}

		const erro = await Narrativa.editar(narrativa);

		if (erro)
			res.status(400).json(erro);
		else
			res.json(true);
    }

    public async excluir(req: app.Request, res: app.Response) {
		let u = await Usuario.cookie(req, res);
		if (!u)
			return;

		const id = parseInt(req.query["id"] as string);

		const erro = await Narrativa.excluir(id, u.id, u.admin);

		if (erro)
			res.status(400).json(erro);
		else
			res.json(true);
    }
}

export = NarrativaApiRoute;
