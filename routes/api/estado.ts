import app = require("teem");
import Estado = require("../../models/estado");
import Usuario = require("../../models/usuario");

class EstadoApiRoute {
    @app.http.post()
	@app.route.formData()
    public async criar(req: app.Request, res: app.Response) {
		let u = await Usuario.cookie(req, res);
		if (!u)
			return;

		const estado: Estado = req.body;

		const erro = await Estado.criar(estado, req.uploadedFiles.imagem, u.id, u.admin);

		if (erro)
			res.status(400).json(erro);
		else
			res.json(true);
    }
}

export = EstadoApiRoute;
