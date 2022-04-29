import app = require("teem");

interface Estado {
	id: number;
	idnarrativa: number;
	titulo: string;
	descricao: string;
	idestado1: number;
	texto1: string;
	idestado2: number;
	texto2: string;
	idestado3: number;
	texto3: string;
	idestado4: number;
	texto4: string;
	idestado5: number;
	texto5: string;
}

class Estado {
	public static readonly TamanhoMaximoImagemEmBytes = 512 * 1024;

	private static validar(estado: Estado): string {
		return null;
	}

	public static listar(idnarrativa: number, idusuario: number, admin: boolean): Promise<Estado[]> {
		return app.sql.connect(async (sql) => {
			return null;
		});
	}

	public static obter(id: number, idnarrativa: number, idusuario: number, admin: boolean): Promise<Estado> {
		return app.sql.connect(async (sql) => {
			return null;
		});
	}

	public static criar(estado: Estado, imagem: app.UploadedFile, idusuario: number, admin: boolean): Promise<string> {
		const erro = Estado.validar(estado);
		if (erro)
			return Promise.resolve(erro);

		if (!imagem)
			return Promise.resolve("Imagem inválida!");

		if (imagem.size > Estado.TamanhoMaximoImagemEmBytes)
			return Promise.resolve("A imagem deve ter, no máximo, " + Estado.TamanhoMaximoImagemEmBytes + " bytes");

		return app.sql.connect(async (sql) => {

			await app.fileSystem.saveUploadedFile("public/xxx/yyy/zzz.jpg", imagem);

			return null;
		});
	}

	public static editar(estado: Estado, imagem: app.UploadedFile, idusuario: number, admin: boolean): Promise<string> {
		const erro = Estado.validar(estado);
		if (erro)
			return Promise.resolve(erro);

		if (imagem && imagem.size > Estado.TamanhoMaximoImagemEmBytes)
			return Promise.resolve("A imagem deve ter, no máximo, " + Estado.TamanhoMaximoImagemEmBytes + " bytes");

		return app.sql.connect(async (sql) => {

			if (imagem)
				await app.fileSystem.saveUploadedFile("public/xxx/yyy/zzz.jpg", imagem);

			return null;
		});
	}

	public static excluir(id: number, idnarrativa: number, idusuario: number, admin: boolean): Promise<string> {
		return app.sql.connect(async (sql) => {
			return null;
		});
	}
}

export = Estado;
